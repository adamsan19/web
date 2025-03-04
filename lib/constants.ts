import { settingsManager } from "./settings"

const settings = settingsManager.getSettings()

export const DOODSTREAM_BASE_URL = process.env.DOODSTREAM_BASE_URL || settings.apiUrl
export const DOODSTREAM_API_KEY = process.env.SECRET_API_KEY || settings.apiKey
export const SITENAME = process.env.SITENAME || settings.siteName
export const DEFAULT_PER_PAGE = Number.parseInt(process.env.DEFAULT_PER_PAGE || settings.perPage.toString())
export const DEFAULT_REVALIDATE_INTERVAL = 3600

