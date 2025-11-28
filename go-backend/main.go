package main

import (
	"local/go/handlers"
	"local/go/middleware"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	// Route: /submit
	submitHandler := http.HandlerFunc(handlers.Submit)

	// Wrap it with middleware
	wrappedSubmit := middleware.Logger(submitHandler)

	mux.Handle("/submit", wrappedSubmit)

	log.Println("Server running on :45631")
	log.Fatal(http.ListenAndServe(":45631", mux))
}
