---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hello hello everyone, my name is Alex Martinez, I am ProstDev's founder, and today we are going to learn how to deploy your Mule application using GitHub Actions to CloudHub 2.0. So let's get started.

### Prerequisites

First of all, you'll need an Anypoint Platform account, of course. You can create a free trial account if you go to `anypoint.mulesoft.com` and just sign up for a 30-day trial account. You can keep creating free trial accounts as many times as you want, just make sure that you change your username — you can even use the same email.

The second thing you're going to need is a Mule application that's already on your GitHub repo. In my case I'm just creating a test, so here in "alexandramartinez-test" I have my private repo. It can be private or public, whichever one you prefer, but make sure that you already have a base project created. If you're not sure how to do this, please take a look at other videos that I have on that. Once you have those two things, then we can get started.

### Creating the Connected App

The first thing that we're going to do is to create a Connected App in Anypoint Platform. So if you go here to Access Management, then select Connected Apps from here, and click on "Create app". You can put any name that you want — in my case this is going to be "GitHub Actions". Then select "App acts on its own behalf", so you can create scopes and you can use client credentials.

Then click on "Add Scopes" and you'll add the following scopes: the first one is going to come from Exchange, and you're going to select the Exchange Contributor one. Then if you go to General, which is right underneath, and you scroll down, you'll select View Environment and View Organization. Then if you scroll down, select Runtime Manager and select Create Applications and Delete Applications. Then from there also you're going to select Manage Application Data and Manage Runtime Fabrics. You scroll down a little bit more, you can select Manage Settings and Read Applications. Those are the minimum scopes. If you have any questions about this, I have put the link in the description of the video, or also in the article in ProstDev.com.

So once you have those nine scopes, select "Next", select your business group (in my case it's SF), "Next", select your environment — I am going to be deploying to Sandbox, so that's the one that I'm going to select — and finally you can just review that all the scopes are correct and click on "Add Scopes". So once you have all that you can click on "Save" and you'll have created your first Connected App.

So now you're going to click here to copy the client ID, and click here to copy the client secret. You're going to be needing these two for your GitHub Actions.

### Adding the secrets to GitHub

Now you can add your GitHub secrets directly here in Settings, and then if you scroll down you'll see "Secrets and variables", "Actions", and here you'll be able to add your repository secret. So the first one that we're going to add is the Connected App client ID. This is the client ID, or the ID, that you copied from Anypoint Platform, so let's paste that right there and click on "Add secret".

Now you can continue to do the same but for the Connected App client secret. Or, if you go to your VS Code and you open your GitHub Actions extension — this is one of the ones that I really like to use because of the secrets — if you click here on "Secrets" > "Repository secrets" you'll see that we already have the Connected App client ID, and if you click on the plus you'll be able to add the new secret and then add the actual secret value. In my case it looks like this, so you can press enter and you'll have both secrets right here. You can also double check that it was created on GitHub — you just refresh the page and you'll see both of them.

### Modifying the pom.xml — group ID and version

Once you have those, we can get started on the changes to your Mule application. As you can see, I have a very basic application — it's just an HTTP listener that's setting up a payload and then is outputting the logger, and that's pretty much it. So I can close this.

The first thing that we're going to modify is the pom.xml. So you can open that up. The first thing we need to do is to modify the group ID to match our organization ID. So if we go back here to Access Management, you can click on Business Groups, select your business group, and here you'll be able to see your business group ID, which is your organization ID. So copy that and put it here in the group ID — make sure that this matches your organization ID.

The next thing we're going to modify is the version. So if you have here the `-SNAPSHOT`, make sure to remove that, so it only says `1.0.0` or whichever version you may have, but just remove the snapshot.

### Modifying the pom.xml — Mule Maven plugin

Next, if you take a look here at the properties, we have the Mule Maven plugin version — in my case it's 3.3.5, so I want to use 4.1.1. Actually, the minimum version that you should use is 4.1.0. The next thing we're going to modify is the configuration for the Mule Maven plugin, so go ahead and go to the article in the description of the video so you can copy and paste the thing that I'm going to put here.

So I recopied it, and then if I paste it I'll be able to see this. We have the artifact ID, which is `mule-maven-plugin`, the same as we had before, and it's going to be using the property that we had at the top, which is 4.1.1 in my case (if there's a more recent version I would advise you to use that, just make sure that it works). And then the configuration: we have the classifier `mule-application`, the URI is `anypoint.mulesoft.com`, the provider always has to be MC if you're using a CloudHub 2.0 environment, in my case it's going to be Sandbox (you can change this to match whatever environment you're using). The target in this case is going to be `cloudhub-us-east-2` because that is the one that I have in my free trial account.

So how do I know that? If I go here to Runtime Manager and I click on "Deploy application", you'll see here that if I select CloudHub 2.0, there's only one shared space that I have available, which is "US East (Ohio)". So then how would I know that this is US East 1 or US East 2? If you go to the link in the description of the video or in the article, you'll find this link to the regions and DNS records for CloudHub 2.0. So for example in my case I had US East (Ohio), which is right here, and if I take a look at the target ID I can see that it's `cloudhub-us-2`, but I don't need the target ID, I need the target name. So if you take a look at this you'll see that there are some capital letters that are different, so you really have to pay attention to that. In my case this is my target name, so it's `Cloudhub-US-East-2` with capital C, US, and E right after that.

### Modifying the pom.xml — server, app name, and replicas

Then I have the server, which is in my case "Repository". You can put any name that you want here, any name at all, just make sure that it matches some other configurations that I'm going to show you in a moment. This server is going to be able to do the actual authentication to Anypoint Platform for us. In the previous videos that you've seen from this series, we have done Anypoint Platform username and password, and we have also done Connected Apps directly here in the pom — instead of having the server here, we used to have the client ID and client secret directly here in the pom. In this case we are going to be using the server, so we don't have to add the credentials directly to the pom — we're going to add them in the `settings.xml` in the Maven settings.

Next we have the application name. In my case I am just going to be extracting the artifact ID from this project, so if I scroll up it's `project` > `artifactId`. So this is the application name that I'll be using. Then we have the release channel — in my case I'm selecting "none" because I want this to be deployed to Mule runtime 4.4.0. If you want this to be on 4.6.0 or up, then you can select here instead of "none" you can put "LTS" or "Edge", whichever one you prefer. Finally I have just one replica with 0.1 vCore, and this is going to generate the default public URL for me.

That is all the settings that I have. If you have any questions, please go to the docs of MuleSoft so you can see all of the different options that you can set up here.

### Modifying the pom.xml — repositories

Now let's scroll down a little bit more until you reach here the repository. This has to be version 3 of Exchange, so make sure you change this to version 3 and version 3, and that is all that you have to do. If you already have Anypoint Exchange version 3 here, then you can just leave it like that.

Now in this same space, inside `repositories`, let's add a new repository. Again, go to the description of the video for the article and you'll be able to see this. This ID is "Repository" — this is the same ID that we had at the top in the configurations, make sure they match — whatever ID you want to put, make sure that it's the same one. And then the name is "Private Exchange repository", and this is the URL. This URL is extracting your group ID from the top, so if I go and scroll up we have `project` and then we have the group ID right here, so this matches your organization ID. You can also just copy and paste it and put it here instead of that, but I thought it was just easier to reference it.

And finally, keep scrolling down, you'll pass the plugin repositories, the dependencies (maybe you have more dependencies here depending on your project), and then just after that, still inside `project`, make sure to add the distribution management with a repository with the same ID as before — in this case "Repository" — and then the URL again will have your organization ID. In my case I'm again just referencing the group ID that I have at the top.

All right, that is all for this file. Make sure you save this so you have all of the latest changes.

### Creating the settings.xml

And then let's create the `settings.xml`. What we've done in the previous videos or articles is that in the root folder we create a new folder called `.maven`, and inside that we create a new file called `settings.xml`, and this is the one that we're going to be referencing from our GitHub Actions.

So once again, copy and paste the file that we have in the article, and you'll end up with something like this. We have the server ID, which matches the server IDs that we've had three times referenced in the pom.xml, and then the username has to be exactly this, which is `~~~Client~~~` so MuleSoft knows that you're using client ID and client secret from a Connected App. And finally the password is going to be this. So if you want to actually paste your credentials here, it would look something like this, but I really encourage you not to put your credentials in the repo, because then anyone is going to have access to them. So in our case we are just setting up the property reference of client ID and client secret, and then we're going to be passing this down from our GitHub Actions.

All right, so that is all for this. Make sure you save this. If you have MUnits or something else, just make sure that you have your Nexus credentials here as well, with a different repository ID and so on. In this case, because it's just a basic case, you can just set this up like this.

### Creating the GitHub Actions workflow

Now after that, let's go ahead and create the actual GitHub Actions workflow. So you have to create a new folder called `.github`, and then inside that create a new folder called `workflows`, and then inside it let's create a new file that's called `build.yaml`. And here again, we're going to copy and paste what we have in the article, and this is what we pasted.

So this workflow is named "publish to Exchange and deploy to CloudHub 2.0". This is going to run every time that there's a push on the main branch, and there's only just one job. If you've seen some of the previous videos/articles, I normally have two or three jobs, but in this case I thought I'd keep it simple — it's just one job that's going to build, so check out this repo, cache dependencies, set up JDK (these are the same steps that we have in the past), and these two are the new steps. So the first one is to publish everything to Exchange, and the second one is to actually deploy the Mule application to CloudHub 2.0. And you'll notice that there's something different between these two: everything is exactly the same except for this flag right here that says `-DmuleDeploy` — this means that this is actually going to deploy and not just publish to Exchange. So those are the two different things.

As you can see here, in this case I am just skipping the MUnit tests because I have nothing about that, and I also would have to set up my Nexus credentials, which I am not doing right now. And as you can see from here, we are setting up the client ID and client secret that will be read from this `settings.xml` file, and these are coming from the secrets that we set up earlier — the Connected App client ID and client secret. We can also check them out again if we use the GitHub Actions extension, so we can just make this bigger, and as you can see these match — these are the repository secrets. We can refresh; we have the Connected App client ID and the Connected App client secret. You cannot see these anymore, you can only modify them, so this is very secure.

### Recap of all the changes

All right, so that's pretty much it. You can save this file and now you have all of the different changes. So let's just review all of the changes that we did. In the pom.xml we have a new group ID that matches the organization ID from your Anypoint Platform account, we modified the version to not have the snapshot, we modified the Mule Maven plugin to be 4.1.1 at least, we added more configuration to have the CloudHub 2.0 deployment with all of the necessary information like environment, the server, the target, and so on. After that we changed the Anypoint Exchange to version 3, we added the new repository with the same ID as the server, and the distribution management with the same ID. Then in the `build.yaml` we created the whole workflow from scratch, and in the `settings.xml` we added the server to connect the client ID and client secret to whatever we need to authenticate to Anypoint Platform. That was a lot of "twos".

### Running the pipeline

All right, so let's go ahead and add all of these changes, commit them — "testing my first workflow run" — so let's commit this and sync changes. This is going to push my branch to the main branch.

If we go back to the GitHub repo and we click here on Actions, you'll be able to see that this workflow is already running. You can click on "build" and you'll be able to see what's happening. The first thing is that it's trying to publish everything to Exchange, and after a while you'll be able to see "publication status completed", so that means that this was deployed to Exchange correctly. And now if we scroll down, we'll be able to see "deploy to CloudHub 2.0", so this will start actually deploying everything to Runtime Manager, and if we scroll down we'll be able to see here "deploying artifacts", "starting deployment", "deploying", and "checking if the application has started".

So if we go here to Runtime Manager we're able to see the application is being deployed correctly. If you open it you'll be able to see here the target name, which is `Cloudhub-US-East-2`, the version which is one, the application file, and the runtime version which is 4.4.0 — this is the release channel, so you can also change this to Edge or LTS (long-term support).

Another thing that I want to mention is that if you have a change that you want to send to the application, you always have to change the version in the pom.xml, otherwise it's going to tell you that the version is already published in Exchange and it won't be able to deploy it. So you have to continue — if you're doing just minor adjustments you can do `1.0.1`, `1.0.2`, `1.0.3` and so on, or you can also change the version as `1.1.0`, `1.2.0` and so on, or you can also change it as `2.0.0`, `3.0.0` and so on, depending on the changes that you're doing for each new version.

### Wrap-up

And that is all. Congratulations, you have deployed your Mule application to CloudHub 2.0 correctly using GitHub Actions. So that is all for this video. Let me know if you want me to do anything else. Remember that if you want to change something in MUnits, if you want to do secure properties or something similar, you can just go ahead and watch the previous videos. Let me know if you're having issues with the CloudHub 2.0 deployment — I'll be happy to create more articles and videos for you all if I'm missing something that I didn't explain before.

So thank you so much for watching. Please subscribe to all of my channels and everything, and I'll see you in the next video. Bye!
