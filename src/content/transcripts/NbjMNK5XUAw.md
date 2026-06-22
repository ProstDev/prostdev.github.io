---
source: 'Edited from the spoken video for readability'
---

### Recap of Part 1

Hello everyone, my name is Alex, and in the last video we saw how to create a To-Do Task
Management API specification using OAS from CurieTech. Just a reminder of what we did: we started
with a very simple command telling it to create the app for us, it asked some questions, we
answered them, and it created the first version. Then we did some back and forth — first "make
sure you're using RESTful best practices," then "`taskCreate` and `taskUpdate` are redundant" and
"change the status to be `completed` and make it a boolean." Finally we said "the example value
shouldn't have quotes because it'll cause issues with the preview in API Console" — that's not a
CurieTech issue, it's an API Console issue in MuleSoft. It took about 10 minutes, and we
published it to Exchange.

### Installing Anypoint Code Builder

Now the second step is to implement that API specification using — you guessed it — Anypoint
Code Builder. In my last "MuleSoft from Start" series I was using Studio, but that's in the past.
Now we're going to be using ACB.

How do you install ACB? First, install Visual Studio Code. Then install Git locally, because I'm
using the desktop version, not the cloud version. Then install the Anypoint Extension Pack from
the Extensions panel. That's pretty much it. Once installed, you'll see the MuleSoft logo and the
ACB homepage.

Because we're going to connect to Exchange, we need to log in to Anypoint Platform. Click the
button, click "Allow," sign in, and then open Visual Studio Code. Now you can see you're logged
in.

### Implementing an API from the spec

Let's click **Implement an API**. ACB gives you three quick actions: you can **design an API**
(what we did in Design Center — same thing, just IDE vs. web), **implement an API** from a spec
(RAML, OAS, or AsyncAPI), or **develop an integration** from scratch (no spec required).

For our case, click **Implement an API**. Since our spec is called "To-Do Task Management API,"
let's call this project "to-do-task-management-impl" (impl = implementation). Because we're
signed in, we can connect to Exchange — search for it and you'll see the organization, created by
Alex Martinez. Click **Add asset**, select the Mule runtime (I'll select the latest) and Java 17,
and **Create project**. After a few seconds the project is ready.

### Publishing the repo to GitHub

Because you can use CurieTech with GitHub, I'm going to initialize and publish my repo to my
GitHub account, which I'm already signed into. (If you click on Accounts, you can see I have my
GitHub and my Anypoint Platform accounts.)

First, initialize the repo. Here's everything that was created: a `.gitignore`, a
`mule-artifact.json`, a `pom.xml`. I don't want the `.vscode` folder, so I'll add `.vscode/` to
my `.gitignore`. Then we have the main Mule file (the flow), and the `src/main/resources` and
`src/test/resources` for log4j. Let's add everything, commit ("first commit"), and click
**Publish branch**. I'll create a public repo so I can also use it from CurieTech (a private repo
works too, since it uses your credentials).

If I check my repos, I already have "to-do-task-management-impl" there. Now go back to CurieTech,
go to **Settings → Repos**, click **Connect via OAuth**, select only the specific repo I want
("to-do-task-management-impl"), and save. It asks for a branch — `main`. Now under indexes I can
see my repo, and I can set Java 17 and Maven 3.9. I won't use a settings.xml for now — it's a
very simple example.

### Asking the Code Enhancer to implement everything

Now go to a new conversation and select **Code Enhancer with repo**. Select the repo on `main`,
and in the description:

> Implement the whole API with the CRUD operations based on the API specification.

For better results, I'd really advise you to do each endpoint one by one instead of implementing
the whole thing at once, like I did here. Because I did it all at once, I introduced some bugs
that could have been avoided by letting the Code Enhancer focus on smaller tasks. So don't be
me — do one small task at a time.

I copied and pasted the whole OAS so it would know exactly what it is, and added instructions:

> The flows have already been scaffolded into the main XML file — don't change these. Just add
> flow references from the main file's flows to the subflows with the actual logic. Create a
> different XML file for each of the five subflows: (1) get all tasks, (2) create a new task,
> (3) get a task by ID, (4) update a task by ID, (5) delete a task by ID.

The data is saved in a MySQL database. I created a MySQL container locally with a `docker
compose`, ran it, and I'm using an extension to see my tables. I gave it the host, port,
database, user, and password, plus the `CREATE TABLE`. I also noted:

> When you create a task, the id in the DB will be auto-incremented. But note the id in the DB is
> a number (`int`) and our API spec is a string — so make sure to transform this data in the
> code. Follow best practices and secure the needed properties.

Then I pasted the best-practices document I'd created for Cursor. I also uploaded my settings.xml
just in case, since CurieTech runs the whole project before giving an answer (it might need my
credentials). Let's run it.

### Reviewing the generated diff

I had recorded this whole thing, but my computer crashed — sorry about that. It took around 20
minutes to generate the diff. Once you receive the diff, it asks if it's okay or if you need
changes. I approved it, so you see "diff reviewed by Alex" and then "task completed." Clicking it
opens the **pull request** it created for you, with all the details and the files it changed.

I find it easier to get it onto my local so I can look at the actual code. Looking at my
globals: I'd been manually externalizing a few properties, but CurieTech created all of them on
its own — host, port, MySQL details, user, password, database name. It got everything right. I
will have to change the host for dev, but for local properties this is great.

Nothing changed on the main flow and the console — the only difference is the flows now have flow
references. The get-all-tasks flow has a flow-ref to "get all tasks," the POST has a flow-ref to
"create task flow," and so on. For the ones with a task ID in the path, MuleSoft had already
created a Transform Message to save the task ID in a variable, and CurieTech just added the
flow-refs exactly as I asked.

CurieTech also added a Java module and a Spring module — I'm not yet sure why. The get-all-tasks
subflow has a logger, a transform preparing the query (`SELECT id, title, description, due_date,
completed FROM tasks` plus a WHERE clause), a Transform Message to map everything to JSON with the
id as a string, and a logger. The create-task flow has a logger, a transform building the task
input, the database insert, the SELECT to get the generated id, and a transform to JSON.

### Fixing the first errors

I made a few changes and it almost ran, but there's an issue with the DataWeave it created — it
has `if / else if / else if`, which isn't how DataWeave works. Instead of fixing it directly,
I'll ask CurieTech to do that, since it would take a few brain cells.

Some changes I made manually: I added the test resources embedded; modified the `pom.xml` (I
removed a Maven plugin configuration I wasn't sure I needed, and removed the MySQL/Java/Spring
dependencies because MySQL was throwing issues — I do have the DB connector, so that's probably
good enough). I also moved the listener config and the APIkit config from the main flow to the
global, since CurieTech forgot to. And I added a few properties I decided I needed. (Heads up: it
turns out I *did* need those MySQL dependencies later — more on that in Part 3.)

Commit and sync — this sends my changes to the `curietech-dev` branch.

### Switching to a local repo and fixing the DataWeave

You can also add **local repos**. Import "to-do-task-management-impl," select Java/Maven, upload
the settings, and now I can use the local repo with the active branch. New conversation → **Code
Enhancer with repo** → select the local one:

> Take a look at the get-all-tasks flow. The "prepared query" Transform Message has an error.
> Please fix it and make sure the rest of the flow is correctly set up to get a list of all tasks
> from the database.

After about a minute and a half, it updated the DataWeave code and nothing else. Because we're
using a local repo now, we can only download the generated code or the diff patch (no PR) — that's
why we first used GitHub, since it created the PR for us. It's a straightforward change, so I just
took it from the output. It says "expecting type Array but got Object," so we'll keep an eye on
that — but it deployed successfully.

### Wrapping up

We did a lot in this video, and we got it to run. In the next video we'll test it to see if it
actually works and start troubleshooting the functionality.

I know some of you will say it took a lot of time — but consider this: if I'm not familiar with
setting up a database in MuleSoft, I'd have to watch or read tutorials to figure out the database
connector by myself. Instead, it took about 20 minutes for CurieTech to generate functioning code,
and it even fixed the DataWeave on its own after I told it about the error. As long as you have
your best practices well documented in your workspace or instructions, it can do all of that for
you.

This gave me a working first pass in 20 minutes or less. I'll see you in the next video where we
run and troubleshoot this working Mule project. Bye!
