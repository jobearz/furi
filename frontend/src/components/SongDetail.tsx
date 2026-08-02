import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { createSection, getSections, getSessions, getSong } from '../api/client'
import type { Section, Session, Song } from '../types'
import { TiDelete } from 'react-icons/ti'
import Heatmap from './Heatmap'

export default function SongDetail() {
  const { id } = useParams()
  const [sections, setSections] = useState<Section[]>([])
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [song, setSong] = useState<Song | null>(null)
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const [sectionPopUp, setSectionPopUp] = useState(false)
  const [reps, setReps] = useState(5)
  const [repsLeft, setRepsLeft] = useState(5)
  const [isPracticing, setIsPracticing] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    if (id) {
      getSong(id).then(setSong)
      getSections(id).then(data => {
        setSections(data)
      })
      getSessions(id).then(setSessions)
    }
  }, [id])

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  }, [])

  useEffect(() => {
    if (!activeSection || !song) return

    const videoId = getVideoId(song.url)

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        host: 'https://www.youtube.com',
        height: '315',
        width: '560',
        videoId,
        playerVars: {
          start: activeSection.start_time,
          autoplay: 1,
          fs: 1,
          controls: 1,
          modestbranding: 0,
          rel: 0,
          origin: window.location.origin
        },
      })
    }

    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer()
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer
    }
  }, [activeSection, song])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleClick = () => {
    setShowSectionForm(!showSectionForm)
  }

  const startPractice = () => {
    if (!activeSection || !playerRef.current) return
    setRepsLeft(reps)
    setIsPracticing(true)

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return
      const currentTime = playerRef.current.getCurrentTime()
      if (currentTime >= activeSection.end_time) {
        playerRef.current.seekTo(activeSection.start_time)
        setRepsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsPracticing(false)
            playerRef.current.pauseVideo()
            // advance to next section
            const currentIndex = sections.findIndex(s => s.id === activeSection.id)
            if (currentIndex < sections.length - 1) {
              setActiveSection(sections[currentIndex + 1])
            }
            return 0
          }
          return prev - 1
        })
      }
    }, 500)
  }

  const getVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/)
    return match ? match[1] : ''
  }

  const handleAdd = async () => {
        if (!id) return
    try {
      const newSection = await createSection(id, name, timeToSeconds(startTime), timeToSeconds(endTime), notes)
      setSections(prev => [...(prev ?? []), newSection])
      setName('')
      setStartTime('')
      setEndTime('')
      setNotes('')
    } catch (err) {
      console.error('error:', err)
      setError('failed to create new section')
    }
  }

  const handleDelete = async (deletedSection: Section) => {
    try {
      // send delete request
      const response = await fetch(`/api/songs/${deletedSection.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // remove if database has successfully deleted
        setSections(sections.filter((section) => section.id !== deletedSection.id))
      } else {
        console.error('Failed to delete section from database')
      }
    } catch (error) {
      console.error('Network error occurred:', error)
    }
  }

  const timeToSeconds = (time: string): number => {
    const parts = time.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    }
    return parseInt(time) || 0
  }

  const secondsToTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div id="song-detail-page">
      <h1 className="sections-header">Sections</h1>
      <button onClick={handleClick}>
        {showSectionForm ? 'Close' : 'Add New Section'}
      </button>
      {showSectionForm && (
        <div className='section-form'>
          <h4>Section name</h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New Section"
          />
          <h4>Start time</h4>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <h4>End time</h4>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <h4>Notes</h4>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button onClick={handleAdd}>Create New Section</button>
        </div>
      )}
      <div className='practice-section'>
        <div className="sections-list">
          {(sections ?? []).map(section => (
            <div className="section-info" key={section.id} onClick={() => { setActiveSection(section) }}>
              <p>{section.name} - {secondsToTime(section.start_time)} to {secondsToTime(section.end_time)}</p>
              <p className="mastery">Mastery: {section.mastery}</p>
              <button
                className='delete-button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(section);
                }}>
                X
              </button>
            </div>
          ))}
        </div>
        <div className="practice-player">
          {activeSection && (
            <div>
              <div id="youtube-player" />
              <div className="reps">
                <label className="reps-label">Reps: </label>
                <input
                  className="reps-input"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                />
                <button onClick={startPractice} disabled={isPracticing}>
                  {isPracticing ? `${repsLeft} reps left` : 'Start Practice'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Heatmap sessions={sessions} />
      {error && <p>{error}</p>}
    </div>
  )
}