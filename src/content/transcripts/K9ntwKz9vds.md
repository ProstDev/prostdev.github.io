---
source: 'Edited from the spoken video for readability'
---

### Introduction

Hi there, Alex here. If you haven't been following all of the previous videos in this series, this is the recorded version of the live stream I did. I just cut down certain scenes so you don't have to watch the whole hour and you can just watch a few minutes to see what we did in the session. Let's watch it.

### Anypoint Studio UI Tour

Everything you have here in the middle is your canvas—you will work on this canvas in the middle. On the right we have the Mule palette. On the left we have the project structure, so all of the folders and files you'll be able to see from here. I mostly use this panel for MUnit, but I'm not using MUnit right now so that's fine. Here on the bottom, every time you click on a component or connector you'll be able to see the Mule properties. If you click here on Console you'll be able to see all of the output console of whatever you're doing in the application. If you start a new application you'll see all of the output from the console here. Then we have Problems. Here I already have three warnings. If you have issues, warnings are normally in this warning sign icon. If you have any problems they'll be in red—those you do want to fix.

Inside `src/main/mule` is where we have our flows. You can see here in parentheses that it says "close"—all of this is called a configuration file. It's an XML file. If you open it you'll be able to see all of the different flows. In this example it's not empty, but if I click on New and then select Mule configuration file, I can create a new one. I'm going to name this `test` and click Finish. Here there's an empty canvas. If I wanted to add a flow, I would be able to go here to the Mule palette and select, let's say, Core. Here you can see all of the core components are already installed. In the Scopes we have, for example, Flow. I'm not going to go through all of these—I'm sure you can figure out some of them. I prefer to teach with examples and not just theoretically.

If I go to HTTP, all of these are modules. If I go to the HTTP module and I take a Listener from here and drag and drop it to Source, then I'll be able to have an HTTP Listener that is listening to a URL. Every time you call that URL it's going to come here, and then here is the process of what you want to do once it gets inside this flow. For example, I can add a Logger. I can use the search bar here and type "logger." I already have it in favorites, so I can drag and drop it into the process.

### Global Elements and global.xml

Now let's change our Mule project to implement some best practices like global elements and properties. Here we have the Message Flow view, here we have the Global Elements view, and here we have the Configuration XML view. If you click on Message Flow you'll be able to see the graphic representation of the XML code. If you click on Global Elements you'll be able to see these global configurations. For example, I have the configuration of this HTTP Listener that is listening on localhost or 0.0.0.0 IP and port 8081, and it has a read timeout of 30,000 milliseconds. This is a global property that can be reused in different flows or in different configuration files. It doesn't have to be one per file—it can be reused over the whole project. Configuration XML is where you keep all of the XML of this file. If you're more comfortable seeing code, you can just go to the XML view and work on the code, or if you prefer the graphical view you can go to the Message Flow tab.

The first thing we're going to do, as a best practice I've seen in other projects, is go here to `src/main/mule`, right-click, select New, and then Mule configuration file. We're going to create a new file called `global.xml`. Once you do that, click Finish. In this file we won't have any flows—we will only have global elements. You saw the global elements we have in the other file: we have an HTTP Listener configuration and an APIkit Router configuration which is used for APIkit. If you right-click on it you can click "Go to XML" and it will show you where the HTTP Listener code is located. We're going to copy both of those—or cut them—and then go to the `global.xml` file. If we go to Configuration XML, now we're going to paste those two inside the `<mule>` brackets here.

Now it's in red because I haven't saved the other file. Right now it thinks this configuration exists in both files. If I go to the previous file and save it, now it will give me errors because there's no configuration file there. But if I come back here to the global elements, now we have them here. If I save this, now this problem goes away because now we have this file here, and now this problem goes away too because now it can reference the other file. This way you can keep all of the global elements inside this global file and you don't have to keep searching for them in every single file. If you end up with, let's say, 30 configuration files here with different flows, the last thing you want is to go into each specific file to look for the global elements. If you have just a `global.xml` file, you'll always know that the global elements are located here.

### Property Files per Environment

Now for the properties. You saw that I had the HTTP Listener configuration, and it says this is 0.0.0.0 and it's using port 8081. But what if, for example, this is only in my local environment running on 8081, but in my dev environment it's running on 8082, or in my prod environment it's running on 80? There are different ports you can do per environment. Another best practice is to create properties for all of these settings and to create a different property file per environment. In this particular case I will not have a prod environment. I will just have a local environment and a dev environment—local is what I'm running here in my computer, and the dev environment is when I put it in CloudHub.

If you go to `src/main/resources`, right-click on it, select New, and then just new file. I am going to name this `local.properties`. You can also use `local.yaml` and keep all of your properties in a YAML file instead of a properties file, but I'm just used to the `.properties` extension so I prefer that. Click on Finish. Then let's create another one that is going to be `dev.properties`. Now we have `dev.properties` and `local.properties`. Now, for example, I want to create:

```
http.host=0.0.0.0
http.port=8082
```

I'm going to do 8082 just to change it a little bit. I can save this, and then go to `dev.properties`. In `dev.properties` I do want to do 8081, so I'm going to save it like this.

Now let's take the HTTP host property and go to `global.xml`. If I double-click on the HTTP Listener config, now I can change this to be dynamic. To make it dynamic and use the properties, I'll do dollar sign, curly brackets, and then the property `http.host`, and then close the curly brackets. We can also have the port be dynamic: `${http.port}`.

All right, we did that, but that's not all. How will this program or app know which configuration file to use? We need to create another variable. If I click here on Create in the `global.xml` file, in the global elements—because I'm going to create a global element—I click here on Create. Let's search for "property." You'll see the global property. You can click on that. Here in Name let's do `env` and value is going to be `local`, because every time you run this anywhere that is not CloudHub, the default is going to be local. So name `env`, value `local`. If I run this in my local it's going to have the value `local`, and if I run this in CloudHub I'm going to put a property there that says `dev`, for example. Click OK.

Now, how will it know exactly which file? Let's create another global property. Search for "configuration properties." Double-click on it and it will ask you for the file. Here is where you will connect the file that we have here—either `dev.properties` or `local.properties`. Since we already said the environment, the `env` property is going to be `local` for this case, then it's going to take the `local.properties`. For that we're going to do: dollar sign, curly brackets, and inside we put `${env}.properties`. If we run this in local, the `env` is going to be `local`, so this file is going to be `local.properties`. If we run this in CloudHub, where I'm going to put a `dev` property, then this is going to be `dev.properties`. That is how it will know which file specifically it will take.

### Implementing GET Articles with Object Store

Now let's start implementing stuff. I'm thinking we can use the Object Store that MuleSoft provides because I just like it. We can also try to implement our own database, but I feel like that's going to be more issues because in local maybe you just have your local instance of a database like SQL, but then when you send it to CloudHub it's going to have to connect to a service where you have your database in the cloud. I don't have the infrastructure for that right now, so I feel like the easiest way to do it with just the few resources we have is to use Object Store.

Let's do `/api/articles` GET. Let's do the GET. We have GET articles—that is the first flow we're going to try to connect. We're going to leave the Logger, but I'm going to change the logger to show me the start, for me to know that it got into the flow. I'm going to change the message here. I'm going to put "Starting GET articles," for example, because that makes sense for me. Here on the display name I'm going to put "Start." I'll probably do another logger here for the end—the same thing that I put in the start, I'm just going to put "Ending" just so I know where it ended and where it began.

Now we're going to add the Object Store. Right now we don't have any module for Object Store. We just have Core, APIkit, HTTP, and Sockets. We're going to click here on Add Module and let's see if Object Store is here. It is. You literally just have to take it, drag and drop it to the left side, let it go, and now you have Object Store. If there is a module that is not here but it's in Exchange, you can also click here on "Search in Exchange" and it will get you to this other screen that we've seen before. You just have to sign in with your username for Anypoint Platform and add the module from there.

I want Retrieve. Now we see here that we have an X saying that the key is required. You can also see in Problems, "Required attribute key is not defined in Object Store." Now we're here on Retrieve. The key I'm going to name `articles`. Then Object Store—here this is a dropdown for the configuration of Object Store. I have not done that. Instead of creating the global element from here, I will instead go directly to the `global.xml`, go to Global Elements, and create the Object Store global element. If I look for Object Store, we have this. Double-click on it. It just asks for a name. If it's persistent, max entries—I don't think I need any of that. I think that's good enough. That's all. I didn't really add anything. I just created the configuration. Save it, and then I go back to where I was, and now I can select it from here.

### Implementing POST Articles (Retrieve, Append, Store)

Now let's do the same thing that I did with the loggers before. Now we are going to add the Object Store and we're going to select Store. It says "Stores the given value using the given key," which is exactly what we want. Let's put the store there. The key is going to be `articles`, like the Retrieve. Here you start to wonder—maybe you should have a property to retrieve these instead of having to manually write it, in case there is a typo or something. I think we can do that.

The value is going to be the payload, so whatever comes in the request is going to be added to the articles. We're not going to do any validation whatsoever. We just want to do a POC really quick. We select here our Object Store, and that's it. Now this way we are going to be overwriting the same thing over and over again.

Let's create the property. Because this property is always going to be the same regardless of the environment, I am going to create in `src/main/resources` a new file and I'm going to put this as `default.properties`, because all of these properties I want to be available in all of the environments—they're not going to change. Here, for example, is going to be:

```
os.articles=articles
```

I just want to avoid the typo, that's all. Then I'm going to reference this property in the Object Store stuff. Save this, go back. Now here in the Store, I was doing key `articles`. Here's another way to call your properties: instead of doing the syntax as we were doing before with the dollar sign and curly brackets, when you have this FX button you can click on that and this will become DataWeave code basically. Here I'm going to do `mule::p()` parentheses, and inside in quotes I'm going to put my `os.articles`. You can also do this without the `p`, like `p('os.articles')`, but I have found that that syntax sometimes can give you trouble, so I'm going to leave it as `mule::p()`. I'm just going to copy this and put it in the other place as well. So we can reference that instead of having to manually write it.

Now I click on the FX. This is going to be now `mule::p()`. Also, if you're not sure if you had clicked on the FX or not, you can see here there is a hashtag and then square bracket—that is telling you that this is a formula instead of being a literal value. The other thing we have to do is go to Global. The same thing we did here to put `${env}.properties`, but now we have to add our other file.

First, we need to retrieve all of the articles so we can add the new article to what already was there, instead of removing what's already stored in the articles key and just putting the new one. We don't want that—we want to keep adding into the new stuff. What we are going to do is we are going to Retrieve. I'm going to use the same `os.articles` property or this key, and the Object Store is going to be Object Store.

The issue here is that when we arrive here, what we have in the content of the payload or whatever we have from the request is going to be the request that we send. But then when we get here and we retrieve the articles, that is going to be removed. What we're going to do is, if we click here on Advanced, Target Variable, we're going to create a new variable called `articles` and the target value is going to be the payload. This way we will have the variable `articles` and the payload, and then we're going to put them together.

### Fixing the Default Value and JSON Output

Now we can add the Transform Message here before storing but after retrieving. This is what we are going to do with DataWeave:

```
vars.articles ++ [payload]
```

My array plus payload, which is going to be the object that I receive from the request. That's all. I am just putting my new article inside the array of articles that I already had. Let's rename this here. Rename as "Append new article."

So we retrieve the articles, we append the new article, and then we store that—which is the array with the new article—we store that, which is now in the payload, into `os.articles`. If you want to kind of keep things clean, you can also remove the variable that we used before. After this, if you want to help a little bit the garbage collector, you can do that. If you don't do this it's fine. It's not going to break. The variable is not going to stay there forever. As soon as this flow is done, that variable we created is going to be removed—which was `articles`. But I like to keep things tidy, so Remove Variable `articles`. You don't have to do this again. This is a very small program. It's not going to break just because you don't have this, but I like to see it.

All right, and that's all. That should work. It was deployed. Let's call `/api/articles`. Oh, I tried 8081—it was 8082. Oh, I received an error because it doesn't exist. It doesn't contain any value for key `articles` and default value was not provided or resolved to a null value.

Let's do that really quick. In the Retrieve—and now notice this, because we have here a Retrieve in GET articles, we have a Retrieve which is doing basically just retrieving `os.articles`, and we have another one here which is doing the same thing. The only difference is that here we're putting it in a variable. Maybe we could create a subflow to do these two things, but for now let's just leave it simple. Now I'm going to put the default value here. I'm going to do DataWeave and I'm just going to put an empty array: `[]`. I'm going to put it in the other one as well. You can maybe try to figure out how to create subflows so you can put all of these things in if you want.

Saved. Run it again. Another thing we can also do is we can create different configuration files for each resource. We can have one with articles, one with writers, one with categories, and this way we can have all of the logic of the flows in those specific files. Here I can just do a flow reference from this part to that other part, so I don't have to keep working here on this file because it's so long. I can just keep working on smaller files. I think you can figure that out. You can figure out how to do that on your own. Maybe for homework you have to create different files here. I'm going to put all of the instructions in the GitHub repo as well so you can follow up. Here in `src/main/mule` you will have to create configuration files, and you will have to have there the flows that we just created. These three, for example, are going to have to be in a subflow in that other part, and here you will only have a flow reference.

Now let's try this again. I think I know what that is. They want me to do `output application/json`, so this way this empty array is going to be application/json. Let's save that and change that in the other one as well. That is why we want subflows—instead of having to do this every single time in both of them, we could just be able to do it in one place and it would be reflected automatically in both of them.

### Testing It

Are we done? Finally! Now we retrieve the articles and we are retrieving an empty array. I am in `localhost:8082/api/articles`. For the body I'm going to send Raw, and this is a JSON. Let's copy this and paste it. Send, and we received the 201 Created. We received this thing. Now let me try this again. It was created! Now let me do `id: 2` and I'm going to remove this whole thing so it doesn't look that big. "The Importance of DataWeave," and this was written by Esmeralda, category, and there are no comments in this case. Now let's send this. It was posted according to this.

Now I can also do the GET. We have the two of them—we have the first one and the second one. Now we have one article, two articles! It's working. I'm glad I tested it. This is working. You have the first version.

### Homework

Now you figure out how to do the rest of the things. Remember, create a new configuration file here for every resource so you don't have to keep navigating in this huge file, and you just have a flow reference. I think you can even select this whole thing and then right-click on it and Extract to Flow or Subflow. There are ways to do it—just try it out, try to see what works, what doesn't work. This will give you a lot of experience to figure out what's happening.

### Wrap-Up

Thank you so much, everyone, for watching. I really appreciate all of you for joining me and for watching my videos. Please let me know if you have any suggestions or any feedback for me of what else you want to see, if this is working for you, or if you have any questions. Also, if you don't finish the homework by the 19th, I will be happy to help you. You can contact me on LinkedIn or on Slack or on Discord, and I can just help you with that to see what we can do, or just wait for the session to see how to do it.

All right, that's all for this live stream. I will see you in two weeks, and I will upload the homework solution—my solution—on the 12th. All right, see you all. Thank you, bye!