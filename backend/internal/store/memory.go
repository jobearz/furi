package store

import (
	"fmt"
	"sync"
	"time"

	"github.com/jobearz/furi/internal/model"

	"github.com/google/uuid"
)

type MemoryStore struct {
	songs map[string]model.Song
	mu    sync.RWMutex
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		songs: make(map[string]model.Song),
	}
}

func (s *MemoryStore) Create(song model.Song) (model.Song, error) {
	// mutex lock before writing to the map
	s.mu.Lock()
	defer s.mu.Unlock()

	song.ID = uuid.New().String()
	song.CreatedAt = time.Now()
	s.songs[song.ID] = song
	return song, nil
}

func (s *MemoryStore) GetAll() ([]model.Song, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	songs := make([]model.Song, 0, len(s.songs))
	for _, song := range s.songs {
		songs = append(songs, song)
	}
	return songs, nil
}

func (s *MemoryStore) GetByID(id string) (model.Song, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	song, ok := s.songs[id]
	if !ok {
		return model.Song{}, fmt.Errorf("Song with id %s not found", id)
	}
	return song, nil
}
