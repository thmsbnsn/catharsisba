import { siteConfig } from "../site.config";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function SEO({ title, description, url, image }: SEOProps) {
  const ogImage = image || siteConfig.logo.webp;
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteConfig.url}${url}`} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
