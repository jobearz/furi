package store

import (
	"github.com/jobearz/furi/internal/model"
)

type MockStore struct{}

func (m *MockStore) Create(song model.Song) (model.Song, error) {
	song.ID = "test_id"
	return song, nil
}

func (m *MockStore) GetAll() ([]model.Song, error) {
	return []model.Song{}, nil
}

func (m *MockStore) GetByID(id string) (model.Song, error) {
	return model.Song{}, nil
}

func (m *MockStore) CreateSection(section model.Section) (model.Section, error) {
	section.ID = "test_id"
	return section, nil
}

func (m *MockStore) GetSectionsBySongID(songID string) ([]model.Section, error) {
	return []model.Section{}, nil
}

func (m *MockStore) UpdateSectionMastery(id string, status model.MasteryStatus) (model.Section, error) {
	return model.Section{}, nil
}

func (m *MockStore) CreateSession(session model.Session) (model.Session, error) {
	session.ID = "test_id"
	return session, nil
}

func (m *MockStore) GetSessionsBySongID(songID string) ([]model.Session, error) {
	return []model.Session{}, nil
}

func (m *MockStore) CreateUser(user model.User) (model.User, error) {
	user.ID = "test_id"
	return user, nil
}

func (m *MockStore) GetUserByEmail(email string) (model.User, error) {
	return model.User{}, nil
}
