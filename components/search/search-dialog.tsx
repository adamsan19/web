"use client"

import type React from "react"

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState } from "react"

const SearchDialog = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const defaultQuery = (() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.startsWith("/f/")) {
        return decodeURIComponent(path.substring(3))
      }
    }
    return ""
  })()

  const onOpenChange = (open: boolean) => {
    setOpen(open)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = e.currentTarget.query.value.trim()

    if (!query) return

    router.push(`/f/${encodeURIComponent(query)}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="md:hidden">
        <MagnifyingGlassIcon className="size-6" aria-label="Search" role="search"></MagnifyingGlassIcon>
      </DialogTrigger>
      <DialogContent className="top-[10%] p-0 w-[85%]">
        <form onSubmit={onSubmit}>
          <Input
            type="search"
            placeholder="Search"
            aria-label="Search"
            role="searchbox"
            name="query"
            defaultValue={defaultQuery}
          ></Input>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog

