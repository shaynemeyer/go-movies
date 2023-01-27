package main

import (
	"backend/internal/config"
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

const port = 8080

type application struct {
	DSN string
	Domain string 
	DB repository.DatabaseRepo
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
	flag.Parse()

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

  app.Domain = "example.com"

	log.Println("Starting application on port", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())

	if err != nil {
		log.Fatal(err)
	}
}