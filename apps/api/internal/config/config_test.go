package config

import "testing"

func TestLoadUsesDefaults(t *testing.T) {
	t.Setenv("TABLY_HTTP_PORT", "")
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if cfg.HTTPAddress() != "0.0.0.0:8080" {
		t.Fatalf("HTTPAddress() = %q", cfg.HTTPAddress())
	}
}

func TestLoadRejectsInvalidPort(t *testing.T) {
	t.Setenv("TABLY_HTTP_PORT", "70000")
	if _, err := Load(); err == nil {
		t.Fatal("Load() expected invalid port error")
	}
}
