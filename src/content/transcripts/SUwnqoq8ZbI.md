---
source: 'Edited from the spoken video for readability'
---

### Introduction and Local Demo

Welcome back! Hopefully we'll have just two more sessions to go after this one, and we'll be done with the MuleSoft from Start collection. We have articles, comments, writers, and categories—all of the GET, POST, PUT, and DELETE methods we've been building.

I spent time working on improvements to the code since last week. I said it wasn't fair to ask you to finish the implementation because there was a lot to do. I finished the categories resource and changed some of the articles resource, so you can check out what I did in the latest commit.

Let me show you what's working now. If I get all of the articles, I currently have id6—that's all, just one article. If I try to get that article (id6), it works and returns a 200 status. But if I try to search for id1, which doesn't exist, it returns a 404 Not Found with the error message: "The ID you're using to retrieve information does not exist. Try a different ID." That's how I decided to set it up.

The same logic applies to PUT—if I try to update id1, it says the ID doesn't exist. For DELETE, if I try to delete an ID that doesn't exist like id1, it just returns no content, which is fine since DELETE doesn't return anything anyway.

### How IDs and 404s Work

Let me delete id6 to show you how the auto-increment works. Now if I retrieve all articles, I have an empty array. I decided not to return a 404 here—I just want to show that there are no articles. You can change this behavior if you want.

Now let's create a new article. Notice that even though I put ID3 in my request, it's not going to use ID3. I want the IDs to be unique and auto-generated, so the flow creates its own ID and ignores whatever you send.

Let me check the categories first. If I get all categories, I already have "exercise" from before. Let me delete it and start fresh. Now if I retrieve categories, it's empty.

Now let's create an article: "The importance of regular exercise" with category "exercise". Notice the ID—I sent ID3, but it created id7 because it's keeping the count going. Now if I retrieve that article, id7 is there. And if I check categories, we now have "exercise".

Let me create another article: "The importance of DataWeave" with category "DataWeave". Now when I get all articles, we have id7 (regular exercise) and id8 (DataWeave). And if I get all categories, we have both "exercise" and "DataWeave".

### Deploying to CloudHub from Studio

Now I want to send this to CloudHub because I see this is a working first draft. I've tested it locally and it makes sense, so now I want to deploy it to dev for other people to test.

The manual way to deploy, which is the easiest when you're just getting started: make sure everything is saved, then right-click on your project and select Anypoint Platform → Deploy to CloudHub.

### Re-authenticating Anypoint Accounts

I'm having an authentication issue. Let me go to Anypoint Studio settings and check my Anypoint Platform authentication. I'm going to remove all my accounts and re-add them. Let me sign in with my credentials and close the settings. Now let me try again: right-click, Anypoint Platform, Deploy to CloudHub. That helped—now it's working.

### Deployment Configuration and Environment Property

The deployment dialog asks where I want to deploy this application called "maxines-blog". I'm going to select CloudHub 2.0 (you could also select CloudHub, but I'm choosing 2.0). I can only select the shared space in US East Ohio, so that's fine.

The application file will be uploaded from this project. I'm leaving the runtime as is and making sure to use Object Store v2 because I am using Object Store. The deployment model can stay as default, and Ingress is empty—that's fine.

Now for properties, there's something important we need to add. I'm going to create the environment property, and the value is going to be "dev" instead of "local". This property is going to override the property we had that said "local". I don't want to protect it because I want to be able to see which environment I'm in, and I don't have any passwords or anything that needs protection at this point.

Let's deploy the application. It's deploying now—we can close the window and see it deploying in the background.

### Getting the Public CloudHub URL

We can already get the public endpoint. You can see it here in Settings, or if you go to the Dashboard you'll also be able to see it in the URL. Either way works—just copy this URL.

### Updating the Postman Dev Environment

Let's go to our Postman environments and update the Dev environment. The current value is that CloudHub URL, then slash API. That's it—that's our new URL. We can save this, and now we'll be able to test it.

Let me change to the Dev environment here. Now this will be connecting to CloudHub instead of localhost. Let me try it—it started, finally! Now we can test from here.

### Testing the Live API

We should have nothing there because we're on dev now. Let me try to get all articles—perfect, empty array. It should appear in the logs. Yes, I can see "starting" and "ending" in the logs.

If we get categories, we have nothing. So let's post an article: "The importance of regular exercise" with category "exercise". Let's send this. It was created with ID1 because this is our very first article in the dev environment.

Now if we try to get the categories, we have "exercise"—perfect!

### Managing Object Store in Runtime Manager

The sweet thing about CloudHub is that we can check the Object Store from Runtime Manager. If we look at Object Store now, we have keys. We have "articles", we have "categories", and we have "next-article-id". We can see the keys but not the actual values stored there.

The really cool thing is that we can delete stuff from here to try it again. Right now we have one article, right? If I check, we have one article with ID1. But if I want to just restart everything, I can remove all of the keys. Delete three keys—yes, I understand, delete.

Now we go back to square one. We have no articles and no categories. If I post an article again, I will have ID1 again because I restarted everything.

For example, if I restart just articles and categories (delete those keys) but don't remove the next-article-id key, then the next ID that gets created will be ID2. If I get articles, I have nothing. If I get categories, I have nothing. But if I post a new article now, the ID is number two because I didn't restart that counter. Now I have ID2 and the category "exercise".

That's the sweet thing about having this on the cloud—I can control the Object Store easily. I'm sure there are ways to control it locally, but they're not as neat as this one.

### Wrap-Up and Next Session

I'm going to remove everything again. That's all for today. I'm sorry I wasn't able to show you API Manager working—I just don't know why it's not running. But for the next session, I will show you what went wrong and how I fixed it.

So I will cover API Manager for the next session, and then we'll do CI/CD with GitHub Actions. Every time you publish something to GitHub, it will automatically create the new deployment.

I hope this was helpful. We did get to do a lot of troubleshooting, and I'll create more posts from everything I learned today. I will see you on the next session on August 2nd for session number eight. Thank you so much for joining, and I'll see you then. Bye!
