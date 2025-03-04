import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor((seconds % 3600) % 60)

  const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
  const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
  return hDisplay + mDisplay + sDisplay
}

export function naturalTime(time: string) {
  const date = new Date(time)
  const diff = Math.round((new Date().getTime() - date.getTime()) / 1000)
  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365
  if (diff < 30) {
    return "just now"
  } else if (diff < minute) {
    return diff + " seconds ago"
  } else if (diff < 2 * minute) {
    return "a minute ago"
  } else if (diff < hour) {
    return Math.floor(diff / minute) + " minutes ago"
  } else if (Math.floor(diff / hour) == 1) {
    return "1 hour ago"
  } else if (diff < day) {
    return Math.floor(diff / hour) + " hours ago"
  } else if (diff < day * 2) {
    return "yesterday"
  } else if (diff < week) {
    return Math.floor(diff / day) + " days ago"
  } else if (diff < month) {
    return Math.floor(diff / week) + " weeks ago"
  } else if (diff < year) {
    return Math.floor(diff / month) + " months ago"
  } else {
    return Math.floor(diff / year) + " years ago"
  }
}

export function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).slice(-2)
  }
  return color
}

const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
export function humanSize(bytes: number) {
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i]
}

