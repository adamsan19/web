import { CalendarIcon, CubeIcon, LapTimerIcon, RocketIcon, Share1Icon } from "@radix-ui/react-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { humanDuration, humanSize } from "@/lib/utils"
import CopyButton from "@/components/copy-button"
import LikeButton from "@/components/like-button"
import MessageBox from "@/components/message-box"
import { SITENAME } from "@/lib/constants"
import SearchCardList from "@/components/search/search-list"
import doodstream from "@/lib/doodstream"
import VideoPlayer from "@/components/VideoPlayer"
import JsonLd from "@/components/seo/json-ld"
import { generateVideoSchema, generateWebPageSchema, generateBreadcrumbSchema } from "@/components/seo/schemas"
import { headers } from "next/headers"
import DownloadButton from "@/components/download-button"
import { formatMetadata } from "@/lib/metadata"

type PageProps = {
  params: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await doodstream.getFile({ file_code: params.id as string })
  if (data.status !== 200) {
    return {
      title: data.msg,
      description: "Something went wrong. Please try again later.",
    }
  }

  const file = data.result[0]
  return formatMetadata('video', {
    videoTitle: file.title,
    duration: humanDuration(file.length),
    views: file.views.toString(),
    size: humanSize(file.size)
  })
}

export default async function Video({ params }: PageProps) {
  const data = await doodstream.getFile({ file_code: params.id as string })
  const headersList = headers()
  const domain = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const fullUrl = `${protocol}://${domain}/e/${params.id}`

  if (data.status !== 200) {
    return (
      <MessageBox title={data.msg} countdown={30} variant="error">
        <p className="text-center">Something went wrong. Please try again later.</p>
      </MessageBox>
    )
  }

  const file = data.result[0]
  const query = file.title ? file.title.split(" ")[0] : ""

  const schemas = [
    generateVideoSchema(file, fullUrl),
    generateWebPageSchema(`${file.title} - ${SITENAME}`, `Watch ${file.title} on ${SITENAME}`, fullUrl),
    generateBreadcrumbSchema([
      { name: "Home", url: `${protocol}://${domain}` },
      { name: "Videos", url: `${protocol}://${domain}/videos` },
      { name: file.title, url: fullUrl },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="grid col-span-full gap-4 md:gap-4 md:mx-10">
        <VideoPlayer file={file} />
        <Card className="mx-2 mb-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl font-bold">{file.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-flow-row lg:grid-flow-col">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex gap-2 items-center">
                      <LapTimerIcon className="size-4 md:size-5"></LapTimerIcon>
                      Duration
                    </TableCell>
                    <TableCell>{humanDuration(file.length)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex gap-2 items-center">
                      <RocketIcon className="size-4 md:size-5"></RocketIcon>
                      Views
                    </TableCell>
                    <TableCell>{file.views}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex gap-2 items-center">
                      <CubeIcon className="size-4 md:size-5"></CubeIcon>
                      Size
                    </TableCell>
                    <TableCell>{humanSize(file.size)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex gap-2 items-center">
                      <CalendarIcon className="size-4 md:size-5"></CalendarIcon>
                      Uploaded
                    </TableCell>
                    <TableCell>{new Date(file.uploaded + ".000Z").toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="grid grid-cols-2 gap-2 mt-8 md:grid-cols-3 lg:grid-cols-2 lg:ml-4 lg:my-4">
                <div className="col-span-full md:col-auto lg:col-span-full">
                  <DownloadButton fileCode={file.filecode} />
                </div>
                <CopyButton className="bg-secondary lg:col-span-full">
                  <Share1Icon className="size-4 me-1 mb-0.5"></Share1Icon>
                  Share
                </CopyButton>
                <LikeButton className="lg:col-span-full" useButton={true} file={file} />
              </div>
            </div>
          </CardContent>
        </Card>
        <h1 className="text-2xl font-bold text-center my-4">Related Videos</h1>
        <SearchCardList query={query} />
      </div>
    </>
  )
}

