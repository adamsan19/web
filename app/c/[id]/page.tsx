import { DEFAULT_PER_PAGE, SITENAME } from "@/lib/constants"
import type { Metadata } from "next"
import CardList from "@/components/card-list"
import MessageBox from "@/components/message-box"
import doodstream from "@/lib/doodstream"
import { stringToColor } from "@/lib/utils"
import JsonLd from "@/components/seo/json-ld"
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/components/seo/schemas"
import { headers } from "next/headers"
import { formatMetadata } from "@/lib/metadata"

type Props = {
  params: { id: string }
  searchParams: { page?: string; per_page?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const fld_id = params.id
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const data = await doodstream.getFolder({ fld_id })

  if (data.status !== 200 || !data.folder) {
    return {
      title: !data.folder ? "Channel not found" : data.msg,
      description: "Something went wrong. Please try again later.",
    }
  }

  const folder = data.folder
  return formatMetadata('channel', {
    channelName: folder.name,
    totalVideos: folder.total_files.toString()
  }, page)
}

export default async function Channel({ params, searchParams }: Props) {
  const fld_id = params.id
  const page = (searchParams.page && Number.parseInt(searchParams.page)) || 1
  const per_page = (searchParams.per_page && Number.parseInt(searchParams.per_page)) || DEFAULT_PER_PAGE
  const data = await doodstream.getFolder({ fld_id })

  const headersList = headers()
  const domain = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const fullUrl = `${protocol}://${domain}/c/${fld_id}`

  if (data.status !== 200 || !data.folder) {
    return (
      <MessageBox title={!data.folder ? "Channel not found" : data.msg} countdown={30} variant="error">
        <p className="text-center">Something went wrong. Please try again later.</p>
      </MessageBox>
    )
  }

  const folder = data.folder
  const schemas = [
    generateWebPageSchema(
      `${folder.name} - ${SITENAME}`,
      `${folder.name} - ${folder.total_files} videos are in this channel.`,
      fullUrl,
    ),
    generateBreadcrumbSchema([
      { name: "Home", url: `${protocol}://${domain}` },
      { name: "Channels", url: `${protocol}://${domain}/channels` },
      { name: folder.name, url: fullUrl },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="md:my-2">
        <div className="my-6 mb-10 text-center">
          <h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl uppercase"
            style={{ color: stringToColor(folder.name) }}
          >
            {folder.name}
          </h1>
          <p className="text-xs uppercase tracking-[0.6em] text-gray-600">Total {folder.total_files} videos</p>
        </div>
        <CardList page={page} per_page={per_page} fld_id={fld_id} />
      </div>
    </>
  )
}

