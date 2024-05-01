# Installation and Startup

1. Clone the repo:
```sh
git clone https://github.com/caffeineeee/apollo-server-graphql-jwt-ts-simple-auth-backend.git
```

2. Change directory:
```sh
cd apollo-server-graphql-jwt-ts-simple-auth-backend
```

3. Install dependencies:
```sh
pnpm i
```

1. Run `cp env.example .env` or copy the `env.example` file, rename it to `.env`.

2. Run `openssl rand -base64 33` in the terminal. Set it as the value of env variable `JWT_SECRET` in `.env` file.

3. Run the project in development mode:
```sh
pnpm dev
```

1. Navigate to http://localhost:4000 to open the Apollo GraphQL Studio.

---

To create a new local SQLite DB (with some seed data), run:
```sh
pnpm seed
```

To view the database, open it through your DB GUI app, for instance mine is from https://sqlitebrowser.org.

---

# Assessment

In the Apollo GraphQL Studio, click the "Explorer" tab (at the left-most, vertical tab), follow the instructions below:

## GraphQL Query

1. `user` endpoint.

a. Scenario 1 (EXISTING USER ID), expect this returns data (SUCCESS).
Top-middle/"Operation" panel, insert this:

```graphql
query Query($userId: ID!) {
  user(id: $userId) {
    username
    email
    password
    token
  }
}
```

Bottom-middle panel > "Variables" tab, insert this:
```json
{
  "userId": "kjds-234s-s4we-wer2"
}
```

Click the ▶ button to run the API request, expect it returns data:

```json
{
  "data": {
    "user": {
      "username": "test",
      "email": "test@gmail.com",
      "password": "$2a$10$Ba99Kn4Xc.C7N.8fGP6lvOsldeit6txCliKIwQ7RbmPulWy00OHRa",
      "token": "test"
    }
  }
}
```

b. Scenario 2 (NON-EXISTING USER ID), expect it returns error (USER_ALREADY_EXISTS).
Try requesting this again (notice the non-existing `userId` "foo-bar-foo-bar" in the DB):

```json
{
  "userId": "foo-bar-foo-bar"
}
```

Expect it returns error:
```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "user"
      ],
      "extensions": {
        "0": "USER_NOT_EXISTS",
        "code": "UNAUTHENTICATED",
        "exception": {
          "stacktrace": [
            "..."
          ]
        }
      }
    }
  ],
  "data": {
    "user": null
  }
}
```

## GraphQL Mutation

1. `registerUser` endpoint.

a. Scenario 1 (PROPER INPUT), expect this returns data (SUCCESS).
Top-middle/"Operation" panel, insert this:

```graphql
mutation RegisterUser($registerInput: RegisterInput) {
  registerUser(registerInput: $registerInput) {
    username
    email
    password
    token
  }
}
```

Bottom-middle panel > "Variables" tab, insert this:
```json
{
  "registerInput": {
    "username": "test",
    "email": "test5@gmail.com",
    "password": "test",
    "confirmPassword": "test"
  }
}
```

Click the ▶ button to run the API request:

```json
{
  "data": {
    "registerUser": {
      "username": "test",
      "email": "test5@gmail.com",
      "password": "$2a$10$/j.ve5UQsYAfDNNLu6tbSuCBx0VrYK./8b.T9FLUUX4TVrdlIyxs6",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTYyZjVlZWItYWU2ZC00OTNiLTk3NTYtYzcyMjQ3MTYwYzc2IiwiZW1haWwiOiJ0ZXN0NUBnbWFpbC5jb20iLCJpYXQiOjE3MTQ1OTAzMTEsImV4cCI6MTcxNDU5NzUxMX0.v-Yi6sRLKAV2vwmzYsz2SW285MP1osrKTZ47jvhah68"
    }
  }
}
```

b. Scenario 2 (SAME EMAIL), expect it returns error (USER_ALREADY_EXISTS).
Try requesting this again (notice the same email "test5@gmail.com"):

```json
{
  "registerInput": {
    "username": "test",
    "email": "test5@gmail.com",
    "password": "test",
    "confirmPassword": "test"
  }
}
```

Expect it returns error:
```json
{
  "errors": [
    {
      "message": "A user is already registered with the email.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "registerUser"
      ],
      "extensions": {
        "0": "USER_ALREADY_EXISTS",
        "code": "UNAUTHENTICATED",
        "exception": {
          "stacktrace": [
            "...",
          ]
        }
      }
    }
  ],
  "data": {
    "registerUser": null
  }
}
```

2. `loginUser` endpoint.

a. Scenario 1 (PROPER INPUT), expect it returns data (SUCCESS).
Top-middle/"Operation" panel, insert this:

```graphql
mutation RegisterUser($loginInput: LoginInput) {
  loginUser(loginInput: $loginInput) {
    username
    email
    password
    token
  }
}
```

Bottom-middle panel > "Variables" tab, insert this:
```json
{
  "loginInput": {
    "email": "test5@gmail.com",
    "password": "test"
  }
}
```

Click the ▶ button to run the API request:

```json
{
  "data": {
    "loginUser": {
      "username": "test",
      "email": "test5@gmail.com",
      "password": "$2a$10$/j.ve5UQsYAfDNNLu6tbSuCBx0VrYK./8b.T9FLUUX4TVrdlIyxs6",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjVmMjBhNzEtMzc1Zi00NDg4LTk4NDktMTYwMmQ3ODEzYjc5IiwiZW1haWwiOiJ0ZXN0NUBnbWFpbC5jb20iLCJpYXQiOjE3MTQ1OTA5NzMsImV4cCI6MTcxNDU5ODE3M30.G2HGBqorHhcWMNappim0uQNbwIOsSV-AT6js1UGJbX0"
    }
  }
}
```


b. Scenario 2 (WRONG EMAIL/PASSWORD), expect it returns error (INVALID_CREDENTIALS).
Top-middle/"Operation" panel, insert this:

Bottom-middle panel > "Variables" tab, insert this:
```json
{
  "loginInput": {
    "email": "test5@gmail.com",
    "password": "foo"
  }
}
```

Click the ▶ button to run the API request:

```json
{
  "errors": [
    {
      "message": "Incorrect credentials",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "loginUser"
      ],
      "extensions": {
        "0": "INVALID_CREDENTIALS",
        "code": "UNAUTHENTICATED",
        "exception": {
          "stacktrace": [
            "...",
          ]
        }
      }
    }
  ],
  "data": {
    "loginUser": null
  }
}
```