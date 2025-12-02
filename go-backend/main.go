package main

import (
	"go-backend/handlers"
	"go-backend/middleware"
	"net/http"

	"github.com/rs/zerolog/log"
)

func main() {
	mux := http.NewServeMux()

	registerHandler := http.HandlerFunc(handlers.Register)
	wrappedRegister := middleware.Logger(registerHandler)
	mux.Handle("/register", wrappedRegister)

	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Is good yes"))
	})
	loginHandler := http.HandlerFunc(handlers.Login)
	wrappedLogin := middleware.Logger(loginHandler)
	mux.Handle("/login", wrappedLogin)

	log.Info().Msg("Server running on port :5000")
	http.ListenAndServe(":5000", middleware.CORS(mux))
}
