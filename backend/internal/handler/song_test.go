package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// implement all other interface methods returning empty values

func TestCreateSong(t *testing.T) {
	// store := &store.MockStore{}
	// handler := NewSongHandler(store)

	body := `{"title":"Supernova","artist":"aespa","url":"https://youtube.com"}`
	req := httptest.NewRequest(http.MethodPost, "/songs", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.Create(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201 got %d", w.Code)
	}
}
