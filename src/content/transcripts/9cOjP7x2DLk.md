---
source: 'Edited from the spoken video for readability'
---

### Intro

Hi everyone, Alex here. I come to you with AI content now I guess. I wanted to talk about this app called Cursor. Cursor is actually based on VS Code, same as Anypoint Code Builder (ACB), so they are actually kind of compatible. If you download Cursor right now I have the free trial, so you can do everything that I am doing. I think I have a two-week pro trial — anyway, I'm on a trial of some sort. I'm not paying anything. So I kind of want to check it out.

### Setting up the project

First of all, I'm going to open some projects here, but I'm actually going to create a new one. I already installed Anypoint Code Builder in Cursor because it does take a while. So I wonder if I can just create one from scratch here. I'm going to do new folder in Downloads — let's do "best-practices" — and open it.

This looks pretty much like Visual Studio Code. It's just like the activity bar — I cannot move it. Actually I tried moving it. In appearance you see activity bar position. This is default. In Visual Studio Code you can actually move it to the left or to the top. Right now this one is on the top. I could not move it to the left. Maybe there is a way. I just don't know how. But anyway.

So we have the new chat here. I'm going to minimize that for now. If I click here, "develop an integration in Anypoint Code Builder," and I'm here. So let's do project name — actually I already have the thing. I don't know if it's going to create it inside the best-practices folder. Let me just select Downloads then.

So let's do "mule-best-practice-template." Mule project, Mule runtime. Let's do 4.9 because that's the latest. Java version 17. And let's say create project.

Because I have Anypoint Code Builder, it is going to show me Agentforce and Einstein and all of that fun stuff. But for now I just want to try it with Cursor. Right now you can build it with Agentforce and do a lot of different stuff. You can use a prompt with Agentforce, but for now I'm not going to do that. I'm also not logged in to Anypoint Platform right now. So that's okay.

### Building the flow with Cursor AI

Let's go ahead and start from scratch for now. So let me minimize this. To hide the sidebar, use the icon in the top right — oh, this one. Okay.

Right now I'm going to leave this as a flow. I wonder if this thing — the agent — can actually create the base thing. Let's try. So I say: "create an HTTP listener and add a transform message to output a JSON payload saying hello world."

Let's see if this works. Okay, it created mule-best-practice-template.xml. There's a linter error. I don't know what that means, but it fixed it. It's still doing a bunch of stuff. I'm going to close it for now.

Let's see what it did. So it did a flow name "hello-world-flow" with an HTTP listener, HTTP listener config "hello," and the set payload with the message hello world. Okay, I feel like this is good enough. And then the HTTP listener config. Okay.

### Moving config to global.xml

So now I want to move the HTTP listener from this file to a new global.xml file.

Okay, so it created the global.xml. It added the HTTP listener config in the thing and it removed it from here. Okay, cool. Awesome. So now we are kind of following the best practices there because we have this thing here and now we want to extract the properties.

### Creating YAML properties files

So: "create a new properties file. Make it a YAML file and add the host and port only properties only."

Okay. So it's going to create an application.yaml with HTTP listener host and port and then it's going to update the global.xml. So now it has the HTTP listener host, HTTP listener port. Yeah, let's accept that. And did it create a file? Let me see. Resources. Yeah, application.yaml.

It was smart enough to know that the host is a string, so it put the quotes here and the port is 8081. It's even telling me how to do it in properties. Okay. But it didn't create — so: "add the application.yaml properties file in the global configurations."

Okay. So it knows it's on global.xml and it is creating the configuration properties name, configuration properties. It keeps changing stuff. Configuration properties file application.yaml. Awesome. Let's accept it.

But then what would happen if we want to have two different environments? So let's say instead of having just one application file: "can you actually create two separate files? One for dev and one for local."

Okay, so local.yaml and dev.yaml and then it's going to change the global.xml. Okay, so it knows to do the env property, but it didn't create the other property. Accept all. And let me just tell it: "can you rename dev properties and local properties?"

So it's going to delete — I just need to press accept. Deleted local and dev. And now it's creating the local-properties.yaml and the dev-properties.yaml. Okay, so it created both. Now it's going to update the global.xml. Okay, awesome. Env properties. Yes, the functionality remains the same, but now the file names are more descriptive. Awesome. You can still run the application using env equals local for local, env equals dev for development.

I don't know if it can add this for me to run, but let's just leave it for now.

### Cleaning up the XML

"Prettify the XML files, but don't add comments."

Okay. So it changed this. Let's just accept and accept. Oh, but it kept the comments. That's fine. Let's just remove it. Accept and accept. I don't know if this makes it better to read or — what if I use format document directly? Yeah, let's just do that. I like this better. That's just me. Here too. Let's just do format document and then remove this space. Awesome. So save. Save.

Let me remove this. Save. Okay. So I have the configuration file, the HTTP listener. This is going to host import. Oh wait, I'm not using application.yaml anymore, right? Yeah. I'm just going to delete it myself. Delete, move to trash. Awesome.

So now we have the properties, local-properties. We can add prod and everything, but let's just leave it like that for now.

"Create a global property env equals local."

And it knows what I mean. I think yeah — global property name env, value local. By default the application will use local-properties.yaml file. You can still override this setting by setting the env when running the application. Cool. So there's that. Oh, I didn't even accept these changes. Accept. Accept.

### Setting up Git

So let me see here. If I initialize a repo, what will I see? I see the .gitignore. That's okay. Let's add that. I see the mule-artifact.json with my specifications. I see the pom.xml. Okay. That's the basic stuff. I don't want to have —

"Add code to the .gitignore."

Accept. Okay, so it added that. If I check here it's added. I can accept the change. .gitignore. My global. I think that's good. My flow. I may come back to that one, but for now it's good. Oh, I just noticed it changed the dev. This should be 8081 in both. 8081. Okay. Add. Add. And the log4j that I never changed. Cool. I don't know why it's doing this thing. It's like we're in a party. But anyway.

All right. So now: "Can you help me run it? Can you run this application locally?"

Okay. I don't think you know how to run this. Reject. Stop. "You don't know how to run this." Okay, that is fair. That is fair. You helped me do everything else. You didn't change anything else. It is only fair that I run this.

### Running and debugging the app

So let's go to run and debug. Man, I really hope that I can change this thing to this side because I don't really like having it over here, but that's okay. So let's start debugging. Let's run it to see if this works. And if not, let's tell this thing how to fix it.

Failed to execute. I see. Error loading global.xml. Can't resolve this. Okay, so it did make an error. Let me put this error. "I see the issue. We need to add the HTTP module dependency." Oh. That is right because it added everything.

It modified the global, but that was not the issue because it just removed the spaces and whatnot. Stop. Because you added — okay, you added one that wasn't the one that we wanted.

"You forgot to add the HTTP listener dependency in the pom.xml. Please add it and make sure the version is the latest."

All right, let's see if it knows how to do that. I added the HTTP listener dependency. So it's going to be on the pom. Okay. It was able to add it. It says it's the latest stable version of the HTTP connector. Okay, let's accept it. And yeah, it's going to tell me this is not cool. So I'm just going to go to project properties and fix this. It added an even further version. Okay. So it made sure that it was the latest version, I guess, but that's not the version that I needed anyway. It was not good enough to know what it was. And this is freaking out again. So let's try to run it now.

Wait. I don't know why this keeps getting modified. I think it's because I'm opening the thing. Anyway, we modified the dependency and that's it. Cool. You don't have to keep adding stuff. It's just that I want to see what are the changes to my files that are happening. So let's run this now.

Okay, failed. And I think I saw the YAML thing. YAML configuration properties only support string values. Yep. To be honest I thought this one was going to pass but apparently it didn't. I'm just going to add it directly. Save. Stop. Save and save. All right. So it should work now. Let's try again to run and let's add the changes here. So we do have to make sure that this is a string otherwise it's not going to run.

Okay, I think it was deployed now.

### Testing the endpoint

Now can I ask this thing to send a request? "Send an HTTP request to localhost 8081." No. Okay. You don't know. You don't know how to do it. Okay. Fine. Let's do localhost 8081. Oh, it was slash hello, right? Oh, I think I'm — wasn't it a message? Hello world? Oh, so it did not output up. Okay.

"Modify the set payload to output an application JSON."

What did you do? Value, doc name, mime type. Nope, that is not what I wanted. That's all right. I will just do it myself. So we want an application JSON DataWeave and then the message and it's not liking it. "Fix in chat." Oh, I forgot the output. Oh, well, thank you. I appreciate it. I don't need the mime type. You know what? Yeah, I'm just going to remove it because I don't want it to cause more issues. Stop in the name of love before you break my heart. All right, save. Let's run this again.

Oh, what? Oh, I didn't add the embedded. "Add the source test resources embedded folders to the .gitignore, please." Resources. Awesome. Appreciate it. Let's do accept and let's see. So we have — close all.

This screen looks really cramped because I have a zoom because I would normally develop something like this because I can still read but it will be really hard for you to read it from your screen. So like as you can see from here it looks really cool if I'm zooming out but you cannot read it. So that's why this looks really cramped because I am zooming in.

All right. So that was a change there and we added the source resources embedded in the .gitignore. So we can try running one more time and see if this finally runs. All right, it was deployed. And let's try this again. Yay. So we received the hello world now.

And the last thing that I had in mind — let me close this — is can I debug this? I think I can but let me just try. And yes I can debug it. So because Cursor is based on Visual Studio Code you can actually continue using Visual Studio Code. You can install extensions and do any of those things that you do in VS Code. It's only that the activity bar is on the top instead of being on the left like in the regular VS Code. But oh well.

### Closing thoughts

Apart from that, it's pretty much doing everything. And maybe it took me a little bit more to do this with Cursor with the agent. But I guess once I know what it can and cannot do, it will be easier. And now that I know that I have this template on my own — like best practices — maybe I can put this out in GitHub and I can tell it to base on that GitHub repo to create my stuff in a new project. So I'm going to try that in the next video.

But for now, I think this is really cool to kind of see. Once we can figure out how to use it better, I think this is going to be a really good tool because it did do a lot of things for me like moving the properties and renaming and stuff. You just have to review that what it did was what you wanted. But it did save me the time of doing copy and paste. And yes, you may argue that maybe I spent more time doing the other things, but it's going to be a tool in a while. It's just getting there for now. But I can see the added value into it. So I'm into it. I like it. So I'll see how to make my own life better.

All right. That is all for this video then. I will see you in the next video. Bye.
