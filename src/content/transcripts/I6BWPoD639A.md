---
source: 'Edited from the spoken video for readability'
---

### Introduction

Hi everyone, Alex here. This is session number one of our MuleSoft from Start series. If you didn't watch the last video, that's totally okay because we were just planning the outline. We didn't go through any actual content. This video was run live and I have edited it so you can see just the best things that happened, so you don't have to go through the whole hour. I hope you enjoy it.

We didn't go through any practical stuff yet, but I did go through a lot of very useful information for you: an overview of all of the MuleSoft products, an overview of the community, the MuleSoft community, what we are, what we're doing, and also a little bit about training and certification. So if you want to go through this video, you will learn a lot about the overview of the products and what we will start learning in this series of videos.

### Anypoint Platform Overview

If this is your first time coming into MuleSoft, you might be wondering what is the whole thing? Is this just Anypoint Platform which is on the web or do you also have an IDE or what's going on? It can be overwhelming. So I am going to give you an overview of all of the MuleSoft products.

We have Anypoint Platform, which is the one that is on the web. If we go to anypoint.mulesoft.com, as you can see here, you can create a new account. If you don't have an account, sign up. Just fill up your stuff. I'm not a robot. I agree. Accept and create.

Before I create it, I want to mention something that is very useful for a lot of people. It's a trick. You can just keep creating free trial accounts as much as you want. Just use the same email, but use a different username. That's all. I have so many trial accounts. As you can see here, this is my 19th one. I'm just using the same email. The rest of it doesn't really matter. Just use a different username and you can keep creating free trial accounts.

Now that we're here on Anypoint Platform, this is the first product that has a lot of products inside. So this is the product that we can access from a web browser. If I go here, you can see here the menu of all of the different products. There are more products that you cannot see in this list because this is a free trial account. If I were to use an enterprise account, I would be able to show you more products, but I'm not going to do that right now because you're just getting started. So you will have a free trial account just like me.

### Anypoint Platform Products

Here is Code Builder. I'm going to go through that in a little bit. Just know that it is there.

Design Center is one of the most used ones. You can kind of guess what every product does from their name. Design Center helps you to design stuff, APIs, but we will get into that. I'm just going to read through the list for now.

Exchange is kind of an app store that you have here in MuleSoft. So you can download connectors, you can download APIs, examples and so on. It's just like an app store.

We have DataGraph. So if you are familiar with GraphQL, this is our version of GraphQL. You can use GraphQL here on this product, which is DataGraph.

Then inside Management Center, we have different products. Access Management is where we can control all of our users, all of our organizations, permissions, applications and so on. You can go here to manage all of that stuff. Normally just the admin of the account will have access to it. Because we are in a free trial account, we are the admins, so we do have access to it.

API Manager is where you can secure all of your APIs. You can put different security policies. You can also add contracts. You can add SLA tiers and so on. Again, I'm going to go through all of them in more detail, but first I'm going to go through the whole list.

We have Runtime Manager, which is where you run all of your APIs. So all of your APIs will be running here. You can connect them to API Manager to secure them and we will see how I think on the next session.

We have API Governance, which is kind of a new product. In this one we are able to set standards for all of our different APIs.

Then we have Visualizer and Monitoring. Visualizer is where you can see kind of architecture diagrams, where you can see how your applications are connecting to each other. I'm not very into Visualizer and we're not going to see it throughout this series, but it's important that you know that it's there. You can read more about it in the docs.

Monitoring is where you monitor your APIs, like the logs, any spikes on CPU, stuff like that. More technical. And Visualizer is more architecture, kind of an overview.

Finally, Secrets Manager is where you can keep passwords or keys. You can keep keys, you can keep important files, stuff like that.

So that's basically Anypoint Platform. You can know more or less what you can do. Everything is in the cloud here. So this is the first product, Anypoint Platform, which has a series of products, and some of these products even have more products inside. Like Design Center, for example, has different products inside where you can create APIs, you can create a quick Mule flow, you can create Async APIs. So all of those are different products where you can create API fragments, API specifications, you can mock them, and the mocking service is a different thing. But all of this umbrella is Anypoint Platform. Everything that is on the cloud, everything that you can access through your web browser, this is Anypoint Platform. And again, it's located in anypoint.mulesoft.com.

### Anypoint Studio

We also have Anypoint Studio, which is the IDE that you download into your computer in order to actually develop the APIs. So Anypoint Platform is more for management of your APIs, designing your APIs, securing your APIs, monitoring your APIs. But the actual implementation will go in the IDE, which is Anypoint Studio. And in the future, also Code Builder is going to be available.

Anypoint Studio is where you implement your APIs. You can also design APIs here, but I really recommend you to use Design Center instead, just because it's easier. The UI is just way easier to understand. Here in Studio you kind of have to know what you're doing in order to design the API here, whereas Design Center is going to help you and guide you through it. So it's great if you're new to it.

As you can see from the menu here, we can create a Mule project. We can create a Mule project, create an API specification, open a template from Exchange, create a Mule domain, open an example from Exchange, and Java stuff. We can do that. We can also import a project that already exists. So we can open it here or we can get an API specification from Anypoint Platform, put it here, develop our application, and then we can deploy it from here to Anypoint Platform with just one click. So it's great.

### Anypoint Code Builder

The idea is that Code Builder is going to be the next IDE. As you can see, this is in a beta version right now, so it's not very stable. It still has a lot of issues, and we recommend you don't use it for production environments or for your actual work. It's more of a beta version. As of May of 2023, it is used only to play around with it so you can see the new capabilities that are going to be available in the future using Visual Studio Code instead of Eclipse. But I don't think we're going to go through it because it's in a beta version and you're just learning. So we are going to learn using Studio eventually, not today.

That is Anypoint Studio or Studio for short. Anypoint Code Builder I just mentioned. Right now, Code Builder is available only from Anypoint Platform. So if you click on it from here, you're only going to be able to use it from your browser, which is kind of a bummer. But coming soon you will be able to use it in your desktop. As you can see here, Code Builder Desktop, this is not possible yet. But you can use it from the web for now. And in the future, it's going to be available both ways. So you can either use it on the web or you can use it on desktop, which is super cool. But I think until it's available on desktop, I am not really using it a lot because it makes things harder to do. But it's great to play around a little bit, check it out and see how this is going.

### Composer

Then we have Composer. I'm not going to go through it because I don't have access to it, but just so you know, Composer is kind of like, I don't know if you're aware of IFTTT, IFTTT.com, if this then that. Here you can create flows to kind of go through different things, create integrations. For example, you can integrate Alexa, you can integrate your Philips with whatever, you can do different things, you can integrate a lot of stuff, and you don't have to code. This is a great thing. This is low code or no code. This is no code, actually. You don't have to code at all. You can just go and click stuff and create integrations with it.

There's also SAP here that does basically the same thing. You have different products that you can use and this is more or less how it looks like. So you create flows and then you create a workflow that is going to run through different products. You can create integrations like that or automations as well.

In our case, we have Composer, which you can access through Salesforce, through your Salesforce account. It does have to be an enterprise account. So you do have to have a contract with Salesforce or your company. It runs MuleSoft underneath, but on the outside you only see Salesforce and you are able to create flows and do stuff like that.

If you do want to learn more about Composer, you can go to meetups.mulesoft.com, which I'm also going to talk about in a little bit. You can search for Composer and here you will see different events that already happened or there's a group for Composer and RPA. You can go check out the past events. A lot of them have videos, so you can just go through the past ones and see if there's something there. I'm going to go back here to the meetup site in a bit.

### MuleSoft RPA

Then we have RPA. RPA is robotic process automation. MuleSoft RPA is kind of a new product as well. Salesforce bought Service Trace. I don't know if you know about that. Service Trace was an RPA product. So since Salesforce acquired Service Trace, it went through a redesign and now it's MuleSoft RPA. We're not going to go through it because I don't have access to it and because I believe it's only available for a Windows machine right now. So I cannot go through it.

But there are some videos about people doing this. You can also go to twitch.tv/mulesoftcommunity and if you go to videos, if you go to the videos tab here and scroll down, you will get to the Composer and RPA section. And there are four videos here if you want to check out some demos about how Composer or RPA work. I think these two are Composer and these two are RPA. If you want to check out RPA, I would recommend doing this one, which is from people from the training team. That's going to be super useful. So there's that and also you can go to the meetup to see if there's something about RPA there.

### DataWeave

What is DataWeave? DataWeave is a programming language that we have right here in MuleSoft. We use DataWeave for everything that we need. MuleSoft is a low code tool and it's not no code because it does have code and that code is DataWeave.

If you are familiar with functional programming, then you're going to be great with DataWeave. It's the same concepts. They just translate from one programming language to another as long as it's a functional programming language. But if you come from an object-oriented programming or structured programming like me, then it's going to be a little bit harder for you to understand it because it's not just understanding the syntax of the language. It's also changing your mind, having a different mindset to be able to create code in this paradigm. So it is going to take you a while if you have never done functional programming before, but it is not impossible and I am the proof and obviously there are a lot of people that have done this.

Inside DataWeave, there are two different products that you can use to develop in DataWeave besides the ones that we already said in Anypoint Platform and Studio, because DataWeave is also there. We have the extension for Visual Studio Code. So if you go to your Visual Studio Code and look for extensions, you can search for DataWeave and you will get to this. This is also in a beta, but it's pretty good. I use it almost all the time.

There's also a DataWeave Playground. So if you go to dataweave.mulesoft.com here, you can find the links to different stuff from DataWeave. So you can see why DataWeave, what you can do with DataWeave, how it looks like. You can get started learning the fundamentals, executing in any terminal. Oh, I forgot about that. Wait, there's also the DataWeave CLI. So yeah, you can go here, go to the CLI, check it out. You can develop in Visual Studio Code as I told you. You can install the extension here and you can also join our community. So you can check out the questions that we have in Stack Overflow. You can ask any questions in Stack Overflow. You can also join the Slack workspace that we have for DataWeave and you can also raise issues in GitHub. So you can go check that out. Here are more links and that's basically it.

### Community and Ambassadors

Then we have the community overview. What are ambassadors and mentors? Where are the meetups? Where are the help forums? I'm going to go through all of that.

So ambassadors and mentors are our best people in the ecosystem. Let's go to the ambassadors. So you can go check out all of the current ambassadors and you can also get to know them and their channels. If you click on someone's profile picture, you will be able to find here their bio and their links. So if you want to connect with them, you will be able to do that through here.

For example, Edgar. If you go here, you will see that Edgar has a lot of links because he does a lot of things. Here you can find his LinkedIn, Twitter, YouTube, ProstDev, and blog. So if you go to his blog, for example, you will be able to see everything that Edgar writes about and you will be able to find a ton of information from Edgar. Or you can just go through every single person from here, follow them on socials, on their blogs, on their YouTube channels, and a lot of them will have very, very useful content.

Some of them don't focus on creating content like they don't create blogs or videos, but they are super helpful in the forums. So here are the MuleSoft forums. You can ask stuff. All of these people or most of these people that are answering you are people from the community because they love to answer questions and they love to help people. And a lot of these people that are top contributors to the forum are our ambassadors. So not all of the people from the ambassador side are going to be doing blogs or videos. They can also be helping newbies through the forums or through Slack or through different kinds of channels, but they are the ambassadors for some reason. They were chosen because they are top experts on what they do and they really love to help people.

You can apply yourself. So if you want to become a mentor, which is the first step to become an ambassador, you can apply here or you can nominate someone if you think they're very cool and they're helping a lot with the community. You can nominate people. So there are going to be a lot of mentors and fewer ambassadors because ambassadors are the top people. Then we have the mentors, but everyone is so friendly and so good and we all just want to help you succeed. So there are a lot of mentors, a lot of ambassadors. You can also go to LinkedIn and search for MuleSoft ambassador, MuleSoft mentor and you might be able to get the people because a lot of them have that title on their LinkedIn description. So you might be able to find them there as well.

### Forums and Meetups

Finally, the meetups. I already went through the help forums. So let's go through what are the meetups. So again, if you go to meetups.mulesoft.com, you will be able to find this beautiful page where there are a ton of groups to join and meetup nearby where you are. You can scroll down here, search for a city, country, region, or you can explore by region.

A lot of these groups are still doing virtual because when it started, it was pre-pandemic and we were all doing just in-person meetups. But then the pandemic started so everyone was doing virtual meetups and now people sometimes have in-person, sometimes have virtual, sometimes have hybrid. So you can just go here and check them out. There are a lot of them that are online. So these ones never meet in person because they are all over the world. But you can also explore by your region and you can find whatever groups are nearby you.

For example, I'm from Canada. I can select all of the ones that are in Canada and see if they are going to be hosting a virtual meetup. Then I can just join the virtual meetup. Or for example, I am based in Niagara Falls. I can join the New York chapter in the US and I will also be able to attend if they have virtual or maybe in person. Like who knows, maybe I can go. And so on. You can just join whatever groups you want. You just click on it. You get here and as simple as that, you just fill your first name, last name, email, click on join and you will start receiving notifications in your email as soon as upcoming events are posted.

You can also check out the past events. If it says virtual meetup, it will most likely have a video. Maybe not. Yeah, there's a video. So you can also check out all of the recordings. And as I told you at the beginning, you can use this search bar here and just search for a topic or a meetup, a country, a city, whatever, and you will get your results.

### Training and Certification

Now we are only missing training and certification. This is a tricky one. I'm not going to lie. If you go to training.mulesoft.com, you will be able to find different training certifications. So if you go here to courses, you will be able to find a course catalog. A lot of them are free. Anypoint Platform Development Fundamentals. Learn material at your own pace on your schedule. Yeah, you just have to sign up. You don't have to pay, I believe. So yeah, you can go through that training.

For example, if you want to go through a very formal training that goes through all of the things, it's supposed to be 5 days, but assuming that you do like 8 hours a day, so it might take you a little bit more. And that's all right. You can use a free trial account for all of this. Everything will be available for a free trial account. So you can go there and try that.

And then for the certifications, I think once you do that training and also if you follow everything that's on the book plus the training, it is most likely that you will pass your certification. The first certification is the MuleSoft Certified Developer - Level 1. So it's 2 hours. It's virtual. It is two hours, by the way. You may be thinking like maybe I'm not going to take two hours. Yes, it is two hours. It is like 60 questions. So it's like 2 minutes per question. You are going to take that long. So make sure you are prepared for that.

The Level 2, I haven't checked that out, but I believe it is kind of hard. So make sure you go through all of the prerequisites. If you click on each certification it will have, oh yeah, and the certifications are not free. So you will have to pay for that. I don't know if the training is still giving free certification vouchers or not, but you can try to check that out.

### Quick Tour of Design Center, Exchange, and More

Before we finish, going back to Anypoint Platform, let's check out. We're going to go through Design Center on the next session because we are going to start designing an API. So, oh my god, it changed. Anyway, once you are here inside Design Center, you can create a new API specification, which is like the contract that you have between APIs. I will explain that in the next session. You can create a new fragment, a new API, an Async API, or you can also get from an existing source. That's basically what you do with Design Center. I will show more examples in the next session.

If you go to Exchange, as I said, it's kind of like an app store. So here you can filter whatever you want to find. So you can find connectors, DataWeave libraries, examples, policies, API spec fragments, REST APIs, RPA, activity templates, rule sets. This is used for API Governance. So APIs and templates. You can search for all of these. We are also going to be using more of these in I think the third session where we actually implement an API in Studio. But here you can find more stuff, kind of like an app store, and you can also go here and see the documentation. So that's really cool.

Next we have DataGraph. As I said at the beginning, it's kind of like our version of GraphQL. You can start building your unified schema. There are some start guides, some tutorials and some concepts that you can go through. If you haven't used this before, you can also go to YouTube and find some channels to use this. I am not going to go through DataGraph in this series of videos because that's kind of more advanced or more to another topic. This is not on REST APIs, which is what we are going to be doing. So you can go check that out.

Access Management is where we have all of our stuff like all of the admin stuff. I'm going to click on try new features because I like that. So you have the users, you have your teams, you have roles, environments, business groups, identity providers. If you want to add more client providers, connected apps and so on. So you can find here different things but mostly only the admins have access to it.

API Manager, which we are also going to look into it more in our fourth session where we deploy to CloudHub and check out some more stuff. We're going to look more into it there. But here is where you have APIs and you can secure them. For example, here you can have automated policies, client applications, custom policies and this is to secure your APIs.

Then in Runtime Manager is where you are actually running your API. So for example, here in Sandbox, if I were to deploy an application, I can just deploy it here and this will be running in CloudHub and I will be able to connect this API that is running in CloudHub or in Runtime Manager with the API that I create in API Manager so I can secure them and I am going to go through that in the fourth session so we can get more familiar with that.

API Governance. I'm not going to go through it here, but it's super cool because this helps you. Or maybe I can go a little bit through it in the next session depending on the time. You can add some basic stuff like rule sets. Let's do super quick. For example, Anypoint best practices. So with this you can make sure that all of your APIs have all of these standards and that they are running exactly how you want them to run. So this will help. Async API best practices, OpenAPI best practices, required examples and so on. You can select or create any more rule sets that you want to apply and you will be able to see which APIs are compliant and which ones are not. So that's very useful.

Visualizer is where you can see from an architecture perspective, as you can see here. So you can see the architecture view, troubleshooting view and the policies view, for example. I don't have anything running so I have nothing here. But this is basically how it looks like.

Monitoring is where you go and check if it's running properly. If it's not, I don't have any resources running right now, so I'm not going to be able to see them. You can also visit the documentation to learn more.

And the Secrets Manager if you want to create stuff. Let's do test. You can have key stores, trust stores, certificates, shared secrets, TLS context, so on. So that is useful for that. I'm going to remove this and I'm also not going to go through it in this series of videos. But that is your summary of all of the products.

### Wrap-up

So we finished the first session. Yay. All right, we made it. And that's all for this video. We did it. That's all for this video. I hope that is helpful. That is all for the first session. It was mostly theory as you can see, but it will kind of give you an overview of what is MuleSoft and what you can do with the different products or where you can find the different things. Of course, it's not everything, but it's a nice first guide for you to have so you are not that lost while you are navigating this confusing ecosystem.

So on the next session then it's going to be on May, I'm going on vacations, so it's going to be on May 31st. So not this Wednesday, the next Wednesday. And we are going to learn more about designing an API. What is an API? What is API connectivity? How to design an API? We're going to design a restaurant API. Write down the requirements. Design the API spec in Design Center. Test with a mocking service and publish to Exchange.

Remember to go to github.com/alexandramartinez/mulesoft-from-start so you can find the resources that we have been talking about or doing in this series of videos. So the next session, May 31st, 1:30 p.m. Eastern, we will start doing actual stuff. All right. Thank you so much for coming and I really appreciate it. And if you're watching this from YouTube, you rock. Thank you for watching. All right, I will see you then on the next video. Bye.
