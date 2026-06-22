---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone. My name is Alex and today I'm going to show you how I created a whole MCP server for the YouTube Data API v3 using CurieTech AI. This is the first time I've ever built an MCP server in MuleSoft, and I did it in about 10 minutes with CurieTech — no docs, just the AI.

### Generating the YouTube API integration

Once you're inside CurieTech AI (you can create a free account), I went to Integration Generator without any repo, just adding a description and selecting settings. In my case I selected Java 17, Maven 3.9, and Mule 4.9.

I first asked it to generate a whole YouTube API for me, because I wanted the integration first to make sure it works before I create the MCP server on top of it. So I said: "Make an API that makes use of the YouTube Data API v3. Include all the possible query parameters including the key parameter for security. This is where your API key would go."

I went to the YouTube Data API docs, copied all the parameters, and pasted them into the query so it would know what exact parameters to use. You can also just get the link and put it there — that also works. Then I said, "Make it as simple as possible."

It took around two and a half minutes and got me the whole thing. I copied the code, went into Anypoint Code Builder (ACB), created a new project called `youtube-mcp-server-mule`, and pasted the whole code in.

### Testing the generated API

After you start running the project — in my case I'm already running it — you can try it out. We're connected using the host `localhost` and port `8081`. There is no base path, and in our listener we have the path `/search`.

So if I open Postman I can put `localhost:8081/search`, then we're going to use the `key` query parameter with the API key from your Google Cloud account. Make sure that you have the YouTube Data API v3 restriction set up. If you don't know how to do that, check out my GitHub repo in the description — I have the instructions in the README.

Then we're using the `q` keyword to search for "MuleSoft". This is the same thing that comes from the Data API — we are just mapping all the parameters to make an API of our own. All of these query parameters are available for me to use from my MuleSoft integration. For now I'm just going to use the `key` and the `q`.

And this is an example of what we receive. In this case we're getting 10 results because I added a few defaults. If I check the Transform Message — or rather, let me open the code — we have the required parameters which are `part` and `key`. But for `part` I am making a default; for `key` I am also adding a default. For `max_results` I'm adding a default of 10, for `order` I'm ordering by default by date, and so on. I added a few defaults just in case. So that is one of the defaults that is returning 10 results per page, but you can change that if you send the query parameter.

Anyway, the API works. It is able to connect to YouTube, do a search, and return the results. Awesome.

### Pushing to GitHub and using the Coding Agent

Once we verify that our API is working, we can go back to CurieTech. What I did is I created a GitHub repo and pushed the whole implementation. You can also do that directly from CurieTech — just click "Initialize repo" and then push, and it will connect to your GitHub credentials. So it just goes directly and puts it in your repo for you.

After I created my repo, I clicked on "Repositories" in CurieTech. I am connected — you can click on "Connect via OAuth" and it will open another page. What I do is select only specific repos. You can select any one that you want. In my case I just added the repo that I had selected, then you click save and it gets you back to CurieTech.

Once you have everything set up, you will see that you already have your stuff. I just make it a habit of coming here and selecting these things just to have them saved, because then whenever you open this repo from another agent you already have these settings.

Once you have your API, everything is working, you put it in a GitHub repo. I just do it because I like that it creates a pull request for me automatically. But you can just go ahead and get it from a local repo or from just uploading your files — whatever works best for you.

I went ahead and selected the Coding Agent. In the Coding Agent you can upload from computer, you can put no repo, or you can add a repo. So in my case I added my repo on the main branch, added the description, and it already has the settings. Just click on submit.

For my case what I did was: "Take this API and turn it into an MCP server using the beta MCP connector." That is literally everything that I told it. It went ahead and did the diff and everything.

### Reviewing the generated changes

Once you take a look at the diff that it generates for you, in my case it only modified the pom.xml. As you can see it added the dependency for the MCP beta connector, and then it went ahead and modified my whole flow to match with MCP stuff, which is pretty much what I needed. So I clicked on "Approve."

Once you click on approve it will generate this PR for you. This is why I am using a GitHub repo, because I really love this feature. And now you can come here and take a look at the files changed. You can go to this branch to verify it on your own, which is what we're going to do now before merging.

You can see here the pom and then all the changes. If you pay attention to the changes that it did, it added first a global element. We are not using best practices on this one, but we have the MCP server config. It's pretty much just setting up the SSE endpoint path and the messages path, which are the default values.

Then it removed completely my HTTP listener configuration that I had here, and it instead added the MCP tool listener, which is exactly what we want. And not only that, it was able to generate the whole parameter schema for me including the description. It was able to know what this MCP server was going to do.

So it added the whole parameter schema, and this is why I wanted all the parameters to be there explicitly. So if we take a look at the DataWeave that we had, we are matching up everything from the `attributes.queryParameters` exactly to the same name. We could have done this differently and just done the mapping automatically — just take all the query parameters and set them — but I wanted to have them here explicitly, because then this would help us to create this whole schema, because then now it knows what exact parameters it's expecting.

So it was able to create all the properties — `part`, `key`, `q`, and so on — and it even generated descriptions for all of them because it knows what they do, which is awesome.

After that, it just generates the MCP responses. In this case it's just doing the output in a JSON. That's fine. And we have the same logger that we had before. But then take a look at this: when we are mapping, we were mapping from the `attributes.queryParameters` to the actual thing. So now it's going to get this from the `payload`, because now this is no longer an HTTP request or like this is not a listener — this is an MCP listener now. So everything comes in the payload as opposed to the query parameters.

So this is also why I wanted to have them visually there, because you can now see this change very clearly. And that's pretty much it. That's all the changes that it did.

Let's remember that I had not done MCP stuff before. So this is the first time that I know how to actually do the changes, because I hadn't done an MCP server before in MuleSoft. This is super cool because I just went ahead, told CurieTech what to do, and it did it. The first one took like two and a half minutes, this one took eight minutes. That's 10 minutes of my life that I didn't have to go through all the docs.

And you can argue like, "I'm not going to know what to do now," but I will, because I can see now the code and I can see now how this is working, how this is set up. So I can now replicate it myself if I need to, because I personally learn from code. Some people might learn from videos or articles, but I learn from seeing code. So this is super useful for me, because now I know what to do. If I wanted to do it from scratch by myself, I would be able to do it.

### Testing with supergateway and MCP Inspector

Now let's run this application. So if I go to my GitHub repo, I already have these instructions in the README. We have to run supergateway first. So this is the command that you have to run — just make sure that this is 8081 or it matches whatever port you changed in the project.

So I already have it here: `supergateway -s localhost:8081/sse` and then the path is `/messages`. We run that and this is just going to hang there like this. So this is just listening to that. It is pretty much taking the HTTP and connecting it to an output transport of STDIO, which is needed for the MCP stuff.

Then the second thing is we can verify if this MCP is actually running. We cannot just do a call like we did before with Postman — that doesn't work like that. So we can use the MCP Inspector. Just run this thing. I already have it here: `npx @modelcontextprotocol/inspector`. Run that and you're going to see something like this. So you receive a session token and you can open the Inspector with the token prefilled. So this is what I'm going to do. I'm going to copy this whole thing with the token, and note that you have to have supergateway running.

So I paste this in my browser. This is what I get. Now we have to do some setups here — you can just go to the README and check that out. So transport type is SSE and the URL is going to be this: `http://localhost:8081/sse`. Again, this is a port where I am running my gateway.

And if we take a look here at Configuration, we can see that the proxy session token is already there because it took it from the URL that we put there. So that's it. Click on "Connect."

And it didn't work. I just realized I forgot something else that I needed you to do. So I stopped the application, and then if you go to ACB, click on the settings — let me make this smaller — from here you can scroll down. You will see this that says "Mule Design Service System Properties." So copy that, or rather from here, and then go into your Mule Runtime Default Arguments. This is kind of a workaround that I'm working on right now because I had some issues with my ACB. I don't know if you will have the same issues or not, but just in case make sure you do this.

So in your default arguments, go to the end and put `-Dmule.http.service.implementation=netty`, which is the same thing that we have from here. So save that. And you can also just double check in your — not here, here — click on this here. You should see this open, and this is how my `launch.json` looks like. If yours looks different, maybe try using this. Just make sure that you have the default argument thing there, or I think you can just add it here as well, like `-m -Dmule.http.service.implementation=netty`, if you don't want to modify your default arguments. But for me I'm just going to leave it in the default arguments.

So let's run this again. And we are running now. So if I make this smaller, we see the deployed. There is no need to restart supergateway or the MCP thing. I think we can just come back here to the MCP Inspector, refresh. We still have the same URL, we still have the proxy session token, and now it works.

So once we have this, you can go here to Tools and click on "List Tools." And you should now see the YouTube search, or whatever the name for your MCP server is. So we have this, and now we can see that we have the `part` snippet and it comes with a default. We also have the default for the `max_results`, for the `order`, and all of the other things that I had set up by default. So this is super cool because it's already there.

We don't have a key. If we don't put a key, this is not going to work. So let's click on "Run." And we receive an error because it's forbidden, because we didn't add a key. So let's go ahead and add a key.

And now if I scroll down and click on "Run Tool" again, I did receive an error because there's something wrong with my implementation. So if I come here and I take a look at the logs from my local, we can see here "kind" and then "evaluating expression" — so it's the response — "no read or write handler for kind." That's okay. So let's fix that.

### Fixing the response format

For the sake of time, I'm just going to show you really quickly how to fix that error. So if we go to the tool listener at the beginning of the thing, we remember we had the name, the description, the parameter schema, and then here we have the responses. So in this case we are selecting text tool response content and we are just going to output the text as is — in this case, `payload raw`. That's it. It's just going to take everything from the payload and put it in a string pretty much. You can do this way fancier to make a few Transform Messages, but I'm lazy. I'm just going to leave it like this.

So once you start running everything, you can go back to your MCP Inspector. You have the key — you put your API key — and then let's search for example, let's search for "MuleSoft." You can also add a channel ID or any other stuff, but let's just leave it like that.

And once we run this, we will receive a successful response and we will receive some stuff. Like here's one video: "Explore Salesforce with Topic Center and API Catalog," and we can see the channel ID. I don't know who did this. Oh, channel title Salesforce Developers. Awesome. This is probably one of Akhairat's videos.

Anyway, so this is working. This is connecting. Instead of using Postman to connect to your API, we are doing this to connect to our MCP server. Cool.

### Connecting to Claude Desktop

Now let's see how to use it in Claude or any other IDE. So I'm going to show you how to do it in Claude. You can use Cursor or ChatGPT or whatever you prefer. In Claude, just go to Settings. This will open this window. Select Developer, and I already have it installed, but you can just go ahead and click on Configuration. This will show you where the file is located and you can open it in any editor of your choice. In this case this is where I have it.

So this is a command. Again, you can go to the description of the video to see my GitHub repo where I have this command, so you can just copy and paste. And here you have the MCP servers. This is called "YouTube," and you have the arguments to run with supergateway. In this case it's in 8081. So that's what we want. That's fine.

Once you have this installed, once you save the file, you will have to quit and reopen Claude. So in Mac it's Command+Q to close all of it and reopen it. In Windows I believe you can just close the app and reopen it and that's good enough.

### Using the MCP server in Claude

So now we're going to get to the fun stuff. So let's try this example: "Search for the ProstDev YouTube channel and give me the last four videos they uploaded."

And I totally forgot to send the API key. All right, so: "Use this API key for the call." FYI, don't worry about my API key — this will no longer be available once you see this video.

So it searched for the ProstDev YouTube channel and got their last four videos. It first tried to look for "prostdev" looking for the type channel. For some reason it didn't return, but this is something that happens with the YouTube API. Sometimes it just returns zero — that's just how the YouTube API works, I guess, because it has happened to me a few times before. So it just tried again, doing now "prostdev channel channel." It should have worked with this one, but it was just a hiccup. So I just tried a different search and it did return just one result. And here you can see it returned my channel ID. It has a title, "ProstDev." So this is the channel.

So by doing this it was able to gather the channel ID. So now it can use the channel ID. So now it's using the key, the type video, order by date, channel ID this, and max results four. So it already knows what to do with it. So it returned the four videos or whatever. For example, this gives you a summary of published video ID, description.

You can say, for example, "Create a LinkedIn post to showcase the first video from this list." I mean this one. "Make sure to add the link to the video in the post."

So now it generated this: "Streamline your API development with AI. Just discovered this fantastic tutorial from ProstDev," blah blah blah. It gives you what you're going to learn, and this is a part one of the thing, and then "Check it out. This is the link to the video. Have you tried," blah blah blah. And I mean you can just ask it to generate more stuff, change it, "Follow ProstDev," I don't know.

This is one use case that I thought of, but you can use it for a lot of different things.

### Closing thoughts

So this is really cool that I was able to generate the whole MCP server from scratch without ever having done an MCP server before in my life. And I didn't know how to start. I didn't know what to do. But CurieTech helped me figure everything out. I didn't even have to read the docs. I just went ahead and checked it out.

And now that I know the basics of how to use this thing, I can do even more stuff. Because, for example, I showed you we were returning the whole payload instead of doing something nice for it. So if we come here we are just generating `payload raw`. We have all these types of responses: text tool response content, text resource tool response content, image tool response content, blob resource tool response content. So there's a lot of things that we can respond with. We can add audience priority and so on. So there's a lot of things that we can do with this. But at least now I know how to do the first thing.

And this was so simple to do. It's just literally connecting to YouTube to do some search using the API. So we can do more stuff. Maybe we can do, I don't know, a Netflix thing to check if it's on Netflix or not. I know Netflix doesn't have an API, but maybe we can do a web crawler kind of thing or something like that. I don't know. The possibilities are endless.

So yeah, this was really cool. Thank you CurieTech for making the MCP creation way easier. And I did have to learn a lot of things on my own, like how to connect it to Claude — CurieTech didn't give me that, but you can see how this is really cool. And they're already working on an extension for ACB or for Anypoint Studio that you will be able to use CurieTech from the IDEs.

So I mean this is — well, I'm not speechless. I'm speaking a lot, but this is really cool. Anyway, let me know if there is any other use case that you would like me to showcase and I am happy to do it. Remember to subscribe and follow, because I will keep doing awesome videos like this and you better be here to watch them. All right, see you in the next video. Bye.
