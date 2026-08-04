import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { FoldersProvider } from "@/lib/folders-context";
import { LinksProvider } from "@/lib/links-context";
import { createClient } from "@/utils/supabase/server";

const siteName = "한입 링크";
const siteDescription = "나만의 링크를 저장하고 폴더로 정리하는 북마크 서비스";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    images: [{ url: "/thumbnail.png", width: 2400, height: 1260 }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/thumbnail.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: folderRows } = user
    ? await supabase
        .from("folders")
        .select("id, name")
        .eq("user_id", user.id)
        .order("id", { ascending: true })
    : { data: [] };

  const folders = (folderRows ?? []).map((folder) => ({
    id: String(folder.id),
    name: folder.name,
  }));

  const { data: linkRows } = user
    ? await supabase
        .from("links")
        .select("id, url, title, description, thumbnail_url, folder_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const links = (linkRows ?? []).map((link) => ({
    id: String(link.id),
    url: link.url,
    title: link.title ?? "",
    description: link.description ?? "",
    thumbnailUrl: link.thumbnail_url ?? undefined,
    folderId: link.folder_id != null ? String(link.folder_id) : "",
  }));

  return (
    <html lang="ko" className="h-full">
      <head>
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "xwztrdrvt5");`}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">
        <FoldersProvider initialFolders={folders} initialUserId={user?.id ?? null}>
          <LinksProvider initialLinks={links} initialUserId={user?.id ?? null}>
            {children}
          </LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
