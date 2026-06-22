---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, welcome to Part 3 of our Data Cloud and MuleSoft integration series. My name is Alex Martinez, as you know by this point I hope. In this third part we're going to learn how to use our integration — how to actually call it, how to insert, query, and delete stuff from Data Cloud. We'll use Postman for this video, but you can use any other REST client like Thunder Client, cURL, or Advanced REST Client. So let's get to it.

### Prerequisites

Just a few prerequisites. First of all, you're going to need the Postman collection that's in the GitHub repo, so head to the description of the video or to the article and you'll be able to find the link to download the Postman collection. Second of all, make sure that you have downloaded Postman on your local computer, or you can also use the web version of Postman just by creating an account. And the third thing is to make sure that you have the Mule application URL that we got from the previous video. If you don't have it yet, just go back and make sure you get it from CloudHub — you'll be able to see the endpoint or the URL. So make sure you have that. And that is all for the prerequisites.

### Importing the collection and setting up the environment

So once you have that, go into your Postman, make sure you select here the Collections tab and click on "Import". Now you can put here the collection JSON that we got from the prerequisites, and just like that you'll have imported the collection in Postman.

Now let's go ahead and create the environment that we're going to need. Click here on the Environments tab on the left. You could create a global variable like this — just put your value here — but just to follow best practices, let's create a new environment. Go here and click on "Create environment". Let's name this "CloudHub" because we want to remember what this is. The variable name is going to be `host`, and you can paste it in the initial value, but the real one that we'll need is a current value, so make sure you paste your URL right there in current value. And that's it. Now you can save this by clicking here on the Save button, or just selecting Command-S or whatever is in your own operating system.

Now once this is saved, you have to make sure to select the environment from here like this, because if you don't select it you won't be able to see it in your request. So you see here it is pointing to the right URL, but if I move it back to "No environment", then we go back to "unresolved variable", so make sure you select the new environment here. Also notice that all of the paths here already have a slash, so make sure that your value in `host` doesn't end with a slash and just ends with `cloudhub.io`, otherwise you might have some issues with that.

### The schema request

All right, so that is all. Let me minimize this a little bit so we can see the schema one. So the first request that we have is the schema. Here in the Params tab we have the OpenAPI version — right now it's set to 3.0.3, but you can modify this if you want to have a different version.

What this does is, if you go here to Body, we'll be able to see that we have this JSON payload — we have a customer object, and then we have an address object, and inside the address we have a geo object. So we have three levels of objects. And if you're familiar with Data Cloud, you'll know that this is not like... if you use the YAML schema, you cannot do this, you have to have just one object level. So with this request we'll be able to send this JSON schema and it will be transformed into the YAML schema that we'll need for the Ingestion API.

So if I were to call this right now, I would correctly receive the YAML schema that I would use. You can just not use this first part and just use from here on, and this would be your YAML schema to use in Data Cloud in the Ingestion API. So if I go back here to Params and I were to change this — let's just make a random number, 25 — click on "Send", then we would correctly receive here `d25`. So just make sure you modify that to whatever it is that you need.

### The query request

All right, now the second request is the query one. So if I open that, we still have the `host` and then `/api/query`. So here we don't have any parameters, but if I go to the Body part, here is where we'll be sending the query, the SOQL query for your Data Cloud instance. So for example, if I have this, I can just click on "Send" and this will query the results. In my case right now I don't have anything, so this is why I have an empty array.

### The insert request

But we can do some insertions. So if you go to the insert request now, we have some parameters here. So if you check this out, we have the source API name, which is "MuleSoft Ingestion API" in my case — this might be different for you depending on what you created from Part 1 of this series. My object name in this case is going to be "runner profiles", again depending on what you created on Part 1 of the series.

Then if we go here to Body, this is the array of objects of what I'll be inputting into Data Cloud. So these are all random values, we have five objects in total. So let's send that, and we receive a "200 OK" response. So that means that this is working correctly.

So now if we go back to the query, it's going to take a little bit before we actually see the results here — it might take between 2 and 5 minutes perhaps. This is just because we're waiting for Data Cloud. So let's come back whenever this starts returning some results.

And there we have it — all of our items were correctly inserted here. So yay, the insert worked. Now let's get to see... let me just run this again to verify — yes, everything is here, all of the five items are here.

### The delete request

So now let's delete them. If you go here to the delete part: in the request, first we have the same parameters as the other requests, so if we open this a little bit we'll see that we have the same source API and the object name, and we have the "MuleSoft Ingestion API" and "runner profiles", same as the insert.

Now in the Body this is going to be different. We're just going to send pretty much what is your primary key for each of the objects — again this is what you set up in Part 1, so if you're not sure you can go back and check that out. In my case these are my five IDs that I created in the insert. You can also go here to the query — my primary key is `MA_ID`. So for example this is number three.

So from the delete, let's say that I want to delete all of them except number five. So let me just remove number five from here, and let's run this. So once again we receive a "200 OK", so this is working properly, and now we just have to wait one more time and continue sending the query until we start seeing a change here.

And there we have it — now we only have one object here in the results, and this is the ID number five. Let me run this again, and yes, this is what we have. So our delete worked perfectly.

### Wrap-up

And that is all. That is how you use this integration for your Data Cloud stuff. Someone had mentioned to me that the delete was kind of hard, so now you can just come and use this integration whenever you need it. Again, the Anypoint Platform free trial account lasts 30 days, but you can keep creating new accounts anytime that you need. You have all of the articles, you can just follow all of the steps in case you need to redo the whole thing, or if you have your same Data Cloud settings you just have to do it once and then you just have to download the JAR from my GitHub repo and upload it to CloudHub and set up all of the properties, and that's all.

I'll continue improving this application though. For example, I mentioned in the last video and the article that you have to make sure that no one can access the URL that you have, because it contains all of your Salesforce credentials, so that would not be good. So there is another way for you to make sure that that URL is secure, and that is adding basic authentication — for example a username and password that only you have access to. In that way you can just add the security policy from MuleSoft directly and just set up your username and password, so you're the only one that can access the URL. Even if someone else has the same URL as you, they won't be able to access it because they don't have your username and password.

So keep posted for the next videos and articles, make sure to subscribe at ProstDev.com, and make sure you subscribe to the YouTube channel at /prostdev, because we'll continue doing so much more fun stuff, so you don't want to miss it. And also let me know if you want me to add a little bit more features to this — I'll be happy to take a look at that.

Oh, and also another quick quick quick note: because we're using the insert and delete here from the streaming API in Data Cloud, you are bounded to a maximum of 200 records per time. But there is a workaround — you can either modify the code to use the bulk API instead of the streaming API, or keep posted and I'll let you know how to use the aggregator module to make sure that this doesn't have a limit.

All right, that is all for this video. I hope you liked it, and I'll see you on the next video. Bye!
