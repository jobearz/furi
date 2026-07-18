import type { Song, Section, Session } from "../types"

const BASE_URL = 'http://localhost:8080'

function getToken(): string {
    return localStorage.getItem('token') ?? ''
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }
}

export async function login(email: string, password: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
        throw new Error('failed to login user')
    }
    const data = await response.json()
    localStorage.setItem('token', data.token)
    return data.token
}

export async function register(email: string, password: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
        throw new Error('failed to register user')
    }
}

export async function getSongs(): Promise<Song[]> {
    const response = await fetch(`${BASE_URL}/songs`, {
        headers: authHeaders()
    })
    if (!response.ok) {
        throw new Error('failed to fetch songs')
    }
    return response.json()
}

export async function getSong(id: string): Promise<Song> {
    const response = await fetch(`${BASE_URL}/songs/${id}`, {
        headers: authHeaders()
    })
    if (!response.ok) throw new Error('failed to fetch song')
    return response.json()
}

export async function createSong(title: string, artist: string, url: string): Promise<Song> {
    const response = await fetch(`${BASE_URL}/songs`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, artist, url })
    })
    if (!response.ok) {
        throw new Error('failed to create song')
    }
    return response.json()
}

export async function getSections(songId: string): Promise<Section[]> {
    const response = await fetch(`${BASE_URL}/songs/${songId}/sections`, {
        headers: authHeaders()
    })
    if (!response.ok) {
        throw new Error('failed to fetch sections')
    }
    return response.json()
}

export async function createSection(songId: string, name: string, startTime: number, endTime: number, notes: string): Promise<Section> {
    const response = await fetch(`${BASE_URL}/songs/${songId}/sections`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
            name,
            start_time: startTime,
            end_time: endTime,
            mastery: "not_started",
            notes
        })
    })
    if (!response.ok) {
        throw new Error('failed to create section')
    }
    return response.json()
}

export async function getSessions(songId: string): Promise<Session[]> {
    const response = await fetch(`${BASE_URL}/songs/${songId}/sessions`, {
        headers: authHeaders()
    })
    if (!response.ok) {
        throw new Error('failed to fetch sessions')
    }
    return response.json()
}