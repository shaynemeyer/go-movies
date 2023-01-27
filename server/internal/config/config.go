package config

import (
	"os"
)

type DBConfig struct {
	ConnectionString string
}

type Config struct {
	DB DBConfig
}

// New returns a new Config struct
func New() *Config {
	return &Config{
		DB: DBConfig{
			ConnectionString: getEnv("DB_CONNECTION_STRING", ""),
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