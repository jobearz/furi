package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/jobearz/furi/internal/model"
	"github.com/jobearz/furi/internal/store"
)

type SessionHandler struct {
	store store.SongStore
}

func NewSessionHandler(s store.SongStore) *SessionHandler {
	return &SessionHandler{store: s}
}

func (h *SessionHandler) Create(w http.ResponseWriter, r *http.Request) {
	// check if request is POST method
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var session model.Session
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	session.Date = time.Now().Truncate(24 * time.Hour)

	created, err := h.store.CreateSession(session)
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *SessionHandler) GetSessionsBySongID(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/songs/")
	path = strings.TrimSuffix(path, "/sessions")
	id := path
	sessions, err := h.store.GetSessionsBySongID(id)
	if err != nil {
		http.Error(w, "failed to find sessions associated with that song ID", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sessions)

}
