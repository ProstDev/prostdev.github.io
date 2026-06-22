---
source: 'Edited from the spoken video for readability'
---

### Recap and what's next

Hello everyone, my name is Alex. Welcome back to our awesome CurieTech AI playlist. In the last
video we got our final Mule application — the To-Do Task Management app — fully working: get all
tasks, create a new task (with the auto-generated id), get a task by ID, update a task by ID, and
delete a task by ID.

The next step is to create MUnits — and nope, we won't be creating them on our own. We'll rely on
CurieTech AI. In CurieTech's **Testing** section there's an **MUnit Test Generator** and a
**Sample Data Generator**. We'll select **MUnit → Start my own**.

That reminds me: I merged the pull request CurieTech created before (the `curietech-dev` branch,
"implement to-do API CRUD") that we used to push all our fixes. So everything we have now is on
the `main` branch.

### Configuring the MUnit Test Generator

In the MUnit Test Generator, select the repo, the branch (`main`), no VM args, enable coverage,
and set "make as many scenarios as needed." Note the **number of MUnit scenarios: at most 3**. You
can lower it to 1, but this is the *maximum* it can generate — it looks at your code and decides
how many scenarios it needs, up to that max.

It's very important to provide your settings.xml, because you might need access to your RAML or
OAS (my case) and your Nexus credentials. If you don't know how to set up Nexus credentials, I
have a few videos on that.

Now the fun part: **you have to select just one flow** — it generates everything for one flow at a
time. We have main, console, and the five resources (delete, get all tasks, get task by ID, create
new task, update task by ID). We'll go one by one through the five, since those are the most
important. Select **delete** and submit; add a new task, select **get** (the list), then the other
**get** (by ID), and so on for all five. The cool thing is you can have them all running at the
same time, which is what I did — and because we're using a GitHub repo, it creates a **pull request
for each one** as soon as it's done.

### Reviewing the generated scenarios

Take the PUT (update). We didn't add a description, so it only used the flow name. It shows what
it's doing:

- **Scenario 1** — successfully update an existing task (the happy path), mocking the database
  connectors, running the target flow, and asserting the logger is called and the DB connectors
  are called as expected.
- **Scenario 2** — attempt to update a task that does not exist (the 404 path).

For the POST (create), it generated only **Scenario 1** — the happy path. For get-by-ID, two
scenarios (retrieve a task, and task not found). For get-all-tasks, just one scenario (the happy
path). For delete, two scenarios (successful delete, and task not found).

Some flows got only one scenario because it's just trying to cover 100% — and it decided one was
enough. But as you and I know, **100% coverage doesn't mean the tests are correct**. If you want
more scenarios — for example, get-all-tasks when there are zero tasks, or a database connection
failure — you can add them in the optional **notes** when you select the flow. Just remember it
creates at most three.

When a flow finishes, you get a summary: it created the tests, both passed, plus the MUnit coverage
report. Overall application coverage shows low (e.g. ~23%) because you're only doing one flow at a
time. The report has a table of every flow and its coverage percentage — the PUT shows 100%, and so
do the rest, including the get-all-tasks that only had one scenario (which is why it decided not to
create more).

### Merging the pull requests

In my GitHub repo, the five pull requests were added correctly. We can go branch by branch, but
let's just merge them. Take get-tasks-by-ID: it has the full summary, the coverage report, and the
two scenarios. Merge it, confirm, and delete the branch. Looking at the files, it added everything
needed to the `pom.xml` for MUnit, the flow, and some expected-response JSON files so it can mock
responses and assert expected vs. actual.

For the PUT, the files include the pom, the flows, and mock data for scenario 0 and scenario 1 — so
it's even testing an empty scenario. Now we have a **conflict** because it modified the pom. Open
that branch, and by pressing `.` on the keyboard we can spin up the VS Code web editor and rename
files. I want to keep them separate, so I'll rename the test suite XML and its resources folder to
include "put," and rename the config name as well. Commit and push, refresh the PR — now there are
two commits taking my changes, and it merges without conflict. Delete the branch.

I'll also rename things on `main`: press `.`, rename the get-by-ID flow and do a replace, and
remember to also rename the folder inside the resources folder (I forgot the first time and had to
come back). Merge, push, and continue with the rest of the PRs. Once there are no open PRs left,
click **Sync changes** to pull everything down. The git graph is funny — merge PR, then CurieTech 1
through 5 with all the renames.

### Renaming the test cases

Another issue: all the MUnit tests have the same name, like `flow-test-0`. So I'll rename them by
their scenario. For the delete suite, one is the happy path and one is "task not found," so I'll
name them accordingly. Do the same for the others. Now in the **Testing** section we can see all
the flows as test suites, and opening one shows how many tests each has — "happy path" and "task
not found" — which is awesome. Now we can run them all.

### Final coverage

I've been having an issue running the tests in my ACB — that's a *me* issue, not a CurieTech or
MuleSoft one; I should probably reinstall everything. But since all my credentials are in my
settings.xml in my `.m2` directory, I can just run everything with **Maven** instead.

After it finishes, the new coverage is **83.93%**, because it's not covering the main and console
flows. The summary table shows main at 0% and the API console at 0%. I don't really need the API
console — deleting it was a best practice in some previous projects — so let's delete it and run
again. Now we're at **87.04%**.

To get the rest, we'd need MUnits for the error scenarios in the main flow (it's just doing the
routing, plus error propagation / error handling for things like APIkit BAD_REQUEST and
NOT_FOUND). There are about six of those, so you'd create two CurieTech tasks (three scenarios
each) telling it exactly which errors to trigger. I'll leave reaching 100% as your **homework** —
send me your results on LinkedIn, Discord, or alexpros.com and I'm happy to take a look.

### A reminder about automating the manual steps

Quick reminder: everything I did manually (renaming, merging) I didn't *have* to do manually — I
just found it easier to show you once. There are a few ways to automate it with CurieTech:

1. Add **notes** when you create each task, specifying your naming conventions for test suites,
   folders, etc.
2. Go to **Settings → Workspace** and upload a PDF with your coding guidelines, e.g. "make sure all
   test suites and folders under src/test/resources match the test suite name and are descriptive."
3. Use the **Code Enhancer** afterward to ask it to rename all of those things.

### Wrapping up

So we already have a functioning application: we created an API specification on day one, debugged
and implemented it in videos two and three, and now in this fourth video we're creating MUnits to
get almost 100% coverage. Isn't this awesome? Let me know in the comments what else you'd like to
see. See you in the next video. Bye!
