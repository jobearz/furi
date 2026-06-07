package model

import "time"

type MasteryStatus string

const (
	MasteryNotStarted       MasteryStatus = "not_started"
	MasteryLearning         MasteryStatus = "learning"
	MasteryDrilling         MasteryStatus = "drilling"
	MasteryClean            MasteryStatus = "clean"
	MasteryPerformanceReady MasteryStatus = "performance_ready"
)

type Section struct {
	ID        string        `json:"id"`
	SongID    string        `json:"song_id"`
	Name      string        `json:"name"`
	StartTime int           `json:"start_time"`
	EndTime   int           `json:"end_time"`
	Mastery   MasteryStatus `json:"mastery"`
	Notes     string        `json:"notes"`
	CreatedAt time.Time     `json:"created_at"`
}
