---
source: 'Edited from the spoken video for readability'
---

### Why switch from Studio to ACB

I'll go straight to the point. If you're still using Studio, you're not alone. But here's
the thing: MuleSoft is clearly shifting toward Anypoint Code Builder, and it's already
unlocking tools and features you just can't get in Studio. In this video I'm going to show
you why I made the switch, what it has helped me do, and how you can try it out without fully
committing just yet.

ACB isn't just a different interface — it's a whole new developer workflow built on Visual
Studio Code. It integrates with tools like Cursor AI and GitHub Copilot. And because it's on
VS Code, you can use source control or install other extensions like I have. Plus, new
MuleSoft features like Agentforce topics are only available in ACB. Imagine what else will be
available in ACB and not in Studio in the future.

Look, I'm not saying ditch Studio right now. It's still the default for many teams, and ACB
isn't fully loaded for enterprise workflows yet. But you should absolutely start playing with
it. That way, when your team does move, you're already way ahead of them.

Take a look at this poll. Only 10% of the people in it (130 votes) are using ACB daily. The
rest are on and off, tried it once or twice, or haven't touched it. Statistics don't lie —
people aren't really using ACB right now, but this will change eventually. Remember when we
had Mule 3 and were switching to Mule 4, and Mule 4 was this scary new thing? That's life. We
try the new stuff, and eventually it's the only stuff available. So why not try it now?

### Installing the tools (Git + VS Code + the Anypoint Extension Pack)

First, install Git. Search for "git download" or go to the [downloads page](https://git-scm.com/downloads).
It'll set you up for Mac, Windows, or Linux.

Once you have Git, download [Visual Studio Code](https://code.visualstudio.com/). Again, you
can download it for Mac, Windows, or Linux.

Now go to VS Code, head to the Extensions tab, look for the **Anypoint Extension Pack**, and
install the whole thing. Do not, under any circumstances, install each extension one by one.
You have to install the whole pack. If you already installed them individually, uninstall all
of them, quit VS Code completely, reopen it, then install the Anypoint Extension Pack.

If you're having any issues — and I've seen a lot of people having issues because they
installed the others first — do the same: uninstall all the extensions, quit VS Code (even
restart your computer if you need to), make sure you have Git and the latest version of VS
Code, and only then install the Anypoint Extension Pack.

Once it's installed, you'll see the MuleSoft icon in the activity bar. Everything else is
plain VS Code — if you're new to it, this is a whole new environment, so go check out some
tutorials on getting used to VS Code first. Then come back and start trying ACB once you
already know how VS Code works.

### Getting started — design, develop, or follow a tutorial

Start with something small. Click **Design an API** and begin with your API specification.
Maybe don't use the Agent topics just yet since you're getting started. Add a project name
and project location (in my case I always use Downloads). Pick your API type — REST or
async, whatever you're comfortable with — and your specification language (RAML, OAS,
whatever). Select your business group only if you're logged in; if you're not, that's fine,
just don't select anything. Click **Create project** and you've started with something
familiar.

If you want to see code but don't want to develop anything yet, go to **Develop an
integration**. You can select a template or example project. There should be a Hello Mule or
Hello World somewhere, but you can use any example — for instance, implementing a custom API
policy in API Manager. Pick one you're familiar with, or open it first in Studio so you can
see the code there, then come here and click **Add asset** to follow along in ACB. That way
you don't feel lost, because it is a new thing, and we humans are naturally afraid of change.

You can also check out my videos — I have a ton on ACB now, and I practically don't use
Studio anymore.

### Using Cursor instead of VS Code

If you'd rather go straight to Cursor instead of VS Code, you can. Cursor is technically
another IDE (another application you install). Go to [cursor.com](https://cursor.com),
download the IDE, and install it. You still have to install Git and the other tools.

The Cursor UI is a tiny bit different from VS Code. So if you don't want to switch twice —
learning VS Code, then redoing everything in Cursor later — maybe just start with Cursor now.
You can still do ACB in Cursor.

When you open Cursor, it looks like you can only open a project or clone a repo, but that's
not true. Look at the top: you can open the Extensions view just like in VS Code, search for
the **Anypoint Extension Pack**, and install it (same rule — install the whole pack, not one
by one). One difference: the activity bar that's on the left in VS Code is at the top in
Cursor. You can pin items to it. You can also show/hide the side view, the terminal panel,
and the Cursor chat — which is the one I use most.

Getting used to the Cursor chat is its own thing: you can add context, use agents, attach
images, use ⌘L to pull context from a file, and so on. Honestly, I feel Cursor is better than
GitHub Copilot — don't ask me why, it's just a feeling. You also have Cursor settings for
rules, MCP servers, and more. And in the command palette (⇧⌘P on Mac) you can search for
themes and change them — you can even create your own. This works the same in VS Code and
Cursor because it's the same underlying editor.

### Wrap-up

In summary, ACB is where MuleSoft is headed, and early adopters will shape how we build
integrations tomorrow. You don't have to switch completely today, but you should start
getting your hands dirty now.

I'm here to help. If you have issues and you've already tried my troubleshooting tips, leave
a comment and I'll help as best I can. You can also reach out on LinkedIn. Remember, not all
Studio features are available in ACB just yet — this is just to get you started. Let me know
if you need a tutorial specific to ACB; I'm happy to create it so you can make the switch
more easily. That's all for this video — I'll see you in the next one. Bye!
