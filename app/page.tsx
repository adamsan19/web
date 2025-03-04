import CardList from "@/components/card-list"
import { DEFAULT_PER_PAGE } from "@/lib/constants"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = (searchParams.page && Number.parseInt(searchParams.page as string)) || 1
  const per_page = (searchParams.per_page && Number.parseInt(searchParams.per_page as string)) || DEFAULT_PER_PAGE
  const fld_id = (searchParams.fld_id && (searchParams.fld_id as string)) || undefined

  return (
    <div className="md:my-2">
      <CardList page={page} per_page={per_page} fld_id={fld_id} />
    </div>
  )
}

