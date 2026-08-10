package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Eberewill/tably.ng/apps/api/internal/config"
	httpserver "github.com/Eberewill/tably.ng/apps/api/internal/platform/http"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	handlerOptions := &slog.HandlerOptions{Level: cfg.LogLevel()}
	var handler slog.Handler = slog.NewJSONHandler(os.Stdout, handlerOptions)
	if cfg.LogFormat == "text" {
		handler = slog.NewTextHandler(os.Stdout, handlerOptions)
	}
	logger := slog.New(handler)
	server := &http.Server{
		Addr:              cfg.HTTPAddress(),
		Handler:           httpserver.NewRouter(httpserver.Dependencies{Logger: logger, Environment: cfg.Environment}),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	shutdownSignal, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		logger.Info("Tably API listening", "address", server.Addr, "environment", cfg.Environment)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("HTTP server failed", "error", err)
			os.Exit(1)
		}
	}()

	<-shutdownSignal.Done()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Error("graceful shutdown failed", "error", err)
	}
}
