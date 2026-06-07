package model

import (
	"time"
)

type Session struct {
	ID        string    `json:"id"`
	SongID    string    `json:"song_id"`
	Date      time.Time `json:"date"`
	Duration  int       `json:"duration"`
	Sections  []string  `json:"section_ids"`
	Notes     string    `json:"notes"`
	CreatedAt time.Time `json:"created_at"`
}
