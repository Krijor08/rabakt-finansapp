package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

type Payload struct {
	Name string `json:"name"`
}

func Submit(w http.ResponseWriter, r *http.Request) {
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

	var p Payload
	if err := json.Unmarshal(body, &p); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Hello " + p.Name))
}
