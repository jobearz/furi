package store

import (
	"fmt"
	"sync"
	"time"

	"github.com/jobearz/furi/internal/model"

	"github.com/google/uuid"
)

type MemoryStore struct {
	songs    map[string]model.Song
	sections map[string]model.Section
	mu       sync.RWMutex
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		songs:    make(map[string]model.Song),
		sections: make(map[string]model.Section),
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

func (s *MemoryStore) CreateSection(section model.Section) (model.Section, error) {
	// mutex lock before writing to the map
	s.mu.Lock()
	defer s.mu.Unlock()

	section.ID = uuid.New().String()
	section.CreatedAt = time.Now()
	s.sections[section.ID] = section
	return section, nil
}

func (s *MemoryStore) GetSectionsBySongID(songID string) ([]model.Section, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	sections := make([]model.Section, 0)
	for _, section := range s.sections {
		if section.SongID == songID {
			sections = append(sections, section)
		}
	}
	return sections, nil
}

func (s *MemoryStore) UpdateSectionMastery(id string, status model.MasteryStatus) (model.Section, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	section, ok := s.sections[id]
	if !ok {
		return model.Section{}, fmt.Errorf("Section with id %s not found", id)
	}
	section.Mastery = status
	s.sections[id] = section
	return section, nil
}
