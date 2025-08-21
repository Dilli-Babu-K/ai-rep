export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "512x512"
      })
    });

    const data = await response.json();
    if (data.data && data.data[0].url) {
      res.status(200).json({ url: data.data[0].url });
    } else {
      res.status(500).json({ error: "No image returned" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
}
