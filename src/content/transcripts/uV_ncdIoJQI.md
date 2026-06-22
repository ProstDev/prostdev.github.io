---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello, hello everyone. In this video we're going to start actually implementing some things. In
the last videos we first designed, then scaffolded, and learned all the tips and tricks about
scaffolding your new Mule flows. In this one we'll start implementing — but just for one of the
methods. Here's the plot twist: you're going to have some homework so you can get used to ACB
and do some things yourself. I'll show you how to do one method, and you'll do the other four
during the week. I'll come back next week and show you the solution I came up with.

We're also going to learn how to run a MySQL database in Docker so we can connect to it and
start saving to-do tasks. It doesn't have to be MySQL — it could be MongoDB, or even an Object
Store (though that needs an enterprise account). I just figured a local MySQL database with
Docker would be easiest. Let's get started.

### Running MySQL in Docker

This is where we left off in the last video. First, I'll remove the API Console since we won't
use it. Then I created a `docker-compose.yml` file that has all the information needed to run
the Docker image. I also have the **Containers** extension (really the Docker extension), which
gives a Containers tab where you can see images — I have `mysql:latest` — and running
containers. You can see the image, the environment (admin), the name `mysql-db`, the user and
password, and the port `3306`.

With this extension installed it's easy: open the compose file and click **Run all services**.
It downloads what it needs and runs the Docker container on the port you asked for, with all
that information.

After that, I installed a **database** extension where you can connect to any local database.
Click to add a configuration — MySQL database — with host `127.0.0.1` (localhost) and port
`3306`, plus the database name, user, and password. At first you won't have any tables, but I
already modified a SQL script to create a `tasks` table with `id`, `title`, `description`,
`due_date`, and `completed` — same as in our OpenAPI spec. Click **Run** and it generates the
table.

### One config file per flow

Now for the actual work. There are different ways to organize your flows. If you keep them all
in one XML, you'd see them together (like in Studio) — but ACB only shows one flow at a time.
Since this is a small project, I recommend creating a **new configuration file per flow**.

I'll do just one — the **GET tasks** — and you'll do the rest. Right-click `src/main/mule` and
choose **New Mule configuration file** (not "New file", which creates a literally empty file).
The configuration file adds all the XML boilerplate. Name it `get-all-tasks` (you don't even
need to add `.xml`). Then select **Build a sub-flow** (we don't need a whole flow, we'll
reference it). Name it `get-all-tasks-subflow` and press Enter (very important, or it won't
save). Add a logger so there's no error, and save.

Back in the **get tasks** flow, remove its default logger (Delete key, or right-click → Delete
component), then add a **Flow Reference** pointing to `get-all-tasks-subflow`. Save.

### A global config file

We're not done. You can keep the global configuration here or move it to a `global.xml` — I
prefer a global file. Create a new Mule configuration file, select **Global**, and press Enter.
From the code of the other file, cut the APIkit config and the listener, and paste them into
`global.xml` (in the code view). Save both. Open the command palette and run **Format Document**
so the XML looks pretty (personal preference). You'll notice there are no properties yet — all
the configuration is inline. That's okay for now.

### Implementing the GET-all-tasks logic

Back in `get-all-tasks`, open the logger and set the message to "start get all tasks". Save (⌘S
/ Ctrl S). Add a second logger at the end with "end get all tasks". Now we have a start and an
end so we can follow the logs.

We have a MySQL database, so click **+** and select **Database → Select** (search for it or find
it under Connectors → Database). Save, then open the POM. Change the database connector to
version 1.14.2. You'll see the new dependency. But we need more: add a `mysql-connector-java`
dependency, version `8.0.29` (the latest, 8.0.33, gave me an error, so let's keep 8.0.29 — yes,
it has one vulnerability, but that's okay). That's still not enough: at the top, in the
`mule-maven-plugin`, the configuration is empty, so add a **shared library** with group ID
`mysql` and artifact `mysql-connector-java`, matching the dependency below.

Now create the DB config. If you type `DB`, you can pick **DB MySQL config** directly (best), or
**DB Config** and then choose a MySQL connection inside. Add the values directly: host
`127.0.0.1`, port `3306`, user `user`, password `password`, database `mysql-db`. Save and click
**Test connection** — valid. (At first I typed `username` instead of `user`; fixing that, the
test passes.) If you didn't have the shared library, dependency, and POM config set up, this
test would fail — I demonstrated that: without everything in place the connection test fails.

Back in the select, set the query to come from `payload` — we'll build the query in a transform
message. There are no input parameters, so leave that and save.

### The DataWeave files (request query + JSON response)

Under `src/main/resources`, create a `dw` folder. Inside, create `get-all-tasks-request.dwl` and
`get-all-tasks-response.dwl`.

Add a **Transform Message** before the select. Instead of an inline script, select the DataWeave
file `dw/get-all-tasks-request.dwl`. Rename the step to "request" and save. After the select,
add another transform — "response" — using `dw/get-all-tasks-response.dwl`. You could also name
these "create SQL query" and "to JSON response" to be more descriptive.

**The request DataWeave (building the WHERE clause):**

```dataweave
%dw 2.0
output application/java
var completed = attributes.queryParams.completed
var dueDate = attributes.queryParams.dueDate
var whereClause = if (isEmpty(completed) and isEmpty(dueDate))
  ""
else
  " WHERE " ++ ([
    "completed=$(completed)" if !isEmpty(completed),
    "due_date=$(dueDate)" if !isEmpty(dueDate)
  ] joinBy " AND ")
---
"SELECT * FROM tasks$(whereClause)"
```

The `$(...)` interpolation works without parentheses when you have a single variable; for a more
complex expression you'd use parentheses (e.g. `$(default something)`). We build an array that
contains the `completed` string only if `completed` isn't empty, and the `due_date` string only
if `dueDate` isn't empty — so we end up with one or two items, never an empty array (because the
top-level `if` already handled that case). Then `joinBy " AND "` stitches them together. The
result is a WHERE clause with `completed`, `due_date`, or both joined by `AND`.

**The response DataWeave (rows → JSON):**

```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.id as String,
  title: $.title,
  description: $.description,
  dueDate: $.due_date,
  completed: $.completed
}
```

Keeping it simple so we can see all the fields returned. Note the database `id` is an integer,
so we coerce it `as String`.

### Running, testing, and debugging

Run the application. Open Postcode (or Postman) and send a GET to `localhost:8081/api/tasks`
with no query parameters — we correctly receive an empty array, and the logs show "start get all
tasks" and "end get all tasks". Now send query parameters: `completed=true` and
`dueDate=2025-01-01`. Still nothing yet (the table is empty), but since the app is running we can
debug it. Add a breakpoint before the select to see what's coming in, and one after to see
what's coming out.

Run again. The Mule message shows `SELECT * FROM tasks WHERE completed=true AND due_date=...` —
exactly the date we sent. Continue, and the message is empty because nothing was returned, which
is what we wanted.

Send only one query parameter and you can see the new query: `SELECT * FROM tasks WHERE
completed=true`. Note there are two spaces — that's fine, but we can remove the extra space in
the DataWeave (we had one after `tasks` and one before `WHERE`). 

You can also use **Hot Deploy**: change a file, save, click Hot Deploy, and it sends just that
file to the runtime — faster than stopping and restarting. For example, add a "hello" log, save,
hot deploy, and you'll see "started app". Send the request and the console shows "hello".

Interesting test: with the extra space removed in the DataWeave file and breakpoints back, send
again — even though the DataWeave is in a *separate* file (not this XML), the change is picked
up: `SELECT * FROM tasks WHERE completed=true` with just one space. We didn't have to stop and
restart everything. Confirmed it's working, so stop the application.

### Your homework — recap of the changes

Here's a quick recap of everything we did for just **one** method, so you can do the rest:

- Added a `global.xml` (you don't redo this — it already has the DB config).
- Added the whole `get-all-tasks.xml` file.
- Added the `get-all-tasks-subflow`, which only holds the implementation so it's easier to
  navigate.
- Removed the API Console (do this once).
- In the **get tasks** flow, removed everything and left just the flow reference to the subflow —
  you'll do that for all the methods.
- Created the per-method XMLs (because it's a small project) and the flow references from the
  four remaining flows.

When you build the other flows, look at the **Database** module operations: **Delete**,
**Insert**, **Select** (we used it), and **Update**. Use those four.

We also created two DataWeave files — one for the request, one for the response — to keep the XML
cleaner (no inline code). Run **Format Document** if you like the XML pretty. And **always,
always save** (⌘S / Ctrl S) — it won't autosave.

Finally, the POM changes (do once): the plugin version, the configuration with the shared
library, and the `mysql-connector-java` dependency (the JDBC driver used by the DB connector —
don't quote me on that exactly).

We did it — we wrote some code in ACB, and it wasn't that bad. For the next video, come back and
we'll compare notes on the rest of the implementation. If you have Git set up, you can also see
your changes from the Source Control view, which is handy so you don't have to track changes in
your head. That's all for this video — see you in the next one. Bye!
