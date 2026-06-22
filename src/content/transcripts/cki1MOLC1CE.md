---
source: 'Edited from the spoken video for readability'
---

### Intro

Let's design a full to-do list API in Anypoint Code Builder. No flows, no integrations yet —
just a clean, reusable API spec that you can mock, test, and publish. This is the foundation
of any good MuleSoft project, and if you're new to ACB or switching from Studio, it's a great
place to start.

### Creating the API specification

From the ACB welcome screen, click **Design an API**. You can create an API specification or
an API fragment — we'll pick API specification. We won't use Agent topics for this one; let's
stick to the basics.

Name it something like `todo-task-api`. API type is REST (not async). The specification
language will be **OpenAPI 3 (YAML)**. If you're signed in you can select a business group; we
can skip it. When you're not logged in you don't even get that option, which is totally fine —
we'll log in later. Click **Create project** and it opens a new project with a basic API file
where we'll define our endpoints.

### Basic info

Start by updating the basic info: the title, the version, and a description. Change the title
to something like **To-Do Task Management API** and add a description. This description is used
when publishing to Exchange, so keep it clear and helpful.

### The /tasks resource (GET and POST)

Add the first resource, `tasks`, with two methods: a **GET** to list all tasks and a **POST**
to create one. Give each a summary and a description.

For the GET, we'll use query parameters to allow filtering. Under `parameters`, specify where
the parameter lives — in this case the query. The first parameter is `completed`, of type
boolean, with a description of what it filters. Add a second query parameter for `dueDate`. You
can add more filters; we'll leave it there. Tip: use Ctrl+Space to see options based on your
current indentation. Add a `200` response with a description and `application/json` content,
and define a schema of type array whose items we'll define in a moment.

For the POST, add a **request body**. It has to be `required`, otherwise we can't know what
we're posting. Content is `application/json`, and we'll reference the schema in a moment. Then
add a `201` response — "task created successfully" — also with `application/json` content and a
schema reference we'll fill in later. Notice the breadcrumb at the top shows which level you're
at, so you don't have to scroll up to see where you are.

### The /tasks/{taskId} resource (GET, PUT, DELETE)

Now define the second resource, inside `tasks` → `{taskId}`, so we can filter by one specific
ID. It will have a **GET**, a **PUT**, and a **DELETE**, with summaries like "get a task by
ID", "update a task", and "delete a task".

Add the URI parameter once, at the top, instead of on each method. With Ctrl+Space, set `in:
path`, `name: taskId` (matching the path), `required: true`, and a schema of type string.

For the GET, add a `200` response (description + `application/json` + schema ref, to be filled
in). Because we use a URI parameter, also add a `404` with description "task not found".

For the PUT, add a required request body (`application/json`, schema ref later) and two
responses: `200` and `404` (copy the 404; give the 200 a description and schema ref).

For the DELETE, two responses: a `204` and a `404`. The 404 is "task not found"; the 204 is
"task deleted successfully" — we return 204 because the operation succeeded but there's no body
to return.

### Data models — Task and TaskInput

Now define the data models. Under `components` → `schemas`, the first schema is **Task**, of
type object, with properties like `id` (string, example `"1"`), `title` (string, example "buy
groceries"), `description`, `dueDate`, and `completed` (with a default of `false`, since a new
task hasn't been completed). The required fields are `id`, `title`, and `completed` — we don't
always need a description or due date, but we always need an ID, a title, and the completed
state.

Because we don't have an ID when **creating** a task, we can't make `id` required there. So
create a second schema, **TaskInput**, with the same properties minus `id`. There are cleaner
ways to avoid repeating yourself, but we'll keep it simple for this example.

Now wire the schemas into the references. When getting a task we already know the ID, so use
**Task**. When creating a task we don't have one, so use **TaskInput** in the request — and we
respond with **Task** (the result that comes back with an ID). For everything under
`{taskId}`, we already have the ID in the URI, so respond with **Task**.

### Testing in the API Console

Now that the spec is written, let's test it without writing any Mule flows. Save with ⌘S /
Ctrl S, then click **API Console**. This shows the full documentation: the endpoints (`tasks`
GET/POST and `tasks/{taskId}` GET/PUT/DELETE), code examples, query parameters like `completed`
and `dueDate`, and the shape of each response. For methods with more than one response — like
GET by ID — you can see both the `200` and the `404`.

Click **Try it** to get a feel for it. It's a mock, so when you send a request it returns the
example you defined regardless of the input. For example, sending `taskId` 123 still returns
the example ID 1. The query-parameter section lets you show/hide optional parameters like
`completed` and `dueDate`. The DELETE returns a `204` with no content. And the console
validates: send something that isn't a boolean and you get a bad request telling you it
expected a boolean but found an integer (or a string). Try sending a request without a required
`taskId` and you get a bad request. Great for quick validation. There's also API Governance,
which is a more advanced topic for a future video.

### Publishing to Anypoint Exchange

Final step: make the spec reusable across your team by publishing it to **Anypoint Exchange**.
You need to be logged in. Either click **Not logged in to Anypoint Platform** to sign in, or
click **Publish API project to Exchange**, or use the command palette (⇧⌘P / ⇧Ctrl P) and
search "Exchange". It prompts you to log in — click **Allow** and follow the flow.

Once logged in, select a business group. You may see a warning suggesting you add rulesets and
run validation; for now we'll keep it simple. Add an API version like `v1`, set the business
group, optionally review the project metadata, and click **Publish**. When it asks whether to
implement it now, select **No** — we'll do that later.

Now from Anypoint Platform → Exchange, you can see the **To-Do Task API** published, with the
same endpoints we saw in the API Console, which you can try out there too. Anyone in your org
can now discover and reuse this API, or scaffold flows from it later.

### Wrap-up

That's how you design, mock/test, and publish a complete OpenAPI specification in Anypoint Code
Builder — no coding yet, but you're already ahead of 90% of Mule devs still starting with XML.
In the next video we'll scaffold the flows from this exact spec and implement it step by step,
so make sure you're subscribed. And if you had any issues, you can book a free one-on-one
session using the link in the description. I'll see you in the next video. Bye!
