---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone, my name is Alex and today we're going to see something really interesting. CurieTech just released a new API Spec Generator agent a few days ago, and I am more than excited to try it out. Let's do this.

### Converting RAML to OAS

I already thought of a use case. I have this RAML specification that I've been using for other things — my to-do API specification: create to-dos, delete, edit, and so on. Because I already have it in RAML, I was thinking let's move it to OAS.

I select OAS 3 and ask a question. You can directly ask any question you want to this agent and it will generate an API spec for you. In my case I'm just going to go ahead and select this whole RAML and tell it to take this RAML spec and create an OAS YAML spec. I paste it and press enter.

This is the result: "This OAS YAML specification is valid and ready to use in your MuleSoft project." Let's see if it's true. I'm going to copy it. I already have my RAML specification open so I can compare them. In this I have `/todos` GET, POST, `/todos/{id}` GET, PUT, DELETE. Then I paste the new OAS version. I can see that I have my `/todos` GET, POST, `/todos/{id}` GET, PUT, DELETE — it looks like it has everything the other one has. `/todos` GET has four query parameters, which are the same that I have in the other one. Then we have the POST to create a to-do and then we have `/todos/{id}` to get, update, and delete a to-do. So it pretty much took the same specification I had in RAML and just put it out in OAS. We have a check on that — it really worked.

### Generating a new spec with full detail

Now let's try to actually create a new specification from scratch. "Create an API to manage a list of to-do items. Each to-do has the following fields: ID (unique identifier), title (the title or description), checked (if the task is completed), due date (the due date of the task). When it retrieves a list of to-do items it should support optional query parameters for filtering like title contains, is checked, from date, to date."

I'm giving it a ton of information right now because I want to make a test with it first. Let's see what happens. And this is what it generated. It has pretty much the same structure as before, but it does look a little bit different because it has some different things. For example, it has a 404 description like "Item not found," which I didn't have before. So it did add a few more things. And also if you take a look here at the schema, it changed the name to `TodoItem` — it didn't used to be called that. We have `TodoItem`, `TodoItemCreate`, and `TodoItemUpdate` — three different items, which makes a lot of sense because they're different things.

### Testing with less technical detail

Now let's give it less technical information to see if it can still create something. I did go to ChatGPT to generate this whole thing, but here we go. It's pretty much just a paragraph explaining what it does: it updates tasks, it adds tasks, it deletes tasks. "My to-do API is a simple digital system designed to help people manage their tasks and to-do lists. It allows users to keep track of tasks, whether they're personal goals, work assignments, or daily reminders. The system lets users create new tasks, view their list of tasks, update them, and remove them."

Let's try with this whole thing and see if it works. Let me see if I give it even less detail to see what questions it will ask me. Something really simple: "Generate an API spec to manage to-do tasks."

Yes, now it is asking me for a few clarifying questions to generate a better spec.

**Number one:** Do you prefer the specification in YAML or JSON? YAML.

**Number two:** What operations do you want to support? All CRUD operations. Again, I'm trying to give it as little detail as possible to see what it comes up with.

**Number three:** What fields should a to-do task have? It's suggesting ID, title, description, due date, and status. So let's just take that and put that.

I didn't answer four and five because I don't know — whatever it wants to make. So let's take this code and check it out.

### Reviewing the generated spec

Oh, this is awesome. We still end up with `/tasks` GET, POST, and then `/tasks/{taskId}` GET, PUT, DELETE. That makes me feel better with myself because the API that I designed first had those five methods. So the fact that CurieTech keeps creating the same five methods makes me feel better.

We have `/tasks` GET to get all tasks — this is an array of items of a task. We have POST to create a task, so it will send a `TaskInput` and it would return a `Task`. Then we have `/tasks/{taskId}`. To GET it will be getting a task. For PUT, to update a task by ID, you send a `TaskInput` and you receive a `Task`. Then for DELETE, you simply send the task by ID.

Now if we take a look at the schemas, we have the object `Task`: ID, title, description, due date, and status. Oh, this is even better than mine. And we can see which ones are required, which is ID, title, and status. Description and due date are not required. Finally, we have `TaskInput`, which is title, description, due date, and status — exactly the same thing as before except the ID. That makes a lot of sense because when you are going to create a task you don't really need the ID — you want the backend to create the ID for you. So this makes a lot of sense.

### Why this is better than ChatGPT

This is perfect. It created exactly what I wanted and even better than what I had at the beginning. This is awesome. I am going to use this so often.

Before, I was trying to do everything with the UI. If you don't know the UI, you come here, create a new API spec, guide me through it, and then you have this nice UI where you can just press buttons and configure stuff and you will get either the RAML or the OpenAPI spec depending on what you want. I used to use that because I like having a UI.

Then AI came and I started using ChatGPT to tell it to generate stuff for me, but I would have to go back and forth to check in API Designer to make sure that it is actually a running RAML specification. It was pretty annoying to be honest.

But now, I gave the same amount of detail that I would give ChatGPT, and it generated it so quickly. And I like that it doesn't assume what you want as opposed to ChatGPT — it asks you for some questions on what you want exactly. For example, I didn't answer all of them. I didn't answer number four or number five because it didn't really matter to me at this point. I just wanted to see the specification. So I answered with just those three numbers and it was able to generate the whole specification for me.

If I want to keep adjusting stuff, I can just keep talking to it and it will just keep sending me more and more specifications. And because you have this handy copy button at the top, you can just copy this and put it in your API Designer. You don't have to drag everything and do something complicated — no, you just have the copy button. So pretty handy.

And also as we saw in the first task that we did, we can also just use this to translate from RAML to OAS or the other way around, which is really cool too.

### Closing thoughts

10 out of 10. Again, awesome product. Awesome new agent. I love CurieTech.

All right, that is all for this video. Tell me which of these agents have you used, do you want to use, or tell me if I should try any other agent from this list — please let me know. I am more than happy to try them out for you. I will see you in the next video. Bye.
