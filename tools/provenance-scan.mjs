#!/usr/bin/env node
import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { PROVENANCE_PATH, verifyProvenance } from "./provenance.mjs";

const MAX_CANDIDATES = 50;
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_BYTES = 32_768;

export class ScanError extends Error {
  constructor(code, message, kind = "error") {
    super(message);
    this.name = "ScanError";
    this.code = code;
    this.kind = kind;
  }
}

/** Reject paths, credentials, IP literals, internal names, and non-default ports. */
export function validateCandidate(value) {
  let url;
  try {
    if (
      typeof value !== "string" ||
      value.length > 2_048 ||
      value !== value.trim()
    )
      throw new Error();
    url = new URL(value);
  } catch {
    throw new ScanError(
      "invalid_url",
      "Candidate must be an HTTPS public origin.",
      "blocked",
    );
  }
  const host = url.hostname;
  const labels = host.split(".");
  const internalSuffixes = [
    "localhost",
    "local",
    "internal",
    "intranet",
    "lan",
    "home",
    "test",
    "invalid",
    "example",
    "onion",
  ];
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    isIP(host.replace(/^\[|\]$/g, "")) ||
    labels.length < 2 ||
    host.length > 253 ||
    internalSuffixes.includes(labels.at(-1)) ||
    labels.some(
      (label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
    )
  ) {
    throw new ScanError(
      "unsafe_origin",
      "Only public HTTPS domain origins, without credentials, paths, or custom ports, are accepted.",
      "blocked",
    );
  }
  return url.origin;
}

/** Conservative public-routing check: false negatives are safer than internal access. */
export function isPublicAddress(address) {
  const family = isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) ||
      (a === 192 && b === 88 && c === 99) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (family !== 6 || address.includes("%") || address.includes("."))
    return false;
  // Accept only ordinary global unicast 2000::/3. Exclude protocol assignments,
  // documentation prefixes, 6to4, and newer documentation space 3fff::/20.
  const [firstText = "", secondText = ""] = address.toLowerCase().split(":");
  const first = Number.parseInt(firstText, 16);
  const second = Number.parseInt(secondText || "0", 16);
  if (!Number.isFinite(first) || first < 0x2000 || first > 0x3fff) return false;
  if (first === 0x2001 && (second <= 0x01ff || second === 0x0db8)) return false;
  if (first === 0x2002) return false;
  if (first === 0x3fff && second <= 0x0fff) return false;
  return true;
}

async function resolvePublic(hostname, resolve, timeoutMs) {
  let timer;
  try {
    const records = await Promise.race([
      resolve(hostname, { all: true, verbatim: true }),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new ScanError("dns_timeout", "DNS lookup timed out.")),
          timeoutMs,
        );
      }),
    ]);
    if (!Array.isArray(records) || records.length === 0)
      throw new ScanError("dns_empty", "Domain did not resolve.");
    if (
      records.some(
        (record) =>
          !isPublicAddress(record.address) ||
          isIP(record.address) !== record.family,
      )
    ) {
      throw new ScanError(
        "unsafe_dns",
        "Domain resolves to a non-public or unsupported address.",
        "blocked",
      );
    }
    return records[0];
  } finally {
    clearTimeout(timer);
  }
}

/** One pinned TLS request; no redirects, cookies, proxy variables, or body uploads.
 * resolve/transport are dependency injection points for isolated tests.
 */
export async function fetchProvenance(
  origin,
  {
    resolve = dnsLookup,
    transport = httpsRequest,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxBytes = DEFAULT_MAX_BYTES,
  } = {},
) {
  origin = validateCandidate(origin);
  if (
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 1 ||
    timeoutMs > 30_000 ||
    !Number.isInteger(maxBytes) ||
    maxBytes < 1 ||
    maxBytes > DEFAULT_MAX_BYTES
  ) {
    throw new ScanError(
      "invalid_limits",
      "Timeout and body limits exceed the supported range.",
    );
  }
  const url = new URL(origin);
  const selected = await resolvePublic(url.hostname, resolve, timeoutMs);
  return new Promise((resolveResult, reject) => {
    let settled = false;
    let req;
    let response;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) {
        response?.destroy();
        req?.destroy();
        reject(error);
      } else {
        resolveResult(result);
      }
    };
    const timer = setTimeout(
      () =>
        finish(new ScanError("request_timeout", "HTTPS request timed out.")),
      timeoutMs,
    );
    try {
      req = transport(
        {
          protocol: "https:",
          hostname: url.hostname,
          servername: url.hostname,
          port: 443,
          family: selected.family,
          autoSelectFamily: false,
          method: "GET",
          path: PROVENANCE_PATH,
          agent: false,
          rejectUnauthorized: true,
          maxHeaderSize: 8_192,
          headers: {
            Accept: "application/json",
            "User-Agent":
              "tanwithme-provenance-check/1.0 (manual-candidate-check)",
          },
          lookup: (hostname, options, callback) => {
            if (hostname !== url.hostname)
              return callback(
                new ScanError(
                  "hostname_changed",
                  "Pinned hostname changed.",
                  "blocked",
                ),
              );
            if (options?.all)
              callback(null, [
                { address: selected.address, family: selected.family },
              ]);
            else callback(null, selected.address, selected.family);
          },
        },
        (res) => {
          response = res;
          res.on("error", () =>
            finish(new ScanError("response_error", "Response stream failed.")),
          );
          const statusCode = res.statusCode;
          if (statusCode >= 300 && statusCode < 400) {
            finish(
              new ScanError(
                "redirect_blocked",
                "Redirects are not followed. Supply the final public origin yourself.",
                "blocked",
              ),
            );
            return;
          }
          if (statusCode === 404 || statusCode === 410 || statusCode === 204) {
            finish(null, { absent: true, httpStatus: statusCode });
            res.destroy();
            return;
          }
          if (statusCode !== 200) {
            finish(
              new ScanError(
                "http_status",
                `Server returned HTTP ${statusCode ?? "unknown"}.`,
              ),
            );
            return;
          }
          const type = (res.headers["content-type"] ?? "")
            .split(";")[0]
            .trim()
            .toLowerCase();
          if (!/^application\/(?:json|[a-z0-9!#$&^_.+-]+\+json)$/.test(type)) {
            finish(
              new ScanError(
                "not_json",
                "Endpoint did not return a JSON content type.",
              ),
            );
            return;
          }
          if (
            res.headers["content-encoding"] &&
            res.headers["content-encoding"] !== "identity"
          ) {
            finish(
              new ScanError(
                "unsupported_encoding",
                "Only uncompressed JSON responses are accepted.",
              ),
            );
            return;
          }
          const declared = Number(res.headers["content-length"]);
          if (Number.isFinite(declared) && declared > maxBytes) {
            finish(
              new ScanError(
                "body_too_large",
                "Response exceeds the body limit.",
              ),
            );
            return;
          }
          let length = 0;
          const chunks = [];
          res.on("data", (chunk) => {
            if (settled) return;
            const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            length += bytes.length;
            if (length > maxBytes)
              return finish(
                new ScanError(
                  "body_too_large",
                  "Response exceeds the body limit.",
                ),
              );
            chunks.push(bytes);
          });
          res.on("aborted", () =>
            finish(
              new ScanError(
                "response_aborted",
                "Response ended before completion.",
              ),
            ),
          );
          res.on("end", () => {
            if (settled) return;
            try {
              const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
              finish(null, { absent: false, httpStatus: statusCode, value });
            } catch {
              finish(
                new ScanError(
                  "invalid_json",
                  "Endpoint returned malformed JSON.",
                ),
              );
            }
          });
        },
      );
      req.on("error", () =>
        finish(
          new ScanError(
            "network_error",
            "HTTPS connection or certificate verification failed.",
          ),
        ),
      );
      req.end();
    } catch {
      finish(
        new ScanError("network_error", "HTTPS request could not be started."),
      );
    }
  });
}

/** Check <=50 supplied origins. fetchDocument may be replaced by a pure test mock. */
export async function scanCandidates(
  candidates,
  {
    fetchDocument = fetchProvenance,
    now = () => new Date().toISOString(),
  } = {},
) {
  if (!Array.isArray(candidates) || candidates.length > MAX_CANDIDATES) {
    throw new ScanError(
      "invalid_candidates",
      "Input must be a JSON array containing at most 50 HTTPS origins.",
    );
  }
  const results = [];
  const seen = new Set();
  // Sequential requests keep the tool low-impact and its target order auditable.
  for (const [inputIndex, candidate] of candidates.entries()) {
    let origin = null;
    try {
      origin = validateCandidate(candidate);
      if (seen.has(origin)) {
        results.push({
          inputIndex,
          origin,
          status: "skipped",
          code: "duplicate_origin",
        });
        continue;
      }
      seen.add(origin);
      const document = await fetchDocument(origin);
      if (document.absent) {
        results.push({
          inputIndex,
          origin,
          status: "absent",
          httpStatus: document.httpStatus,
        });
        continue;
      }
      const validation = verifyProvenance(document.value, origin);
      results.push({
        inputIndex,
        origin,
        status: validation.valid ? "confirmed" : "unverified",
        httpStatus: document.httpStatus,
        validation,
      });
    } catch (error) {
      results.push({
        inputIndex,
        origin,
        status: error instanceof ScanError ? error.kind : "error",
        code: error instanceof ScanError ? error.code : "request_failed",
        message:
          error instanceof ScanError
            ? error.message
            : "The candidate could not be checked.",
      });
    }
  }
  return {
    schemaVersion: 1,
    checkedAt: now(),
    method: "manual-supplied-origins",
    endpoint: PROVENANCE_PATH,
    candidateCount: candidates.length,
    uniqueOriginsAttempted: seen.size,
    limitation:
      "Marker, owner approval, and Barcelona are public self-declarations. This is not identity verification, physical location proof, quality assessment, or exhaustive discovery.",
    results,
  };
}

async function main(args) {
  let input;
  let output;
  if (args.includes("--help") || args.length === 0) {
    process.stdout.write(
      "Usage: node tools/provenance-scan.mjs --input candidates.json [--output report.json]\nInput: a JSON array of up to 50 public HTTPS origins. No crawling or redirects.\n",
    );
    return;
  }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && !input && args[i + 1]) input = args[++i];
    else if (args[i] === "--output" && !output && args[i + 1])
      output = args[++i];
    else
      throw new ScanError(
        "invalid_arguments",
        "Use --input candidates.json and optional --output report.json.",
      );
  }
  if (!input) throw new ScanError("missing_input", "--input is required.");
  const source = await readFile(input, "utf8");
  if (Buffer.byteLength(source) > 131_072)
    throw new ScanError("input_too_large", "Candidate file exceeds 128 KiB.");
  const report = await scanCandidates(JSON.parse(source));
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  // Never overwrite the original candidates or an earlier report accidentally.
  if (output) await writeFile(output, serialized, { flag: "wx" });
  else process.stdout.write(serialized);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(
      `${error instanceof ScanError ? error.message : "Unable to read candidates or write the report. Use a valid JSON file and a new output filename."}\n`,
    );
    process.exitCode = 1;
  });
}
