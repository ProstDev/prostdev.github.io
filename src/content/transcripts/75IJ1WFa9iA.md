---
source: 'Edited from the spoken video for readability'
---

### Introduction

In the last session, session five, we started developing our API in Anypoint Platform. The homework was to create new Mule config files and add flow references to finish the logic for the Articles resource — just the happy path.

I modified the homework last week because I realized I was asking too much. Originally, I asked you to finish the whole implementation, but when I was doing it myself, I noticed that was way too much if you're just getting started. So I changed it to just finish the logic for articles. Even that would be difficult if you don't know DataWeave, because you do need to transform some data. So don't worry if you didn't finish — I will walk through it.

You can see my full solution in this pull request. I'm going to start doing pull requests so you can see all the things I changed. I added images, I changed the RAML specification to include POST and DELETE for categories. After you do that, you can simply rescaffold. All of the instructions are in the README, so you can check out my step-by-step and see exactly everything I did. You can also see all the code changes.

### Per-resource config files and flow references

I modified the main file, which is Maxine's Blog API, and I created four new config files — one for each resource. This way, things are better organized. You can separate this however you want, whatever makes it easier for you to find the flows.

For me, this works because if I need to modify something in the logic of articles, I can just go to that file. If it's something in the logic of writers, I go to that file.

In the main file, I added all of the flow references to the flows that I created in these four files. All of the things you see here are just flow references to the other place. The router is going to route the request to the specific flow from these, depending on which one we're calling, and then it's simply going to reference one of the flows that I have in the other files. That's all this file is doing now. I do not have to modify this file at all anymore. All of my logic is in one of these four files.

If I go to, for example, the comments file, I simply took whatever was on the main file and put it here in the flows. This contains all of the flows for each one of the operations.

### Naming convention and reusable subflows

Notice the naming convention I used to name each one of the flows. I put first the name of the file, like `resources-comments`, and then I added a colon, and here I'm putting the name of the flow. This makes it way easier to find.

If I go back to the main file and click on the flow reference, in the flow name it will ask me for the flow. If I didn't have this first part — the `resources-articles` prefix — then I would just see "update one article". It would be harder to find, in my opinion, because when you check the dropdown, it's huge and has all of the flows from all of the projects.

With this naming convention, we have all of the flows from resources-articles grouped together, then resources-categories, resources-comments, and resources-writers at the end. That makes it way easier for me to find the flows I'm looking for. Even though I know which file it is in, when you need to reference them, it's going to ask for the name of the flow without the file. That's why I'm putting the file name here.

Make sure you have loggers. If you have nothing in a flow or subflow, you won't be able to run this application. You cannot have a scope that is empty. I just added a logger to have something there so I would be able to run the Mule application.

Let's go to articles. I created four subflows at the top that have common stuff that I'm calling from this same file over and over again. For example, we had "retrieve articles" in two different flows. If we modified something from the first retrieve, we would have to modify it from the second retrieve as well and make sure we remember to do that. You can never trust your memory. That's why I'm creating a subflow with the component, so I can just call this subflow from wherever I need to reuse these components.

Same naming convention: `resources-articles: retrieve articles in vars`. This name you can just put whatever is descriptive for you. I'm doing the retrieve articles and the store articles in two different subflows.

I also created two transformations that are reused in the rest of the file, so I added them here. One is to get the article ID variable — going to `attributes.uriParams.articleId as Number`. Very important that we are making this as Number, because even though we put number in the RAML, the URI parameter is always going to be a string. If you need to transform this URI param into Date or Boolean or Number, make sure to do that from somewhere in the logic.

The other transformation is filtering the payload by article ID. This is basically taking all of the payload, whatever the request is, and then I'm just doing a filter to match the ID to the URI parameter. First, I'm retrieving all of the articles with the retrieve component we saw before, and then I'm just filtering them to match the ID that I sent in the request. There's a `[0]` at the end because that means it's getting the first item.

### The Mule event: variables, attributes, and payload

Now we get to the logic part. All of the flows have a logger for the start and a logger for the end. That makes it easier for me to understand if there was an error — what flows happened, what flows didn't happen. You can put loggers or not, it's your preference. I just prefer to do that so I can debug this later in the console or in the logs.

Before we continue, let me explain the Mule event. The Mule event is immutable. Every change to an instance of a Mule event results in the creation of a new instance.

This is what is getting transported from one component to the other. The whole Mule event is this box, and inside the Mule event we have on one side **variables** and on the other side the **Mule message**. Inside the Mule message, we have the **attributes** and the **payload**.

When we're retrieving the article ID, we're doing `attributes.uriParams.articleId as Number`. We are accessing the Mule message and getting the attributes. Then we have the payload. When I send a request to this application, the payload is going to contain the JSON that I send in the request, for example. The attributes could be the article ID, for example. The variables I'm going to create them inside Mule, like the article ID variable. If you see here, it says output and then it says `variable articleId`. This means that the variable named `articleId` is being created. You can modify this and you will be able to see: output variable, variable name `articleId`. You can make this an attribute or you can make this the payload. We have attributes, payload, or variables.

### Walking through the CRUD flows

Let's walk through the logic. To **read all articles**, we have the flow reference to retrieve articles. You can right-click on it and select "Go to reference flow" if you don't want to just scroll and find it. It's retrieving all the articles, then it's setting the payload to `vars.articles`, and that's it.

To **read one article**, it starts, then it gets the article ID variable, then it retrieves all of the articles in the variable `articles`. At this point, we have a variable `articleId`, a variable `articles`, and then we are filtering all of this. We have a Transform Message and we are saying: get from the variables `vars.articles` in order, default for now `vars.articles`, then filter and get all of the articles that match the ID that I put there. That's how we are retrieving one article.

To **create one article**, first we are getting the article ID from the payload, because when we create an article, we are not sending any ID. We are not sending a URI parameter with the article ID as we are doing when we have `articles/{articleId}`. When we create an article, we have to get the ID from somewhere. In this case, we are getting it from `payload.id`. Then we retrieve all of the articles, then we append the new article to the articles, then we store the new set of articles, and then we filter the payload by article ID to return that.

To **update one article**, first we are retrieving the article ID, then we're retrieving the articles in the variables, then we are updating the articles by article ID. We have the variable `articles` which contains all of the articles, and then we're doing a map. We're going article by article, kind of like a for-each or a for loop. We're saying: if the ID of this article that I'm checking right now matches the article ID that I received from the attributes, then return the payload. If it doesn't match, then just return the same article — don't do anything else. If it matches the ID, then it will put the request in that place instead of the article that was there. Then we're storing the new articles array, and then we're filtering again by article ID to return that at the end.

To **delete one article**, again we retrieve the article ID, we retrieve the articles, and then we are filtering by not article ID. We're getting `vars.articles`, all of the articles, and then we're filtering by the ID that doesn't match the article ID from the variables. This is where I had trouble with the data type. Since I was filtering the ID that doesn't match the variables article ID, and the variables article ID was a string when the ID was a number, then nothing matched. This just wasn't working. It wasn't removing anything. I needed to make the article ID variable a number, otherwise this just wouldn't work, because the not-equals is comparing the data types as well. Then we store the new articles, and we finish.

### Building a Postman collection

Let's go ahead and build the Postman collection. If you go to postman.com, you can download this from here, whatever matches your operating system. You can create a collection from this side. You can change the theme — I have it on the dark theme. You can also create an account for free, but you don't have to. You can just use this without an account.

I'm going to create a collection, and I'm also going to add this collection to the repo so you can use it if you want. If you don't want to create it from scratch, you can just click here on Import and you can import the file, the folder, the link, the raw text, code repository, and so on.

I have my collection, which is basically a folder. Then I will add a new request. We have first "Articles GET". For now, I'm going to leave `localhost`. We were using `localhost:8082/articles`, and this is a GET, so we're going to leave it like that. Right now I'm not running it, but if you click on Send, you will be able to send a request and receive a response here.

I am using this two-side panel because I work better with that. If you click on View, you will be able to change this — toggle to pane view — like this or like this, if you want to see the request on the top and the response on the bottom. Whatever works best for you. I prefer to use the request on the left and the response on the right.

Let's name this "GET articles". You can also name this more descriptive if you prefer, like "Get all articles".

### Environments in Postman

The other thing I wanted to show you is that we are going to be changing this URL, because right now we are running in localhost:8082, but eventually we will deploy this whole application into CloudHub and we will have to change this URL to the CloudHub environment.

For that, you can go here in Environments and you can create a new environment. One is going to be "local". On variable, let's name this `host`. This is going to be `localhost:8082`, which is what we are using right now.

The other one is "dev". This `host` will eventually change to be something about CloudHub. We don't have this URL yet because we haven't deployed to CloudHub, but we will have it at some point and we can just put it here in the current value.

Now to reference that, we go here and where we had `localhost:8082`, we're going to remove that and add double curly brackets, and inside here we're going to write `host`. Now we have `{{host}}/articles`. Here on the top, we can change the environment. Right now it says "No environment", but if we click on it, since we already saved the dev and local environments, we can just select which one we are in. If I select local, now this is saying that I am running in `localhost:8082`.

I can keep all of the requests for articles right here, and all of the other resources are going to be in their own dedicated folder. This way, I can just come here and run all of these folders and collections. I don't have to do this every time that I need to run it. You can change the environment here from dev to local, and it's the same request and response.

Let's create all of the articles requests. Duplicate. Now this is going to be "POST articles". We change this to POST, and then this is our body. To send this body, we can select here Body, Raw, JSON. This is the body that I'm going to send.

Duplicate. This is "GET articles article ID". We change this to `articles/{articleId}`. Let's say 1, for example. We don't have a body here, so this is done.

Let's duplicate. This is going to be "PUT articles article ID". The body is this JSON. Change the name to "PUT articles article ID". Save.

Let me duplicate. This is going to be "DELETE articles article ID". There's no body, so that's all.

In the future, I'm going to show you how to create tests if you want to create regression testing. It's super fun, I love to do that. But for now, we are good.

For the rest of the resources that you're going to do on homework, if you click on Params, you will be able to add query params. I remember that we had some requests that had query parameters. Here you can add them — just add the key, the query param, and the value. You're going to be able to send that. You also have authentication. In our case, we don't have any authentication. There are headers. Prerequest scripts and tests are to run JavaScript scripts. Prerequest scripts are going to run before you run the request, and the tests are going to run after you run the request to make sure that everything is correct. We're not going to do that now. You're just going to need to use the Params tab for the query parameters, or the Body tab for the body, as we saw in the PUT or the POST.

### Debugging with breakpoints

Let's say that I want to check what happens when I read one article. I'm going to right-click on this part and click on "Add breakpoint". This will add this tiny red spot. Ignore all of those problems — the application runs fine. Sometimes DataWeave sends this stuff. It's annoying, but it goes away sometimes.

I have this red spot right here, and I'm going to run this. When it gets here, it's going to stop so I can check this out one by one. Right-click on the canvas and click on "Debug project". Eventually, it's going to ask me if I want to change perspectives — basically to show the debugging window or to see the console.

The Mule Debug perspective is designed to support application debugging. Do you want to open this perspective now? You can also click here and remember my decision if you wanted to do it automatically. In my case, I don't like when it does it automatically, so I just keep clicking yes or no every time. In this case, I'm going to select yes, and the perspective has changed.

You can see here the console still, so it's still running. It's deployed. Here you will be able to see the canvas. Here you have some things like Evaluate Expression, the Mule Breakpoints, the Mule Palette if you want to continue developing. You can also change the perspectives from up here. Right here, we are in the debug perspective. If you want to go back to the other perspective, we have Mule Design, and here you have API Design as well.

We wanted to read one article. I have this breakpoint here. If I go to Postman, I will open the "GET articles article ID", and I'm going to search for article 1. I'm missing `/api` — I forgot about that. I'm going to add it here to the environment because I don't want to modify it in every single one. So `localhost:8082/api`. I can just modify the current value. Save.

Now this is going to work if I do articles. Okay, it worked. Right now, if I get all of the articles, I have one with ID 2. When I go with the ID 1, I have some testing IDs — ID 3. Yeah, I have some IDs that are repeated because we don't have yet the functionality to stop this from happening. Don't worry about that.

I'm going to get just one article. If I do `articles/1` and send — you notice this is not going to stop running because it's stopped right here. Right now, it's on the first logger, and I can come here and see my Mule message. Remember, we had the Mule message with attributes, payload, and variables. Here you can see attributes, payload, and variables.

You can open the attributes, and then you can see headers and you can see the URI parameters. If you open URI parameters, you will see that we have `articleId`, and the value is `1` because we are sending number 1. If we check the payload, we don't have anything. It's empty because this is a GET. In variables, we have one — album headers — that's fine, we don't need that.

Here on the top right, you have the navigation keys to go through whatever you are developing. If I click here, this is going to move just one space. You saw it moved from the start of the logger to the flow reference article ID. If I click on it again, it's going to go inside the flow reference. Now it's here on the article ID, and it's going to create the article ID variable. If I click on it again, it's going to come out and go back to the flow.

Now if I check the variables, I have `articleId` equals `1`. It went to retrieve articles, and now it's going to retrieve all of the articles, which is going to create another variable. If I click on next — it moved again. Now we have `articleId: 1`, and then `articles`, and this has all of the articles. If you want to see a bigger version of what I'm clicking, you can move this here. Here you have all of the payload that we are seeing, and this is better. You can also see here what is the payload, and this is exactly what I got back from the other call where we got all of the articles.

After that, what I did was use the filter. Remember, I showed you this — it's filtering from all of the articles. It's filtering the ones that match the ID only. Now if I check the payload again, this only contains one article which matches the ID 1. We can click Continue, and this is now done, and now I have my response.

### Using Evaluate Expression and the DataWeave Playground

If I do the same but change this to 3 — remember that I had several articles with the number 3 — I can send this again, and it's going to come here and do the whole thing. Let's stop there. Now we have variables `articleId: 3`, and the `articles` — we have again all of the list of articles that we had before. Then it's gonna do the filtering thing right here. You can see the square — it stopped there. Here's the payload. You can see it's empty. Once I click on it, it's gonna do the filtering and it assigns whatever got back there.

Now you might be wondering, why is there just one if there were three different articles? Because for my use case, I'm assuming that there is just going to be one article with the same ID. I haven't created the logic to prevent that from happening, so I ended up with three. But remember that I told you in the code I added this `[0]` at the end. This means that it's getting just the first one from what it got.

Let me do a test here. If I get all of this code, here we have the Evaluate Expression — Evaluate DataWeave expression. I can put this code here and click on Evaluate. Now it's super small. Here you can see that it's returning the whole thing. Wait, sorry, I forgot to take out the zero. I have the zero here, and I'm just going to remove it. Now we have `filter ID equals vars.articleId`. Let's click on Evaluate again. Now we can see that we have an array of objects. We have the first article here with ID 3, and we scroll down and we have the second article with ID 3, and now the third article with ID 3.

I'm going to show you DataWeave in future content, but I think you need to understand this for the rest of this stuff. Let me go to dataweave.mulesoft.com, the playground. I'm just going to show you this real quick so you can see what is happening.

Here we are assuming that this is the payload that has the three articles — one, two, three. This is the payload. I can copy this whole thing to show you what is happening. Just the filter: `payload filter ID equals` — we don't have a variable here, so I'm just going to put `3`. This is super slow. Why is this super slow? Let me try that again. I don't know why this is not working right now. Sometimes when I'm streaming, I have a lot of issues because of all the bandwidth.

Anyway, here you can evaluate different expressions so you can see what is happening in your code. If you want to see step by step, just click on Next, and we end up just with one because we are extracting the index 0 from the array that we had.

I can also run 2, and it's also going to work because we also had IDs with 2. I'm just going to send it, and then here you can just click on this Resume button and it will just go ahead and continue without you having to go step by step. That's it. We got the ID number 2.

What happens if I send an ID that does not exist? Let me click on Next. I receive a `null`, and that is because once I do the filter, I am setting up first the default — `default []` — and then square brackets. That means if there are no articles, then make this default to an empty array. In this case, there are articles, but then after we do the filter, it ends up being just an empty array because there is no article that matches the ID number 4. First we have the empty array, but then when I do the `[0]`, then I will receive the `null`.

We can actually fix that if I put here on the code, after the zero — because I'm getting a `null` — I can use another default here and just put an empty object, for example. Save this, and this is going to start running again. Now, instead of receiving the `null`, I'm going to receive the curly brackets. This is just some examples so you can kind of understand how DataWeave works and what you are doing in DataWeave.

I am now seeing that I'm not going to have time to do the rest of the implementation, so I hope this works for you. We can just continue the implementation on the next session as well. It started, so we can run this again. Send, and Continue. Now we receive the empty brackets.

### Wrap-up

It's just taking me so much longer than I was expecting because it's just so much content that I want to cover. We're going to do that, but this is a great experiment for me to see what content you all need out there so I can create this content clean and upload it and show it to you step by step in a better version — like three minutes, five minutes, stuff like that.

Thank you so much for joining the session. I will see you next week, July 26th, for session seven, to show you the finished implementation and to show you how to deploy the API to CloudHub. I also think that I should have done a way easier API, like a to-do or something like that, but oh well. It will be for the next content I create.

Thank you all for experimenting this thing with me, and please feel free to show me whatever feedback you have for me. I am happy to help you all. I'll see you next week. Create those Postman collections. Bye!
