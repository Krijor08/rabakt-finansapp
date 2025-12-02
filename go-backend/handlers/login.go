package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Could not read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var p LoginPayload
	if err := json.Unmarshal(body, &p); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	respondJSON(w, http.StatusCreated, ApiResponse{
		Data:    map[string]string{"email": p.Email},
		Message: "User login successful",
		Status:  "success",
	})

}
