import { settingsManager } from "./settings"

export const formatMetadata = (type: string, data: Record<string, string>, page?: number) => {
  const settings = settingsManager.getSettings()
  let metadataConfig = settings.metadata.home

  switch (type) {
    case "home":
      metadataConfig = settings.metadata.home
      break
    case "search":
      metadataConfig = settings.metadata.search
      break
    case "channel":
      metadataConfig = settings.metadata.channel
      break
    case "video":
      metadataConfig = settings.metadata.video
      break
    case "download":
      metadataConfig = settings.metadata.download
      break
    default:
      metadataConfig = settings.metadata.home
  }

  let title = settingsManager.formatMetadata(metadataConfig.title, { ...data, siteName: settings.siteName })
  const description = settingsManager.formatMetadata(metadataConfig.description, data)

  if (page && page > 1) {
    title = `${title} - Page ${page}`
  }

  const metadata = {
    title,
    description,
    robots: metadataConfig.robots,
  } as any

  if (metadataConfig.ogTitle) {
    metadata.openGraph = {
      title: settingsManager.formatMetadata(metadataConfig.ogTitle, data),
      description,
    }
  }

  if (metadataConfig.ogDescription && !metadata.openGraph) {
    metadata.openGraph = {
      description: settingsManager.formatMetadata(metadataConfig.ogDescription, data),
    }
  }

  if (metadataConfig.twitterCard) {
    metadata.twitter = {
      card: metadataConfig.twitterCard,
    }
  }

  return metadata
}

