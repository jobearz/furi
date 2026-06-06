package store

import "github.com/jobearz/furi/internal/model"

type SongStore interface {
	Create(song model.Song) (model.Song, error)
	GetAll() ([]model.Song, error)
	GetByID(id string) (model.Song, error)
}
