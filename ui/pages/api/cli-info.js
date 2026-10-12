// Returns the brain's CLI access info (endpoint + API key).
// Behind the console basicauth gate — only authenticated console users
// can reach this. The API key is read from server-side process.env;
// it never sits in client bundles or anonymous responses.

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Brain ID + public-facing endpoint. The provisioner sets BRAIN_ID at
  // deploy time; we use it to construct the public URL the CLI should hit.
  const brainId = process.env.BRAIN_ID || "your-brain";
  // The brain's public API base (no /console subdomain); the settings page
  // puts it in BRAIN_ENDPOINT for the curl example.
  const endpoint = (process.env.PUBLIC_API_BASE || "http://localhost:8010").replace(/\/+$/, "");
  const apiKey = process.env.BRAIN_API_KEY || "";

  return res.status(200).json({
    brain_id: brainId,
    endpoint,
    api_key: apiKey,
    api_key_configured: !!apiKey,
  });
}
