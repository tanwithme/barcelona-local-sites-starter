import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import {
  createProvenance,
  verifyProvenance,
  PROVENANCE_PATH,
} from "../tools/provenance.mjs";
import {
  fetchProvenance,
  scanCandidates,
  validateCandidate,
  isPublicAddress,
  ScanError,
} from "../tools/provenance-scan.mjs";

const ORIGIN = "https://business.example.com";
const brief = {
  origin: ORIGIN,
  status: "live",
  provenance: { enabled: true },
  approvals: { provenance: true },
  contact: { personalPhone: "never-copy-this" },
};
const live = () => createProvenance(brief);
const publicResolve = async () => [{ address: "93.184.215.14", family: 4 }];

function fakeTransport({
  statusCode = 200,
  headers = { "content-type": "application/json" },
  body = JSON.stringify(live()),
  hang = false,
  onOptions,
} = {}) {
  return (options, callback) => {
    onOptions?.(options);
    const req = new EventEmitter();
    req.destroy = () => {
      req.destroyed = true;
    };
    req.end = () =>
      queueMicrotask(() => {
        if (req.destroyed) return;
        const res = new EventEmitter();
        res.statusCode = statusCode;
        res.headers = headers;
        res.destroy = () => {
          res.destroyed = true;
        };
        callback(res);
        if (!hang && !res.destroyed) {
          for (const part of Array.isArray(body) ? body : [body]) {
            if (!res.destroyed) res.emit("data", Buffer.from(part));
          }
          if (!res.destroyed) res.emit("end");
        }
      });
    return req;
  };
}

test("creation is explicit opt-in, copies only the fixed fields, and supports drafts", () => {
  assert.equal(createProvenance({}), null);
  assert.equal(createProvenance({ provenance: { enabled: "true" } }), null);
  assert.equal(createProvenance({ provenance: { enabled: false } }), null);
  assert.deepEqual(live(), {
    schemaVersion: 1,
    marker: "tanwithme",
    generator: "barcelona-local-sites-starter",
    city: "Barcelona",
    languages: ["ca", "es", "en"],
    canonicalOrigin: ORIGIN,
    status: "live",
    ownerApproved: true,
  });
  assert.equal(JSON.stringify(live()).includes("never-copy-this"), false);
  const draft = createProvenance({ provenance: { enabled: true } });
  assert.equal(draft.canonicalOrigin, null);
  assert.equal(draft.status, "demo");
  assert.equal(draft.ownerApproved, false);
  assert.equal(verifyProvenance(draft, ORIGIN).valid, false);
});

test("verification requires the complete exact live declaration and canonical match", () => {
  assert.equal(verifyProvenance(live(), ORIGIN).valid, true);
  assert.equal(
    verifyProvenance({ ...live(), languages: ["en", "es", "ca"] }, ORIGIN)
      .valid,
    true,
  );
  const invalid = [
    null,
    [],
    "tanwithme",
    { marker: "tanwithme" },
    { ...live(), marker: "TanWithMe" },
    { ...live(), canonicalOrigin: "https://other.example.com" },
    { ...live(), canonicalOrigin: `${ORIGIN}/` },
    { ...live(), status: "demo" },
    { ...live(), ownerApproved: "true" },
    { ...live(), ownerApproved: false },
    { ...live(), schemaVersion: "1" },
    { ...live(), schemaVersion: 2 },
    { ...live(), generator: "unrelated" },
    { ...live(), city: "barcelona" },
    { ...live(), languages: ["ca", "ca", "en"] },
    { ...live(), languages: ["ca", "es", "en", "fr"] },
    { ...live(), personalEmail: "forbidden@example.com" },
  ];
  for (const value of invalid) {
    const result = verifyProvenance(value, ORIGIN);
    assert.equal(result.valid, false, JSON.stringify(value));
    assert.ok(result.reasons.length > 0);
  }
  assert.equal(
    verifyProvenance(live(), "http://business.example.com").valid,
    false,
  );
  assert.equal(verifyProvenance(live(), `${ORIGIN}/`).valid, false);
  const unapproved = verifyProvenance(
    { ...live(), ownerApproved: false },
    ORIGIN,
  );
  assert.equal(unapproved.confirmedMarker, true);
  assert.equal(unapproved.barcelonaDeclared, true);
  assert.equal(unapproved.ownerApproved, false);
});

test("candidate validation blocks hostile origins before DNS or HTTPS", () => {
  assert.equal(validateCandidate(`${ORIGIN}/`), ORIGIN);
  assert.equal(validateCandidate("https://business.example.com:443"), ORIGIN);
  const invalid = [
    "http://business.example.com",
    "file:///etc/passwd",
    "ftp://business.example.com",
    "https://user:secret@business.example.com",
    "https://business.example.com/path",
    "https://business.example.com?secret=1",
    "https://business.example.com/#fragment",
    "https://business.example.com:8443",
    "https://localhost",
    "https://printer.local",
    "https://internal.example",
    "https://business.example.com.",
    "https://-invalid.example.com",
    "https://127.0.0.1",
    "https://2130706433",
    "https://0x7f000001",
    "https://[::1]",
    "https://[2606:4700:4700::1111]",
    "https://169.254.169.254",
    "https://192.168.1.2",
    "https://93.184.215.14",
    ORIGIN + "\n",
    {},
    null,
  ];
  for (const value of invalid)
    assert.throws(
      () => validateCandidate(value),
      { kind: "blocked" },
      String(value),
    );
});

test("public-address classification rejects private, mapped, reserved, and documentation addresses", () => {
  const rejected = [
    "0.0.0.0",
    "10.1.2.3",
    "127.0.0.1",
    "100.64.0.1",
    "100.127.255.255",
    "169.254.169.254",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "192.0.0.9",
    "192.0.2.8",
    "192.88.99.1",
    "198.18.0.1",
    "198.19.2.3",
    "198.51.100.1",
    "203.0.113.1",
    "224.0.0.1",
    "255.255.255.255",
    "::",
    "::1",
    "::ffff:127.0.0.1",
    "::ffff:7f00:1",
    "fc00::1",
    "fe80::1",
    "2001:db8::1",
    "2001::1",
    "2001:10::1",
    "2002:7f00:1::",
    "3fff:fff::1",
    "64:ff9b::7f00:1",
    "not-an-ip",
  ];
  for (const address of rejected)
    assert.equal(isPublicAddress(address), false, address);
  for (const address of [
    "93.184.215.14",
    "8.8.8.8",
    "2606:4700:4700::1111",
    "2001:4860:4860::8888",
  ]) {
    assert.equal(isPublicAddress(address), true, address);
  }
});

test("HTTPS uses verified TLS and a pinned DNS address without a second lookup", async () => {
  let lookups = 0;
  let checkedOptions = false;
  const result = await fetchProvenance(ORIGIN, {
    resolve: async (hostname, options) => {
      lookups++;
      assert.equal(hostname, "business.example.com");
      assert.equal(options.all, true);
      return publicResolve();
    },
    transport: fakeTransport({
      onOptions: (options) => {
        checkedOptions = true;
        assert.equal(options.path, PROVENANCE_PATH);
        assert.equal(options.rejectUnauthorized, true);
        assert.equal(options.servername, "business.example.com");
        assert.equal(options.agent, false);
        options.lookup(options.hostname, {}, (error, address, family) => {
          assert.equal(error, null);
          assert.equal(address, "93.184.215.14");
          assert.equal(family, 4);
        });
        options.lookup(options.hostname, { all: true }, (error, values) => {
          assert.equal(error, null);
          assert.deepEqual(values, [{ address: "93.184.215.14", family: 4 }]);
        });
        options.lookup("attacker.example.com", {}, (error) =>
          assert.equal(error.code, "hostname_changed"),
        );
      },
    }),
  });
  assert.equal(lookups, 1);
  assert.equal(checkedOptions, true);
  assert.deepEqual(result.value, live());
});

test("mixed public/private DNS fails closed without starting the transport", async () => {
  let requested = false;
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: async () => [
        { address: "93.184.215.14", family: 4 },
        { address: "127.0.0.1", family: 4 },
      ],
      transport: () => {
        requested = true;
      },
    }),
    { code: "unsafe_dns", kind: "blocked" },
  );
  assert.equal(requested, false);
});

test("missing metadata is absent and redirects never reach their destination", async () => {
  const absent = await fetchProvenance(ORIGIN, {
    resolve: publicResolve,
    transport: fakeTransport({ statusCode: 404 }),
  });
  assert.deepEqual(absent, { absent: true, httpStatus: 404 });
  let calls = 0;
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({
        statusCode: 302,
        headers: { location: "https://169.254.169.254/" },
        onOptions: () => {
          calls++;
        },
      }),
    }),
    { code: "redirect_blocked" },
  );
  assert.equal(calls, 1);
});

test("timeouts, declared and streamed size, malformed JSON, and non-JSON pages are bounded failures", async () => {
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: () => new Promise(() => {}),
      transport: fakeTransport(),
      timeoutMs: 5,
    }),
    { code: "dns_timeout" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({ hang: true }),
      timeoutMs: 5,
    }),
    { code: "request_timeout" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({
        headers: {
          "content-type": "application/json",
          "content-length": "999999",
        },
      }),
    }),
    { code: "body_too_large" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      maxBytes: 10,
      transport: fakeTransport({ body: ["123456", "789012"] }),
    }),
    { code: "body_too_large" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({ body: "{broken" }),
    }),
    { code: "invalid_json" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({
        headers: { "content-type": "text/html" },
        body: "tanwithme",
      }),
    }),
    { code: "not_json" },
  );
  await assert.rejects(
    fetchProvenance(ORIGIN, {
      resolve: publicResolve,
      transport: fakeTransport({
        headers: {
          "content-type": "application/json",
          "content-encoding": "gzip",
        },
      }),
    }),
    { code: "unsupported_encoding" },
  );
});

test("scan results distinguish confirmed declarations, drafts, missing, blocked, and failures", async () => {
  const candidates = [
    ORIGIN,
    "https://draft.example.com",
    "https://absent.example.com",
    "https://127.0.0.1",
    "https://error.example.com",
    `${ORIGIN}/`,
  ];
  const calls = [];
  const report = await scanCandidates(candidates, {
    now: () => "2026-09-07T00:00:00.000Z",
    fetchDocument: async (origin) => {
      calls.push(origin);
      if (origin.includes("draft."))
        return {
          httpStatus: 200,
          value: { ...live(), canonicalOrigin: origin, status: "demo" },
        };
      if (origin.includes("absent.")) return { httpStatus: 404, absent: true };
      if (origin.includes("error."))
        throw new ScanError("request_timeout", "HTTPS request timed out.");
      return { httpStatus: 200, value: live() };
    },
  });
  assert.deepEqual(
    report.results.map((row) => row.status),
    ["confirmed", "unverified", "absent", "blocked", "error", "skipped"],
  );
  assert.equal(calls.length, 4);
  assert.equal(report.uniqueOriginsAttempted, 4);
  assert.equal(report.results[3].origin, null);
  assert.match(report.limitation, /self-declarations/);
  await assert.rejects(scanCandidates(Array(51).fill(ORIGIN)), {
    code: "invalid_candidates",
  });
  await assert.rejects(scanCandidates({ url: ORIGIN }), {
    code: "invalid_candidates",
  });
});
