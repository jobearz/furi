package model

import "time"

type Song struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	Title      string    `json:"title"`
	Artist     string    `json:"artist"`
	YoutubeURL string    `json:"url"`
	CreatedAt  time.Time `json:"created_at"`
}
