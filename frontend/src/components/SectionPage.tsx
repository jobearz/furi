import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSection, getSections, getSessions, getSong } from '../api/client'
import type { Section, Session, Song } from '../types'
import Heatmap from './Heatmap'

export default function SectionPage() {
    const { id } = useParams()
    const [sections, setSections] = useState<Section[]>([])
    const [name, setName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')
    const [activeSection, setActiveSection] = useState<Section | null>(null)
    const [song, setSong] = useState<Song | null>(null)
    const playerRef = useRef<any>(null)
    const intervalRef = useRef<any>(null)
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
                height: '315',
                width: '560',
                videoId,
                playerVars: {
                    start: activeSection.start_time,
                    autoplay: 1,
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
        console.log('button clicked', { id })
        if (!id) return
        try {
            console.log('calling createSection with:', { id, name, startTime, endTime, notes })
            const newSection = await createSection(id, name, Number(startTime), Number(endTime), notes)
            setSections(prev => [...prev, newSection])
            setName('')
            setStartTime('')
            setEndTime('')
            setNotes('')
        } catch (err) {
            console.error('error:', err)
            setError('failed to create new section')
        }
    }

    return (
        <div>
            <h1>Placeholder header</h1>
            <div className='sections'>
                {(sections ?? []).map(section => (
                    <div key={section.id} onClick={() => setActiveSection(section)}>
                        <p>{section.name} - {section.start_time}s to {section.end_time}s</p>
                        <p>Mastery: {section.mastery}</p>
                    </div>
                ))}
            </div>
            <div className="practice-section">

                {activeSection && (
                    <div>
                        <div id="youtube-player" />
                        <label>Reps: </label>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(Number(e.target.value))}
                        />
                        <button onClick={startPractice} disabled={isPracticing}>
                            {isPracticing ? `${repsLeft} reps left` : 'Start Practice'}
                        </button>
                    </div>
                )}
                <div className='section-input'>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New Section"
                    />
                    <input
                        type="number"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input
                        type="number"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>
            <button onClick={handleAdd}>Create New Section</button>
            <Heatmap sessions={sessions} />
            {error && <p>{error}</p>}
        </div>
    )
}