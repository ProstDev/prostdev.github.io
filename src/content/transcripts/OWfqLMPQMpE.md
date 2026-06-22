---
source: 'Edited from the spoken video for readability'
---

### Setting up connected app credentials

I grabbed the client ID and secret from my environment in Access Management. To make things clearer, I renamed these to "connected app client ID" and "connected app client secret" instead of just client ID and secret. Then in the configuration, I updated the property names to "anypoint platform client ID" and "anypoint platform client secret" so it's obvious what these credentials are for.

### Passing credentials via the terminal

Now that we have those properties defined, we can pass them in via the terminal when we deploy. This way we don't have to put them in manually every time. I ran the deployment and it was successful—the app started up.

### API autodiscovery and API Manager

The app was initially showing as unregistered in API Manager. I just needed to send a request to trigger the autodiscovery. I went into Postman and sent a request. The Object Store was empty at first since we didn't have any data yet. I created an article with ID 1, then retrieved the articles and saw article 81 in the response.

I checked the Object Store in the Anypoint Platform and saw the data: articles, categories, and next article ID. Everything was working correctly. The only difference from before is that I created my CI/CD pipeline to deploy to CloudHub 1 instead of CloudHub 2. After the deployment, the app was now registered and active in API Manager.

### Testing the basic authentication policy

Now we can see the policies in API Manager. We're using the basic authentication policy that we added at the top of the configuration. We have the authorization header in our request. If I were to change or remove that header, it wouldn't work anymore—sure enough, I got "authentication attempt failed."

I added the correct credentials back and tried again. Perfect, it worked.

### CI/CD with GitHub Actions

We finished setting up API autodiscovery and also got CI/CD working. I showed you how to do it with GitHub Actions, but I didn't actually implement it in this repo because this repository isn't just a Mule application—it has a lot of things and I think it would be messy.

If you have any issues setting up GitHub Actions, you can let me know. You can also check out the MuleSoft MFA CI/CD repo that I showed you. If you go to `.github/workflows`, you'll find the `build.yaml` file. As I mentioned, if you just want to implement the changes that I did, you only have to change the workflow file and the `pom.xml`—those are the only things we changed.

### What's next: MUnit and Nexus

We are so close. In the next session we will do some MUnit tests manually, and I will also show you how to add the MUnit stuff to your CI/CD pipeline. Please note that to add it to CI/CD you will need to have a Nexus Enterprise account. If you don't have it, don't worry—you can still check your MUnit tests manually.

We will also take a look at the Postman tests that you can do if you want to do some of that, and I will just mention the bat CLI, but I will not go through it.

### Wrap-up

That's it. Our next session is the last one—August 9. We are so close. I hope that everything has been working correctly for you. If not, please let me know. I am happy to help you. If you have any questions at all, please send them to me.

I will put everything on the repo so you can go and check out all the changes that I did and also all the links that I showed you today. I will see you next week at the same time. Bye.
