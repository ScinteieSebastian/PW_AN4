# Documentatie

>## Users
**POST /api/v1/users/register** - Register a user

**Body** - json
    
    {
        username: String //admin - for admin,
        password: String
    }
---
**POST /api/v1/users/login** - Login a user

**Body** - json
    
    {
        username: String,
        password: String
    }

**Response** - String

    JWT_TOKEN
---
>## Authors
**POST /api/v1/authors** - Post Author information

**Permission** - admin

**Body** - json

    {
        firstName: String,
        lastName: String
    }
 ---
 **GET /api/v1/authors** - Get Authors information

**Permission** - admin, user

**Response** - [json]

    [{
        id: Number,
        firstName: String,
        lastName: String
    }]
---
 **GET /api/v1/authors/:id** - Get information for author with id in params

**Permission** - admin, user

**Response** - json

    {
        id: Number
        firstName: String,
        lastName: String
    }
---
**PUT /api/v1/authors/:id** - Update information for author with id in params

**Permission** - admin

**Body** - json

    {
        firstName: String,
        lastName: String
    }
---
 **DELETE /api/v1/authors/:id** - Delete author with id in prams

**Permission** - admin

---

>## Books
**POST /api/v1/books** - Post Book information

**Permission** - admin

**Body** - json 

    {
        authorId: Number,
        name: String,
        genres: ['horror', 'fiction', 'romance', 'science-fiction', 'fantasy', 'philosophy', 'biography']
    }
 ---
 **GET /api/v1/books** - Get Books information

**Permission** - admin, user

**Response** - [json]
    
    [{
        id: Number
        author: String,
        name: String,
        genres: [String]
    }]
---
 **GET /api/v1/books/:id** - Get information for book with id in params

**Permission** - admin, user

**Response** - json

    {
        id: Number
        author: String,
        name: String,
        genres: [String]
    }
---
**PUT /api/v1/books/:id** - Update information for book with id in params

**Permission** - admin

**Body** 

    {
        id: Number
        author: String,
        name: String,
        genres: [String]
    }

---
 **DELETE /api/v1/books/:id** - Delete book with id in prams

**Permission** - admin
