import type { Session } from '../types'

interface Props {
    sessions: Session[]
}

export default function Heatmap({ sessions }: Props) {
    const days = 90
    const today = new Date()

    // set of practiced dates
    const practicedDates = new Set(
        sessions.map(s => s.date.split('T')[0])
    )

    // array of last 90 days
    const grid = Array.from({ length: days }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (days - 1 - i))
        const dateStr = date.toISOString().split('T')[0]
        return {
            date: dateStr,
            practiced: practicedDates.has(dateStr)
        }
    })

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', width: '210px' }}>
            {grid.map(day => (
                <div
                    key={day.date}
                    title={day.date}
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: day.practiced ? '#FF4E8E' : '#252525'
                    }}
                />
            ))}
        </div>
    )
}