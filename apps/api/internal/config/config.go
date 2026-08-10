package config

import (
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Environment string
	Host        string
	Port        int
	LogFormat   string
	LogLevelRaw string
	DatabaseURL string
	RedisURL    string
}

func Load() (Config, error) {
	port, err := strconv.Atoi(value("TABLY_HTTP_PORT", "8080"))
	if err != nil || port < 1 || port > 65535 {
		return Config{}, fmt.Errorf("TABLY_HTTP_PORT must be a valid port")
	}

	cfg := Config{
		Environment: value("TABLY_ENV", "development"),
		Host:        value("TABLY_HTTP_HOST", "0.0.0.0"),
		Port:        port,
		LogFormat:   value("TABLY_LOG_FORMAT", "json"),
		LogLevelRaw: value("TABLY_LOG_LEVEL", "info"),
		DatabaseURL: os.Getenv("TABLY_DATABASE_URL"),
		RedisURL:    os.Getenv("TABLY_REDIS_URL"),
	}
	return cfg, nil
}

func (c Config) HTTPAddress() string { return fmt.Sprintf("%s:%d", c.Host, c.Port) }

func (c Config) LogLevel() slog.Level {
	switch strings.ToLower(c.LogLevelRaw) {
	case "debug":
		return slog.LevelDebug
	case "warn":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

func value(key, fallback string) string {
	if current := os.Getenv(key); current != "" {
		return current
	}
	return fallback
}
