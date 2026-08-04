// typescript will warn if an invalid mastery value is used
export type MasteryStatus = 'not_started' | 'learning' | 'drilling' | 'clean' | 'performance_ready'
 
export interface Song {
    id: string
    title: string
    artist: string
    url: string
    created_at: string
}

export interface Section {
    id: string
    song_id: string
    name: string
    start_time: number
    end_time: number
    mastery: MasteryStatus
    notes: string
    created_at: string
}

export interface Session {
    id: string
    song_id: string
    date: string
    duration: number
    sections: string[]
    notes: string
    created_at: string
}