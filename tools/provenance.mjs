/** Transparent, removable project attribution. This module never sends a request. */
export const PROVENANCE_PATH = "/.well-known/tanwithme.json";
export const PROVENANCE_GENERATOR = "barcelona-local-sites-starter";

/**
 * @param {object} brief
 * @returns {object|null} Public metadata, or null when provenance is disabled.
 * Nothing from contacts, analytics, prompts, or arbitrary brief fields is copied.
 * Drafts may use canonicalOrigin:null; publication is validated separately.
 */
export function createProvenance(brief) {
  if (brief?.provenance?.enabled !== true) return null;
  return {
    schemaVersion: 1,
    marker: "tanwithme",
    generator: PROVENANCE_GENERATOR,
    city: "Barcelona",
    languages: ["ca", "es", "en"],
    canonicalOrigin: brief.origin ?? null,
    status: brief.status ?? "demo",
    ownerApproved: brief.approvals?.provenance === true,
  };
}

/** Validate a declaration, not its author's identity, location, or site quality.
 * A `valid` result requires a complete live, approved declaration for the exact
 * expected HTTPS origin. Extra JSON properties are rejected to keep this public
 * document small and prevent unnoticed personal data additions.
 */
export function verifyProvenance(value, expectedOrigin) {
  const reasons = [];
  const record =
    value !== null && typeof value === "object" && !Array.isArray(value);
  const v = record ? value : {};
  const confirmedMarker = v.marker === "tanwithme";
  const barcelonaDeclared = v.city === "Barcelona";
  const ownerApproved = v.ownerApproved === true;
  const fields = [
    "schemaVersion",
    "marker",
    "generator",
    "city",
    "languages",
    "canonicalOrigin",
    "status",
    "ownerApproved",
  ];
  if (!record) reasons.push("Document must be a JSON object.");
  if (Object.keys(v).some((key) => !fields.includes(key)))
    reasons.push("Unexpected fields in public provenance document.");
  if (fields.some((key) => !Object.hasOwn(v, key)))
    reasons.push("Required fields are missing.");
  if (v.schemaVersion !== 1)
    reasons.push("schemaVersion must be the number 1.");
  if (!confirmedMarker)
    reasons.push("marker must be exactly lowercase tanwithme.");
  if (v.generator !== PROVENANCE_GENERATOR)
    reasons.push("generator does not match this starter.");
  if (!barcelonaDeclared)
    reasons.push("city must be the self-declared value Barcelona.");
  if (
    !Array.isArray(v.languages) ||
    v.languages.length !== 3 ||
    new Set(v.languages).size !== 3 ||
    !["ca", "es", "en"].every((language) => v.languages.includes(language))
  ) {
    reasons.push("languages must contain exactly ca, es, and en.");
  }
  if (v.status !== "live")
    reasons.push("status must be live; drafts are not confirmed deployments.");
  if (!ownerApproved) reasons.push("ownerApproved must be the boolean true.");
  let expected;
  try {
    const url = new URL(expectedOrigin);
    if (
      typeof expectedOrigin !== "string" ||
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.origin !== expectedOrigin
    )
      throw new Error("origin");
    expected = url.origin;
  } catch {
    reasons.push(
      "Expected origin must be a canonical HTTPS origin without a path.",
    );
  }
  if (!expected || v.canonicalOrigin !== expected)
    reasons.push("canonicalOrigin does not match the inspected origin.");
  return {
    valid: reasons.length === 0,
    reasons,
    confirmedMarker,
    barcelonaDeclared,
    ownerApproved,
    status: typeof v.status === "string" ? v.status : null,
  };
}
