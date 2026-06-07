package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jobearz/furi/internal/model"
	"github.com/jobearz/furi/internal/store"
)

type SectionHandler struct {
	store store.SongStore
}

func NewSectionHandler(s store.SongStore) *SectionHandler {
	return &SectionHandler{store: s}
}

func (h *SectionHandler) Create(w http.ResponseWriter, r *http.Request) {
	// check if request is POST method
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	path := r.URL.Path // "/songs/uuid-here/sections"
	path = strings.TrimPrefix(path, "/songs/")
	path = strings.TrimSuffix(path, "/sections")
	songID := path
	var section model.Section
	if err := json.NewDecoder(r.Body).Decode(&section); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	section.SongID = songID

	created, err := h.store.CreateSection(section)
	if err != nil {
		http.Error(w, "failed to create section", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *SectionHandler) GetSectionsBySongID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/songs/"):]
	sections, err := h.store.GetSectionsBySongID(id)
	if err != nil {
		http.Error(w, "failed to find sections associated with that song ID", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sections)
}

func (h *SectionHandler) UpdateSectionMastery(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// extract section ID from path
	// path looks like: /songs/uuid-song/sections/uuid-section
	path := strings.TrimPrefix(r.URL.Path, "/songs/")
	parts := strings.Split(path, "/")
	// parts[0] = songID, parts[1] = "sections", parts[2] = sectionID
	if len(parts) < 3 {
		http.Error(w, "invalid path", http.StatusBadRequest)
		return
	}
	sectionID := parts[2]

	// decode just the mastery status from body
	var body struct {
		Mastery model.MasteryStatus `json:"mastery"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	updated, err := h.store.UpdateSectionMastery(sectionID, body.Mastery)
	if err != nil {
		http.Error(w, "section not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}
