CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    youtube_url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sections (
    id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL REFERENCES songs(id),
    name TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    mastery TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL REFERENCES songs(id),
    date TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL,
    section_ids TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL
);