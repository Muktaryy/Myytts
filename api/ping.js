export default async function handler(req, res) {
  const backendBase = process.env.TTS_BACKEND_URL;
  if (!backendBase) {
    return res.status(500).json({ status: "missing_env" });
  }

  try {
    const cleanBase = backendBase.replace(/\/+$/, "");
    const response = await fetch(`${cleanBase}/`, { method: "GET" });
    return res.status(response.ok ? 200 : 503).json({ status: response.ok ? "ok" : "offline" });
  } catch (e) {
    return res.status(503).json({ status: "sleeping" });
  }
}
