"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Input } from "../ui/input"
import React from "react"
import { cn } from "@/lib/utils"

const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = React.useState(() => {
    // Check if the URL path starts with /f/ to extract the query
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.startsWith("/f/")) {
        return decodeURIComponent(path.substring(3))
      }
    }
    return ""
  })
  const [timer, setTimer] = React.useState(null as any)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value.trim()
    if (search === newSearch) return

    setSearch(newSearch)

    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        executeSearch(newSearch)
      }, 500),
    )
  }

  const executeSearch = (query: string) => {
    if (!query.trim()) return
    router.push(`/f/${encodeURIComponent(query.trim())}`)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    executeSearch(search)
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        aria-label="Search"
        className={cn(className)}
        type="search"
        placeholder="Search"
        onChange={onChange}
        role="searchbox"
        defaultValue={search}
      />
    </form>
  )
}

export default SearchInput

