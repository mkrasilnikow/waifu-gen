
interface Tag {
  name: string;
  description: string;
}

interface ImageResponse {
  images: Array<{
    url: string;
    source: string;
    tags: Tag[];
  }>;
}

const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <title>Random Anime Character</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #1a1a1a;
            color: white;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        img {
            max-width: 90%;
            max-height: 70vh;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            margin-bottom: 20px;
        }
        .info {
            background: rgba(0,0,0,0.5);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            max-width: 90%;
        }
        .tag {
            background: #333;
            padding: 5px 10px;
            border-radius: 5px;
            margin: 5px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <img src="{{ image_url }}" alt="Anime Character">
    <div class="info">
        <p><strong>Source:</strong> <a href="{{ source_url }}" style="color: #66b3ff;">{{ source_url }}</a></p>
        <p><strong>Tags:</strong></p>
        {{ tags }}
    </div>
</body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const response = await fetch("https://api.waifu.im/search?included_tags=maid&height=>=2000");
      if (!response.ok) {
        return new Response("Error fetching image", { status: 500 });
      }

      const data: ImageResponse = await response.json();
      if (!data.images?.length) {
        return new Response("No images found", { status: 404 });
      }

      const image = data.images[0];
      const tags = image.tags
        .map(tag => `<span class="tag" title="${tag.description}">${tag.name}</span>`)
        .join('\n');

      let html = HTML_TEMPLATE
        .replace("{{ image_url }}", image.url)
        .replace(/{{ source_url }}/g, image.source)
        .replace("{{ tags }}", tags);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
        },
      });
    } catch (error) {
      return new Response("Server error", { status: 500 });
    }
  },
};
