---
source: 'Edited from the spoken video for readability'
---

### Where we left off

Hello everyone, welcome to the second part of the implementation. In the last part we were
trying to get this thing going, and right now I have it deployed and I'm still testing it out.

But guess what? Remember those things I removed that CurieTech gave me in the `pom.xml` — the
ones I decided weren't good? It turns out they *were* needed. So I now have the configuration for
the MySQL Connector/J and the dependency for it. Yes, I keep getting a transitive-dependency
vulnerability warning; there's a workaround, but for now I'll leave it, because it's working and I
don't want to mess with it anymore. Last time we also applied the changes it gave us for the
DataWeave. So now we're just going to keep asking things in the Code Enhancer.

One other tell I had: I was trying to test my SQL database connection from the global config
(without running the whole thing), but my connection wasn't coming out as valid — until I asked
CurieTech "my database connector is not working, please help me troubleshoot it." It gave me the
correct configuration and dependency, and it worked.

### The 500 error on get-all-tasks

Now my issue is that I'm trying to GET from `host/api/tasks` and I keep getting a **500 Internal
Server Error** about bad SQL syntax. I know roughly where it's coming from: we set up a Transform
Message to prepare the query and store a `whereClause` in a variable, but then we use that
`whereClause` in a way I'm not sure is correct.

So let's ask the Code Enhancer. Select the local repo on the active branch:

> I keep getting this error when trying to run the get-all-tasks flow.

It came up with a fix to how the syntax is set up — instead of `$(...)` it uses `#[...]`. It says
it took 8 minutes, but it didn't — it took about 1 minute. (The timer counts all the approval
steps and the time I was doing other stuff.) I applied the change, but when I try again I get
another error.

### Using the single-repo Code Insights agent

So I thought of another agent that can help: the **single-repo Code Insights** lens, where you
can ask questions about a single repo. I asked "why am I getting this error in the get-all-tasks
flow?" and pasted whatever was in the terminal.

It was really insightful: the DB Select step dynamically builds the SQL query using a
DataWeave-generated `whereClause` variable, concatenating values directly into the SQL string.
When no query parameters are present, if the DataWeave logic produces a malformed clause,
MuleSoft's DB connector may try to bind a parameter named `null`. If `whereClause` is empty, the
SQL is valid; but if the DataWeave logic is off — like adding a clause with a missing value — the
DB connector gets confused.

Then it recommended **parameterized queries** and gave me the whole thing on how to do it. The
only downside is I can't see the nice before/after diff like before, and I don't think this lens
actually compiles or runs the code — but I can just copy and paste and see what changed.

I copied everything from the Transform to the DB Select, formatted the document, and looked at it.
It changed the Transform Message: now there's a variable `queryData` generating both `sql` (with
the WHERE clause) and `params`. So we send the parameters as `queryData.sql` and
`queryData.params`. I pressed add-and-deploy (hot deploy, no full restart). There were some
issues here, so let me take this feedback and ask the **Code Enhancer** to do something similar
against the repo: "Use parameterized queries."

It returned a few changes on the Transform Message — variables `queryParams` and `sqlQuery` — and
set up the DB Select with `sql` and the input parameters. I copied the whole thing, pasted it,
saved, and hot-deployed one more time. Fingers crossed.

Oh my god, it worked! It returned zero tasks because I don't have anything. I didn't even
remember how to do parameterization with the DB connector, so that's really cool.

### Testing create, get, and delete in Postman

Let's test the POST. From Exchange I copy the example request body, change the method to POST
(after a moment of confusion forgetting to do that), and send it. It actually worked — it's
creating tasks! I do see an issue where it returns id 1 here and id 0 there, so the id needs work,
but it's creating the tasks.

For the insert, it actually used parameterization from the start — it was only the other flow that
wasn't. The problem is `SELECT LAST_INSERT_ID()` isn't working. In other news, I can search for
each task by ID and retrieve it.

Let's check the delete. Right now we have id 2, so let's remove id 2 → **204 No Content**, which
means it worked. Yes! For the create's generated-id issue, what if we simply do `SELECT id FROM
tasks ORDER BY id DESC`? That returns the last id, which I'll assume is the one I'm creating.
Let's save and hot-deploy. The create now works.

### Debugging the update flow with breakpoints

The update doesn't work — internal server error, "column 'title' cannot be null," even though it
isn't null. Let's add a **breakpoint** and send again. Now we can see the Mule message: the
payload is the whole thing — id, title, description, due date, completed. I notice the update
isn't saving the original payload, because somewhere we're overwriting the whole payload.

So let's add a variable `inputPayload` set to `payload`. That's the one we'll use. Then in
"prepare the test data," instead of `payload.title` use `vars.inputPayload.title`, and the same
for `description`, `dueDate`, and `completed`. Hot-deploy again.

Send. Now we step through: first the Mule message has the application/java payload because we're
preparing the task data; continue; now we're in the update with id, title, description, due date,
completed. It looks like it's going to work. (Earlier I was confused because I was looking at
`payload` instead of the `inputPayload` variable I created — that's why I couldn't see the updated
value.) It actually got updated!

Let me update again — "buy groceries by June 15," for example. Send (oops, forgot to remove the
breakpoints — let me remove them). It's saved, and getting it by ID returns the updated task. It
works. High five!

### Wrapping up

So now our whole application is working — all five operations. And I'm just so happy about it.
Thank you, CurieTech. It didn't take as long as I thought, because by the end of the day I didn't
exactly remember how to use the DB connector — I hadn't used it in about five years. Asking
CurieTech to do at least the beginning of it was really useful, because I'd be lost without the
initial skeleton. And once I understood more or less what was happening, I was able to troubleshoot
and debug on my own. Plus, if you didn't know how to debug in ACB — now you do.

That's all for this video. We finished implementing our API. In the next video we're going to
learn how to add MUnits to our project — and yes, using CurieTech AI. We're not going to have to
create a single MUnit (I hope). See you in the next video. Bye!
