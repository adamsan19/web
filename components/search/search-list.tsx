import MessageBox from "../message-box"
import VideoCard from "../video-card"
import doodstream from "@/lib/doodstream"
import { settingsManager } from "@/lib/settings"

const SearchCardList = async ({
  query,
  banner,
  sort,
}: {
  query: string
  banner?: boolean
  sort?: string
}) => {
  const settings = settingsManager.getSettings()
  const data = await doodstream.search({ query, sort: sort || settings.defaultSort })

  if (!data.result || !Array.isArray(data.result)) {
    return (
      <MessageBox title="No results found" variant="info">
        <p className="text-center">Try a shorter search term.</p>
      </MessageBox>
    )
  }

  return (
    <div className="flex flex-col">
      {banner && (
        <div className="my-6 mb-8 text-center">
          <h1 className="text-xs md:text-sm font-bold text-gray-600 uppercase">Search Results</h1>
          <h1 className="text-sm md:text-xl uppercase">
            Found {data.result.length} videos for &apos;{query}
            &apos;
          </h1>
        </div>
      )}
      {data.result.length ? (
        <div className="grid grid-cols-2 gap-0 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
          {data.result.map((video: any) => {
            return <VideoCard key={video.file_code} video={video}></VideoCard>
          })}
        </div>
      ) : (
        <MessageBox title="No results found" variant="info">
          <p className="text-center">Try a shorter search term.</p>
        </MessageBox>
      )}
    </div>
  )
}

export default SearchCardList

