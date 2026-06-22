---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi, welcome back to the series of CI/CD pipelines with GitHub Actions using MuleSoft. In this video we're going to learn how to decrypt properties using the CI/CD pipelines that we created in the last video. Let's do it.

### The encrypted property setup

First of all, I already have my application. I did some changes — here I added the secure property using `${secure::encrypted.property}`. This is the name of the property that I'm going to be using. I created a new file under `src/main/resources` called `secure.properties`, and if I go here I'll see my `encrypted.property`, and as you can see this value is already encrypted.

Also, something to keep in mind: in your `mule-artifact.json` file it's important that you set up here the `secure.key`, or the name of your key, into the secure properties field. This is so when you deploy to CloudHub this property will be hidden and no one can see it. Otherwise anyone that accesses CloudHub will be able to see your key.

### Running it locally

Now let's run it to see that it's working. If I go to Run and then Run Configurations, I'll be able to set up my key in the Arguments tab, and I set it up here in the VM arguments part. So my secure key in this case is `myMuleSoftKey`. After that you can just click on Run.

So my application is deployed. Let's now test that it works, same as before: `curl localhost:8081/test`. Let's run this to make sure that it works, and I received "it worked secure property" — yay.

### Creating the GitHub secret

So now the first thing that we're going to do is to create the secret in GitHub. In Anypoint Studio we set up the `secure.key` (`myMuleSoftKey`) from the VM arguments in the Run Configurations.

Remember from the previous video that if we go to GitHub in our repo and then click on the Settings tab, we'll be able to scroll down, select "Secrets and variables", and then "Actions". This will bring up our previous repository secrets, which we already set up as Anypoint Platform password and Anypoint Platform username.

Let's now create a new one that's going to be called `decryption.key`, and as we had set up in Studio, this key in my case is `myMuleSoftKey`. So we're going to add this secret, and that's all for this step.

### Updating build.yaml

Now if we go back to our Mule project and open the `build.yaml` that we had created in the previous video, let's scroll down until we see the deploy job. In this case we have to add the new decryption key here in the environment variables. Remember that we set up our `decryption.key`, so this name has to match with what we put in the command. So here, right after password, we're going to add a new key, and this is going to be referencing the secret that's called `decryption.key`.

Now we're going to add a new parameter here in the Maven command, so right after this one let's add a new `decryption.key` that's going to be referencing the key variable that we just created right here. Make sure you add a backslash right here, otherwise this is not going to work.

You might be wondering why this is called `decryption.key` and not `secure.key`. This is because we'll be changing this in the pom.xml, as I'll show you in a moment. We can now save this file.

### Updating the pom.xml

Now for the next step let's open the pom.xml and search for the CloudHub deployment. This is going to be inside `build` and then `plugins`, then `plugin`, and we'll see here the configuration for the CloudHub deployment.

So here we're going to add a new property before the CloudHub deployment tag ends. Let's go ahead and create here this new property. We have to create first a field called `properties`, and inside it we're going to be referencing the `secure.key` that we'll be using inside the Mule application, and the other value that we're going to be referencing is `decryption.key`. So the value that we send here from `build.yaml`, which is the encryption key, will be taken and will be put inside here. So the `secure.key` property will contain the value that we have in our GitHub secrets. So if you have a different key instead of `secure.key`, you have to change it here in the pom.

Let me save this file, and also the `mule-artifact.json` here, so you can make sure that this key is not visible from CloudHub.

### Running the pipeline

And same as before, as soon as we push this new commit, we'll be able to see here in the Actions tab that this workflow is starting to run. If you click on it you'll be able to see the details of each job separately. So the build was a success after 30 seconds, and now this is trying to deploy the application.

We can already see in Runtime Manager that the application is being deployed — it's updating right now. As soon as this is updated in Runtime Manager, our deploy job will be successful. And now that the application has been successfully deployed in Runtime Manager, we can go back to our GitHub Actions and we'll see that everything is green.

Let's try to call this application just to make sure that it actually works. Let's send the cURL request to our CloudHub URL and then `/test` — and "it worked secure property", yay.

### Wrap-up

And that's all for this video. I hope you liked it. In the next video we're going to see how to incorporate MUnit into the CI/CD pipeline, so keep posted when this video is uploaded. Remember to subscribe to watch all of the other videos, and I'll see you in the next video. Bye!
