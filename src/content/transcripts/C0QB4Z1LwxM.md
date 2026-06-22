---
source: 'Edited from the spoken video for readability'
---

### Intro

Hey everyone, my name is Alex Martinez and in today's video we're going to do something
really exciting: we're going to compare AIs using DataWeave. For this comparison I'm using
Advent of Code 2025 — the most recent one. The AIs (not me!) solved Days 1 and 2, Parts 1
and 2 — so four different challenges. I used Claude Code on MAX effort and CurieTech AI.

For Day 1 I used CurieTech's MCP server inside Claude Code. For Day 2 I used CurieTech
directly through its chat. The first couple of days of Advent of Code aren't very complex,
so the generated code — and the execution time — doesn't differ much between Claude and
CurieTech. But there are other things worth keeping in mind. Let's see how it went.

### Day 1 — Claude Code

We're in Advent of Code 2025, Day 1. I copied the whole challenge, went back to VS Code with
my Claude Code extension, and said: "I'm trying to solve a programming challenge using
DataWeave. I'll attach a scenario, and you have to create the DataWeave code to run it." Then
I pasted everything I copied. My effort setting is MAX.

After a few seconds it generated DataWeave code plus a brief explanation of how the script
works. I took the code, pasted it into the Playground, and got the expected result for the
example input. Then I grabbed the real puzzle input from Advent of Code, pasted it into the
payload, ran it again, and got **997** — the correct answer. Yay Claude.

For Part 2 I didn't even read it — I just copied everything and told Claude this was a
DataWeave challenge that had a Part 1, and here's Part 2. It correctly referenced the Part 1
code, modified it for Part 2, and generated new code. I ran it, entered the answer, and it
was correct.

### Day 1 — CurieTech AI (MCP server)

Now to CurieTech. I'd already installed the CurieTech DataWeave MCP server — you can find the
install command in their docs, and you'll need to generate an API key in CurieTech, which I
did.

I did the same thing as before: copied the whole Part 1 challenge, but this time told Claude
to solve it using the CurieTech AI MCP server. It asks for permission before running, then
generates a task you can see in the browser version of CurieTech. It works for about ten
seconds and checks whether the task finished. It gave me a brief explanation and the full
code. I copied it into the Playground, set the input, ran it, and got **997** again — the
same correct answer.

For Part 2, I again asked it to solve using the CurieTech MCP server. After a few seconds it
generated code; I ran it and got **61**, which was wrong. So I asked it to try something
different. I set my effort to low to make sure it was using the CurieTech MCP server and not
Claude, and gave it more context. CurieTech noticed something useful on its own: the payload
had line numbers prefixed, but the script expected raw instructions. It sent the corrected
version, generated a task, and this time it returned a **verified solution** — it even
updated my `mapping.dwl` directly. Note that Claude didn't run any of these validations, so
if you want accurate validation, CurieTech is the better option. I ran it and got the correct
answer: **5978**.

Back in CurieTech you can actually see the chats and tasks it generated — all four, with the
DataWeave scripts it created. Some of those we never saw because it was working behind the
scenes, but in the end it gave the answer I needed.

### Day 2

For Day 2 I copied everything again. I hadn't solved this one yet, so I created a new chat
directly instead of creating tasks, and asked CurieTech to help me solve the DataWeave
puzzle. It gave me DataWeave code, made sure it matched the expected output, and even left a
**performance note**. Then I gave it the actual input and asked it to generate the result
directly — so I didn't even have to copy the code into the Playground myself.

Meanwhile I ran the same thing with Claude, and it was still thinking — this puzzle was a
little more challenging. CurieTech produced the answer (no new tasks, just the chat); I
copied it and it was right.

Back to Claude: when I ran its code with the real input, it threw an **error**. So I selected
the whole error and told Claude to make sure the code actually works. While it fixed that, I
copied Part 2 into CurieTech. Claude figured out why the error happened, I ran it again, and
got the answer — which matched. For Part 2, CurieTech had already taken the real input; I
just asked it to generate the result without commas so it was easier to read. Both parts were
correct with CurieTech, and after Claude's fix, Claude got them too.

### Reviewing the code

So which AI did better? Let's look at the code side by side.

**Day 1, Part 1:** Using the Timer in the DataWeave Playground, the execution times were
extremely close — milliseconds apart, even running in the browser-based Playground (which can
choke on large payloads or heavy iteration). The fact that all four ran cleanly says a lot.
The structures were similar too: both used nested `do`/`var` blocks, `splitBy`, `reduce`,
`map`, `filter`, and `mod`. Honestly impressive — both did a really good job, and the answers
matched.

**Day 1, Part 2:** Here the approaches start to diverge a bit. Claude leaned on `splitBy` then
`reduce` with a couple of `mod`s and `if/else`. CurieTech used more functions —
`splitBy`, `map`, `filter`, type coercions (`as Number`) — yet still matched Claude on timing.

**Day 2, Part 1:** Both got complex: `pow`, `max`, `min`, `floor`, `flatten`, `map`,
`replace`, `splitBy`, `trim`, `filter`, `sum`, `sizeOf`. CurieTech stood out for using clean
conventions and typed signatures, and remember it had also given a performance note.

**Day 2, Part 2:** Both were complex because the problem is complex. The standout difference:
CurieTech used proper **types**, while Claude tended to use `Any`. The types make CurieTech's
code a little more readable — genuinely helpful for someone reading the code without having
read the challenge (like me). In the Playground, hovering over a typed expression actually
tells you it's a Number, whereas the untyped version doesn't.

### CurieTech's performance notes

One thing I really liked about CurieTech was the performance notes. On Day 2 Part 1 it
explained that the ranges here are tiny, so brute forcing works — but if you ever face huge
ranges, you'd want to generate candidates, loop over half-lengths, and concatenate instead of
scanning every number. It even gave me a formula for double-digit numbers of half-length K.
And it flagged a subtle gotcha: some IDs match multiple factorizations and could be
triple-counted, so Part 2 needs deduping. Claude gave some insight too — it explained the
error and the new challenge — but CurieTech's performance notes were the highlight for me.

### My two cents

In summary, both did well, and both have pros and cons.

- If you want to run code from the CLI / terminal / VS Code, you can use the CurieTech MCP
  server to run it right there — which is neat.
- You can also run it in the cloud via CurieTech's chat, and it generates tasks you can always
  go back and review — unlike a Claude Code session, which is local to your terminal and
  harder to recover once you close VS Code.
- For someone brand new to both, CurieTech is easier — even just using the chat. Claude can be
  a little confusing for newbies, but once you know it, it makes a big difference, especially
  if your code is already open in VS Code.

I liked that CurieTech generated typed functions (better readability, fewer mistakes), that
it actually **runs** the DataWeave code and returns a working result (so it rarely fails),
and that it adds those performance notes. Claude only generates code — it doesn't really run
it — so it can ship runtime errors, as we saw on Day 2.

So this round was a little inconclusive — both are strong. I'm putting everything in my
Advent of Code 2025 repo; you can open each file or jump straight into the Playground links,
which include the code and some notes on how I generated it.

I'm going to keep making videos comparing different AI tools — let me know what you'd like to
see next. (Probably not Codex: I don't have paid access, and honestly I've lost some interest
in ChatGPT in general.) Remember to subscribe so you never miss an update, and I'll see you
in the next showdown. Bye!
