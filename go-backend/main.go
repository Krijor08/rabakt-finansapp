package main

import (
	"crypto/tls"
	"go-backend/database"
	"go-backend/handlers"
	"go-backend/middleware"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/zerolog/log"
)

func main() {
	database.InitMySQL() // func in database/db.go
	defer database.Close()
	mux := http.NewServeMux() // new HTTP request multiplexer

	registerHandler := http.HandlerFunc(handlers.Register)
	wrappedRegister := middleware.Logger(registerHandler)
	mux.Handle("/register", wrappedRegister)

	loginHandler := http.HandlerFunc(handlers.Login)
	wrappedLogin := middleware.Logger(loginHandler)
	mux.Handle("/login", wrappedLogin)

	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("pong"))
	})

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Is good yes"))
	})

	log.Info().Msg("Server running on port :5000")
	server := &http.Server{
		Addr:      ":5000",
		Handler:   middleware.CORS(mux),
		TLSConfig: &tls.Config{},
	}
	log.Fatal().Err(server.ListenAndServeTLS("cert.pem", "key.pem")).Msg("Server failed")
}
