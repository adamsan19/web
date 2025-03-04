import SearchCardList from "@/components/search/search-list"
import type { Metadata } from "next"
import { SITENAME } from "@/lib/constants"
import JsonLd from "@/components/seo/json-ld"
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/components/seo/schemas"
import { headers } from "next/headers"
import { formatMetadata } from "@/lib/metadata"

type Props = {
  params: { query: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const decodedQuery = decodeURIComponent(params.query)
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  return formatMetadata('search', {
    query: decodedQuery
  }, page)
}

export default function SearchPage({ params, searchParams }: Props) {
  const query = decodeURIComponent(params.query)
  const headersList = headers()
  const domain = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const fullUrl = `${protocol}://${domain}/f/${params.query}`

  const schemas = [
    generateWebPageSchema(`Search: ${query} - ${SITENAME}`, `Search results for "${query}" on ${SITENAME}`, fullUrl),
    generateBreadcrumbSchema([
      { name: "Home", url: `${protocol}://${domain}` },
      { name: "Search", url: fullUrl },
      { name: query, url: fullUrl },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="md:my-2">
        <SearchCardList query={query} banner />
      </div>
    </>
  )
}

