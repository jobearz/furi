import { useState, useEffect } from 'react'
import { createSong, getSongs } from '../api/client'
import type { Song } from '../types'
import { useNavigate } from 'react-router-dom'

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setURL] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getSongs().then(setSongs)
  }, [])
  
  const handleAdd = async () => {
    try {
      await createSong(title, artist, url)
      window.location.reload(); 
    } catch (err) {
      setError('failed to create new song')
    }
  }

  return (
    <div>
      <h1>My Songs</h1>
      {songs.map(song => (
        <div key={song.id} onClick={() => navigate(`/songs/${song.id}`)}>
          <p>{song.title} - {song.artist}</p>
        </div>
      ))}
      // add song form
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter the song title"
      />
      <input
        type="text"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Enter the artist name"
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value)}
        placeholder="Enter the YouTube URL of the song"
      />
      <button onClick={handleAdd}>Create New Song</button>
      {error && <p>{error}</p>}
    </div>
  )
}