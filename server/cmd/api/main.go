package main

import (
	"backend/internal/config"
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
)

const port = 8080

type application struct {
	DSN string
	Domain string 
	DB repository.DatabaseRepo
	auth Auth
	JWTSecret string 
	JWTIssuer string
	JWTAudience string
	CookieDomain string
	TMDBAPIKey string
	AllowOrigin string
}

// init is invoked before main()
func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
log.Print("No .env file found")
	}
}

func main() {
	conf := config.New()

	// set application config
	var app application
	
	// read from command line
	flag.StringVar(&app.DSN, "dsn", conf.DB.ConnectionString, "Postgres connection string")
	flag.StringVar(&app.JWTSecret, "jwt-secret", conf.Auth.JWTSecret, "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", conf.Auth.JWTIssuer, "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", conf.Auth.JWTAudience, "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", conf.Auth.CookieDomain, "cookie domain")
	flag.StringVar(&app.Domain, "domain", conf.Auth.AppDomain, "domain")
	flag.StringVar(&app.TMDBAPIKey, "tmdb-api-key", conf.API.TMDBAPIKey, "tmdb-api-key")
	flag.StringVar(&app.AllowOrigin, "allow-origin", conf.CORS.AllowOrigin, "allow-origin")
	flag.Parse()

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer: app.JWTIssuer,
		Audience: app.JWTAudience,
		Secret: app.JWTSecret,
		TokenExpiry: time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookiePath: "/",
		CookieName: "__Host-refresh_token",
		CookieDomain: app.CookieDomain,
	}

	log.Println("Starting application on port", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())

	if err != nil {
		log.Fatal(err)
	}
}