import { useState, useEffect } from 'react'
import { createSong, deleteSong, getSongs } from '../api/client'
import type { Song } from '../types'
import { useNavigate } from 'react-router-dom'
import { PopUp } from './PopUp'

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setURL] = useState('')
  const [showSongForm, setShowSongForm] = useState(false)
  const [error, setError] = useState('')
  const [activeSong, setActiveSong] = useState<Song>()
  const [songPopUp, setSongPopUp] = useState(false)
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

  const handleDelete = async (song: Song) => {
    try {
      await deleteSong(song.id)
      setSongs(prev => prev.filter(s => s.id !== song.id))
    } catch (err) {
      console.error('failed to delete song:', err)
    }
  }

  const handleClick = () => {
    setShowSongForm(!showSongForm)
  }

  const handleSongClick = (): void => {
    setSongPopUp(true);
  }

  const handleCloseSong = (): void => {
    setSongPopUp(false);
  }

  const navigateToSong = (activeSong: Song): void => {
    if (activeSong !== undefined) {
      navigate(`/songs/${activeSong.id}`)
      }
  }

  const doesUserHaveSongs = (): boolean => {
    if (!songs || songs.length === 0) {
      return false
    } else {
      return true
    }
  }

  return (
    <div id='song-list-page'>
      <h1 className='songs-header'>My Songs</h1>
      <button onClick={handleClick}>
        {showSongForm ? 'Close' : 'Add New Song'}
      </button>
      {showSongForm && (
        <div className='song-form'>
          <h4>Song title</h4>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the song title"
          />
          <h4>Artist name</h4>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter the artist name"
          />
          <h4>YouTube URL</h4>
          <input
            type="text"
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="Enter the YouTube URL of the song"
          />
          <button onClick={handleAdd}>Create New Song</button>
        </div>
      )}

      {doesUserHaveSongs() &&
          <div className='song-list'>
            {songs.map(song => (
              <div className='song-info' key={song.id} onClick={() => {
                setActiveSong(song);
                handleSongClick();
                }}>
                <p>{song.title} - {song.artist}</p>
              </div>
            ))}
          
          <PopUp showPopUp={songPopUp} closePopUp={handleCloseSong}>
            <div className='popup-content'>
              <h3 className='popup-song-info'>{activeSong?.title} - {activeSong?.artist}</h3>
              <div className='popup-options'>
                <button onClick={() => navigateToSong(activeSong!)}>
                  Practice
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(activeSong!);
                  }}>
                  Delete Song
                </button>
              </div>
            </div>
          </PopUp>
        </div>
      }

      {error && <p>{error}</p>}
    </div>
  )
}
// navigate(`/songs/${song.id}`