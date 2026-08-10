# syntax=docker/dockerfile:1
FROM golang:1.24-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/tably-api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/tably-api /tably-api
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/tably-api"]
