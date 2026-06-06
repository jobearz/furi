package main

import (
	"log"
	"net/http"

	"github.com/jobearz/furi/internal/handler"
	"github.com/jobearz/furi/internal/store"
)

func main() {
	memStore := store.NewMemoryStore()
	songHandler := handler.NewSongHandler(memStore)

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

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
