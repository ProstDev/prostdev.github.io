---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone, my name is Alex and today we're going to see some code insights from CurieTech AI. I'm going to demo three modes: single repo code lens, code review lens, and multi-repo code lens. Let's dive in.

### Single repo code lens

I've been trying out the Mac project and I created this repo. If you haven't seen my really detailed README yet, let's see what CurieTech can tell me about this.

I've already set up my repos. If you go to your settings → repositories, you can connect your GitHub. I would recommend connecting via OAuth. Once you have that, you'll be able to use your own repos.

So let's go to Coding Insights → Single Repo Code Lens and select my own repo. You can also upload from your computer; in my case I'm just going to select the Mac project from here. Let's ask, "What is this repo about?"

It gave me a bunch of explanations. For example, key features: Agentforce integration. Here you can see the flows it's implementing in Agentforce — all the flows I have implemented. Then we have the configuration and setup, the MuleSoft configuration and properties, some documentation like the README and the OAuth example that I created for you to use in Agentforce, and it also gave me this nice summary table so I can see where everything is set up.

Another cool thing: if you go to your settings → workspace and scroll down, you'll see coding guidelines. I have uploaded my own PDF file with the coding guidelines I want CurieTech to take a look at. You can upload yours, too.

So let's go back and ask: "Are there any best practices or security violations I should be taking a look at?" It's asking me for a specific flow. I'm just going to select this flow.

It gave me a bunch of stuff:

- **Use of a hard-coded file path.** Yeah, I hard-coded that. I definitely need to change it. It even tells you why it's not recommended and how to fix it.
- **Proper use of global configurations.** Thank you! I have all my global configs in `global.xml`.
- **Properties management.** I am following the pattern — yay.
- **Secure properties.** I definitely need to secure my properties. I have not used the `secure::` property placeholder for this, so yes, I need to do that.
- **No error handling.** That is true. I have no error handling.
- **No MUnit test for this flow.** Definitely not. So I also need to add my MUnits.

And finally, it's letting me know: you need to review other flows, ensure that secure property setup is in place, and some other stuff I need to review.

So that was the single repo code lens in Code Insights. I'll leave the multi-repo code lens for the end, so let's do the code review lens now.

### Code review lens

I created this pull request (PR) where I am definitely not following best practices. For example, here you can see that I have my port and my host hard-coded instead of in the properties — I just changed them from 881 to 882 — and I'm also exposing some test Salesforce credentials. These do not exist, by the way.

So let's copy the PR link, head to Code Review Lens, select the test branch, and ask a question. We can also edit the guidelines here. Let's just say "Review this PR."

And yeah, it definitely told me everything:

- **Review finding: security issues.** Remove hard-coded credentials and use `secure::` property placeholders. Salesforce username and password — definitely.
- **Create a `global.xml` file** with configuration properties. Yes.
- **Update the HTTP listener configuration.** Yes.
- **Add to the properties YAML.** Yes.
- **Missing proper configuration properties.** Yes, because I have no properties at all.
- **Missing configuration properties module.** Yes, because I have no properties at all.

So yes, it was definitely able to find everything.

### Multi-repo code lens

Now, the third and final way to use this is the multi-repo code lens.

For those of you that don't know what Anypoint Race or Anypoint Speedway is: Ryan Heck, someone in the community, created this integration challenge where you can create your own Anypoint race cars for racing on the speedway. Anyway, for season 1 and 2, I believe, I had to create two different repos.

This is the whole diagram of how everything works. But in summary, I have the **race client** (which is this repo) and I have the **racer API** (which is this repo). I'm going to take those two repos and feed them into CurieTech to see what it does.

So in Multi-Repo Code Lens, let's select the branch (main), select the repos — Anypoint racer API and Anypoint race API MuleSoft — and ask a question: "Can you tell me how these repos work together?"

If we take a closer look at the diagram, they never actually talk to each other directly. The race client is talking to the endpoint race API which was managed by Ryan, and that one is orchestrating and managing all of the calls to both of these projects. But what they have in common is this **token queue**. Every time the racer API would create a token, it would publish the token to the token queue, and then the race client would consume the token from the token queue. So this queue, in theory, is the same. But because we don't have the Anypoint race API from Ryan, we can't really see all of these connections, I think.

And here we have it:

**Anypoint racer API** is the message publisher. Yes, as we saw, this is a message publisher, and we can see here where this is implemented and how this is being published. The queue destination is defined by the property `anypoint.mq`, and the MQ configuration is in `global.xml`.

Then we have the **Anypoint race API MuleSoft** (which is the race client) consuming messages from the same Anypoint MQ. This is implemented here: the subscriber listens to the same queue `anypoint.mq` and processes incoming messages, triggering further actions such as HTTP requests and logging.

So, summary table: the racer API is the Anypoint MQ publisher, and the race API MuleSoft is the Anypoint MQ subscriber. That is really cool.

### Recap and my thoughts

So yeah, in summary, if you go to the Code Insights part, you have:

1. **Single repo code lens** — where you can get a repo or your project and ask any questions you may have. Like, how does this work? Is it following best practices? Are there any security violations? If you're having a bug and you need to figure out why, you can ask any kind of question regarding a single repo. You can even ask if your code is being efficient or if there is a way you can rewrite it so it is better.

2. **Code review lens** — where you can actually tell it to review a pull request from the repo that you provided. As we saw, you can upload your own file to follow best practices, naming conventions, or whatever you want. Kind of like the rules file that I had created for Cursor. You can also check if a PR is going to inject a bug or something, and it can check against the main code to make sure it's still working as expected.

3. **Multi-repo code lens** — I used it with some of the projects I had that are actually connecting through a queue. They're not even connected like an HTTP call or doing some sort of experience/process/system layer exchange. I feel like this is actually more complex because it wouldn't know that they're connecting to the same place through a queue. So I thought this was a really nice use case to see it in action, and it actually worked. Using this multi-repo code lens, you can also see the overall architecture of how your projects are being set up — how it's working. If you had experience, process, and system layers, you could ask it, "How are these functioning? Maybe you can give me a diagram of some sort?"

So yeah, that is how you can use the Code Insights. So far, in the last videos that I've done about CurieTech, we've been seeing the coding agents, the data generator, the code enhancer, and then in testing we saw the MUnit generator. We haven't seen any of the documentation agents, but we have now seen all of the Code Insights. We also have not seen the migration agents.

So let me know in the comments below what other agent from CurieTech should I test next. Let me know what you think. If you want me to do some specific experiments, I'm here for you — I am all up for it. Or let me know if you have some other tool that you want me to try out. But so far, CurieTech is definitely earning the number one prize for MuleSoft development.

All right, see you in the next video. Bye.
