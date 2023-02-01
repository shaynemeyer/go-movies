package config

import (
	"os"
)

type AuthConfig struct {
	JWTSecret string
	JWTIssuer string
	JWTAudience string
	CookieDomain string
	AppDomain string
}

type DBConfig struct {
	ConnectionString string
}

type APIConfig struct {
	TMDBAPIKey string
}

type Config struct {
	Auth AuthConfig
	DB DBConfig
	API APIConfig
}

// New returns a new Config struct
func New() *Config {
	return &Config{
		Auth: AuthConfig{
			JWTSecret: getEnv("JWT_SECRET", ""),
			JWTIssuer: getEnv("JWT_ISSUER", ""),
			JWTAudience: getEnv("JWT_AUDIENCE", ""),
			CookieDomain: getEnv("COOKIE_DOMAIN", ""),
			AppDomain: getEnv("APP_DOMAIN", ""),
		},
		DB: DBConfig{
			ConnectionString: getEnv("DB_CONNECTION_STRING", ""),
		},
		API: APIConfig{
			TMDBAPIKey: getEnv("TMDB_API_KEY", ""),
		},
	}
}

// Simple helper function to read an environment variable or retur a default value
func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}