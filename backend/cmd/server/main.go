package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/jobearz/furi/internal/handler"
	"github.com/jobearz/furi/internal/store"
)

func main() {
	memStore := store.NewMemoryStore()
	songHandler := handler.NewSongHandler(memStore)
	sectionHandler := handler.NewSectionHandler(memStore)
	sessionHandler := handler.NewSessionHandler(memStore)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.Health)
	mux.HandleFunc("/songs", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			songHandler.Create(w, r)
		case http.MethodGet:
			songHandler.GetAll(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/songs/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/songs/" {
			http.Redirect(w, r, "/songs", http.StatusMovedPermanently)
			return
		}

		path := r.URL.Path
		if strings.Contains(path, "/sections") {
			switch r.Method {
			case http.MethodPost:
				sectionHandler.Create(w, r)
			case http.MethodGet:
				sectionHandler.GetSectionsBySongID(w, r)
			case http.MethodPatch:
				sectionHandler.UpdateSectionMastery(w, r)
			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			}
			return
		}
		if strings.Contains(path, "/sessions") {
			switch r.Method {
			case http.MethodPost:
				sessionHandler.Create(w, r)
			case http.MethodGet:
				sessionHandler.GetSessionsBySongID(w, r)
			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			}
			return
		}

		switch r.Method {
		case http.MethodGet:
			songHandler.GetByID(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
