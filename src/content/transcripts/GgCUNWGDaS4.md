---
source: 'Edited from the spoken video for readability'
---

### Intro

If you're new to MuleSoft or switching from Anypoint Studio, Anypoint Code Builder might feel
like a big shift. In this video I'll walk you through everything you need to get started with
ACB locally in VS Code — from installing the right tools to building your first Hello World
integration and finally deploying it to CloudHub. I'll show you how to avoid common setup
mistakes, explain how the ACB extension works inside VS Code, and help you get everything
running smoothly.

### Installation (Git + VS Code + Anypoint Extension Pack)

First, install [Git](https://git-scm.com/downloads) for your operating system. Then download
[Visual Studio Code](https://code.visualstudio.com/), again for whatever OS you're on. Once
you have those two — and only when you have those two — make sure you're on the latest version
of VS Code; if not, uninstall and reinstall.

Then go to the Extensions tab, look for the **Anypoint Extension Pack**, and install the whole
thing. Do not install the extensions one by one. If you already did, remove them all first,
then quit VS Code. It's very important that you fully restart VS Code — you can't just
uninstall the individual extensions and reinstall the pack without quitting first.

### Get comfortable with the command palette and themes

Once everything is installed, get used to the command palette: ⇧⌘P on Mac, ⇧Ctrl P on
Windows. This is your best friend. You can search for MuleSoft, DataWeave, and a lot more —
options come from your installed extensions or from VS Code itself.

Try something simple like **Preferences: Color Theme**. Pick a theme you like, light or dark.
You can browse additional color themes from the marketplace, too. In my case I use a MuleSoft
Community theme. Finding a theme you like is your first task of the day.

### Opening projects vs. creating them in ACB

In Studio you import a project or open a folder. In VS Code you can open a folder, clone a
repo, or create a Java project. You'd use the folder/clone options to open existing work. But
to create a new MuleSoft project, go to the MuleSoft tab (Anypoint Code Builder), where you
have three quick actions: **Design an API**, **Implement an API**, or **Develop an
integration**.

A common point of confusion: I don't believe you can import a JAR into ACB just yet — you have
to open a folder. (Update: it turns out you can import a JAR — see the dedicated correction
video.) If you click **Open folder**, you can only open the root of a project (where the
`src` folder, the POM, and the mule-artifact live). Note that "Open folder" comes from the
Explorer tab, which is plain VS Code, not ACB. From ACB itself you use the quick actions, plus
Help and Tutorials.

### VS Code extensions are a superpower

Another great thing about VS Code: you can install any extension from the marketplace —
Docker, Kubernetes, Postman, a database viewer, GitHub Actions, Kafka, Serverless, Markdown
and XML helpers, and so on. None of that is ACB-specific, but it's very handy. For example, I
can view my MySQL database, see my running Docker containers, and run Postman requests, all
from inside the editor.

### ACB settings, login, and source control

Click the Mule button, then **Settings** to open the ACB-specific settings: autocompletion,
trigger delay, default versions, and more. Under **Edit defaults** (via the command palette)
you can set the default Mule runtime and Java version that get pre-selected whenever you
create a project — I always keep the latest. You can also set a default group ID, and add VM
arguments here (for example, `-M-Danypoint.encryption.secureKey=1234` to pass values to the
runtime). You can also set the control plane and the home directory, where things like the
Mule runtime and Java version get installed.

Note: **you do not have to download Java** — ACB downloads it for you. And in the future ACB
will download Git for you too, so you won't have to install it yourself. (If you're watching
from the future and Git is already bundled, great — check the comments.)

Then there's the **Not logged in to Anypoint Platform** prompt; you can sign in from there or
from the profile icon. For now I won't sign in — I'll show that later. There's also GitHub
Copilot if you want it; I don't normally use it, but you're free to.

VS Code also has a **Source Control** tab. Once you have a folder, you can initialize a repo,
push, pull, commit, cherry-pick, and more — all from the UI. No more Git commands in the
terminal.

### Building the Hello World flow

Let's build a Hello World. In the ACB tab click **Develop an integration**. Remember the three
options: Design an API is for designing a RAML/OAS spec; Implement an API is when you already
have a spec (it goes to Exchange to retrieve it); Develop an integration creates an empty
project or pulls a template/example from Exchange. We'll create an empty project.

Name it `hello-world`, pick a location (Downloads for me), and select your Mule runtime. By
default I have the latest. Because I don't already have this runtime on my machine, it'll
download automatically on project creation. For the Java version I only have 17 right now;
if I changed the runtime I might be able to pick Java 11. Click **Create project**.

Once it's created, you can adjust, hide, or reopen the windows (the UI canvas and the code
view). There's also Agentforce, which we'll skip for now. You can choose what shows in the
Explorer — Open Editors, Outline, Java Projects, Maven, and so on. I normally only keep the
Folders view; right-click to uncheck the rest. You can show/hide the panels and terminal with
the buttons at the top, and use ⌘−/⌘+ (or Ctrl−/Ctrl+) to zoom in and out.

At the top of the canvas you have **Add** (to add flows, subflows, and error handlers) and the
**flow list** (ACB shows one flow at a time, unlike Studio). Click **Build a flow** to create
a flow with a name. Then click the **+** — this is your new Mule palette. Instead of dragging
and dropping like in Studio, you click + and pick what you want. You see the components you
have installed, or you can pull connectors from Exchange.

Go to Connectors → HTTP → **Listener** (or just search "HTTP" / "listener"). Notice it shows
which versions are compatible with your runtime and Java (for me, runtime 4.9.5 and Java 17).
You can double-check versions by right-clicking the XML and choosing **Project properties** —
that view also has options like export to deployable JAR, export shareable JAR, and publish.

Select the listener, then add a global configuration: click **Add**, set the host and port,
and save. (Don't add properties yet — we're just learning how ACB works.) Set the path to
something like `/hello` and press Enter (or click to save) — important, or it won't save. You
can rename the flow from the canvas or the XML.

Right now there's an error because the flow isn't complete — you can see it in the **Problems**
panel ("content of element flow is not complete"). So add a **Transform Message**. Use an
inline script with `output text/plain` and literally `"hello world"`. Then add a **Logger** —
click the FX button to open the expression builder and log `payload` at level INFO.

To keep the XML tidy, open the command palette and run **Format Document** (make sure you're on
the XML file). Then save with ⌘S / Ctrl S — watch the dot in the tab turn back into an X.
Always save, because it won't autosave.

You can reopen the global config by clicking **Test connection** or right-clicking and choosing
**Configure component in UI**.

### Running and debugging locally

Head to the **Run and Debug** tab in VS Code. You should already have a "Debug Mule
application" configuration; if not, click **Open launch.json** to see it. Press **Run / Start
Debugging**. The logs show it was deployed. You can check Problems and Output (Mule Maven
output, etc.).

To test it, I use an extension called **Postcode** — a simple REST client, like Postman but
without needing to log in. Send a GET to `localhost:8081/hello` and you get **hello world**
back. 

Now let's debug. You can right-click in the flow to add a breakpoint (it adds it in the XML
too), or add it directly in the XML. Since I'm already debugging, I just resend the request in
Postcode and it hits the breakpoint. You can see breakpoints, the call stack, and add watches
— for example watch `payload`. You can also inspect the Mule message attributes: listener
path, raw request, relative path, method, scheme, and so on. Use **Step Into** to move to the
Logger; now the watch shows `hello world` with media type text/plain. Press **Continue** to
exit, or disable the breakpoint and resend to get an immediate response.

That's how you deploy and try your app locally without ever leaving VS Code. The next step
would be to deploy to CloudHub (you press the deploy button, log in, and continue), but I'll
keep this video simpler and cover that in a future one.

### Wrap-up

You've got Anypoint Code Builder running locally in VS Code and built your first Hello World
integration. In the next video we'll go one step further and expose a proper REST API using
API specifications and flow logic. If this helped, hit like, subscribe for more weekly
MuleSoft tutorials, and drop your questions in the comments — I always read them. And if you
get stuck, I've got ACB office hours you can book (link in the description). I'll see you in
the next video.
