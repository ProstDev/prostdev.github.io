---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hey everyone, Alex here. In the last series of videos — the last four videos we've seen — we've been signing in to Anypoint Platform using username and password. And that's cool and all, because we've been using free accounts (or I have been using free accounts so far). But if you're using an Enterprise account, it's most likely that you'll have multi-factor authentication, or MFA, enabled in your organization, which means that you have to sign in using an SMS or another application so you can sign in from your phone, get a code, stuff like that.

So there's a different process altogether to do the authorization with CI/CD pipelines using multi-factor authentication, which is using a Connected App instead of your Anypoint Platform username and password. In today's video we'll learn exactly how to do that. So let's get started.

### Creating the Connected App

The first thing we're going to do is to sign in to Anypoint Platform, go to the menu here, and go to Access Management. Once you're in Access Management, please go to Connected Apps right here and select "Create app". You can name this whatever you want — in this case we're going to name it "GitHub Actions" just like that. Now select "App acts on its own behalf (client credentials)".

After that click on "Add Scopes" and we'll add the following scopes: the first is going to be Design Center Developer, then we're going to select View Environment, View Organization, Profile, CloudHub Organization Admin, Create Applications, Delete Applications, Download Applications, Read Applications, and finally Read Servers. After you select all of those scopes, click on "Next" right here, select your business groups (in my case it's only one), select "Next", and we'll be using the Sandbox environment for this demo. Next, click on "Add Scopes", and after we do all that we just have to review that everything looks good and click on "Save".

Now here you'll be able to copy the ID and the secret that we're going to use in the next step to add to GitHub.

### Adding the secrets to GitHub

Now if you go to your GitHub repository, click on Settings, then scroll down and select "Secrets and variables", "Actions", and this will get you to where we've already selected all of our previous repository secrets. In this case we're going to create two more for the ID and secret that we just saw.

Simply go here and click on "New repository secret", and the first one is going to be Connected App client ID. So now if we go back to Anypoint Platform we can select "Copy ID", we'll go back to our GitHub repo and paste here the secret. Now just click on "Add secret", and now repeat the process for the second secret, which is going to be Connected App client secret. Now we go back to Anypoint Platform, copy secret, go back to GitHub repo and paste this, select "Add secret".

### Modifying the pom.xml

Now that we have the setup, we can go into our actual repo to modify the code. The first thing we're going to do is to modify our pom.xml file. You can scroll down until you find the CloudHub deployment, and in here you can notice that we have username and password. We're going to replace those two with our Connected App credentials, and these are the three properties that we're going to add now: Connected App client ID, Connected App client secret, and Connected App grant type. The grant type is going to be `client_credentials`, and the ID and the secret are going to be parameters that we're going to send from our `build.yaml`. So that's all for the pom.xml.

### Modifying build.yaml

Now if we go to our `build.yaml` file that we have under `.github/workflows`, we now have to go into our deploy job. So we have the test, build, and deploy. If we scroll down we'll be able to find here that we have username and password in our environment variables, and we're connecting to Anypoint Platform username and Anypoint Platform password — these are the secrets that we have in our GitHub settings. So let's replace that with ID and secret like this.

Now we have the ID environment variable, which is connecting to the Connected App client ID secret that we just created, and the secret variable connected to the Connected App client secret secret that we just created in our GitHub settings.

And the second thing we need to change is right in the Maven command that we're sending. We have to modify this `anypoint.username` and `anypoint.password` with the two variables that we just created, like this. So now this is going to be `client.id` connected to the ID variable, and `client.secret` connected to the secret variable. These are the two properties that we're going to receive here in the pom.xml.

### Running the pipeline

Now we just have to push all of these changes into our GitHub repo to see the pipeline running. So now if we come to the repo and click on the Actions tab, we'll be able to see that the workflow is now running. You can click on it to see the details of what's happening. Right now it's running all of the MUnit tests that we had previously set up, and once that's done it's going to continue to the build and the deploy steps.

Once it reaches the deploy job, we can see that this is already deploying in Runtime Manager, and as soon as this is done we'll have a successful pipeline. Once the application appears as "started", we can go back to the pipeline and we'll see everything was successful.

### Wrap-up

And that's it. That is how you configure a Connected App from Anypoint Platform into your CI/CD pipelines when you're using an Enterprise account, or just using multi-factor authentication in your account.

I hope this has been useful for you. Please let me know in the comments if you would like me to create any more content about CI/CD pipelines or any other type of MuleSoft content. All right, that is all. Remember to subscribe to the channel so you never miss the new videos that we create, and also subscribe to ProstDev.com so you receive notifications as soon as new articles are created. Bye-bye!
