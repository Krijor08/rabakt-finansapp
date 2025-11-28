package main

import (
	"go-backend/handlers"
	"go-backend/middleware"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	registerHandler := http.HandlerFunc(handlers.Register)
	wrappedRegister := middleware.Logger(registerHandler)
	mux.Handle("/register", wrappedRegister)

	loginHandler := http.HandlerFunc(handlers.Login)
	wrappedLogin := middleware.Logger(loginHandler)
	mux.Handle("/login", wrappedLogin)

	log.Println("Server running on :45631")
	log.Fatal(http.ListenAndServe(":45631", mux))
}
