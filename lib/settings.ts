type MetadataConfig = {
  title: string
  description: string
  robots: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: string
}

type PageMetadata = {
  home: MetadataConfig
  search: MetadataConfig
  channel: MetadataConfig
  video: MetadataConfig
  download: MetadataConfig
}

type Settings = {
  apiUrl: string
  apiKey: string
  siteName: string
  perPage: number
  defaultSort: "views" | "uploaded" | "relevance"
  embedDomain: string
  cacheConfig: {
    search: number
    fileList: number
    fileInfo: number
    folderList: number
  }
  metadata: PageMetadata
}

const DEFAULT_SETTINGS: Settings = {
  apiUrl: "https://eeeea.sitikhoir19.workers.dev",
  apiKey: "112623ifbcbltzajwjrpjx",
  siteName: "DoodWeb",
  perPage: 40,
  defaultSort: "relevance",
  embedDomain: "https://doodstream.com/e/",
  cacheConfig: {
    search: 3600,
    fileList: 3600,
    fileInfo: 3600,
    folderList: 3600,
  },
  metadata: {
    home: {
      title: "{siteName} - Watch and Download Videos",
      description: "Watch and download your favorite videos on {siteName}",
      robots: "index, follow",
    },
    search: {
      title: "Search: {query} - {siteName}",
      description: "Search results for {query} on {siteName}",
      robots: "noindex, follow",
    },
    channel: {
      title: "{channelName} - {siteName}",
      description: "{channelName} - {totalVideos} videos are in this channel",
      robots: "index, follow",
    },
    video: {
      title: "{videoTitle} - {siteName}",
      description: "{videoTitle} - Duration: {duration} - Views: {views} - Size: {size}",
      robots: "index, follow",
      ogTitle: "Watch {videoTitle}",
      ogDescription: "{videoTitle} - {duration}",
      twitterCard: "player",
    },
    download: {
      title: "Download {videoTitle} - {siteName}",
      description: "Download {videoTitle} from {siteName}",
      robots: "noindex, follow",
    },
  },
}

export class SettingsManager {
  private static instance: SettingsManager
  private settings: Settings
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private subscribers: Set<() => void> = new Set()

  private constructor() {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("admin_settings")
      this.settings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS
    } else {
      this.settings = DEFAULT_SETTINGS
    }
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager()
    }
    return SettingsManager.instance
  }

  public getSettings(): Settings {
    return this.settings
  }

  public getCachedData(key: string): any {
    const cached = this.cache.get(key)
    if (!cached) return null

    const { data, timestamp } = cached
    const cacheKey = key.split(":")[0] as keyof Settings["cacheConfig"]
    const ttl = this.settings.cacheConfig[cacheKey] * 1000 // Convert to milliseconds

    if (Date.now() - timestamp > ttl) {
      this.cache.delete(key)
      return null
    }

    return data
  }

  public setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  public clearCache(): void {
    this.cache.clear()
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings }
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_settings", JSON.stringify(this.settings))
    }
    this.notifySubscribers()
  }

  public resetSettings(): void {
    this.settings = DEFAULT_SETTINGS
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_settings", JSON.stringify(DEFAULT_SETTINGS))
    }
    this.notifySubscribers()
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback())
  }

  public formatMetadata(template: string, variables: Record<string, string>): string {
    return template.replace(/{(\w+)}/g, (match, key) => variables[key] || match)
  }
}

export const settingsManager = SettingsManager.getInstance()

