package httpserver

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthAndVersionRoutes(t *testing.T) {
	router := NewRouter(Dependencies{Logger: slog.New(slog.NewTextHandler(io.Discard, nil)), Environment: "test"})
	tests := []struct{ path, contains string }{
		{"/health/live", `"alive"`},
		{"/health/ready", `"ready"`},
		{"/api/v1", `"Tably API"`},
	}
	for _, test := range tests {
		t.Run(test.path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, test.path, nil)
			response := httptest.NewRecorder()
			router.ServeHTTP(response, request)
			if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), test.contains) {
				t.Fatalf("response = %d %s", response.Code, response.Body.String())
			}
		})
	}
}
