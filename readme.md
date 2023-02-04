# Go Movies

A React front-end application with a Go Lang backend

## Running locally

### Run Postgres Docker container

```bash
cd server/
docker-compose up -d
```

### Kill the Postgres container

```bash
docker-compose down
```

## Run API

```bash
cd server/
go run ./cmd/api
```

## Run the Frontend application

```bash
cd client/
npm run start
```


## Project Structure

```ascii
.
├── .gitignore
└── readme.md
└── client <-- Frontend application written with ReactJS, TypeScript and Material UI
└── server <-- REST API written with go language using Postgres DB
```
