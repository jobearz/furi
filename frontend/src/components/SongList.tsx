import { useState, useEffect } from 'react'
import { getSongs } from '../api/client'
import type { Song } from '../types'

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    getSongs().then(setSongs)
  }, [])

  return (
    <div>
      <h1>My Songs</h1>
      {songs.map(song => (
        <div key={song.id}>
          <p>{song.title} - {song.artist}</p>
        </div>
      ))}
    </div>
  )
}