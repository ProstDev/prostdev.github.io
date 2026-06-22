---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone, Alex here again, and welcome to the third part of my AI Cursor series. On the first video, I went ahead and created a project using best practices with Cursor — I had to tell Cursor exactly what the best practices were because it wasn't smart enough. Then on the second one, I used that GitHub repo I generated in the first video to try to tell Cursor to just generate another project with best practices based on that repo. It didn't work.

So on this third try, I generated some MuleSoft best practices — just instructions on what to tell Cursor to do. We're going to use this Cursor rules file, put it in our Mule project, and see if that works, if that makes it better.

### The Cursor rules file

I'm in my GitHub and I created this gist file, which is an MDC file. These are the rules that I generated so far — just the basic stuff, I guess. I also generated some of these with Cursor. Like, I was asking Cursor to do things and it was either doing them or not. Through trial and error it was finally able to do it for me, so then I asked it to keep adding rules to this file every time that it learned something about what I was telling it to do. We generated this together and I'm going to use this now.

### Setting up the new project

Let's go to Cursor. Here I'll go to Anypoint Code Builder. By the way, you can pin Anypoint Code Builder if you just click on this pin right here. Anyway, we are here. Let's develop an integration. I don't need you yet because I'm going to start from scratch. Let's do "testing cursor rules" and let's put this in Downloads. Select empty project, 4.9 latest runtime, Java 17. Create project.

From what we've seen, it's not going to open this for me. So I just have to go to File → Open, go to Downloads, select the "testing cursor rules" folder that I just created, and open. And now I will be able to be inside my project. It generated my project and now I'm going to start.

Let me close this. Maybe zoom out a little bit. Let's see. "Create a flow with an HTTP listener and a transform message that outputs the hello world string as text." Okay, let's try this and see if it follows the best practices of creating the global elements in another file. Oh, wait. But I didn't add the rules.

Okay, well at least this helps as a test — it created the thing here. It didn't add properties, right? So, okay, let's reject this. And I'm going to add the rules. How did I add the rules again? Was it here? Yeah, here. Add context → Cursor rules → Add new rule. So, I'm going to call it "MuleSoft best practices." And now you have the thing here. So now if I go to this other file, I can just copy this whole thing and paste it here. Save.

Okay. And now let's ask this thing again. Send. And now let's see if it follows the best practices. Okay. "Would you like me to make these changes to follow best practices?" Yes.

### Testing the best practices

Okay. So it created the `global.xml`. Cool. And it added the thing. And then it's going to create the properties file. And then it changed the main file to remove the thing that it moved to the global properties. Okay. So let's take it one at a time. So it edited three files. Oh wait, it forgot the dev properties. But it created the `global.xml` and it has the configuration properties, `env.properties`, it matches here, global property `env.local`. That's what I wanted it to do. The HTTP listener with the host and port. Yes, this is what I wanted. Cool. One down.

And then we have the testing cursor rules XML. And it just has a flow with the HTTP listener path `/hello`, and a set payload value "hello world", mime type text/plain. Yeah, pretty much. And finally, it only created the local properties files, but it did add the properties as strings, which is one of the rules — somewhere here. Yeah, "All values in YAML properties files should be strings including numeric values. For example, use `port: "8081"` instead of `port: 8081`." So that was one of the rules and it followed it which is awesome.

But you did not create — I mean, it makes sense that it created the local properties only. Let me see. Did I ask to have local and dev? "Configuration property should be stored in YAML files with the naming convention `${env}.properties.yaml`." I didn't ask it to do several. Okay, that's fair. That is fair because I didn't tell it that I wanted it to have also like a dev properties. But I'm sure if I ask it to do it — "Can you also add a dev properties file for when I deploy it to the cloud?"

Yep. It created the dev properties. Didn't change anything else. Just that. So, accept. And here's the properties. It has the same thing as the local. So, cool. This works as it should. Well, it pretty much is following best practices and I only had to use one — well, two, I added one for dev. I'm sure I can keep adding like the same thing just like QA or prod or so on. But it added the whole thing and I just needed one single thing.

### Fixing the set payload vs transform message

So "Create a flow with an HTTP listener and a transform message." I did ask for a transform message and it gave me a set payload but that's fine. We can ask it to reconsider. "The output is a hello world string as text. Okay. You created a set payload component but I asked you for a transform message component."

Okay. So now it changed it to have the transform message. All right. So we can see if this is what we wanted. `dw output text/plain. "Hello world"`. Yeah, that's pretty much what I wanted.

### The missing HTTP connector dependency

Oh, I'm missing one thing though for the pom. I am using an HTTP listener and it was not added to the pom as a dependency. And I believe this is in the rules. Or not. Did I not add it to the rules? "Dependency." Yeah. "When adding dependencies to the pom, ensure the version is compatible." Oh, "Always verify connector." Oh, okay. It's not in the rules. Fair. Fair.

Okay. So, let me tell it. "You added an HTTP listener component to my project, but you did not add the dependency in the pom file." Oh, close. But that's not what I wanted. I don't want this. I don't want this. No, I don't want this. I wanted this. Okay. No, reject.

You know what? What if I try to run it and I will receive the error? Did I reject the files? Yes. Yeah. I'm going to try to run it. Then I will receive the error that the dependency was not added. Then I'm going to tell it to fix it. And then I'm going to tell it to add the rule if it's not there already.

Okay. "Can't resolve this dependency or plugin. Maven missing." Okay. Let me just copy the whole error and put it here. Okay. "See the error." "The issue is that we need to add the HTTP connector dependency to the pom file." Yep, that is what I wanted. But I don't think that is compatible. Or maybe it is.

"I use version 1.8.0 of the HTTP connector which is compatible with Mule 4.4.0, the same version specified in the mule-artifact." That is not true though. Nope. "The error you were seeing was because the HTTP connector dependency was missing which is required blah blah blah." Okay. "Why do you say Mule 4.4.0 is the runtime version I'm using though?"

Yep. "Could not find." Oh, okay. No, you're wrong. I'm going to accept the pom change, but I'm not going to accept the mule-artifact. "So the mule-artifact.json file is located in the root folder not inside src." "Mhm." Okay, it's already in the — blah blah blah. "The correct HTTP connector dependency." "Okay, can you add this information to the rules file?"

It might or might not add it to be honest because when I was trying it, sometimes it added it and sometimes it didn't. But we can just — oh, editing. Yes, we can just add it ourselves if it doesn't actually add it. "I see that the rules file already contains the relevant information of Mule runtime and version." Okay. So, "Error includes not matching Mule versions between pom and" — let me just tell it — "mule-artifact.json located at the root directory." Yeah, I can add that. Okay. So then why didn't you follow the rule if it was already there? But okay.

All right, that's fine. Let's — let me try to run it as is and see if it's actually compatible. And if it isn't then I will have to go back because maybe the version 1.8.0 — yeah 1.8.0 — maybe the version 1.8.0 is the minimum required. So let's see if that is the case because maybe it is a minimum required because I've been using 1.10.3 which is the latest version but maybe 1.8.0 is a minimum required and then you can change it.

### The Java version issue

All right. So it was able to build it. Let's see if it is able to deploy it. And it failed because it is not supported. "Extension HTTP does not support Java 17. Supported versions are 1.8 and 11." All right. So, let's tell our agent about this. Or like can it just go — "The deployment failed. Can you see what went wrong?"

"Mule-artifact specifies Java 17, but we haven't configured the Java version in the pom." Ah, I don't think that's the case, but okay, fine. I'm going to let you do whatever you think you need to do. Added Java 17 configuration, added Mule runtime version configuration, added required dependencies. No, that's not it.

Okay, so you're not smart enough to go and check the compatibility. That's fair. I mean you did add — wait what if I — "When adding dependencies to the pom ensure the version is compatible with the Mule runtime version specified in mule-artifact.json." Let me remove this. "And is compatible with the Java version specified in the same file." And let me add this — "whenever Mule runtime version is added, mule-artifact" — is there any other mule-artifact? No. Okay.

All right. So as you can see you can play around with this and see whatever works best for you. For now I'm just going to let it be and I'm going to modify the version myself. Project properties. I'm sure MuleSoft is going to be releasing an MCP server soon, so you won't have to do all of this manually because it will be smart enough hopefully to already know all of these things. But yeah, 1.10.3.

And you saw there, right? "Connector version is not compatible with project's Java version." So, let's just select that one. Apply. And if I check my pom now, I should be able to see my — where is the thing? — dependencies, 1.10.3. But wait, Maven plugin version. Oh, yeah, that doesn't matter. Okay.

### Success

Let's try this again. This should work now because I did it myself, but okay. And yep, it was deployed. So now I'm going to tell it to call this app with a curl command. Yep. And we do receive the "hello world". So perfect. We made it work.

And as you saw, we had to do a few changes, but I'm sure MuleSoft is going to be releasing an MCP server soon. Don't quote me on that. I'm not 100% sure, but it would be really cool. And since everyone is doing it, I don't see why MuleSoft wouldn't do it. But yeah, I asked one thing which was to create this flow with the HTTP and with the transform message. It did create a set payload component instead of the transform message, but that's okay. I just told it to change it and it changed it.

And then the HTTP listener global configuration was added immediately. Well, not immediately. I had to tell it to follow the best practices, but it was added to the `global.xml`. And then it was also smart enough to follow the best practices of creating the global property `env.local`, which is what I told it to do in the rules. And then the configuration properties to follow the best practices that I had told it to follow. And here is the HTTP listener. And it also was smart enough to move the HTTP host and HTTP port into the properties.

So it did create only one `local.properties.yaml` file because I told it to use YAML instead of properties. And also here once it added the values instead of leaving them as numeric it changed them to strings because otherwise it would fail which I already knew about. And that is why it's on the best practices thing. And then it didn't create the dev properties because I didn't add that rule to my best practices thing. I only said to create the local properties. So I just asked it to create the properties and it added it with the same configuration.

### Way better in summary

Way, way, way better. And if we can take one moment to take a look at this: "All the global element configurations have to go inside a global XML file unless a different name is provided for this file. Properties like host and port should not be hardcoded in the XML files. These values should be referenced from a YAML or property file. Whenever a Mule runtime version is added to the pom.xml file, this version has to match the version from the mule-artifact.json file located at the root directory."

This is what I added because apparently didn't know what the mule-artifact was. "Always make sure the properties files added to the project are being correctly configured with configuration properties global element. When adding a dependencies to the pom.xml ensure the version is compatible with the Mule runtime version specified in mule-artifact file again located at the root directory and that it's compatible with the Java version specified in the same file."

It did not listen to me on this one. Well, it wasn't there. I didn't have the Java version. So I didn't test that. Hopefully that works. "Always verify connector compatibility by checking the official MuleSoft documentation before adding or updating dependencies." I don't know if it actually did this, but in one of the tests that I had previously done before recording this video, it actually went there. So hopefully it will continue to go there.

"When determining the latest compatible version of a connector, always check the MuleSoft Maven repository to find the actual latest available version. Do not assume version numbers or make up version numbers" — because it was doing that before, so I had to add that rule.

"Configuration properties should be stored in YAML files with the naming convention `${env}.properties.yaml`." And there are two examples. "The configuration properties module must be added to the pom.xml with the correct version." I think this one is not needed. No, I think this one is not needed. Anyway, "The configuration properties element in global XML should use the format" — because that was a thing that we had. I think it was using like the Mule 3 kind of configuration properties. I don't know. So, it just added this rule itself.

"The environment variable `env` should be set as global property in global.xml with a default value like `env.local`. All values in YAML properties files should be strings including numeric values." For example, this and this is also a rule that it added itself. And finally, "The `.gitignore` file must include entries for IDE specific files like `.vscode` and test sources like `src/test/resources/embedded` to prevent them from being committed to the repository." That is a rule that I told it to remember. So it added the rule there.

### Wrapping up

Okay. So that was it. I think it was pretty cool. I think we made a lot of progress with that. So here's the file. I just went ahead and added the revisions that I just did. I can continue updating this with whatever I see that is needed. So you can always come and reference to this file. If you go to my actual profile in github.com/alexandramartinez, you can scroll down after all of these things. And here in Pinned, you will be able to see the "use this cursor rules files for your Mule project thingy." And here you can find the file that I was just referencing to. So, okay, there is where you can find it. And yeah, feel free to write stuff, leave me a comment of something that I should change or that works best for you. And that's all for this video.

So, in conclusion, the GitHub repo didn't work for the best practices, but this rules file actually worked for implementing the best practices and telling it what to do. And the other thing that I was seeing is that because it is here in your repo in `.cursor/rules`, you have them here. You can list more of them if you want and you can just commit them to your repo. So they will always be there and anyone that uses your repo will be able to reuse these. So that's really cool. There's also a global file where you can get all of these rules in all of your projects, but I just figured it was easier to get it here because it's more accessible and more visible from the project.

All right, that is all for this video. I will continue experimenting, I don't know if with Cursor, but with other AI stuff. So feel free to let me know in the comments if you want me to do something specific. Or I'm sure there will be an MCP server for Mule stuff. So I will very probably come here and try it out from Cursor because I'm really liking Cursor to be honest. I don't think I'm going to continue using VS Code alone. I think I'm just going to start using Cursor directly because this agent is really useful. It's like a little intern that you're telling what to do, but you might have to explain some things if it hasn't done this before. So, it's like your little intern, your little assistant. So, I like it.

You still have to know what you are coding, as you saw, but once you have the rules set for yourself, this will be a way better and painless experience. All right, that is all for this video then. I will see you in the next video. Bye.
