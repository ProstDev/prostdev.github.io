---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Claude Code, CurieTech AI, MuleSoft Vibes. I gave these three different AIs the exact same
prompt: build the MuleSoft API-led connectivity network. Three layers, 11 operations, customers
and orders. Same brief, same rules, no hints. One of them wrote a documented, tested,
restart-proof build. One went full microservices with 41 MUnit tests. And one of them looks
great but doesn't actually save your data. Let's find out who did what.

### The prompt

Here are the full, actual instructions that I gave every single one of them. Create an API-led
connectivity network example with the three layers: experience, process, system — I even put
them there. Create a customers plus orders architecture for this. These are the operations you
can do:

- List all the customers.
- List one customer's details.
- Get each customer's orders.
- See one customer's order details.
- Create a new customer.
- Edit an existing customer's details.
- Delete a customer only if no orders are attached. This one is very, very important.
- Create a new order attached to a customer.
- Edit an existing order, still attached to a customer.
- Cancel an existing order. This does not delete it. Note, this is also very important.
- Delete an existing order.

Then the other tricky thing that I put here: we are not going to be connecting to an actual DB
just yet. Mock and seed the test data in the system layer as if we were connected to a DB. Create
as many APIs as you think is needed for this architecture to be successful and to really follow
API-led connectivity, without having too much redundancy where code is repeated — but also don't
just create one big API for everything. There must be at least three APIs since there are three
layers, but there can be more than three APIs if you choose that. Choose the best approach. Think
like a MuleSoft architect. Use the latest Mule, Maven, and DataWeave version for the Mule project.

So it is a little bit abstract in the sense that there are a lot of things that I'm just letting
it decide what to do on its own. But on some other things I'm very specific, like the latest
Mule, Maven, and DataWeave versions. That's very specific. Now, to figure out which ones those
are was up to them. But also note this: think like a MuleSoft architect. That was just to see
what they would do. But being honest, anyone can make 11 endpoints and return a 200 for all of
them. The question is who actually built something that you would actually put out in production.

### How many APIs each AI created

Let's take a quick look first at how many APIs each one of them created.

First we have Claude Code. I used Claude Code with Opus 4.8 in the MAX setting. It created four
different APIs: an experience customer-orders API, a process customer-orders API, system
customers, and system orders. These two are kind of expected, hopefully. But the important thing
is that it decided to create just one process API. The other cool thing is that it created one
parent POM to rule all of them, even though each one of them has its own POM. This was something
that the other two didn't do. And it also created a RAML, so you could actually see what it
generated.

Next up we have CurieTech AI, which created five APIs: one experience, two process (so one for
each), and two systems. Before we continue with the explanation, I just wanted to show you really
quickly here how the five APIs look different than the four that the other two created. Remember
that I did say in the instructions to only delete a customer if there are no orders attached to
it. So this is how CurieTech decided to manage that: it comes here to the process customer and
then checks the orders in the system orders API directly. Whereas the other two will do all of
the orchestrating inside the process APIs and will just decide to either call customers or orders
depending on the case. So there we have it — one experience, two process, two systems, and no
parent POM at the beginning.

And finally we have MuleSoft Vibes, which created four different APIs: the experience API, one
process API, and two system APIs. Something worth noting though is that when I was running
MuleSoft Vibes, I did notice that it was actually using Claude Sonnet in the background. That was
very interesting, because then it's pretty much just comparing Claude — since I was using Opus,
it's pretty much just comparing Opus versus Sonnet. But also, MuleSoft Vibes in theory contains
all of the skills, all of the docs, and the best practices and stuff. So that would be one of the
differentiators between just using plain Claude Code or using MuleSoft Vibes. That might also
explain why Claude Code and MuleSoft Vibes created four APIs instead of five.

### Do the operations persist data?

Now, from my list of operations, are all of them there? Here is the result. I did tell it to mock
but that we were not actually going to use a database, so I understand why MuleSoft Vibes is
really not persisting anything. But Claude and CurieTech found a way to mock the data and also
make it last, which was really cool. Claude is using a file connector to create files in my local
where it would persist the data, mocking the database but without actually using a database.
CurieTech decided to use an Object Store connector so it would mock my data. And Vibes just
created the mock of the sample data being returned, but it actually doesn't persist the data.

The other cool thing is that, because CurieTech created five different APIs, it created five
different API specs. And on this one — delete a customer only if no orders — this API will
actually go and query the order system API. Another difference is that CurieTech is using a PATCH
to change the status as canceled, which is again a better practice.

### The scorecard

Now let me show you this scorecard. We already went through the number of apps, the three layers,
the parent POM, and the RAML (the API specification). As we can see, MuleSoft Vibes didn't create
any specs. It just went ahead and created the HTTP listeners, which could also be a good approach
since I didn't actually specify to use API specs — and that would have used more tokens for me.
So maybe that's what I wanted. It doesn't know. It's just one approach versus the other.

The other interesting thing is that none of them actually added any security. Not even in the API
specs or in the actual implementation. There was no security at all, which again was expected
because I didn't mention any security. But then this one also becomes really interesting: the
error handling, both in the spec and in the code. Both Claude and CurieTech added all of that,
and MuleSoft Vibes didn't add any. Again, it doesn't have any spec, but it also didn't add any
global handler. I did not ask for any error handling, but it was a nice-to-have in case I didn't
know what I was doing.

Then the thing that I mentioned about the mock and the seed: Claude created a file-backed JSON, so
it will persist because it's using a file connector. CurieTech decided to use an Object Store
connector, so it's going to persist in memory. I personally like the file connector more than the
Object Store, because then I have to do way more setting up for the Object Store. And finally,
MuleSoft Vibes did a read-only JSON, which again was expected since I did not really say anything
about the approach.

But take a look at the MUnit tests. I did not ask for any MUnit tests. MuleSoft Vibes didn't
create any, expected. But Claude created 18 cases and CurieTech created 41 cases. That is really
interesting. And Claude — I don't think it can run them. I'm almost sure that it cannot run the
MUnit cases, so I'm not sure if they run. But CurieTech for sure is running these cases. It will
not give you broken MUnit tests.

### The versions

The other thing that I did specify in my prompt was to use the latest Mule, Maven, and DataWeave
version for the Mule projects. So who actually did that? First of all, the latest Mule version
right now is 4.12. Claude went really, really bad with 4.9. But CurieTech and Vibes went to 4.11,
which is not bad — it's pretty good. But then CurieTech made a mistake in four apps: it did add
the 4.11, but in one app it added the 4.9. So it's close enough. I'm really glad that the thing
that I did specify, MuleSoft Vibes was able to do.

The other interesting thing about CurieTech is that with Claude and with MuleSoft Vibes — they're
both using Claude underneath, but whatever — they are being consistent on the versions they're
using throughout the whole project network, whereas CurieTech actually used different versions in
different apps, like from the connectors and stuff. So that was also very interesting. If you
scroll down a little bit in the comparison doc, you'll also be able to see what versions each one
of them actually used.

### TL;DR — Claude Code

Claude was the most engineering-disciplined. It created contract-first — a RAML and APIkit with a
documented design rationale. It created a parent POM. All 11 operations work and data persists
across restarts using the file connector. There is global error handling in every app, and there
are 18 MUnit tests. The cons are that it was the oldest runtime of all three, and there was no
security layer — which we already know none of them did.

### TL;DR — CurieTech AI

CurieTech was the most complete and granular. It created five apps per entity split (the process
and system layers). All 11 operations worked. It created the most MUnit tests that are actually
running — 41 MUnit tests — and it had the richest error handling, plus a dedicated status-change
endpoint for the cancel order. Cons: the version drift across its five apps, there's no central
POM, no security layer, and the data is lost on restart because the Object Store is in memory.

### TL;DR — MuleSoft Vibes

And finally, MuleSoft Vibes. It has a runnable demo. I don't blame it — I was very abstract with
what I was asking for. I did not specify a lot of things, and it was running Claude Sonnet
underneath, which I don't really like. So, pros: it runs and uses the freshest HTTP connector,
there's a consistent runtime version across all apps, and all 11 operations are coded with correct
business rules. The cons: it completely skipped the API rigor — no specs, no APIkit, no tests, no
handler, no docs. I did not ask for any of those, I know, but it was nice to have from the other
two. The data doesn't persist. I also didn't specify that, but the other two tried to do it. And
there is no security layer, which none of them had.

But it's also worth noting that out of all three, MuleSoft Vibes was the fastest. It took maybe
some minutes, not an hour for sure. Claude Code again, with Opus and MAX, it took a little bit,
but again not up to an hour. Whereas CurieTech, it took a long time. I'm not really sure how long
it took because I left my task at that point. But it also makes sense, because CurieTech wants to
give you something that is actually runnable and that actually works. It goes and deploys
everything internally, it checks that it works locally, and it even runs all the MUnit tests. If
some of them don't work, it won't give it to you like that — it will make sure that all of the
MUnits are running and that there are no errors when you try to deploy. So it completely makes
sense that it's the one that took the longest.

### So who won?

Depends on what you wanted, right? I would want Claude's discipline with CurieTech's completeness,
but at MuleSoft Vibes' speed. At the end of the day, if I just want a running demo, and I want it
fast, and I want the bare minimum of what I asked, and I don't want it to overthink on everything
that I'm telling it — MuleSoft Vibes is the way. If you want the most complete, granular approach
with a lot of tests, a lot of safeguards, error handling, and so on, then CurieTech is the way to
go.

I wonder — what makes MuleSoft Vibes MuleSoft Vibes except ACB? Just taking out ACB, what really
is there? Because it's running Sonnet, right? It's already running Claude, so what really is the
difference there? It has skills, it has MCPs, it has a lot of things that plain Claude would not
have. So I wonder: if I use Claude Code with Opus with MAX and I bring in all of these skills and
all these MCP servers, would that be the best approach? I don't know. Maybe something for a future
video.

### Wrap-up

If you want to take a look at the whole code, the whole comparison, and the whole shebang, just go
here to my GitHub repo, `ai-showdown-api-led`. You can find the instructions given, the
comparison, the RAML, and the three different folders with all of the APIs that they created
inside. Of course, this link is also in the description of the video. Go ahead and check it out.

But the real question here is: which one would you have chosen for this? Tell me in the comments
below which one was your favorite from everything that you just saw here. And what next video do
you want me to do? Remember to subscribe so you can continue watching all my AI showdowns, plus
some other MuleSoft tutorials as well. All right, that is all for this video. I will see you in the
next video. Bye!
