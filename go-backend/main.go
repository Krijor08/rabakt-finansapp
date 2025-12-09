package main

import (
	"fmt"
	"go-backend/handlers"
	"go-backend/middleware"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func init() {
	if os.Getenv("DOCKER_ENV") != "true" {
		_ = godotenv.Load()
	}
}

func getDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Local&timeout=%s",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_HOST"),
		os.Getenv("MYSQL_PORT"),
		os.Getenv("MYSQL_DATABASE"),
		os.Getenv("MYSQL_TIMEOUT"),
	)
}

func main() {
	dsn := getDSN()
	log.Info().Msgf("Connecting to database with DSN: %s", dsn)
	//	db, err := sql.Open("mysql", getDSN())
	//	if err != nil {
	//		log.Fatal().Msg(err.Error())
	//	}
	//	defer db.Close()
	//
	mux := http.NewServeMux()

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
	http.ListenAndServe(":5000", middleware.CORS(mux))
}
