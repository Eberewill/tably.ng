.PHONY: run test check build

run:
	go run ./cmd/api

test:
	go test ./...

check:
	gofmt -w .
	go vet ./...
	go test ./...

build:
	go build -o bin/tably-api ./cmd/api
