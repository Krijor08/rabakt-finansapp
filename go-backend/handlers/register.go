package handlers

import (
	"database/sql"
	"encoding/json"
	"go-backend/database"
	"io"
	"net/http"
	"regexp"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
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
	Password string `json:"password"`
	Key      string `json:"key"`
}

type Name struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func Register(w http.ResponseWriter, r *http.Request) {

	// POST only
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, ApiResponse{
			Error:  &ErrorResponse{Code: "METHOD_NOT_ALLOWED", Message: "Only POST method allowed"},
			Status: "error",
		})
		return
	}

	var p Payload

	// Decode JSON body
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "INVALID_JSON", Message: "Could not parse JSON"},
			Status: "error",
		})
		return
	}

	// Validate input
	if !isValidEmail(p.Email) {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "VALIDATION_ERROR", Message: "Invalid email"},
			Status: "error",
		})
		return
	}

	// Password length check, minimum 8 characters
	if len(p.Password) < 8 {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "WEAK_PASSWORD", Message: "Password too short"},
			Status: "error",
		})
		return
	}

	// Name fields check
	if p.Name.FirstName == "" || p.Name.LastName == "" {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "VALIDATION_ERROR", Message: "Name required"},
			Status: "error",
		})
		return
	}

	// Read body again for hashing and DB insert
	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "BAD_REQUEST", Message: "Cannot read body"},
			Status: "error",
		})
		log.Fatal().Err(err).Msg("Failed to read body")
		return
	}
	defer r.Body.Close()

	// Unmarshal again
	if err := json.Unmarshal(body, &p); err != nil {
		respondJSON(w, http.StatusBadRequest, ApiResponse{
			Error:  &ErrorResponse{Code: "VALIDATION_ERROR", Message: "Invalid JSON"},
			Status: "error",
		})
		return
	}
	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(p.Password), bcrypt.DefaultCost)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, ApiResponse{
			Error:  &ErrorResponse{Code: "HASH_FAILED", Message: "Failed to hash password"},
			Status: "error",
		})
		return
	}

	db := database.DB
	var exists int

	// Check if email already exists
	err = db.QueryRow("SELECT 1 FROM users WHERE email = ?", p.Email).Scan(&exists)
	if err != sql.ErrNoRows {
		if err == nil {
			respondJSON(w, http.StatusConflict, ApiResponse{
				Error:  &ErrorResponse{Code: "EMAIL_EXISTS", Message: "Email already taken"},
				Status: "error",
			})
			return
		}
	}

	// Insert new user
	_, err = db.Exec(`
		INSERT INTO users (email, first_name, last_name, password_hash) 
		VALUES (?, ?, ?, ?)`,
		p.Email, p.Name.FirstName, p.Name.LastName, string(hash))
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, ApiResponse{
			Error:  &ErrorResponse{Code: "DB_ERROR", Message: "Failed to save user"},
			Status: "error",
		})
		return
	}

	// Success response
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

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return re.MatchString(email)
}
