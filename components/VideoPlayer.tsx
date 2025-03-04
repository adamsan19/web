"use client"

import { useState, useEffect } from "react"
import { settingsManager } from "@/lib/settings"

type VideoPlayerProps = {
  file: {
    title: string
    filecode: string
    splash_img: string
    length: number
    views: number
    uploaded: string
    single_img: string
  }
}

export default function VideoPlayer({ file }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const settings = settingsManager.getSettings()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: `url('${file.splash_img}') no-repeat center center`,
        backgroundSize: "contain",
        backgroundColor: "black",
      }}
      className="player relative"
    >
      {isPlaying && isClient ? (
        <div onClick={handlePlay} style={{ width: "100%", height: "100%" }}>
          <iframe
            id="videoIframe"
            className="w-full h-full"
            src={`${settings.embedDomain}${file.filecode}`}
            allowFullScreen
            title={file.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            scrolling="no"
          ></iframe>
        </div>
      ) : (
        <button
          id="playButton"
          onClick={handlePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none p-5 rounded-full hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fad"
            data-icon="play-circle"
            className="svg-inline--fa fa-play-circle fa-w-16 w-16 h-16 md:w-24 md:h-24"
            role="img"
            viewBox="0 0 512 512"
          >
            <g className="fa-group">
              <path
                className="fa-secondary"
                fill="#000000"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"
                opacity="0.4"
              />
              <path
                className="fa-primary"
                fill="#ffffff"
                d="M371.7 280l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"
              />
            </g>
          </svg>
        </button>
      )}
    </div>
  )
}

