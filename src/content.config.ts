// Minimal content config: register the `artists` collection without enforcing a runtime schema.
// This avoids the JSON schema generation errors in some Astro versions. If you want strict
// schema validation, replace this with a Zod schema and enable it later.
export const collections = {
  artists: {},
};
