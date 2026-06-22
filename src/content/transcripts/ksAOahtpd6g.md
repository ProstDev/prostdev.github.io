---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi, I'm Alex Martinez, and in this third video from this series I'm going to show you how to add MUnit to your CI/CD pipeline.

There's something important here: you'll need Nexus credentials, so if you don't have them you'll have to get them before starting this. For more information about the Nexus credentials, you can go to the article that's linked in the description of the video to see the links to the documentation to learn what exactly that is, if you don't know.

In the two previous videos we learned how to set up the basic configuration for the CI/CD pipelines, and how to add a configuration for any decryption that you need to do in your properties. Let's do it then.

### Confirming the MUnit tests work

So before starting, we have to make sure that our MUnit tests are actually working and they're successful, otherwise we might encounter some issues in the pipeline because we did not run this earlier. So here you can see that my two tests are working — everything is in green, so I'm ready to proceed.

And as I mentioned, you'll have to have Nexus Enterprise credentials for this. So if you're not sure if they work, you can come to this link — I'm going to put it in the description of the video, or it's also in the article that I wrote — and here you'll be able to put your username and password to make sure that your credentials actually work. So once you add your credentials, simply click on Login, and you'll see this page because you're able to log in. As you can see here, I'm logged in to my user.

### Adding the Nexus secrets to GitHub

The next step is to go into your GitHub repo, and same as before, go into the Settings tab, scroll down, and select "Secrets and variables", "Actions". We already had three different repository secrets that we set up in the previous videos, so now we're going to create a new one.

First we're going to add the Nexus username that you just used in the previous screen — in my case `amartinez-mule` — and click on "Add secret". Now let's create the second one: in this case we're going to set up the Nexus password, and you put here your own credential and click on "Add secret". Now we have set up five different repository secrets.

### Modifying build.yaml — the test job

The next step is to modify our `build.yaml` file, which is the one that's running the workflows for the GitHub Actions. Please go into the description of the video and click on the article; you can copy and paste the script that I'm about to show you here.

As you can see, here by these green lines, these are the new changes that we're adding. We're adding the new test job, and we're adding the new `needs: test` into the build job because we need to run this synchronously, as I explained in a previous video — we need to run the test job before the build job.

There are two other additional changes in the build and the deploy jobs. One is here in the build job: if you go to the "build with Maven" command, I added the `-DskipMunitTests` so we can send this parameter to not run the MUnit tests on these two other jobs, because we'll already be running the tests on the first job. If you scroll down to the deploy job, you'll also see that I added the same thing here in the Maven deploy command.

So now if we take a look at the test job, the first steps are the same as the other ones — Ubuntu latest, and then we check out this repo, cache dependencies, set up JDK 8 (again, you can set up another JDK if you want) — and then here in the "test with Maven" command, this will change a little bit from what we've been doing before. Here are our two secrets that we had set up, Nexus username and Nexus password, but in this case the variables that we'll be creating here will not be used in our Maven command. I'll show you in a bit where we're using this.

And then if you have a decryption key, you have to send it in this command as well. Also, in this case we're sending the decryption key directly here as the `secure.key` property, as opposed to what we were doing before, which was setting up the decryption key. Now we have to set up the property directly, so if you have a different property name that's not `secure.key`, please make sure to modify it in this parameter.

The other thing that we can see here in this command is that we're setting up a `settings.xml` file directly. So in this case we're saying that it's under the `.maven` folder and then the `settings.xml` file will be found there.

### Creating the settings.xml

So we have to create it in a root folder. We're going to create a new folder called `.maven`, and then inside this folder we're going to create a new file called `settings.xml`. Now, again, you'll have to reference the article that's posted in the description of the video so you can copy and paste the contents of this file.

In this case we're adding a new server that's called `mule-repository`, and we'll be linking the Nexus username and Nexus password from our secrets. We're also creating a new profile that's called `mule` and it contains this repository for the Mule repository that matches the server. So now this Nexus username and Nexus password will be taken from what we're sending here in the `build.yaml` — these two environment variables that are not being used anywhere in our Maven command will be passed down and will reach the `settings.xml` here.

### Running the pipeline

And that's it. Those are all the changes that we need to do in order to run these tests. So now let's save both files and push all of these changes into our GitHub repo to run the GitHub Actions.

And same as before, as soon as we push all of the changes we'll be able to see that the action is running. Now if you click on it you'll be able to see the details of each different job — in this case now we have first the test job, then the build, and then the deploy.

Let's open the test job to see how it's doing. And after roughly two minutes we're able to see our MUnit coverage summary, as well as the number of tests and if there were any errors, failures, or skipped. In this case there were two tests and both of them were successful. Notice how I only have 33% of the application coverage with my MUnit tests — in the next video we'll see how to make sure that this coverage is a higher percentage so we don't let this happen in a real-life scenario.

The build already finished, and now it's up to the deploy now, and we can see in Runtime Manager that this application is being currently redeployed. And once again, as soon as this application is deployed, you can go back to see that all of the three steps have been successful.

### Wrap-up

And that's all for now. In the next video we'll incorporate the MUnit coverage into the CI/CD pipeline. I hope you liked the video. Remember to subscribe, and I'll see you in the next video. Bye!
