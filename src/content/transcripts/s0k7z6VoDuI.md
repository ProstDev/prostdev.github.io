---
source: 'Edited from a local recording (auto-captions cleaned)'
---

### Install the Anypoint Extension Pack

All right, let's learn how to enable MuleSoft Vibes. First of all, if you haven't installed the
Anypoint Extension Pack in your VS Code, go ahead and do that. It's as simple as finding it in the
Extensions marketplace and clicking Install — just make sure it comes from Salesforce.com.

Once it's installed, you'll see the MuleSoft logo, and this will be Anypoint Code Builder. But that
isn't quite what we want. You'll also have this second logo — that one is MuleSoft Vibes. Let's go
ahead and log in to Anypoint Platform.

### Log in to Anypoint Platform

Now it's going to do the usual thing: you open the login in your browser, log in there, and then it
sends you back to VS Code. As you can see here, I don't have the AI features yet — so let's learn
how to turn those on.

Let's head back to Anypoint Platform. I'm going to log in with my username and password. Once we're
in, we can go to Anypoint Code Builder, and right from the start you can select "Go to Access
Management."

### Enable Agentforce in Anypoint Platform

Here, first, let's enable Agentforce. You'll accept the terms and conditions for Agentforce in
Anypoint Platform. Once we have that, we're going to need to add the Salesforce org so we can enable
some of the other settings.

### Create a Salesforce Developer Edition org

Let's head to developer.salesforce.com and click on free trials. In here you'll be able to see the
Developer Edition — there are other free trials you can try out, but for now let's just get our
Developer Edition free trial.

Once you add all of your details, click "Sign me up," and you'll receive your details via email.
After you set up your password and everything, you'll be able to log in to your new organization.
You'll receive a verification code in your email, and after that you're inside your Developer Edition
Salesforce org.

### Turn on Agentforce and Einstein in Salesforce

Let's click on Setup. In Quick Find, search for "agentforce" and head to Agentforce Agents. Just
switch this on and that's pretty much it. You can also make sure you've turned on Einstein, just in
case — search for "einstein," open Einstein Setup, and turn it on. Just like that.

### Connect Anypoint Platform to your Salesforce org

Now let's search for "mulesoft" and select the Anypoint Platform Setup. Click on "Complete the
Connection" and copy your Salesforce org tenant key. Once you go back into Anypoint Platform, you'll
be able to paste that right there.

By the way — if you get an error message ("Organization is not yet onboarded"), just wait a few
minutes, then refresh and try again.

That's it. Add a name so you can recognize the org later — I'm just going to call this "sfdevaccount."
Click Add, then copy that Anypoint Platform org key, paste it back in Salesforce, and click Connect.
Ta-da — that's it.

### Enable Agentforce in Anypoint Platform (final toggle)

Now just make sure to enable Agentforce in Anypoint Platform. And that is all you need to be able to
use MuleSoft Vibes from Anypoint Code Builder — or from VS Code.

### Try it out

Now you can just try again, and you can see that you have MuleSoft Vibes enabled in your VS Code.
That's all for this video — I hope you liked it. Remember to subscribe and stay posted for more
guides and MuleSoft tutorials.