# CRUD API

Simple CRUD API built with Node.js and TypeScript. The server exposes REST endpoints for managing users stored in memory and supports single-instance, production, and clustered (load balanced) modes

### Requirements
    "node": ">=24.10.0",
    "npm": ">=10.9.0"

1. ### Install
```
npm install
```
2. ### Set environment variables:

Copy .env.example to .env and adjust as needed.
```
cp .env.example .env
```
| Variable | Description                | Default |
| -------- |----------------------------| ------- |
| `PORT`   | Base port for the HTTP API | `4000`  |

3. ### Run appropriate script 

Available scripts
```
npm run start:dev        # Development mode with live reload
npm run start:prod       # Build TypeScript and run the compiled server
npm run start:multi:dev  # Development clustered mode with round-robin load balancer
npm run start:multi      # Run clustered mode with round-robin load balancer
npm test
```

## API reference

| Method | Path              | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/users`      | Get all users                   |
| GET    | `/api/users/:id`  | Get a user by id                |
| POST   | `/api/users`      | Create a new user               |
| PUT    | `/api/users/:id`  | Update an existing user         |
| DELETE | `/api/users/:id`  | Delete a user                   |

### NOTE: 
Windows CMD doesn’t recognize single quotes as string delimiters. 
On Windows CMD Use double quotes and escape the inner JSON.

#### GET all users
```
curl http://localhost:4022/api/users

```
#### GET a single user
Replace <id> with an actual user ID:
```
curl http://localhost:4022/api/users/<id>
```
#### POST (create a new user)
Your POST expects a JSON body like this:
```
curl -X POST http://localhost:4022/api/users -H "Content-Type: application/json" -d '{"name":"Alice","age":25,"hobbies":["reading","cycling"]}'

```
```
{
  "name": "Alice",
  "age": 25,
  "hobbies": ["reading", "cycling"]
}
```
#### PUT (update a user)
Replace <id>. You need an existing user ID
```
curl -X PUT http://localhost:4022/api/users/<id> -H "Content-Type: application/json" --json '{"id":"<id>","name":"Alice Updated","age":26,"hobbies":["reading","cycling","swimming"]}'

```
#### DELETE a user
```
curl -X DELETE http://localhost:4022/api/users/<id>
```