---
source: 'Edited from the spoken video for readability'
---

### A quick correction: you CAN import a JAR

Hello, hello everyone. A very quick announcement: I lied to you. I'm so sorry — it wasn't on
purpose, I just didn't know better. When I told you in an earlier video that there's no way to
import a JAR in VS Code, that was a complete and utter lie. My bad. There **is** a way to import
a JAR into ACB — you don't have to use the "open folder" approach.

### Exporting a deployable archive from Studio

First, in Studio, right-click the project and select **Export**. Choose **Anypoint Studio
project to Mule deployable archive** and click Next. I'll rename it `test123` so I know which
one it is.

Select **Attach project sources** and leave **Include project modules and dependencies**
unchecked, since we won't be deploying to CloudHub. Note the message: a lightweight package
generated without modules and dependencies won't be deployable to CloudHub, but it *can* be
imported into Studio (and ACB). That's exactly what we want. Save it in Downloads as `test123`
and click **Finish**. This generates a JAR file.

### Importing the JAR into ACB

Back in ACB / VS Code, open the command palette and select **Import a Mule project** (just like
the docs say). Go to Downloads, pick the `test123` JAR, then choose a project folder (Downloads
again) and select it. Once it loads, open the project.

### Why import instead of just opening the folder

This is actually one of the reasons it's better to **export and import** rather than just
opening the folder. For example, look at the Java version: in Studio this project is on Java 8
(on purpose, to demonstrate), with Mule server 4.9.7 — a combination that isn't possible from
ACB but is fine in Studio.

If you just opened the original folder, ACB would modify the `mule-artifact.json` of **both**
projects, because you'd be pointing at the same files. So especially if you're just trying ACB
and don't want to touch your day-to-day enterprise files or your real GitHub repo, importing is
better: it lets you see the differences in a fresh copy instead of modifying the original.

In Studio we have 4.9.6 and Java 8, which isn't really possible in ACB. So when I click **Set
versions**, it tells me the runtime is 4.9.6 but the Java version is unsupported — so I select
17 and click Apply. You can also go to **Connectors** and update as needed (in this case just
one). Now if I open `mule-artifact.json`, the imported project shows Java 17, while Studio still
shows Java 8. Even if I refresh, they stay independent — because choosing a new project folder
made a copy. The imported project lives in Downloads; the original stays in the Studio
workspace. Likewise, the imported project isn't tied to the original repo, so you'd initialize a
new repo (or reference the old one) if you want.

### Recap

To recap: in Studio, click **Export**, select **Anypoint Studio project to Mule deployable
archive**, click Next, uncheck **Include project modules and dependencies**, leave **Attach
project sources** checked, save it somewhere, and click Finish. Then in VS Code, open the
command palette, select **Import Mule project**, pick your JAR, and choose where the new project
should live.

### Bonus: the CurieTech AI plugin for Studio

One more secret — well, it's not a secret anymore, there are articles and videos about it: there
is a new **CurieTech AI plugin** you can use in Studio now. Go check it out, it's really cool.
You can apply everything from a panel, see your tasks, create new tasks, and even undo things.
You can move it wherever you want — I like it on the side, but that's up to you, and you can
close and reopen it easily.

That was my quick update. I'm sorry I lied to you — again, not on purpose, just ignorance. See
you later. Bye!
