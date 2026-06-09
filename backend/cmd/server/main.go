package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/jobearz/furi/db"
	"github.com/jobearz/furi/internal/handler"
	"github.com/jobearz/furi/internal/middleware"
	"github.com/jobearz/furi/internal/store"
)

func main() {
	database, err := db.Connect()
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}
	defer database.Close()

	pgStore := store.NewPostgresStore(database)
	songHandler := handler.NewSongHandler(pgStore)
	sectionHandler := handler.NewSectionHandler(pgStore)
	sessionHandler := handler.NewSessionHandler(pgStore)
	authHandler := handler.NewAuthorizationHandler(pgStore)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.Health)
	mux.HandleFunc("/auth/register", authHandler.Register)
	mux.HandleFunc("/auth/login", authHandler.Login)
	mux.HandleFunc("/songs", middleware.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			songHandler.Create(w, r)
		case http.MethodGet:
			songHandler.GetAll(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	}))
	mux.HandleFunc("/songs/", middleware.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
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
	}))
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
