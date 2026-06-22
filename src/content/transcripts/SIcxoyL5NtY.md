---
source: 'Edited from the spoken video for readability'
---

### Intro

In the last video we designed a complete API specification using OpenAPI. Now it's time to
scaffold it. In this video I'll show you how to take that spec from Anypoint Exchange, generate
a full Mule project in Anypoint Code Builder, and get it running locally. But we're not
stopping there — I'll walk you through what actually gets scaffolded, how to explore your flows
in both XML and UI views, how to fix common project-setup issues, and how to start working like
a real dev in VS Code with Git, Postman, error handling, and all the ACB essentials. By the
end, your API will be running and you'll actually understand what's going on.

### Scaffolding from Exchange

We finished our API spec and published it to Exchange — and remember there was a message asking
whether to scaffold, and we selected No. So let's get that going now. In the MuleSoft tab,
click **Implement an API**. (It doesn't matter whether the spec is on your computer; it's in
Exchange.) Name the project something like `todo-api-impl`, select the project location, and
since we're already signed in, search for "todo API", press Enter, and select your **To-Do Task
API**. Click **Add asset**, leave the Mule runtime and Java version as default, and click
**Create project**.

### What got scaffolded

Once scaffolding finishes, you'll see all your flows. Note the **error handling** that's
already there — this is the default for common errors: bad request, resource not found (404),
method not allowed (405), not acceptable (406), unsupported media type (415), and so on. Each
sets a target payload and an `httpStatus` variable. These error messages are created by default
— you don't even define them in your API spec.

There's a **listener** with a connection configuration and a path starting with `/api`, running
on `localhost:8081`. We'll keep that for now and save best practices for a later issue. At the
top is the **flow list** — one flow per method (the two GETs, the DELETE, the POST, and the
PUT). There's also an **API Console** flow you can leave or ignore (a lot of people don't use
it).

You also get a Log4j config, test resources with some embedded sample data, an auto-created
`.gitignore` (handy when you start using Git), the `mule-artifact.json` (don't edit it
directly), and the POM. For any file under `src/main/mule`, right-click and check out **Open
Mule project properties** — it's important: it shows what's in your `mule-artifact.json` in a
nice UI, and it'll download runtimes or Java versions you don't already have. For example, I
only have 4.9.6, but if I select another and click Apply, it downloads it. On the **Connectors**
side you can see everything in your `pom.xml` (APIkit module, HTTP connector, sockets
connector) — all added automatically by scaffolding — check available versions, and see which
are incompatible with your runtime or Java.

### Cleaning up: .gitignore and source control

To get rid of the embedded folders (they only create sample data), open the `.gitignore` and
add `src/test/resources/embedded` (and anything else named "embedded"); save, and they
disappear from the tree.

To start a repo, go to **Source Control** and click **Initialize repo**. All files and folders
show up (minus the embedded ones we ignored). Another folder you may not want in your repo is
`.vscode` — right-click it and **Add to .gitignore** (it adds one file at a time, so it's
easier to just ignore the whole folder). You don't have to commit right away, but you can see
all the changes happening.

### Touring the canvas buttons

Minimize the panels to see the canvas. At the top: **Open Agentforce** (skip for now), **Open
changes** (related to Git/source control), **Open code editor** (to see the XML — you can close
the canvas and only see XML if you prefer), and **Deploy to CloudHub** (not yet). If you have
the XML open instead of the UI, you'll see an **Open canvas** button instead.

A great tip: by default, opening a Mule config file opens the **UI** rather than the XML. To
change that, click **Configure editors**, find `source.main.mule.xml`, and set it to default to
the XML view. To go back to the canvas, set it to `mulesoft.pr-file.canvas`. (This tip was
brought to you by Ryan Carter — thank you, Ryan!)

Right-clicking a file also gives you: **Open canvas and code editor** (both at once), **Open
Mule project properties**, **Deploy to CloudHub**, **Publish to Exchange**, **Export to Mule
deployable JAR**, and **Export shareable JAR**. The difference: a deployable JAR can be deployed
to CloudHub but not opened in Studio; a shareable JAR can be opened in an IDE to see the code.

### Running it locally

Without changing anything, press the run/debug button to start the application and confirm
everything is set up correctly. Once it's deployed, test it with the **Postcode** extension (or
Postman, or any REST client). A GET to `localhost:8081/api/tasks` returns a `200` with an empty
body (we haven't implemented anything yet). `localhost:8081/api/tasks/1` also returns `200` with
nothing. Check the terminal logs and you'll see the GET requests coming through — the app is
actually running. Then stop the application.

### Wrap-up

We've scaffolded our API, explored everything ACB gives us out of the box, and you've got a much
better feel for working inside VS Code with MuleSoft. We didn't touch any flow logic yet, but
now you know how to find the flows, view and edit them in both UI and XML, set up your default
views, run the app locally, and get started with source control and helpful extensions like
Postcode and Postman.

In the next video we'll start implementing real logic, beginning with the GET and POST methods,
then the rest. If this helped you feel more confident in ACB, give it a thumbs up and drop a
comment — I read every single one. And don't forget to subscribe so you don't miss the
implementation video. That's all for this one — see you in the next video. Bye!
