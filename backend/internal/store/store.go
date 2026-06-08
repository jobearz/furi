package store

import "github.com/jobearz/furi/internal/model"

type SongStore interface {
	Create(song model.Song) (model.Song, error)
	GetAll() ([]model.Song, error)
	GetByID(id string) (model.Song, error)
	CreateSection(section model.Section) (model.Section, error)
	GetSectionsBySongID(songID string) ([]model.Section, error)
	UpdateSectionMastery(id string, status model.MasteryStatus) (model.Section, error)
	CreateSession(session model.Session) (model.Session, error)
	GetSessionsBySongID(songID string) ([]model.Session, error)
	CreateUser(user model.User) (model.User, error)
	GetUserByEmail(email string) (model.User, error)
}
