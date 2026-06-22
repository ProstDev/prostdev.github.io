---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, Alex Martinez here, welcome to the second video of the Data Cloud and MuleSoft integration series. In this second video we're going to go through the steps for you to deploy the Mule application into Anypoint Platform, and then we'll get to call this application in the next video.

So for now, it's okay if you come from a Salesforce or a Data Cloud background — you do not need to know MuleSoft. We will not be developing this Mule application here today; you'll just get to see how to download the application, put it in Anypoint Platform, and deploy it so you can get the public URL. You do not need to do anything else about this. So it's okay if you don't know MuleSoft, I'll guide you through all of the necessary steps.

### Prerequisites

Okay, so first of all, you'll need to have an Anypoint Platform account. So if you go to `anypoint.mulesoft.com`, you'll be able to sign up and create a 30-day trial account. It's okay if your trial account expires, because you can create a new one just using a different username — you can even use the same email, just change your username, and you'll be able to create as many free trial accounts as you want.

Next, if you go to the description of the video, there will be a link to the article of this video, and there you'll be able to download this JAR, or to get to the releases page. If you want to find it, you can just go to `github.com/alexandramartinez/datacloud-mulesoft-integration/releases`, and here you'll be able to find the Data Cloud integration Mule JAR. When this video was created and when the article was written, this was on version 1.0, but if there are any new versions from this moment on, I would advise you to use those. I'll make sure to document here in the release notes everything that you'll need, or everything that will change from the other articles or videos in the new version. Anyway, for now, just come here in the assets and download this JAR file because we'll need it later.

Also make sure you go through the whole video — the last video, or the last article, Part 1 — because we'll need four credentials that we created from the last video.

### Deploying the app in Runtime Manager

Inside your Anypoint Platform account, let's go ahead and go to Runtime Manager right here. If this is the first time that you open Runtime Manager, it will ask you to select an environment, either Design or Sandbox — please select Sandbox.

Then once you're here, click on "Deploy application" right here in the middle. Add your application name — in my case it's going to be "Data Cloud integration". Then in the deployment target, just make sure that you have selected CloudHub 2.0. You can also select CloudHub to select CloudHub 1, but that is going to take some more things, so it's okay, just select CloudHub 2.0 (there are more details in the article if you want to change to the other one).

Then on the application file, go here and choose file and click on "Upload file". Here you'll select the JAR file that you downloaded from the releases section on my GitHub repo. Then under the Runtime tab, make sure you have selected the runtime version — in my case I'm going to select "none" so I can select the runtime version 4.4.0, but it's okay if you want to experiment with others (just, at the time that this video was created, I was just using 4.4.0). You can leave all of the rest of the defaults.

### Setting the properties

And then click on "Properties". From the Properties tab, select the Text view, and you can copy and paste this snippet from the article in the description of the video. You'll have pretty much something like this, where you have the Salesforce username, Salesforce password, CDP consumer key, CDP consumer secret. These four credentials are what we got from the previous video or article: the Salesforce username is the username that you use to log into Salesforce, the Salesforce password is the password that you use to log into Salesforce, and the CDP consumer key and secret are the credentials that you generated when you created the Connected App in Salesforce. Now here I added just some random examples so you can see how it should look.

After you add those, go here to the Table view and click on "Protect" next to all of the values. So the first one is going to ask you if you're sure — just click on "Protect value" — and then you can click on the rest so you can protect all of them.

Now after all of that is done, you can click "Deploy application". It will start uploading the application file, as you can see from here, and once this whole bar has finished, then the application will start deploying.

### Waiting for the deployment

Once the JAR file has been uploaded, you'll now see the screen right here, which is the logs. It's okay if you see here a red circle in the Data Cloud integration part, because it's just starting to deploy. If you go to the Settings tab here on the left, you'll be able to see here that this is applying the new configuration, so that's okay, don't worry about it, just give it a few more minutes.

It can take between 2 and 10 minutes, I would say — it's really random, I don't know why. Sometimes it can take like 2 minutes, which is great, but sometimes it has happened that it can take 8 minutes, so just give it a few minutes. You can also view the status here, but it's not going to tell you a lot of information, or you can also check out the logs so you can see that it's actually running things.

All right, so this time it actually took 2 minutes, so that is good, it was not that long, and now we can see the green circle here, so that means that this was deployed properly. Also here in the Settings tab you'll see the application status is "running".

### Getting (and protecting) the public URL

Now what we want to get from here is this public endpoint, so make sure you copy this value and paste it somewhere safe because we'll be using this to call our application in the next video. But very important: do not share this URL publicly like I am doing right now. By the time you see this video this URL will not be available for you, so even if you try to call it, it will not work. But this might not be the case for you, so do not share this URL, because anyone that has this URL will be able to access all of your Data Cloud information — in the sense that you added your credentials into the configuration of this app, so with this URL you can access that directly.

If you want to create a new URL because it was compromised, you can simply delete this application by going here, you can just click on "Delete", and then check this and click on "Delete application". Then you'll have to go through all of the steps that we just did and create a new application with a new name that no one else knows. In this way you'll have a new URL.

Another thing that you can do is that you can stop your application when you're not using it, and then start it again when you want to use it. So for example, now if I would try to get to this URL, I would not be able to use it because this is right now not running, as you can see here. So if I click on "Start", it will start doing everything again. It already has the property saved so I don't have to add any of that information again — I just have to start this application, it will do its thing to deploy, and then it will appear with a green success circle again.

### Wrap-up

And that's all. You deployed your first Mule application — if this was your first or not. As I said, you did not have to develop this application, I already did that for you, you just had to download the JAR and put it here so you can deploy the application directly into CloudHub.

And that is all for this video. We now have our Salesforce credentials that we already put here — we'll be using more of the things that we got from the previous video for Salesforce in the next video, so make sure you go through that one as well. We now have our public endpoint, or our public URL, that we'll be using to call our application in the next video.

And keep posted for the next videos, because I'll be adding so much more stuff to this thing, like for example you can add basic authentication so you don't have to worry about someone having your public endpoint, because you'll have actual credentials to access this endpoint, which is awesome — but that will come later in time. The best part is that all of these are no-code tools, because I already did the work for you, so you don't have to create the Mule application from scratch, you just have to download the JARs.

So remember to follow us on all of our socials at ProstDev.com, subscribe please, and if you go to youtube.com/prostdev, please subscribe there as well. Make sure to put the notifications so you receive everything that we post. You can also send me messages or comment in the video if you have any suggestions, feedback, or just general comments for me. All right, that is all for this video. I'll see you on the next video where we actually call this Mule application. Bye!
