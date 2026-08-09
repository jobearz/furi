import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { createSection, getSections, getSessions, getSong, deleteSection } from '../api/client'
import type { Section, Session, Song } from '../types'
import { updateMastery } from '../api/client'
import Header from './Header'
import Heatmap from './Heatmap'
import { PopUp } from './PopUp'

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
      getSections(id).then(data => setSections(data))
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

    const getVideoId = (url: string) => {
      if (!url) return ''
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
      if (shortMatch) return shortMatch[1]
      const longMatch = url.match(/[?&]v=([^&]+)/)
      if (longMatch) return longMatch[1]
      const embedMatch = url.match(/embed\/([^?&]+)/)
      if (embedMatch) return embedMatch[1]
      return ''
    }
    const videoId = getVideoId(song.url)

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId,
        playerVars: {
          start: activeSection.start_time,
          autoplay: 1,
          fs: 1,
          controls: 1,
          rel: 0,
          origin: 'https://furidance.app'
        },
      })
    }

    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer()
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer
    }
  }, [activeSection, song])

  // MutationObserver for iframe sizing
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.getElementById('youtube-player') as HTMLIFrameElement
      if (iframe && iframe.tagName === 'IFRAME') {
        const container = document.getElementById('video-container')
        if (container) {
          const w = container.clientWidth
          iframe.setAttribute('width', String(w))
          iframe.setAttribute('height', String(Math.round(w * 0.5625)))
        }
        observer.disconnect()
      }
    })

    const container = document.getElementById('video-container') || document.body
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['width', 'height']
    })

    return () => observer.disconnect()
  }, [activeSection])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

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
      await deleteSection(id!, deletedSection.id)
      setSections(sections.filter(s => s.id !== deletedSection.id))
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
  }

  return (
    <div id="song-detail-page">
      <Header></Header>
      <h1 className="sections-header">Sections</h1>
      <button onClick={() => setShowSectionForm(!showSectionForm)}>
        {showSectionForm ? 'Close' : 'Add New Section'}
      </button>
      {showSectionForm && (
        <div className="section-form">
          <h4>Section name</h4>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="New Section" />
          <h4>Start time</h4>
          <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="0:30" />
          <h4>End time</h4>
          <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="1:00" />
          <h4>Notes</h4>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="create-button" onClick={handleAdd}>Create New Section</button>
        </div>
      )}
      <div className="practice-section">
        <div className="sections-list">
          {(sections ?? []).map(section => (
            <div
              className="section-info"
              key={section.id}
              onClick={() => {
                setActiveSection(section)
                setSectionPopUp(true)
              }}
            >
              <h3>{section.name} — {secondsToTime(section.start_time)} to {secondsToTime(section.end_time)} - {section.mastery}</h3>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(section)
                }}
              >X</button>
            </div>
          ))}
        </div>
        <PopUp showPopUp={sectionPopUp} closePopUp={() => setSectionPopUp(false)}>
          <div className="popup-content">
            {activeSection && (
              <div>
                <div id="video-container" className="video-wrapper">
                  <div id="youtube-player" />
                </div>
                <div className="reps">
                  <label className="reps-label">Reps:</label>
                  <input
                    className="reps-input"
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                  />
                  <button onClick={startPractice} disabled={isPracticing}>
                    {isPracticing ? `${repsLeft} reps left` : 'Start Practice'}
                  </button>
                  <select
                    value={activeSection.mastery}
                    onChange={async (e) => {
                      const updated = await updateMastery(id!, activeSection.id, e.target.value)
                      setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
                      setActiveSection(updated)
                    }}
                  >
                    <option value="not_started">Not started</option>
                    <option value="learning">Learning</option>
                    <option value="drilling">Drilling</option>
                    <option value="clean">Cleaning</option>
                    <option value="performance_ready">Performance Ready</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </PopUp>
      </div>
      {/* <div className='heatmap'>
        <Heatmap sessions={sessions} />
      </div> */}
      {error && <p>{error}</p>}
    </div>
  )
}