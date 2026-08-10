package httpserver

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"
)

type Dependencies struct {
	Logger      *slog.Logger
	Environment string
}

func NewRouter(deps Dependencies) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health/live", jsonHandler(http.StatusOK, map[string]string{"status": "alive"}))
	mux.HandleFunc("GET /health/ready", jsonHandler(http.StatusOK, map[string]string{"status": "ready"}))
	mux.HandleFunc("GET /api/v1", jsonHandler(http.StatusOK, map[string]string{"name": "Tably API", "version": "v1", "environment": deps.Environment}))
	return requestLogger(deps.Logger, recoverPanic(deps.Logger, mux))
}

func jsonHandler(status int, payload any) http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(status)
		_ = json.NewEncoder(w).Encode(payload)
	}
}

func requestLogger(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		next.ServeHTTP(w, r)
		logger.Info("HTTP request", "method", r.Method, "path", r.URL.Path, "duration_ms", time.Since(started).Milliseconds())
	})
}

func recoverPanic(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				logger.Error("request panic", "error", recovered)
				w.Header().Set("Content-Type", "application/json; charset=utf-8")
				http.Error(w, `{"error":"internal_server_error"}`, http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}
