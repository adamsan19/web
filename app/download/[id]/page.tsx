"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { DownloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import doodstream from "@/lib/doodstream"

export default function DownloadPage({ params }: { params: { id: string } }) {
  const [countdown, setCountdown] = useState(10)
  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const data = await doodstream.getFile({ file_code: params.id })
        if (data.status === 200) {
          setFile(data.result[0])
        }
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }
    fetchFile()
  }, [params.id])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>File Not Found</CardTitle>
            <CardDescription>The requested file could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{file.title}</CardTitle>
          <CardDescription>Your download will be available in {countdown} seconds</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {countdown === 0 ? (
            <Link href={`https://doodstream.com/d/${file.filecode}`} target="_blank">
              <Button>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </Link>
          ) : (
            <Button disabled>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Please Wait...
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

