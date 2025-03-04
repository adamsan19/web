import { Button } from "./ui/button"
import { DownloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export default function DownloadButton({ fileCode }: { fileCode: string }) {
  return (
    <Link href={`/download/${fileCode}`}>
      <Button className="w-full">
        <DownloadIcon className="size-4 me-1 mb-1"></DownloadIcon>
        Download
      </Button>
    </Link>
  )
}

