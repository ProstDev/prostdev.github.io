---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi, I'm Alex Martinez, and today I'm going to show you how to create your CI/CD pipelines with GitHub Actions for your Mule applications.

I have a simple Mule application here that is simply setting up a payload that is just a string saying "it worked", and a logger that will output that payload into the console. That's all that this is doing. So let's run it to make sure that it works before we start with the CI/CD pipeline.

This is now deployed and ready to be called. I'm going to use cURL to make this easier. I'm calling `localhost:8081/test`, so once I call this I receive the "it worked" string that I had set up. So I know this application is working.

### Creating the workflow file

Now inside of the Mule application, let's create a new folder called `.github`, just like that, and then inside this folder let's create another folder called `workflows`. There you go. Now inside this `workflows` folder we're going to create a new file called `build.yaml`.

Once you have that file, you'll have to go into the article from the link in the description, copy the script that I put there in the article, and paste it right here.

### Walking through the build job

Let's take a look at this file to see what this is doing. The name of this workflow is "build and deploy to sandbox". We're going to trigger this workflow every time that there is a push to the main branch, or that a pull request is merged into the main branch.

In this case we have two jobs: build and deploy. The build job is going to be running on Ubuntu and the steps are listed like this:

- The first step is going to check out this repo into the Ubuntu machine.
- Second step is to cache all of the Maven dependencies.
- Third step is to set up JDK 1.8 — this is the Java version that I chose; you can also use Java 11.
- Then we're going to build this with Maven using the pom.xml from this Mule project.
- After that the artifact will be stamped with the commit hash. This is just so you can go to CloudHub, and if you want to download the JAR file or make sure that this is the JAR file that you're using, you can check that it has the commit hash that you need.
- Finally, once the JAR file is created, we're going to upload this artifact into the workflow so it can be used by other jobs.

### Walking through the deploy job

Now if we scroll down to the deploy job, first of all we see here that it says `needs: build`. What this means is that GitHub actually runs each job asynchronously, but in this case we don't want it to run asynchronously — we want them to run synchronously to each other, because first we need to build the application and then we need to deploy the application. We cannot do that separately. So in this second job we're stating that we actually need the build job to run first.

Then you'll see the same first steps that we had: it's running on Ubuntu, it's checking out the repo and caching the dependencies. After that it's going to download the artifact, or the JAR file, that was previously uploaded from the previous job, and then it'll deploy everything to sandbox.

In this case our Anypoint Platform username and password are going to be used from here. I'll show you how to set this up from GitHub in a moment, but we'll be using Anypoint Platform username and Anypoint Platform password. Once these are extracted from our GitHub account, they'll be used as username and password environment variables. So now here we can see the Mule deploy that will be running using the Mule artifact, then the same name of the JAR, the username and password from Anypoint Platform.

### Adding the GitHub secrets

Now if we go to our repo in GitHub, you can click on the Settings tab — make sure that you're logged in — and then scroll down and go into "Secrets and variables", and then "Actions". This will bring you to this page where we currently don't have any environment or repository secrets.

Let's click on "New repository secret". Here, select the Anypoint Platform password name for the variable, and then the secret is your actual password. After that just click on "Add secret". Once you've added that secret, now let's go ahead and create a new one for the username. In this case this is going to be Anypoint Platform username, then add your own username and click on "Add secret".

Now that we have our credentials here in GitHub, there's no need for us to hard-code the credentials directly in the workflow. Please don't do that — that is a huge security issue.

### Running the workflow

So now all that's left is to run the workflow. If you remember, our triggers are either a push or a pull request merge into the main branch. So let's save this file and push it into the repo.

Now once you push it, you'll be able to see here that you created this new commit, and here you'll be able to see the state of the action. You can also click here on the Actions tab and this will take you to all of the workflows that had run before.

Now if you click on the latest workflow — that's the one that you just triggered — you'll be able to see the details of each step. Here you have the build job that already finished running, and then we have the deploy job that just started running. If you click on it you'll be able to see the details of what is running in each step and the outputs from the command line. As you can see here, it's checking whether the application is started or not.

So if we go into Anypoint Platform and Runtime Manager, we'll be able to see that this is currently deploying. Once this finishes deploying, we'll be able to see a green state on our Actions. After our application finishes deploying correctly, we'll now be able to see that we have a green status in both of them.

### Wrap-up

And that's it. I hope this video was useful. I'll continue to do more videos about the same topic — continue to the next video to see how to use encryption and decryption of your Mule properties in your CI/CD pipeline. See ya!
