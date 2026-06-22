---
source: 'Edited from the spoken video for readability'
---

### Introduction

Hi there, Alex here. Just a quick summary of what you're going to see in this video. This is a pre-recorded live stream and I edited a few things so you don't have to watch the whole thing.

In this video we did the API design or API specification for our API. We finished that, we tested it, we published to Exchange, and we started creating the implementation using APIkit. That is a MuleSoft product that helps us to get all of the API specification and start creating code instead of having to do everything from scratch. MuleSoft does this for you, including error handling and some logging. I hope you enjoy it.

### Reviewing the Homework Solution

The homework was to create the resources for writers, categories, and comments. I added the solution to the repo before this session and here is my whole solution if you want to read it and go through it. I'm going to do a quick summary.

Here are the requirements if you want to see them. First of all, I didn't continue using the visual designer when I started checking all the resources and everything because you kind of have to go—for responses, click on Add, and so on. I kind of just wanted to copy and paste stuff, so I ended up just going to Design Center and creating a new one. I created the Maxine's Blog API. I didn't want to remove the other one just in case we needed to check something from there, but I ended up creating a new one. You can continue using the UI if you feel better with that. This is just my personal preference.

I ended up with this RAML which I think looks easier. Then you can just copy and paste and do different stuff. You can also use traits and other kinds of things.

These are the endpoints I ended up creating: `/articles`, `/articles/{articleId}`, then `/articles/{articleId}/comments` and `/articles/{articleId}/comments/{commentId}`, and finally I created `/writers`, `/writers/{writerId}`, and `/categories`. I didn't create `/categories/{categoryId}` and I'm going to explain why. But this is basically the API specification that I ended up with. You can do whatever you want—there are different ways to design your APIs. It doesn't have to be my way.

### Data Type Changes

Here are the changes I ended up doing. First of all, with the article data type, I changed it—we previously had `writerId` as a number, I changed it to be just `writer`. So here, instead of having `writerId` I actually have the whole writer, so `writerId`, `name`, and `bio`, so everything is going to be there. Same thing with `categoryId`—I actually changed the category to be just a string instead of it being its own data type. So that is why we don't have the category data type here. I ended up just making it a string. So this is kind of going to be like if everything is going to be saved in an array of strings and then each string has to be unique. If there's something different then it's going to become another category, kind of a deal. So it's going to matter the spelling, the lowercase, the uppercase, and so on.

Then the writer data type—I removed `articles`. So here in the writer data type we used to have the article property and I removed it because then I would end up having, since I moved the whole writer thing into the article data type, then I would have like article, writer, article, writer, article, and so on. So I just removed the article from writer. And then if you want to find out what articles a writer has written, then you will have to create a query parameter or something. In my case I'm just not doing that. I think I have the article and in the article we have each writer, not the other way around.

I removed the category data type because I just created a string with it.

The comment data type—I removed `articleId`. So if I go to comment I just have `id`, `content`, and `author`. I don't have the article listed to the comment anymore, but if I go to the article data type then it's going to have different comments. So for example here I have writer, array of comments is an array, and then this is an array of different comments. So all of the comments will be under an article instead of being on its own.

### Extracting Data Types into Files

I created the new API specification. I created a `types/` folder with the data types just because I didn't want to have all of the data types listed in the main RAML. I did this: `types:` and then inside here you can just write the name of the type and link it to the file that has it. In this case everything is under `types/` and then `error.raml`, `comment.raml`, and so on.

To create it you basically just go here, create new folder, create the `types/` folder, and inside the types folder here you can just click on it and create a new file. But when you create a new file, make sure here that you select a data type for this specific case because we will be creating a data type. We are not creating a specification, we are not creating a resource, we are not creating a library—we are creating just one data type. So do that, click on Create, you can change the file name, and you end up with this.

For example here, `comment.raml`—as you can see here, this says data type, it doesn't say specification or resource, it says data type. And now we can just list the properties that we had before. The `id` and example is `1`, the type is going to be `number` and the format is going to be `int`. Then we have the `content`—example "Hey, this was a nice post", type `string`. And then `author`, example "Alex Martinez", type `string`. This is just going to be the name and that's it.

So you do that with all of them. We have `error`, we have `writer`, and we have `article` which has more stuff. And as you can see here, for example in article where we have writer, then in the type we are linking it to the `writer.raml`. Same thing for the comments—we have the comments and then items and we are including the `comment.raml`. This is an array. That is how I decided to create it. You can do whatever you want with that.

### Traits and Nested Resources

Then I created some traits because I noticed that all of the responses will have 400 and 500. So I created a trait called `commonErrorResponses` and these are the two—just 400, 500, and the body is going to be error. That's it. And basically in all of the resources you can just go and say `is: [commonErrorResponses]` and then everything that is going to be here is going to have the same common responses.

I could have also clicked on new file and trait and put it there—that also works. But I had a little bit of trouble doing that for some reason, so I decided to just put it here directly. But you can also just put it in another file if you want to make this even better. You can also create, as you saw, a new file—you can create examples, you can create user documentation. You can create a lot of different things to make this RAML easier to follow.

I thought this was pretty good. We have the `/articles`, we have get, post, and then `/articles/{articleId}`, we have the URI parameters, get, put, delete, and so on. I removed all of the descriptions as well because I just wanted this to be easier to read, but you can also leave all of the descriptions.

If you don't know RAML, I would advise you to learn it first if you want to do something like this, because there are so many different ways to make your RAML easier. So I decided to leave it like this, but it's up to you if you want to just keep extracting pieces of the specification into different files. Because at one point, if you have a huge project, this RAML—if you put everything in this RAML, then this RAML would be like, we have right now 150, 160 lines. So imagine you can end up with 5,000 lines or something like that if this is too complex. So it's better to put everything here in files and folders to make it easier to read the main RAML. But in this case I thought it was not that bad. I can clearly see where the traits are. I decided to extract the types, but other than that I think that looks pretty good for me. Again, you can do whatever you want.

Then the other change that I decided to do on the design was, as I told you, we have `/articles` and inside `/articles/{articleId}` we have `/comments`, because I didn't want to have just `/comments` like a resource for comments. Because all of my—at the end of the day all of my comments are inside the article data type. So what's going to happen here is that I'm going to have to do `/articles` and then `1` for example and then `/comments`, and this is going to return all of my comments because it's first going to extract the article ID and then it's going to send me the comments. Same thing here—if I want to see just one single comment I decided to do `/articles/{articleId}/comments` and then the comment ID. But you can decide to manage this differently if you want.

I think in categories—yeah, in categories I created a query parameter in the get. So if I go to `/categories` I will be able to see all of the categories that have been created, but if I send the query parameter called `categoryName`, type of string, then I will get just the categories that match this category name. So this is a change that I decided to do instead of doing `/categories/{categoryName}`. I'm just doing `/categories` and I can just send a query parameter. So you can do the same with the comments if you wanted to do that—to just do `/articles/{articleId}` and then send the query parameter that is like comments or comment ID or something like that and it will return that. You can also filter it. Normally the query parameters are used to filter things, but you can use it however you want.

You can also send headers if you want. Remember, the only difference between using query parameters and headers is that the query parameter is on the URI—you can visually see the query parameters in the actual URI that you send. And the headers are not visible from the URI. You have to kind of go inside the request or the response to see them.

The only thing that I would advise you is that all of the responses should have at least a 200 response—it can be 201, 202, or whatever, but that starts with 2. That it has a 400 response, whichever you want, just that it's a 400-and-something because it means that there was an error from the client side. In the 500, which is an error from the server side. Those are the only three responses that I would advise you to always have. Outside of that, all of the things that you want to do—you'll notice that I just have post and put but I don't have patch. I just decided to do it that way. I decided not to use patch, but you can also use patch if you want to.

And that's it. All of them have get. The delete I decided to use it only on the singular resources. So I can only delete one article at a time, one comment at a time, one writer at a time, but I cannot delete all of the writers, all of the comments, and so on.

So far this is my design. You can decide to take that or do your own, whatever you prefer. If you want to take mine you will find it in Sessions 3 and then `homework-spec.raml`. The `in-session-spec.raml` is the one that we did during the last live stream. The `homework-spec.raml` is what I just did.

### Testing with the Mocking Service

Go here and click on "Try it". You will be able to send the query parameters if you have any, any headers or anything you want to send. This is just a get—I'm not sending anything, so I can just click on Send and it will return me an example like "200 OK, everything went right" and this is how your response is going to look like.

If I wanted to try for example the categories, let's see categories because we had a query parameter there. If I click on "Try it" I can just not send any query parameters. Oh, I made it required. Well, that's wrong. I should—that shouldn't be required. Hold on. If I check this again, try it, yeah, okay. Now this is not required so I'm not going to send it. Send. Okay, I didn't get anything back for some reason. I should have gotten—well, I got a 200 OK. String. Oh, maybe I don't have any examples. Oh yeah, I don't have any examples. Okay, so I can add an example. We have example here that you can send, but I'm not going to send it. If I click on Send I receive a 200 OK and I receive an array of strings. That's what I wanted, with the different categories that we have. Yeah, I like the design of my API.

I can also try how it's going to look like if I go to comments. Get. Oh, I think I have to have different IDs. Well, it's nice that we're trying it out. So `/articles/{articleId}` is going to be that, and then `/comments`. And let's change this to `commentId` URI parameters, `commentId`. So now, yeah, `/articles/{articleId}/comments/{commentId}`. I'm going to change everything so it matches: `/articles/{articleId}` here and here, and then `/writers/{writerId}` here and here.

Okay, so now `/articles/{articleId}/comments/{commentId}`. If we go to the get, click on "Try it", now we have the different URI parameters. So article ID 1, comment ID 1. Comments. Ah, here is why. Comment, comment, comment, copy pasting, and then comment ID, comment, comment, comment. And that is why it's good to check everything.

So comments, get, try it, article ID 1, send. Now we receive the list of comments. And if I go to comment ID, get, try it, article ID, comment ID, send, and now we receive just one comment. Okay. All right, I'm glad that I checked this before continuing. That would have been awful.

All right, so we have this. It's all good, we tested it, it works.

### Publishing to Exchange

Now we can publish it. So click on Publish. Preparing to publish as a version 1.0.0. API version 1 and let's do stable because we want to be able to use it. If we do development I think we won't be able to use it, so let's do that. Let's leave it in stable. Publish.

All right, so this is done. Close. And then we have it in Exchange. So we can go to Exchange now and see that it's actually there. Yes, Maxine's Blog API. And then if we go to Summary here we will be able to see everything that I just showed you, all of the specification. And then on the Endpoints we can do the same thing that we just did. But this is—I think this is better, like visually speaking. I feel like this is better to see than the one we have in Design Center.

So yeah, you can just check this, everything. You can also use this part here to test it out just as we did before. You can add query parameters if you want. You can click on Send and you will receive the 200 OK and how this response would look like. So you can also try it out there if you want.

And that's it. We have it on Exchange, which means that we can start designing it in Studio.

### Scaffolding the Project in Anypoint Studio (APIkit)

If you're new to the whole thing: mulesoft.com, Studio. You can also do that and you will get to this part and you can just download it—Downloads, Anypoint Studio. So here's the overview, here's the release notes, download and install. Here are also for Windows, Linux, and Mac.

I'm going to do Create a New Mule Project. I think it was Project name. What was the name? Maxine's Blog API. So Maxine and Blog. Maxine's Blog. Maxine's Blog. Okay, I just put it as Maxine's Blog.

And then here we have the—let me zoom in—API implementation. So here you can see that it says "Add an API implementation to your project to automatically set up an APIkit Router and create placeholder flows for each resource method." So that's what we want to do. This basically means based on the API specification that you have, I'm just going to create the basic structure for your project so you don't have to, which is awesome.

So "Scaffold flows from this API specification"—yes, that's what we want. Import a published API, import RAML from local files. So even if you don't put it in Exchange you can also just put it here, or download the RAML from Design Center. So go to Design Center, you download it, and you put it here. No, it puts it there for you, I think. Anyway, we're just going to do Import a Published API because we want to be able to use the one that we have in Exchange because we are assuming that it's done, right?

So we're going to select that: Import a Published API. And then Plus. From Exchange or from Maven. Let's select from Exchange and now we can search for it here. Maxine's Blog. Maxine's Blog API. This is the one that I created. Publisher is Twitch because that's the organization that I created. Click on Add. Now you have it here in Selected Modules and you can now click on Finish.

### Running It Locally

So we have this and now this is the beautiful, beautiful thing. Maxine's Blog API. We have the APIkit Router. This is the beautiful, beautiful thing about MuleSoft: APIkit Router basically gets the request here and then based on the URI or the path that it receives, it automatically sends to the corresponding flow so you don't have to do that. And it already creates—oh, I think I can zoom in here. Yay.

It already creates the flows, the error handling flows for you. So for example, if there's a bad request it's going to automatically send this. You don't even have to create any implementation at all to send the bad request. If there's a bad request it's going to be here. If there's a not found it's going to be here. If there's a method not allowed, not acceptable, unsupported media type, not implemented—they already have the error messages for all of that.

And then here you have the full flows for everything. Here you have the put. Here at the beginning you can see put and then we have `/articles/{articleId}` and this is what you're going to—you can just change this to go to the desired flows. If we go down we have put `/articles/{articleId}/comments/{commentId}` and so on.

Right-click on the canvas here and click on Run Project. This will start running it locally and then you can run it in the terminal or in Postman or whatever you prefer. My case, I'm going to do terminal.

So here's my terminal. If I do `curl localhost:8081` will be able to run this. Okay, this is running now. Let's run `localhost:8081`. Oh, sorry, let's do `/articles`. No, `/v1`. It probably added there. Okay, see here Path—it says `/api/*`. So this is the path that we're going to have to use before sending the requests. So `localhost:8081/api/articles`.

It didn't return anything. I guess it only has a logger or something. Yeah, it just has a logger. It doesn't have anything here, so it did log something. If I click on word wrap right here it will show me everything in different lines. So it did run something here. So if I run it again you will see that a new line is going to be added there. There you go. And if I keep running it, new lines are going to be added because it's logging something.

### Wrap-Up

All right, I hope you like that and I will see you on the next video. Remember to follow me on Twitch or subscribe on YouTube if you're watching the recorded version from YouTube. All right, I'll see you on the next session then. Bye.
