import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { createSection, getSections, getSong } from '../api/client'
import type { Section, Song } from '../types'

export default function SongDetail() {
  const { id } = useParams()
  const [sections, setSections] = useState<Section[]>([])
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [song, setSong] = useState<Song | null>(null)

  useEffect(() => {
    if (id) {
      getSong(id).then(setSong)
      getSections(id).then(data => {
        setSections(data)
      })
    }
  }, [id])

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
      <h1>Sections</h1>
      {(sections ?? []).map(section => (
        <div key={section.id} onClick={() => setActiveSection(section)}>
          <p>{section.name} - {section.start_time}s to {section.end_time}s</p>
          <p>Mastery: {section.mastery}</p>
        </div>
      ))}
      {activeSection && (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${getVideoId(song?.url ?? '')}?start=${activeSection.start_time}&autoplay=1&enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name of section."
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
      <button onClick={handleAdd}>Create New Section</button>
      {error && <p>{error}</p>}
    </div>
  )
}