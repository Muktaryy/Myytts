export default async function handler(req, res) {
  const { text = "", voice = "sv-SE-MattiasNeural", rate = "+0%", pitch = "+0Hz" } = req.query;
  const backendBase = process.env.TTS_BACKEND_URL;

  if (!backendBase) {
    return res.status(500).send("Missing TTS_BACKEND_URL in Vercel Environment Variables");
  }

  try {
    const cleanBase = backendBase.replace(/\/+$/, "");
    const targetUrl = `${cleanBase}/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&rate=${encodeURIComponent(rate)}&pitch=${encodeURIComponent(pitch)}`;

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).send("Voice synthesis failed");
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res.status(502).send("Voice server unreachable");
  }
}
