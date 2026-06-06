package main

import (
	"log"
	"net/http"

	"github.com/jobearz/furi/internal/handler"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.Health)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
