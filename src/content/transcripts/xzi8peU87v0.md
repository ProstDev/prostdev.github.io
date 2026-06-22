---
source: 'Edited from the spoken video for readability'
---

### Intro

Hi everyone, my name is Alex Martinez. I am ProstDev's founder and current Developer Advocate at MuleSoft. This part right here is a recorded message for you, but the rest of the video is going to be what I livestreamed previously. There will be some additions here and there, there will be cuts and then you will be in another place, but don't worry about it. I hope it still makes sense on the video.

If you want to join me on my live sessions, you can go to twitch.tv/devalexmartinez. Or if you just want to keep watching the recorded videos, you can just go to youtube.com/prostdev and see them there. Please subscribe. All right, enjoy the rest of the livestream.

### Why I'm basing this on the book

I thought since I did write this book, then maybe we can kind of take this outline, this beautiful outline that we worked so hard to do. It's written by Ariel, Akshata, and myself. So I am going to base whatever I'm going to do on this series of streams on whatever the outline is for this book.

I am not going to go through everything in the book. If you want to have more of a formal education, I would recommend you to go to the book, because I will not go into details of what's in the book. I am going to kind of just focus on a practical perspective, just going in and doing the things and figuring it out.

I'm going to edit all of the recordings of the videos and put them in YouTube so you can see the clean version of whatever I did on the livestream. Because if you have been watching my livestreams so far, you will see that I'm never prepared. So I am going to edit them this time so you can have a clean version on YouTube of everything that I did.

But if you join from Twitch, you will be able to talk to me in the chat, send me your questions, give me any suggestions of what you want me to do. So I would recommend you to join the livestreams on Twitch. And if you cannot make it because of the schedule or whatever, then you can just go to ProstDev's YouTube channel and you will be able to find there all of the cleaned recordings. Also, if you don't want to watch the whole livestream with me and you just want to watch the edited recording, that's also okay.

### About the book

I don't know if any of you are familiar with the book or not. You can find it on Amazon: "MuleSoft for Salesforce Developers." It's not only for Salesforce developers. I also have it in my background right there. It's not only for Salesforce developers, it's for anyone that wants to learn MuleSoft.

You can just go ahead. It does have at the end some of the final chapters with some specifics about Salesforce, but you don't have to go through that. You can just go through all of the other chapters and you will still learn MuleSoft from the beginning. So that's why I'm going to be basing on that outline.

In this first session, I guess I'm going to kind of break down what we are going to do in the next sessions so we can kind of have an idea of what is going to happen. I can check the outline of the book and I can have something planned way better because you all deserve that, because you all are amazing.

### Setting up the GitHub repo

I am going to create a new GitHub repo so I can keep all of the things that I will be doing here and you can just go reference the repo whenever you have questions or whenever you want to check something, you can just go there. So let me create a new one.

Sweet, everything is set. In case you don't know about this IDE, whenever you are in your repo on GitHub (let me go back to my repo) — so I am in my repo github.com/alexandramartinez/mulesoft-from-start — whenever you're here and you are signed in and this is your repo, you can press on the dot on the keyboard, literally just a dot. Press on that and this will open the web editor for GitHub. So this is Visual Studio Code in an IDE version and you will be able to edit everything from there.

Or you can simply use the same URL as we had before, just changing github.com by github.dev. As you can see here, github.com, github.dev. This only happens if this is your repo and you have access to modify it. Otherwise, I don't think it's going to work.

### Planning Session 1: MuleSoft products and community

Okay, so let's put the book over here. "MuleSoft for Salesforce Developers." Let's go to the outline. All right, so this is the outline from the book. Again, I'm not going to follow through everything that is on the book. I am just going to take this as an example to have kind of a structure of what we are going to review on these sessions.

I don't think I'm going to do the introduction. I'm just kind of going to explain all of this on the go. But I do want to explain the different MuleSoft products. I'm not going to name this exactly. Let's just say "Listing MuleSoft products." And I'm not going to go through all of them. I am just going to give you kind of a list so you know what are different products, you can understand. Because if you are new to MuleSoft, these will be confusing.

At the beginning, I also want to go through something that's at the end, because I don't want to leave it until the end. I want you to be able to know that beforehand. Where is it? Here. So the MuleSoft certifications, the MuleSoft training. I may not go through the MuleSoft training just yet, but I will go through the community stuff so you know how you can expand your knowledge.

So community overview: this includes ambassadors and mentors — what are those? Meetups, help forums, ambassador forums. Yeah, that's basically it. And I may go through some trainings and certifications. Let's leave it like that.

### Planning Session 2: API layer connectivity and designing your API

I guess I can kind of explain APIs, or well, you know what, I'm going to let you decide. You have one week to tell me if you want me to go through what are APIs, or if you think that's kind of understandable. Or maybe I can just go and explain it when I'm actually doing stuff and not just doing theory. Let me know if you are live, comment on the chat. If you're watching the recording, leave a comment in the video before I go through this next session next week.

I guess I can explain API layer connectivity because that is kind of important. I guess. Yeah, API layer connectivity. So you can let me know before May 17, 2023. All right, I guess that's good enough for a first session.

And I'm also going to be updating the outline in case this keeps changing. This is just to give us an idea, you and me, of what we are going to be going through when we are doing this. All right, then designing your API. So basically yes, that's everything that I'm going to do on the second session: designing your API.

I was thinking of an example of kind of like a restaurant, because it goes with the analogy of what is an API. So maybe we can create an API of like, imagining that we have this restaurant, we have the clients, we have the waiters, we have the cooks. And so a client comes and then asks for the menu and then gets the menu. Yeah, that sounds like something interesting.

Design an API: restaurant. And we are going to start from creating the idea of what the API is going to do, like shaping it, and then actually creating it in a MuleSoft product. So that's what we're going to do. So I think: write down requirements, design the API spec in Design Center, test with the mocking service, publish to Exchange.

I don't think I'm going to go through all of this. I'm not going to explain the difference between SOAP and REST, for example. I'm going to be very practical. I'm not going to be super theoretical. So again, if you want theory, it's better if you go to the books.

And also another thing that I wanted to tell you: if you just want to get started and do some stuff, let me search for MuleSoft Tech Zone. So if you go to MuleSoft Tech Zone, you will be able to find Shravan's videos and stuff. Shravan has already some playlists: Mule 4 tutorials for beginners, MuleSoft for beginners. There are 13 videos right now and he is currently doing more videos. So if you just want to get it over with, just go with Shravan and see whatever he created on these videos. I'm sure it will be super helpful. It has a ton of views. For example, the session one has 369K views from two years ago. So that's a lot of views. So you can just do that if you want, if you don't want to wait. Again, just giving you some more options.

All right, so query parameters. Yeah, I'm not going to go through the theory of that. I'm just going to show you how to do it practically. API design, naming conventions. Yeah, I'm kind of going to tell you all of the tips and tricks and all of the best practices while I'm going through the things. I'm not going to tell you, "okay, these are the best practices blah blah blah." I'm just going to be like, "yeah, we're going to create this API specification, we're going to do this, we're going to do that, and oh by the way, this is how you name the things," stuff like that.

I'm not going to go through the specifics of OpenAPI spec in RAML because I'm going to be using the visual designer. So if you want to go deeper in that, I suggest you check other videos. Getting started with API design, or maybe I will. I don't know, I'm just talking out loud here, thinking out loud. API design, yeah, we're going to do that. All right, and then once we have our API spec published, yeah, publish to Exchange.

### Planning Session 3: Implementing in Anypoint Studio

I'm going to go now to Anypoint Studio: implement an API. So there is, you're supposed to first design your API and then implement it, but you can kind of just create an integration or implement your API directly without actually having to design it. So I'm going to show you different routes on how you can do that. Let's just hope that it works because the demos sometimes don't work in the livestreams for some reason.

I'm not going to go through downloading and installing, but I'm going to show you some videos that you can — I'm going to kind of prepare before I come to the livestream. I'm not going to be just like, "here it is," but I'm not going to prepare the technical things. I'm just going to prepare what I'm going to go through so I can give you videos and stuff. Because I'm definitely not going to go through all of these: building, running, testing. Testing, well, testing locally, I guess. Implement an API. Yeah, we're not going to do a unit test here. We're just going to test that it works locally, like manually test it. Updating the thing in Anypoint Studio. Nice, I didn't write this chapter, by the way.

Yes, okay, we're going to go through Studio, kind of give a perspective of everything that is there in Studio so you can understand what that is, how does that IDE work in Studio. And I can also give you a brief maybe summary of Anypoint Code Builder because it's in beta. It's still in beta. A lot of people don't like it because it doesn't work yet. Well, yes, it's in beta version. It's not the final version yet.

I'm going to say that a lot because you need to understand that: yes, a lot of things don't work. Yes, a lot of things are broken. There are a lot of bugs. It's a beta version. It's expected. So just leaving it out there.

All right, the core components. I'm kind of going to go through them here in Studio: core components. But again, just a summary of what they are. I'm not going to go through all of them practically. I'm just going to show you the ones that I'm going to need and I can quickly tell you what the other ones are for. So if you want a deep introduction in all of the components, then you can just see the book or see other articles, other videos from other people. I'm sure there's a lot of stuff out there. And if there's not, feel free to tell me.

And as you can see here, Chapter 4 goes through it all. It goes through components like the logger, set transaction ID, endpoints, error handling, flow control, scopes, transformers, etc.

### Planning Session 4: Anypoint Platform, Runtime Manager, API Manager

And then Anypoint Platform. Well, I'm kind of going to show you Anypoint Platform in the first session: MuleSoft products. Anypoint Platform, Anypoint Studio, Anypoint Code Builder (beta). I can kind of tell you about Composer, but I'm not going to go through it because I don't have access. And MuleSoft RPA, I guess I can also show you about DataWeave, and this includes extension for VS Code, Playground. Yeah, that's it.

Okay, core components: brief summary. And API. So I'm going to talk about Exchange here because we're going to publish to Exchange. I'm also going to go through Design Center there in this session because we are going to design an API there.

Runtime Manager. Yeah, we're going to do Runtime Manager, API Manager, and the rest on this session — no, on the next session, fourth session. And this outline can change. It's not written in stone. So if for some reason I decide to go longer on a session because there's a lot of information, then we can just move something from that into the next one and so on. I can also answer any questions that you may have for me online or live when we're live.

So we're going to go through Runtime Manager, API Manager. And you know what, let's also do CI/CD here because I'm going to show you how to deploy. This is deploy API to CloudHub. I'm going to show you how to deploy this manually in different ways, but I also want to show you how to deploy using continuous integration, CI/CD pipelines. So we're going to do CI/CD with GitHub Actions because I've been doing a lot of content with GitHub Actions lately, so I'm kind of aware of what happens here. So we can set this up in that way we don't have to keep deploying the API manually every single time. So there's that.

I guess if I do this, I will have to talk about Maven and secure properties, secured encrypted properties. I don't know if I'm going to have — again, because I'm going to follow all of those practices as much as I can — I don't know if I'm going to have specific things like username and password or stuff like that. So if I do, I will have to encrypt them and I will show you how. But if I don't, I'm not going to go through that. I'm going to try to go through it because there are a lot of things there.

Access management, Visualizer, monitoring. I'm not going to go through those. Access management, I can kind of show you really quick what it is, but no. Access management is going to be here on Anypoint Platform. All right.

### Planning Session 5 (maybe): DataWeave deep dive

All right, then we have the deep dive. There are two chapters for DataWeave because there's a ton of things to do with DataWeave. But I'm not sure if I'm going to go through all of that. I guess I'm kind of going to go through some DataWeave stuff while I'm implementing the API. Oh boy, we'll see. We'll see if this is going to be our fifth session. Well, you know what, yeah, let's do a DataWeave: just DataWeave. We'll see what we can do. I'm going to try to start from the beginning, assuming you don't know anything about functional programming or stuff like that, so we can all be on the same page.

### Planning Session 6: Testing and deployment

Building your Mule application, deploying, securing. Well, I'm kind of going to go through that in the other ones because I'm not going so deep. I don't need to do a ton of that.

Okay, sixth session. Now let's do a unit test: M unit manually and M unit CI/CD. I can also do Postman so we can kind of see, yeah, we can maybe create some tests from Postman as well. What was the other tool? Was it BAT? Yeah, it was BAT: functional monitoring with the BAT CLI. That would be interesting, but I don't know exactly how to use it yet. Like I went through some stuff in the playground, but I haven't used the CLI. I can kind of mention it, but I don't think I'm going to go through it. Okay, mention BAT CLI. All right.

I also haven't used API Test Recorder. Maybe we can kind of try it out a little bit in M unit. And then we have Salesforce integrations, which I'm not going to go through. Connectors and use cases — yeah, also not. I'm just going to show you how to do a simple API from the beginning, like from not knowing anything about MuleSoft. I'm going to show you how to do that, but I'm not going to go through the advanced stuff. I don't think so.

You can buy the book and go through all of them, or you can check out, for example, Shravan's videos. I think Shravan is also doing the beginner stuff only and he's creating the advanced videos just now, but he hasn't uploaded them yet. Best practices, and then we already did all of this.

Okay, I don't think these are going to be six sessions only. I think we're going to start checking that we're doing more and more and more stuff. But we'll see. We'll see if we can keep following the outline or if we get stuck.

### Recap and feedback

Let's take a pause and let's just digest what I just said. You can let me know if this is not what you were expecting, if you want me to do something else. Who knows, maybe we do only six sessions and maybe I have more time to do more stuff. But remember, each session is going to be just an hour per week, so it's going to be very little information but throughout six weeks. So that's going to be good. I'm going to tell you why in a moment.

### Why spaced repetition learning works

There's this thing called spaced repetition learning, where basically, instead of — for example, you have the "MuleSoft for Salesforce Developers" book — instead of going through the whole book in one day or in one week, you can create spaced repetitions of what you are learning. In that way, it will kind of stick more in your head.

I really like this topic about learning and how your brain works, how the chemicals work, how the neurons work. I don't know the super deep scientific things, but I like to learn about that because it's, for me, super interesting to understand how we as humans learn different things and how we have, for example, different methods of learning.

I am a very visual learner. Like you just saw that I had to break down everything into bullets because that gives me a sense of groups and I can see the different groups and what we are going to do. I cannot read a whole paragraph and understand it. I just can't. I have to practice it or I have to make a diagram or I have to see it in a different way, because I'm very visual.

There are other people that are very auditory and they like to hear the things. So maybe they put a video and they just hear, or maybe a podcast and they're just hearing things, and that's how they absorb information. I do not work like that. I cannot sit through a whole podcast episode. I try. I can do it sometimes, but I get distracted very easily. My mind just wanders around because if I'm not watching something, because I'm visual, I cannot understand it. I cannot digest it that easily.

This all came from a book that I read about how we learn, which is super, super good. And it basically explains different perspectives on how we learn. It explains the scientific perspective, like the neurons, serotonin, blah blah blah. It explains the practical perspective, like creating different schedules to learn, going for a run, going for a walk, etc. etc. And there's also the teaching perspective. So if you're a teacher, how should you teach your students so they can retain as much information as they can? It's focused on teachers for kids, like in elementary schools or stuff like that, but it still applies. I mean, we all learn. Maybe we learn differently, but we all learn.

The only difference between kids and adults is that supposedly — I'm not 100% sure — adults have a better attention span than kids. I have seen very distractible adults in my life, so I'm not sure if that's true. But that's the only difference. Everything else works the same.

And basically, how you learn is based on neural networks, right? So you have different neurons that are connected and they emit signals, let's say. And if that link is connected a lot of times, then the information that is passing through that link is going to stick with you.

So what happens in spaced repetition? Going back to the beginning of my point: in spaced repetition, you are learning different things on different days, but it's spaced. So for example, we're going to be doing this one hour every single Wednesday. One hour is great because our attention span is going to be around an hour, less than an hour, maybe 20 minutes. So I'm going to do the livestream in an hour, and then the edited version is going to be less than an hour. So for people that are watching the recording, it's going to be great because I can just watch the digested version of whatever happens here.

And if you do that every Wednesday for six weeks, seven weeks, eight weeks, that is going to help you to retain the information not faster but stronger. Because you are not — for example, if you go through the whole book in a week and then you never touch that information again in your brain until a month after that or something like that, you're going to forget whatever you did because you acquired the information so quickly that you didn't have time for your brain to actually create the links or actually absorb all of the information to pass it from your prefrontal cortex to the neocortex or something like that. You have to pass it to where your long-term memory is and not just your temporal memory. Or you have to pass it from the RAM to the CPU, if you want to look at it in a different way.

So if you keep doing this repeatedly but with spaced amounts of time, then you will be able to keep forming the links. Because you form the first link and it's weak and it's going to start fading, but then you form it again and it's going to start fading, but then you form it again, and so on. So every time that you keep forming it, it's going to be stronger and it's going to be there more time.

Like you know that saying that once you know how to ride a bike, you never forget how to do it? You can just pick up and do it. That's supposed to be because you did it so many times for a long amount of time. If you do know how to ride a bike — if you don't, that's totally okay — you did it for so long that those links just stayed in your brain forever. So even if it's been 10 years, 20 years without using a bike, once you take it, it only takes you maybe half an hour, maybe less, to pick it up and go at it again, because your links are so strong in your brain that you already know how to do it. So you can just pick it up and do it.

So that's what happens with spaced repetition. I'm not going to tell you that once you know MuleSoft you're going to know it forever, but it's going to help you definitely to have the spaced repetition to be able to learn those things separately to form stronger neural links.

That's all I wanted to say about that. I'm really passionate about that topic, about learning and learning how to learn. It's, I really, really like it.

### Wrap-up

That's all for this livestream then. Thank you so much for coming. I will see you on May 17, next week. Please, you have seven days to let me know if there is something that you want me to change from the outline, or if you just have suggestions, ideas, or comments for me. I am happy to take them into account.

I hope that my throat is better. I really do, because this is just annoying. But I've been sick for like three or four weeks. I didn't want to keep postponing my livestreams. So that's all then.

Thank you so much for watching, and I will see you next week on twitch.tv/devalexmartinez if you want to see me live, or ProstDev on YouTube if you want to just watch the recorded videos. You can also go to alexmartinez.ca to see some of my portfolio, my links, and my stuff. Or you can go to alexandramartinez on GitHub to follow through whatever I'm doing in these sessions.

All right, that's it then. Thank you so much. Thank you for the follow, and I will see you in seven days. Bye bye.
