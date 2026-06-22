---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello, hello everyone, and we're back with the implementation of my To-Do Task Management API.
Hopefully you finished the homework. In the last video we had the **get all tasks** flow:
start → create SQL query (built with DataWeave) → select → transform to JSON → end. The homework
was to implement the rest of the methods. Let me run it and walk through everything.

### Testing the happy path in Postman

The app is deployed. In Postman I already have a collection with the GET, the create, the GET by
ID, the update, and the delete.

- **Get tasks:** with no query parameters I get ID 7, title "get groceries", completed false.
  Notice I'm not getting the other fields back because they're null.
- **Create a task:** the body says "finish this video". Send it and I get ID 8, title "finish
  this video", completed automatically false. Getting all tasks again shows ID 8.
- **Get task by ID:** task 8 returns the ID, title, completed false.
- **Update:** for task 8 I send a body — I don't need to send the ID because it's in the URI.
  Change completed to true and send → 200 OK. Getting it again shows true; getting all tasks
  shows true. Correctly changed in the database.
- **Delete:** delete task 7 → 204 No Content, nothing in the body. Getting all tasks now returns
  only ID 8.

### Known bugs (happy path only — no error handling yet)

Everything works, but this is **only the happy path**. There's no error handling yet (I wanted
to do that with you all).

- **Get by ID** with a non-existent ID (e.g. 9) returns `200 OK` with nothing, instead of a
  `404 Not Found`. Bug — it should return an error saying it doesn't exist.
- **Update** task 9 (which doesn't exist) just returns null and nothing gets updated, but
  responds `200`. Should be `404`.
- **Delete** task 9 says `204 No Content`, but nothing was deleted because there was no task 9.
  Should be `404`.

The query parameters for get-all-tasks do work: `completed=false` returns nothing (our task is
true), `completed=true` returns the task. `dueDate` returns nothing when there's no match, which
is correct. So those three (get by ID, update, delete) need 404 handling — that's what we'll fix
in the next video.

### Reviewing what changed (Git diff)

Let's look at everything we modified, using the Source Control view.

- **POM:** removed the snapshot version (to `1.0.0`) and updated the To-Do Task API to `1.0.2`
  because I made changes in Exchange.
- **The API spec / Exchange:** I changed from `1.0.0` to `1.0.2`. One change was to remove the
  required `completed` field in the create — I hadn't realized it was required, which would have
  forced sending `completed` on create. I wanted to send just the title and let the default be
  false. So I modified the spec, republished to Exchange (now `1.0.2`), and updated the POM. I
  also had to update the version in `global.xml` (you could make this a property so you don't
  edit it manually).
- Added the **create new task**, **delete**, **get all task by ID**, and **update by ID**
  implementations.
- Modified **get all tasks**: renamed loggers and renamed the DataWeave files to make more
  sense (optional).
- In the **implementation file**, removed everything from the flows, leaving only flow
  references — same pattern as `get-all-tasks-subflow`. Also moved the global configuration to
  `global.xml`.
- Added several DataWeave files: `create-task-input`, `task-id-uri-param`, `to-json`, and
  `update-task-query`. In `all-tasks` (response) I added logic to skip empty fields (so a null
  `dueDate` isn't shown), and in the all-tasks query I added some string coercions.

Throughout, I open the command palette and run **Format Document** because I like pretty XML.

### Create new task

The flow: start logger → transform message → insert → select (to get the auto-generated ID) →
transform to JSON → end logger.

The transform creates an **input payload variable** (click the X to remove the default payload,
then Add → Variable, confirm to rename). It uses `create-task-input.dwl`. Everything sent to SQL
has to be Java, so:

```dataweave
%dw 2.0
output application/java
---
{
  id: attributes.uriParams.taskId default payload.id default null,
  title: payload.title default null,
  description: payload.description default null,
  dueDate: payload.dueDate default null,
  completed: payload.completed default false
}
```

I reuse the same DataWeave for the update (which *does* have an ID in the URI). For create there's
no URI param, so `id` falls back to `payload.id` (also null here), which is fine because we don't
send the ID. `title` is required so it's always there, but I add `default null` for safety on
title, description, and dueDate. `completed` defaults to false.

The **insert** is a plain string (not an FX expression):

```sql
INSERT INTO tasks (title, description, due_date, completed)
VALUES (:title, :description, :due_date, :completed)
```

We don't send the `id` — that's why it doesn't matter if `id` is null here. The **input
parameters** come from the `inputPayload` variable.

Because the table was created with `id INT NOT NULL PRIMARY KEY AUTO_INCREMENT`, MySQL handles
the ID for us, so I don't have the new ID. To get it, I run a **select**:

```sql
SELECT * FROM tasks WHERE title = :title ORDER BY id DESC LIMIT 1
```

I take the title (the only required field) from the `inputPayload` variable, order by ID
descending, and limit to one to get the newest. Then I transform to JSON with `to-json.dwl`,
which maps mostly Java → `application/json`, takes the first index (a select returns an array),
matches the ID and title, skips empty description and dueDate, and always returns `completed`
(default false) and an ID. You'll see red squiggles because there's no sample payload defined —
click **Define sample data** to fix that and even run the mapping, but I skipped it because I'm
lazy.

### Delete

Start logger → transform (create `taskId` variable) → delete → end logger. The transform uses
`task-id-uri-param.dwl`:

```dataweave
%dw 2.0
output application/java
---
{ taskId: attributes.uriParams.taskId }
```

Everything is Java because it's used in SQL. The **delete**:

```sql
DELETE FROM tasks WHERE id = :taskId
```

The input parameters send `vars.taskId` (the object), and the query takes the `taskId` key — so
`:taskId` equals the value. That's why we send an object instead of the raw value. No output
mapping because it's a `204` with no content.

### Get task by ID

Start logger → `task-id-uri-param.dwl` (same file as delete) → select with `LIMIT 1`:

```sql
SELECT * FROM tasks WHERE id = :taskId LIMIT 1
```

Then transform with the same `to-json.dwl`. We use `LIMIT 1` just to be tidy (it shouldn't match
more than one).

### Update by ID

The transform creates both a **payload** (with `create-task-input.dwl`) and a `vars.taskId` (with
`task-id-uri-param.dwl`) — they're set at the same time in the same transform message. This is
where `create-task-input.dwl` actually uses `attributes.uriParams.taskId`. Then the **update**:

```sql
UPDATE tasks SET title = :title, description = :description, due_date = :due_date,
  completed = :completed WHERE id = :id
```

After updating, I run a **select** (same one as create/get-by-ID) to make sure I return what was
actually saved rather than just echoing the input, then transform to JSON.

### Refactoring repeated logic into shared subflows

You've noticed the same three steps (set task-id variable → select → to-JSON) repeat across
subflows. So let's extract them. In `global.xml`, create a subflow `global-get-task-by-id` and
move the select + to-JSON transform there. Then realize the **set task-id** step must run
*first* (before the URI param is gone), but the update needs it in a different order — so make
the task-id variable its own subflow too: `global-set-task-id-var-from-uri`.

Now wire flow references:

- **Get task by ID** → flow ref to `global-set-task-id` + flow ref to `global-get-task-by-id`.
- **Delete** → flow ref to `global-set-task-id`, then delete (no get afterward).
- **Update** → keep the `create-task-input` payload, replace the inline task-id transform with a
  flow ref to `global-set-task-id`, do the update, then flow ref to `global-get-task-by-id`.

Now if we ever change how we get the task ID, we change it in one place.

### Re-testing everything

Run it. In Postman:

- **Get tasks** → works (with `completed` true/false too).
- **Create** "be awesome" → ID 9, completed false. (We are awesome — should be true, so we'll
  update it.)
- **Get by ID** 9 → "be awesome", completed false.
- **Update** 9 → I found a bug: if I leave the ID in the body it breaks. Let's debug the update —
  breakpoints in. The `UPDATE ... WHERE id = :id` wasn't taking the ID correctly. The problem: I
  changed the variable to `vars.taskId`, but `taskId` is an object, so I need `vars.taskId.taskId`
  to get the actual value. (Because I modified a DataWeave file, I restart/redeploy.) Now ID 10,
  "be awesome", completed true → works.
- **Delete** 9 → deleted (we still shouldn't get content back, but we'll fix that next video).

A quick bug, solved quickly, and we saw how to debug along the way — a win-win.

### Wrap-up

For the next video we'll add **error handling** so this works as it should — returning a `404`
when something isn't found. That's also where our new global subflow comes in handy. We'll use
**Choice** routers to check existence and send an error if not found, or a try/catch approach.
Subscribe and turn on the alerts so you don't miss the next video, where we learn error handling
in Anypoint Code Builder. I hope this was fun — see you next Monday. Bye!
