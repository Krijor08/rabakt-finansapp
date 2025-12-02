package middleware

import (
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

func Logger(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Let the real handler run
		handler.ServeHTTP(w, r)

		// After the request finishes, log it
		duration := time.Since(start)

		log.Info().
			Str("method", r.Method).    // GET, POST, etc.
			Str("url", r.URL.String()). // /hello
			Dur("took", duration).      // how long it took
			Str("from", r.RemoteAddr).  // who made the request
			Msg("request completed")
	})
}
