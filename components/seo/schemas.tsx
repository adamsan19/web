import { SITENAME } from "@/lib/constants"

export function generateWebPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: SITENAME,
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITENAME,
    url: typeof window !== "undefined" ? window.location.origin : "",
    logo: "/logo.png",
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITENAME,
    url: typeof window !== "undefined" ? window.location.origin : "",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${typeof window !== "undefined" ? window.location.origin : ""}/f/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateVideoSchema(video: any, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.title,
    thumbnailUrl: video.splash_img,
    uploadDate: new Date(video.uploaded + ".000Z").toISOString(),
    duration: `PT${Math.floor(video.length / 60)}M${video.length % 60}S`,
    contentUrl: url,
    embedUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/e/${video.file_code}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: video.views,
    },
  }
}

