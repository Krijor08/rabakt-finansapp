package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type ApiResponse struct {
	Data    any            `json:"data,omitempty"`
	Error   *ErrorResponse `json:"error,omitempty"`
	Message string         `json:"message,omitempty"`
	Status  string         `json:"status"`
}

type ErrorResponse struct {
	Code    string         `json:"code"`
	Message string         `json:"message"`
	Details map[string]any `json:"details,omitempty"`
}

type Payload struct {
	Email    string `json:"email"`
	Name     Name   `json:"name"`
	LastName string `json:"lastName"`
	Password string `json:"password"`
	Key      string `json:"key"`
}

type Name struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	dsn := "root:yourpassword@tcp(127.0.0.1:3306)/mydb?parseTime=true&loc=Local"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Test the connection
	if err := db.Ping(); err != nil {

	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "BAD_REQUEST", Message: "Cannot read body"},
			Status: "error",
		})
		return
	}
	defer r.Body.Close()

	var p Payload
	if err := json.Unmarshal(body, &p); err != nil {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "VALIDATION_ERROR", Message: "Invalid JSON"},
			Status: "error",
		})
		return
	}

	respondJSON(w, http.StatusCreated, ApiResponse{
		Data:    map[string]string{"email": p.Email},
		Message: "User registered successfully",
		Status:  "success",
	})
}

func respondJSON(w http.ResponseWriter, status int, payload ApiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
