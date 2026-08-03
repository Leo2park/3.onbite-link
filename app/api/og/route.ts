import { NextRequest, NextResponse } from "next/server";

export type OpenGraphData = {
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
};

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OnbiteLinkBot/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "failed to fetch url" },
        { status: 502 },
      );
    }

    const html = await decodeResponseBody(response);
    const data = extractOpenGraph(html, targetUrl);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "failed to fetch url" },
      { status: 502 },
    );
  }
}

async function decodeResponseBody(response: Response): Promise<string> {
  const buffer = await response.arrayBuffer();
  const charset =
    getCharsetFromHeader(response.headers.get("content-type")) ??
    getCharsetFromMeta(buffer) ??
    "utf-8";

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

function getCharsetFromHeader(
  contentType: string | null,
): string | undefined {
  return contentType?.match(/charset=([^;]+)/i)?.[1]?.trim().toLowerCase();
}

function getCharsetFromMeta(buffer: ArrayBuffer): string | undefined {
  // Charset declarations are always plain ASCII, so a lossy latin1 decode
  // of the head of the document is enough to find them regardless of the
  // document's real encoding.
  const preview = new TextDecoder("latin1").decode(buffer.slice(0, 2048));

  const htmlCharset = preview.match(/<meta[^>]+charset=["']?([a-z0-9_-]+)/i);
  if (htmlCharset) return htmlCharset[1].toLowerCase();

  const httpEquiv = preview.match(
    /<meta[^>]+http-equiv=["']content-type["'][^>]+content=["'][^"']*charset=([a-z0-9_-]+)/i,
  );
  return httpEquiv?.[1]?.toLowerCase();
}

function extractOpenGraph(html: string, baseUrl: URL): OpenGraphData {
  const title =
    getMetaContent(html, "og:title") ??
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ??
    baseUrl.hostname;

  const description =
    getMetaContent(html, "og:description") ??
    getMetaContent(html, "description") ??
    "";

  const rawThumbnail = getMetaContent(html, "og:image");
  const thumbnailUrl = rawThumbnail
    ? resolveUrl(rawThumbnail, baseUrl)
    : undefined;

  return {
    url: baseUrl.toString(),
    title: decodeHtmlEntities(title).trim(),
    description: decodeHtmlEntities(description).trim(),
    thumbnailUrl,
  };
}

function getMetaContent(html: string, property: string): string | undefined {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const propertyFirst = new RegExp(
    `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`,
    "i",
  );

  return html.match(propertyFirst)?.[1] ?? html.match(contentFirst)?.[1];
}

function resolveUrl(possiblyRelativeUrl: string, baseUrl: URL) {
  try {
    return new URL(possiblyRelativeUrl, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}
