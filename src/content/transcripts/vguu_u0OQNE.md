---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone. My name is Alex and today I am going to show you the Code Enhancer agent from CurieTech AI. From my previous videos we already did the DataWeave generator and the MUnit test generator. Now let's try the Code Enhancer.

Before, I had usually been updating my project here from my computer, but now I have set up my GitHub repo and everything. So let's go ahead and select my Alexander Martinez test in the main branch and we can give a description of the task.

### Using MuleSoft best practices as the task description

In this case, I am going to be using the MuleSoft best practices file that I had generated in one of the videos before for Cursor AI — because Cursor AI can use this file to make sure that it's using best practices for all of the projects. But for now, I'm just going to copy this whole file and I am going to use it here in CurieTech. So this is the description that I'm going to add — just all of the rules to make sure that it has best practices. And we're just going to click submit.

I already ran this, so I am going to click on submit just so you can see what's happening and how it looks. It's going to tell you the task was submitted, this is what you added, and the task is going to be in progress. Once it's done, it's going to show you the differences.

### Reviewing the generated changes

So I already ran it. Let me come here — diff generated. If I click on this to see the diff, we can see that from my project, it's just a hello world application. Really simple. But I am not following best practices. I have my HTTP listener configuration here in the same test.xml file. I have my properties like my port and my host right here. You can see them. And I don't have any properties file at all. So those are the main changes that I want — that are actually described here. You can see in the description of the video I have all the links so you can go check them out and read them or just pause and take a look at them.

So what it generated was in the test file — in the test file we have the listener config that was removed because it was added to the global.xml, and here it was just some doc ID changes. That's fine.

The pom.xml had just some new lines added. Not sure why but whatever.

But here is a good thing: in the `src/main/mule/global.xml`, it has the global property `mule.env` set to `local`, which is what I described in my task. Then I have the configuration properties set to `env-properties.yaml`, which is also what I asked — it can be named different things but I selected that. And my listener configuration was moved from my test.xml to my global.xml. And the properties of host and port were actually taken and put in another file which is my `local-properties.yaml`.

### Properties file naming and YAML strings

I also added in my rules that I want this file to be named `env-properties.yaml`. So this is what I selected. It can be named local.yaml or whatever you prefer. Just make sure to put it in the task.

And the other thing that I also put in the task was that these properties have to be strings — because YAML is very specific with that, or MuleSoft, I don't know. But if you put here for example just `8081` without the quotes, then it's going to be an error because it's going to tell you that it doesn't accept numeric values, only strings. So that is why it's important to put quotes in values that can be numeric. Like if you had `ABC` for example it doesn't really matter because it's not a number, but `8081` can be interpreted as a number. So that is why it's important to have the strings.

So it generated all of those things and then it asks you if you approve the changes or not. In my case I selected approve.

### The pull request (PR) magic

So then it created the task completed right here. So if we open that, we can see that it actually went ahead and created a pull request (PR) to your GitHub repo — which is really, really, really cool and really convenient. That way you don't have to do anything else.

So here you can take a look — the following, this is the description of the task that you added. In my case it was added based on the file that I had previously generated. Then it gives you a small summary of what it actually created — like the files that it added, the files that it modified, and the summary of the changes.

So this is actually really convenient if you have the GitHub repo already there. Just tell CurieTech to create the PR with whatever changes you need. That's really cool because you also can keep track of all of the changes that have been happening on your repo. And then you can just merge it or comment or do a comparison or whatever.

### Pairing with the Code Review agent and GitHub Actions

And the cool thing about that is if you come here, we also have a Code Review agent. So you can use it to review a pull request (PR) for the provided repo — which is also cool because they kind of complement each other.

And if you really need it to run MUnit or make sure that the project runs before deploying or whatever, you can just set up your GitHub workflows — your GitHub Actions — and you can add them to any PR that is created. And that way, once CurieTech creates a PR for your repo, you can just run all the necessary validations that you need before actually accepting the pull request, which is great.

### Closing thoughts

All right, that is all for this video. So again, CurieTech is not disappointing. CurieTech helped make sure that my project had best practices and it also created a pull request (PR) for me to actually go take a look at all of the changes. So this is really cool. Again, 10 out of 10 would recommend.

So what are we going to do next with CurieTech? Let me know in the comments whatever you want to see or reach out to me and I will be happy to test it out for you. All right, that is all for this video. I will see you in the next video. Bye.
