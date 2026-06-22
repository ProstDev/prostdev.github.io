---
source: 'Edited from the spoken video for readability'
---

### Intro

Hi everyone, my name is Alex and in the last video about Cursor AI and Anypoint Code Builder, we created this Mule best practice template — a regular Mule application that uses some of the basic best practices. I even generated the README with Cursor, which was really cool.

This is the project structure: we created the `global.xml` that has all of the global configurations, the `mule-best-practice-template.xml` with the main application flow (it just outputs a hello world in JSON format), and the resources folder with `local-properties.yaml` and `dev-properties.yaml`. So we're creating two different properties files, and they're YAML — I'm not using `.properties` files anymore because I think YAML is a best practice now.

The README lists all the prerequisites: how to install Cursor, how to install Anypoint Code Builder (ACB) inside Cursor, the configuration we created, and how to test the app. You run the application and use curl to call it; you also have to set the env property because it's specified as local or dev (if you don't specify, it defaults to local). PS: this README was generated using Cursor too. Really cool.

### Testing if Cursor can infer best practices

So we have this project. Now I'm going to test if Cursor can be smart enough to know that that's what I want. I'm going to open my downloads folder, create another project, and see if Cursor can understand the best practices from the existing one.

Let me create a new one using ACB. All right. I wonder if it can create a new project using the best practices. Let me ask it to create a Mule project called "testing-cursor" and use the best practices from the other Mule project.

Let's see if it knows what to do. Okay, it's going to create the whole thing. For now I'm not going to do that — let me create the base project myself and then I'll ask it to do the other things.

It created the "testing-cursor" folder but didn't open it. That's weird. Okay, let me just open it manually. So I was in downloads, testing-cursor… there you go. Open.

Okay, so it created the project. Doesn't have any resources, any tests, anything. It doesn't have any best practices because, yeah, that's normal. So let's see.

### Creating the flow

Let me ask it to create a flow with an HTTP listener and add a Transform Message component. You can test this flow by making a GET request there. All right. So HTTP listener, Transform, and the HTTP listener config. Let's accept these.

Now let me take a look at the code. We have the flow, main flow, HTTP listener, response body — I don't think this is needed — Transform Message, output application JSON, message "hello from Mule." This should work in theory. We can try it out.

Wait, it's not going to work because it didn't create the dependency in the pom.xml, right? Yeah, it didn't add the dependency in the pom. That is one of the annoying things with Cursor — it's not really adding the HTTP listener in the pom. So you kind of have to remember that. If you're using this, add the HTTP dependency in `pom.xml` and make sure it's compatible with the Mule runtime and Java versions.

It's going to try to add the Mule runtime version in the pom, but yeah. Let's reject this and let me try again: "Add the HTTP dependency in pom." Okay, looks like it added it. Let me just make sure… dependencies. Okay. I don't know if this is going to be compatible with what I have, but we'll see. Accept.

And it's not going to be compatible, but that's all right. Let me just fix that manually. And it's annoying that I have to do this manually, but hopefully that is the problem we're trying to solve. Okay, 1.0.3. All right, perfect. Did it apply it? Yeah, 1.0.3. Cool.

So now we can try to run it and see if it runs. Deployed. I didn't even see the configuration. Okay, localhost 8081. Perfect. Let me create a new terminal and do it with curl: `curl localhost:8081/api`. "Hello from Mule." Okay, so this works. Awesome.

### Trying to apply best practices

Now let's see if we can add some best practices from the other project. Let me modify my project to have best practices — you can base it on this project here.

Hmm. I feel like it didn't really understand what to do. So what did you do in testing-cursor? Oh, you created some things. I just wanted the base things — I didn't want anything really fancy.

It took out the path and renamed the config. I don't know why it did this. I don't need this. Let's reject this. An error handler? No. I just wanted you to move this.

Reject all, accept all. Oh boy. So it did that there. I don't like that.

Then in the pom it keeps adding the Mule runtime version, and it keeps adding the wrong one. So okay, this is not working. Configuration module, but it changed my HTTP connector version. It knew that it had to add the local properties, but it didn't actually do it right. Only this would be useful — this is not useful. The properties, maybe like the logging level maybe, but it's not really changing it anywhere I think. The environment property? That's not really useful. Configuration property, the local pro… no. You didn't know. Nope, no. You clearly don't know what you did.

Okay, reject all. You clearly don't know what you did.

### Answer: it can't infer best practices from a repo

So to answer the question: no, it's not really creating the best practices. Coming from just providing a GitHub repo, it doesn't actually know what to do, because if we take a look at everything it just did…

First, let's create the property directory structure and configuration files. Mule resources, Java — but it should already be there. Why are you modifying that? Then the environment-specific YAML files, sure, and then the global configuration file. Update the main flow to use the new configurations, right. Let's update the `pom.xml` to include the necessary dependencies — like, this is where you're losing me.

Environment-specific configurations, global configuration, main flow improvements, dependency management, error handling. Yeah.

### Next idea: instructions file

I wonder if I just create a doc or a blog post where I can reference it and say, "See what's being listed here and apply that as best practice." Maybe that would work, and that way you can generate just a document or something.

Let me see what we have here in context. Do we have files and folders, code, docs, Git, paths, chats, Cursor rules, terminals… I don't know what's "linter errors" and "web." So what if I select "web"? Oh, that's just like taking the thing from there anyway. I can just paste, like I just did — I pasted the GitHub repo. Maybe I can just paste a blog post from somewhere that will have this documentation, and I can put that there.

So maybe it can be like, even from the docs — like the official MuleSoft docs — if they create one site with all of the best practices to feed this LLM, and then you can add other context like your company-specific ones. Maybe this will work.

### Closing thoughts

All right, so in the next video I will try something like that. I will create a blog post and reference it to see if that improves, but it's not smart enough to just take the GitHub project that I just did and be like, "Okay, this is what you need." So maybe a set of instructions will work.

All right, see you in the next video with that experiment. Bye.
