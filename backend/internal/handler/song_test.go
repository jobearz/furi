package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jobearz/furi/internal/store"
)

func TestCreateSong(t *testing.T) {
	mockStore := &store.MockStore{}
	h := NewSongHandler(mockStore)

	body := `{"title":"Supernova","artist":"aespa","url":"https://youtube.com/watch?v=test"}`
	req := httptest.NewRequest(http.MethodPost, "/songs", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Create(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201 got %d", w.Code)
	}
}

func TestGetAllSongs(t *testing.T) {
	mockStore := &store.MockStore{}
	h := NewSongHandler(mockStore)

	req := httptest.NewRequest(http.MethodGet, "/songs", nil)
	w := httptest.NewRecorder()

	h.GetAll(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 got %d", w.Code)
	}

	var songs []map[string]interface{}
	json.NewDecoder(w.Body).Decode(&songs)
	if len(songs) == 0 {
		t.Error("expected at least one song")
	}
}

func TestGetSongByID(t *testing.T) {
	mockStore := &store.MockStore{}
	h := NewSongHandler(mockStore)

	req := httptest.NewRequest(http.MethodGet, "/songs/test-id", nil)
	w := httptest.NewRecorder()

	h.GetByID(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 got %d", w.Code)
	}
}
