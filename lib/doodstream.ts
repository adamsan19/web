import { DEFAULT_PER_PAGE, DOODSTREAM_API_KEY, DOODSTREAM_BASE_URL } from "./constants"
import { settingsManager } from "./settings"

type DoodstreamProps = {
  baseUrl?: string
  key?: string
}

class Doodstream {
  baseUrl: string
  key: string
  upstream: string | undefined

  constructor(
    { baseUrl, key }: DoodstreamProps = {
      baseUrl: undefined,
      key: undefined,
    },
  ) {
    baseUrl = baseUrl || DOODSTREAM_BASE_URL
    key = key || DOODSTREAM_API_KEY

    if (!baseUrl) throw new Error("Doodstream Base URL not set")
    if (!key) throw new Error("Doodstream Key not set")

    this.baseUrl = baseUrl
    this.key = key
  }

  serializeQueryParams(params: { [key: string]: string }) {
    return new URLSearchParams(params).toString()
  }

  async fetch(cmd: string, params: { [key: string]: string }, cacheKey: string) {
    const settings = settingsManager.getSettings()

    // Check cache first if caching is enabled
    if (settings.cacheConfig) {
      const cached = settingsManager.getCachedData(cacheKey)
      if (cached) return cached
    }

    params.key = this.key
    const url = `${this.baseUrl}/api${cmd}?${this.serializeQueryParams(params)}`
    const response = await fetch(url)
    const data = await response.json()

    // Cache the response if caching is enabled
    if (settings.cacheConfig) {
      settingsManager.setCachedData(cacheKey, data)
    }

    return data
  }

  async listFiles({
    page = 1,
    per_page = DEFAULT_PER_PAGE,
    fld_id = "",
  }: {
    page?: number
    per_page?: number
    fld_id?: string
  }) {
    if (per_page && per_page > 200) throw new Error("per_page cannot be greater than 200")

    const data = await this.fetch(
      "/file/list",
      {
        page: page.toString(),
        per_page: per_page.toString(),
        fld_id: fld_id.toString(),
      },
      `fileList:${fld_id}:${page}:${per_page}`,
    )
    return data
  }

  async getFile({ file_code }: { file_code: string }) {
    const data = await this.fetch("/file/info", { file_code }, `fileInfo:${file_code}`)
    return data
  }

  async search({ query, sort = "relevance" }: { query: string; sort?: string }) {
    const data = await this.fetch(
      "/search/videos",
      {
        search_term: query,
        sort: sort,
      },
      `search:${query}:${sort}`,
    )

    if (data.result && Array.isArray(data.result)) {
      // Sort results based on the selected option
      if (sort === "views") {
        data.result.sort((a: any, b: any) => b.views - a.views)
      } else if (sort === "uploaded") {
        data.result.sort((a: any, b: any) => {
          const dateA = new Date(a.uploaded + ".000Z").getTime()
          const dateB = new Date(b.uploaded + ".000Z").getTime()
          return dateB - dateA
        })
      }
    }

    return data
  }

  async listFolders({ fld_id = "" }: { fld_id?: string }) {
    const data = await this.fetch(
      "/folder/list",
      {
        only_folders: "1",
        fld_id,
      },
      `folderList:${fld_id}`,
    )
    return data
  }

  async getFolder({ fld_id }: { fld_id: string }) {
    const data = await this.listFolders({ fld_id: "" })
    const folder = data.result.folders.find((f: any) => f.fld_id === fld_id)
    return {
      ...data,
      folder,
    }
  }
}

const doodstream = new Doodstream()

export default doodstream

