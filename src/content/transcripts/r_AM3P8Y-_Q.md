---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, welcome to Part 4 of the MuleSoft and Data Cloud integration series. My name is Alex Martinez, and today we are going to learn how to secure your API with basic authentication in API Manager.

So in Part 2 of this series we learned how to retrieve the URL from CloudHub, but I did warn you a lot of times that you should not be sharing that URL with anyone else because they would have access to all of your credentials. So the solution to add security to that URL would be to add some security policies to the API. Now this is perfect to do in MuleSoft because you do not need to know how to code these security policies — you can simply apply them using Anypoint Platform, just in clicks, not code. So let's learn how to do that.

### Prerequisites

Now, some prerequisites before we get started. Of course you'll need to have an Anypoint Platform account. I am expecting that you already went through Parts 1, 2, and 3 of the series because you should have everything prepared for this.

Then you'll also have to download version 2.0.0 of the JAR. So if you go to `github.com/alexandramartinez/datacloud-mulesoft-integration/releases` and you get to the release 2.0.0, you can scroll down here and you'll see the assets part, and here you have the 2.0.0 application JAR — so download that because we'll use it in a moment.

Next, you'll need your Anypoint Platform environment credentials. So in your Anypoint Platform, go to Access Management right here, go to Business Groups, select your own business group, then click on Environments here and select your environment — in my case this is going to be Sandbox — and here you can extract the client ID and the client secret.

Finally, if you followed Part 3 or the previous part, you should already have your Postman collection ready to run, and please double-check that this works before getting started.

### Creating the API in API Manager

All right, so let's get started. First of all, go into your Anypoint Platform and then head to API Manager. In API Manager, click on "Add API", "Add new API". Here in the runtime section, select "Mule Gateway", leave all of the defaults and click on "Next". Now in the API part, select "Create new API". In our case we're going to name this "Data Cloud API" and select an HTTP API, click on "Next". You can leave this Downstream empty, click on "Next", and also leave the Upstream empty and click on "Next". Now just review that everything looks good and click on "Save".

Once you save it, you'll be able to get the API instance ID from this part, so copy this number because we'll use it later.

### Upgrading the deployed Mule app

Now let's upgrade the deployed Mule application. So if we go to Runtime Manager, open our app, and in the Settings tab you'll be able to see that you have your application file, so click here on "Choose file", upload file, and once you select the new JAR — the 2.0 — you'll be able to see it here. You'll also see the "Apply changes" button that just appeared.

But before we continue, let's go into the Properties tab and scroll down. We already had our Salesforce and CDP credentials, so let's go into the Text view, and if you go into the description of the video you'll see the link to the article where you'll be able to copy and paste this text right here, because this contains all of the properties that you'll need to upload here. So let me change into the Table view to see them one by one.

We have the `anypoint.platform.gatekeeper`, this will be set to "flexible". We have the `api.id`, which is the API instance ID that we just copied — let me put that there. Then we have the Anypoint Platform client ID and Anypoint Platform client secret, which are the two credentials that we got from the beginning. Your client ID should look something like this, and I'll put the client secret in a moment. After you add both of the client ID and client secret, remember to click on "Protect" so that no one can actually get to this value.

Perfect, now these are all of the properties that you should have. You can pause this video if you need to take a look at them. After you're done, you can click on "Apply changes".

Now once this has been deployed, you'll see this as "running" and there will be no processes here. If for some reason it's taking more than expected, like more than 5 minutes and nothing is happening, just make sure and double-check that all of the properties you set up are correct.

### Confirming the API is active

Now after this, let's go back to API Manager. So if we open the menu and select API Manager, we'll be able to see our API, select that, and now you'll see the API status here set as "Active". If for some reason you're not seeing it, you can also refresh the page and make sure that this appears as "Active". If it doesn't, please make sure that you're using the correct API instance ID and your environment credentials. And if you come back to Postman and run the query again, you'll receive a "200 OK" because everything is good.

### Adding the basic authentication policy

Now let's go back to API Manager and now we can start adding the policies. So select the Policies tab, click on "Add policy", search for the "Basic authentication - Simple" one, click on "Next", and then just add whatever username and password you want to use for your own credentials. In my case, as an example, I am going to be setting this up to "foo" and "bar" — to not use this, please create your own credentials. And once you have added them, click on "Apply".

Once this policy has been created, you'll see this green message, and then you can go back to Postman and send this again. It will take a few seconds, but eventually you'll be able to see the error being shown. And here we have it — we have a "401 Unauthorized", and we have the error saying that you're supposed to be sending basic authentication but you're not sending it.

### Adding the credentials in Postman

So to fix that, we'll add the credentials to our environment and then we'll reference them from our collection so it applies to all of the requests. So if we go to the Environments and select the CloudHub environment we had previously created, let's add a new variable called `username`, and in the current value we'll write "foo". Now let's add the other variable, which is `password`, and then in the current value we'll set this up as "bar".

If you don't want to show this, you can also change this type as "secret" and it will appear like that, so if you're sharing your screen or something, people won't see your credentials. In my case I'm just going to let it be as default so you can see my credentials for now. And then click on "Save", or select Ctrl-S or Command-S to save the environment.

Now let's go back to the Collections tab and open our collection by clicking it. Here in Authorization, let's select the type as "Basic Auth", and then in the username we can create the variable — so if we use the double curly brackets we'll be able to select the `username`, and the same thing for the password, let's add the double curly brackets and select `password`. So now if you hover over it you'll be able to see that it says "foo" and this one says "bar". So make sure to save this, and now you can go back to your query and send it. And now we receive a "200 OK" because now we are sending our basic authentication with Postman.

### Recap

And that's all. Congratulations, you applied a basic authentication security policy to your API without having to code anything into it.

Just as a summary: you had to create an API in API Manager like this one, and then you had to copy the API instance ID in order to send it into the new JAR file that we have created — so here we had to upgrade this to the version 2.0, which is the change to the code that I created in order for you to activate autodiscovery. Then we also added the properties — the API ID, the gatekeeper, the Anypoint Platform client ID and client secret — in order to be able to apply those policies. And finally we added the two variables to the environment, and then we also modified the Postman collection to contain the username and the password.

### Wrap-up

And that's all for this video. Remember to follow us on all of our socials at ProstDev.com, subscribe so you can receive notifications as soon as we post any new content, also on our YouTube channel /prostdev so you receive notifications as soon as new videos are uploaded, and feel free to contact me for any questions or suggestions that you may have for me. I am happy to keep creating content for you all. That's all then, I'll see you in the next video. Bye!
