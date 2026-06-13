package store

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jobearz/furi/internal/model"
	_ "github.com/lib/pq"
)

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore(db *sql.DB) *PostgresStore {
	return &PostgresStore{db: db}
}

func (s *PostgresStore) Create(song model.Song) (model.Song, error) {
	song.ID = uuid.New().String()
	song.CreatedAt = time.Now()

	_, err := s.db.Exec(
		"INSERT INTO songs (id, title, artist, youtube_url, created_at) VALUES ($1, $2, $3, $4, $5)",
		song.ID, song.Title, song.Artist, song.YoutubeURL, song.CreatedAt,
	)
	if err != nil {
		return model.Song{}, err
	}

	return song, nil
}

func (s *PostgresStore) GetAll() ([]model.Song, error) {
	rows, err := s.db.Query("SELECT id, title, artist, youtube_url, created_at FROM songs")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var songs []model.Song
	for rows.Next() {
		var song model.Song
		err := rows.Scan(&song.ID, &song.Title, &song.Artist, &song.YoutubeURL, &song.CreatedAt)
		if err != nil {
			return nil, err
		}
		songs = append(songs, song)
	}
	return songs, nil
}

func (s *PostgresStore) GetByID(id string) (model.Song, error) {
	row := s.db.QueryRow("SELECT id, title, artist, youtube_url, created_at FROM songs WHERE id = $1", id)
	var song model.Song
	err := row.Scan(&song.ID, &song.Title, &song.Artist, &song.YoutubeURL, &song.CreatedAt)
	if err != nil {
		return model.Song{}, err
	}
	return song, nil
}

func (s *PostgresStore) CreateSection(section model.Section) (model.Section, error) {
	section.ID = uuid.New().String()
	section.CreatedAt = time.Now()

	_, err := s.db.Exec(
		"INSERT INTO sections (id, song_id, name, start_time, end_time, mastery, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		section.ID, section.SongID, section.Name, section.StartTime, section.EndTime, section.Mastery, section.Notes, section.CreatedAt,
	)
	if err != nil {
		return model.Section{}, err
	}

	return section, nil
}

func (s *PostgresStore) GetSectionsBySongID(songID string) ([]model.Section, error) {
	rows, err := s.db.Query(
		"SELECT id, song_id, name, start_time, end_time, mastery, notes, created_at FROM sections WHERE song_id = $1",
		songID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sections := make([]model.Section, 0)
	for rows.Next() {
		var section model.Section
		err := rows.Scan(&section.ID, &section.SongID, &section.Name, &section.StartTime, &section.EndTime, &section.Mastery, &section.Notes, &section.CreatedAt)
		if err != nil {
			return nil, err
		}
		sections = append(sections, section)
	}
	return sections, nil
}

func (s *PostgresStore) UpdateSectionMastery(id string, status model.MasteryStatus) (model.Section, error) {
	_, err := s.db.Exec("UPDATE sections SET mastery = $1 WHERE id = $2", status, id)
	if err != nil {
		return model.Section{}, err
	}
	row := s.db.QueryRow("SELECT id, song_id, name, start_time, end_time, mastery, notes, created_at FROM sections WHERE id = $1", id)
	var section model.Section
	err = row.Scan(&section.ID, &section.SongID, &section.Name, &section.StartTime, &section.EndTime, &section.Mastery, &section.Notes, &section.CreatedAt)
	if err != nil {
		return model.Section{}, err
	}
	return section, nil
}

func (s *PostgresStore) CreateSession(session model.Session) (model.Session, error) {
	session.ID = uuid.New().String()
	session.CreatedAt = time.Now()

	_, err := s.db.Exec(
		"INSERT INTO sessions (id, song_id, date, duration, section_ids, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		session.ID, session.SongID, session.Date, session.Duration, strings.Join(session.Sections, ","), session.Notes, session.CreatedAt,
	)
	if err != nil {
		return model.Session{}, err
	}

	return session, nil
}

func (s *PostgresStore) GetSessionsBySongID(songID string) ([]model.Session, error) {
	rows, err := s.db.Query(
		"SELECT id, song_id, date, duration, section_ids, notes, created_at FROM sessions WHERE song_id = $1",
		songID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []model.Session
	for rows.Next() {
		var session model.Session
		var sectionIDs string
		err := rows.Scan(&session.ID, &session.SongID, &session.Date, &session.Duration, &sectionIDs, &session.Notes, &session.CreatedAt)
		if err != nil {
			return nil, err
		}
		if sectionIDs != "" {
			session.Sections = strings.Split(sectionIDs, ",")
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}

func (s *PostgresStore) CreateUser(user model.User) (model.User, error) {
	user.ID = uuid.New().String()
	user.CreatedAt = time.Now()

	_, err := s.db.Exec(
		"INSERT INTO users (id, email, password, created_at) VALUES ($1, $2, $3, $4)",
		user.ID, user.Email, user.Password, user.CreatedAt,
	)
	if err != nil {
		return model.User{}, fmt.Errorf("insert failed: %w", err)
	}

	return user, nil
}

func (s *PostgresStore) GetUserByEmail(email string) (model.User, error) {
	row := s.db.QueryRow("SELECT id, email, password, created_at FROM users WHERE email = $1", email)
	var user model.User
	err := row.Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}
