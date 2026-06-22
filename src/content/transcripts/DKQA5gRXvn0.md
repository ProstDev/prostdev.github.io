---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, Alex here. In the last video we learned how to include our Nexus credentials into our `build.yaml` file — just like the GitHub credentials — in order to be able to deploy our application using the MUnit tests in our new CI/CD pipeline.

Now, in the last video we didn't learn how to actually do MUnit coverage; we only learned how to run the MUnit tests from the CI/CD pipeline in GitHub Actions. So in today's video we're going to learn exactly that: how to add the MUnit coverage into our CI/CD pipeline.

### Configuring coverage in the pom.xml

This part is going to be actually way simpler than the last one, since we already have all the Nexus credentials and all the configuration to run the MUnit tests. The only thing that we're going to add here in the pom.xml is the configuration for the necessary minimum percentage required to pass the build.

So inside the pom.xml we can scroll down until we see `build` > `plugins`, and then we'll search for the MUnit plugin right here, `munit-tools`. The first thing we're going to add is going to be here in the configuration part. Inside the configuration we're going to add these environment variables, which is `secure.key` — this is the decryption key that we've been using from the previous articles — and here we're going to set up the `decryption.key`, which is what we have set from our GitHub Actions. If you want to just confirm that all of this configuration is set up properly, you can just go to the previous articles or the previous videos to make sure that your `secure.key` or your `decryption.key` are set up properly.

After setting that up, you can just go here inside `coverage` and you'll notice that you're already running the coverage. So now under that we're going to add `failBuild` set to true, so if this configuration is not completed properly then the build is going to fail — that's exactly what that means. And then we're going to set up the required application coverage to 90. In this case this is my own configuration; I want it to have a 90% coverage minimum in order to pass the build, but you can set up however you want.

Other options that you could also have are `requiredResourceCoverage`, so for every resource that you have you'll have, for example, a 50% minimum coverage, and another setting would be `requiredFlowCoverage`, also let's say for example 50%. So you can set all of this up, or you can set just one, or maybe two, or however you want this to be configured. In my case I just want the whole application coverage to be 90% minimum, so that's what I'm setting right now.

Now you can leave this configuration like that and it will create an HTML coverage report, or you can also set up more formats like console, sonar, JSON. But honestly, I feel like only the console and the HTML are really useful. The JSON is useful if you're going to be using this information for another pipeline or for another thing, and the sonar, well, if you're running SonarQube.

### Uploading the reports as artifacts

Now we can simply save what we have here in the pom.xml and that's it. Or, if you want to see all of these reports from the GitHub pipeline, then you have to add something into the `build.yaml` file.

So if we go here to `.github/workflows/build.yaml` and we scroll down in the test job all the way to the end, we'll be able to add here another step, which is to upload the MUnit reports. Basically, using the `actions/upload-artifact`, we're saying name this artifact "munit-test-reports" and take whatever is in `target/site/munit/coverage` and put it there. For more information about this configuration you can just go to the docs — I'll add this link in the description of the video, or if you go to the article in ProstDev you'll be able to see this link.

### Running the pipeline

So now that we have all of these changes in pom and build, let's simply push all of these into our branch and see how it's running.

And now if we go to our GitHub repo in the Actions tab, we'll see that this is already running. We can open it and see that it's running the testing, and at the end of the test we'll be able to see the console report. Here I have all of my coverage at 100% — so I already covered every single thing from my flows, so I have 100% coverage, everything passed, and this build is a success, at least from the test. Right now it's trying to deploy and we'll wait until that's done.

And once this is finally deployed, we can see the status is "started", and we can go back to the GitHub Actions — this is all green so everything was done properly. Now if we scroll down here, we'll be able to see some artifacts right here. So we have the artifacts, which is where we have our JAR file, and the MUnit test reports, which is where we can find our sonar, HTML, JSON, and I believe the console is already done, so you'll be able to find those there. If you click on it, it'll download a zip file and you'll be able to unzip it and see the results there.

### Wrap-up

And that's all for this video. I hope you liked it, I hope it works for you, and as you can see it was very simple — you just have to set up the pom.xml, and if you want to also get the artifacts from the CI/CD pipeline, you also have to set up the `build.yaml` file, but it's not that hard.

I think I'm pretty much done with everything you all have been asking me, but on the next video I'll go ahead and explain how to sign in to Anypoint Platform using GitHub Actions if you're using MFA, or multi-factor authentication, in your Anypoint Platform account. So far, since I've been using free accounts, I don't have to have MFA activated, but a lot of the Enterprise users — I believe all of them — have to use MFA in their organizations. Instead of using the Anypoint Platform password and username, you'll have to use a Connected App, and I'll show you how to do that in the next video.

Let me know if you have more suggestions of what else you want me to cover in this content of CI/CD pipelines, and I'll try to make it happen. All right, that's all for this video. Bye-bye!
