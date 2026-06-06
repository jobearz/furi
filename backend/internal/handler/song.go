package handler

import (
	"encoding/json"
	"net/http"

	"github.com/jobearz/furi/internal/model"
	"github.com/jobearz/furi/internal/store"
)

type SongHandler struct {
	store store.SongStore
}

func NewSongHandler(s store.SongStore) *SongHandler {
	return &SongHandler{store: s}
}

func (h *SongHandler) Create(w http.ResponseWriter, r *http.Request) {
	// check if request is POST method
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var song model.Song
	if err := json.NewDecoder(r.Body).Decode(&song); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	created, err := h.store.Create(song)
	if err != nil {
		http.Error(w, "failed to create song", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *SongHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	songs, err := h.store.GetAll()
	if err != nil {
		http.Error(w, "failed to get songs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func (h *SongHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/songs/"):]
	song, err := h.store.GetByID(id)
	if err != nil {
		http.Error(w, "failed to find a song with that ID", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(song)
}
