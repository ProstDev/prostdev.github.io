---
source: 'Edited from the spoken video for readability'
---

### Introduction

Welcome back! My name is Alex, and in this video we will learn how to design an API from scratch — how to write down the requirements in a note and then bring those requirements to life in our API specification using Anypoint Platform's Design Center.

### Writing Down the Requirements

Here is where we're going to be doing the requirements for our blog API. Since we're just getting started, we need to design it first. This is my process, but you can use your own process, whatever you prefer.

First, we need to identify our resources. Resources are basically the nouns or the things that we can do a CRUD operation on: Create, Read, Update, Delete. We want to do all of those things with these resources.

Our list of resources includes:
- **blog** (we'll have one blog, so I'm not sure if this is a resource or not yet)
- **articles** (plural — we'll have several articles where we can create an article, read an article or several articles, update an article, or delete an article)
- **writers** (same operations)
- **series** 
- **categories**
- **comments**

Notice how all of these are plural because we're going to have several of each. Maybe blog will just be the largest object that will contain all of these inside. Let's leave it like that for now.

### Creating the API Specification

I'm going to create a new account so you all can do this with me if you want to. Once you sign in, you might see this as your first screen — just go right over here and select Design Center. Remember in session one we saw an overview of all of these products, and now we are going to just focus on Design Center for this session.

Let's click on "Create new API specification." This is the beautiful thing about this UI — you don't have to know RAML or OpenAPI Specification language to design your API.

For the project name, let's use "blog API." Now, how do you want to draft the API spec? Here you can select "I'm comfortable designing it on my own" and choose whatever language you want, or you can select "Guide me through it — use a visual interface." The scaffolding can generate both RAML and OAS (OpenAPI Spec), and that is what we want. Let's select "Guide me through it" and create the API.

Here on the left we can see the different things that we can do — we can import stuff from Exchange, and we can create security schemes, resources, data types, and so on. Here on the right you have the code that is going to be generated once we start creating stuff. Here in the middle is where we'll work. At the bottom you can see that you can select RAML or OpenAPI Spec — you can see whatever language you want and even copy and paste this code if you need it. This is a free tool, and you can create as many free trial accounts as you want.

Let's set up the basic information. Our title is "blog API," version 1.0.0, protocols let's select both, media type is going to be application/json. For base URI, we won't have any parameters. Description we can leave blank. Secured by — nothing. This blog will not have any security because we trust people (said no one ever).

### Defining Data Types

Before we create the resources, we should probably start creating data types. Let's think about what each one will have:

**Article:**
- ID
- title
- content
- writer ID (this will link to the writers list)
- category ID
- comments

**Writer:**
- ID
- name
- bio
- articles

**Series:** Actually, wait — what's the difference between series and categories? I think I don't need series actually, so let's remove it. I think we only need categories.

**Category:**
- ID
- name
- list of articles

**Comment:**
- ID
- content
- author
- article ID (because an article can have many comments, but a comment can only be in one article)

Now let's create these data types in Design Center. Starting with **article**:
- ID: required, type number
- title: required, string
- content: required, string
- writer ID: required, string — actually, let's make all IDs numbers
- category ID: number
- comments: not required, this is going to be an array of comment (we'll come back to this)

Let's do **comment** next so we can link it properly:
- ID: number
- content: string
- author: string
- article ID: number

For the example: ID 1, content "This was a nice post," author "Alex Martinez," article ID 1.

Now back to article, the comments property is already showing the inherited example. Perfect. Let's add an example for article:
- ID: 1
- title: "The Importance of Regular Exercise"
- content: (example content)
- writer ID: 1
- category ID: 1
- comments: (inherited from comment)

Now **writer**:
- ID: required, number
- name: required, string
- bio: required, string
- articles: not required, array of article

Example: ID 1, name "Esmeralda," bio "20 plus years of experience in IT and very smart," articles with the example article including the comment from Alex.

Finally, **category**:
- ID: required, number
- name: required, string
- articles: not required, array of article

Example: ID 1, name "Mental Health," with the articles array.

We also need an **error** data type for error responses:
- code: number (example: 404)
- description: string (example: "Not found")

### Building the Articles Resource

Now let's create the resources. We already have our requirements, and I don't think we're going to do blog because it seems like all the information we need is already covered. Let's start with articles.

Create a resource at `/articles`. Here we have the HTTP methods we can select. Remember from our previous session we talked about HTTP methods — the main ones were GET, POST, PUT, PATCH, and DELETE.

**GET /articles** (get a list of all articles):
- Response 200 OK: body is an array of article
- Response 404 Not Found: body is error ("There are no articles to show")
- Response 500 Internal Server Error: body is error ("There was an internal error")

Now we want to retrieve just one article. We'll use a slug pattern (like prostdev.com/post/programming-challenge-seven). Let's add a slug property to the article data type: required, string.

Create a nested resource `/{slug}` with a URI parameter:
- slug: string, example "importance-of-regular-exercise"

**GET /articles/{slug}** (get one article):
- Response 200 OK: body is article
- Response 404 Not Found: body is error ("There are no articles with this slug")
- Response 500 Internal Server Error: body is error

URI parameters are like variables in the path (https://host.com/posts/1, where 1 changes). Query parameters come after the question mark (like ?q=cat). Headers are not in the URI at all.

### Adding POST, PUT, and DELETE

Let's check our CRUD operations:
- Can we create an article? Not yet.
- Can we read one article or the list of articles? Yes.
- Can we update? Not yet.
- Can we delete? Not yet.

**DELETE /articles/{slug}:**
- Response 204 No Content: nothing returned
- Response 404 Not Found: body is error ("There are no articles with this slug")
- Response 500 Internal Server Error: body is error

I don't want to allow deleting all articles at once — that would be awful. Just one at a time.

For creating and updating, I'm going to use POST to create and PUT to update. This is my personal preference, but you can do whatever feels better for your API.

**POST /articles** (create a new article):

Body to send (the API will generate the ID):
- title: required, string
- content: required, string
- writer ID: required, number (you have to create the writer first)
- category ID: number (not required)
- slug: required, string

Responses:
- 201 Created: returns the created article
- 400 Bad Request: body is error (if something's wrong with the body, like missing title)
- 409 Conflict: body is error (if the slug already exists)
- 500 Internal Server Error: body is error

**PUT /articles/{slug}** (update a specific article):

Body to send: the full article object with all properties (since it's already created)

Responses:
- 200 OK: returns the updated article
- 400 Bad Request: body is error
- 500 Internal Server Error: body is error

So now we have completed all CRUD operations for articles:
- Create: POST /articles
- Read: GET /articles (all) and GET /articles/{slug} (one)
- Update: PUT /articles/{slug}
- Delete: DELETE /articles/{slug}

You can design this however you want. For example, you could use POST to update a specific article and create a new one if it doesn't exist. In my case, I don't want to create new articles if I'm trying to update — I just want a response saying "you're trying to update something that doesn't exist."

### Homework

For your homework, you will need to continue what we started. We only did articles today, but you saw what I was doing. You will have to do writers, categories, and comments. At least we finished the data types, so you only need to do the resources.

I will also try to do that before the next session so we can all start on the same page, and I will send this to the repo so you can compare your response to mine.

You are free to make any changes you think are necessary for your API because this is your design. You are designing it however you want. If you want to use POST, PUT, or PATCH, you are free to do so. If you want different status codes — 400 Bad Request, 500 Internal Server Error, or whatever else — you are free to do them. This is your stuff.

I will see you in two weeks on June 28th, so we have enough time to do our homework and finish this API specification. Bye bye!
