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

    const html = await response.text();
    const data = extractOpenGraph(html, targetUrl);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "failed to fetch url" },
      { status: 502 },
    );
  }
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
