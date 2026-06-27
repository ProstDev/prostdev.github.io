---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, welcome to another ProstDev video! Yay. My name is Alex Martinez, I am ProstDev's founder, and today we are going to learn how to add JVM or command-line arguments to Anypoint Code Builder, or to the Mule Runtime in Anypoint Code Builder. So let's get started.

I will assume that you already have all the prerequisites — you already have Anypoint Code Builder installed and you kind of know how to use it, more or less — so I will just get right to the point.

### Create the base Mule project

First, let's click on "Develop an Integration" and select any name. I'm just going to use "test". Select your project location and click on "Create project". It's going to take a little bit for this to finish running, but once it is, you will be able to see your code right here in the canvas. All right, here we go.

I'm just going to add this super quickly — you can go to the GitHub tutorial repo in the description of the video — and I will just paste this right here and format the document. There we go. It will just take a few seconds for this to load.

So pretty much we are just setting up an HTTP listener, and then we are setting up the payload. But here is the thing that we are going to have to pay attention to: in the HTTP listener we are setting up the HTTP listener host and port using properties. In the configuration properties we are using an `env` property that we will have to pass in runtime. You can also use this same tutorial in case you are using encrypted properties or secure properties — then you will be able to pass your secure key as an argument, just as we will do here today with the `env` property.

Also, you will notice that I'm not using best practices: I am putting my global elements right here in this same file. I would advise you to create a `global.xml` file in case you are using a real project. Don't do this — this is just for demonstration.

Now, if we go to the Explorer on `src/main/resources`, let's create a new file, and this file is going to be `dev.properties`. You can also create a YAML file in case you are more familiar with that — that is totally okay, just make sure that it says `.yaml` instead of `.properties`. In my case I'm just going to use `dev.properties`. All right, that is all my setup.

### Add arguments to the Runtime

Now for the fun part. Let's go to the main screen of Anypoint Code Builder to learn how to do the settings. If you see here, there is this button that says "Open ACB settings", so you will click on that. It will open the Mule settings, or all of the settings that start with "Mule".

If you see here, we have the "Mule Runtime: Default Arguments" setting. If you go right to the right of this huge string, you can add a new argument by saying `-M -D`, then the name of your argument or your property, like `env`, and then this will equal the value, so `-M -Denv=dev`. If you have an encrypted property or something like that you can also do this and then `secure.key` equals your secure key. This is how you will send this argument to the Mule Runtime once you run this application.

### Run your app locally

So let's see if this works. If we go here to "Run and Debug", just make sure that you have selected "Debug Mule application" and click on this green thing. All right, so this is deployed.

If I open my Thunder Client that I have right here, I can create a new request, and this will be to `localhost:8081/hello`, I believe. So let's send this request, and we receive a 200 OK with the Hello World. So yay, this application worked correctly because we are sending the argument.

Now, just in case you want to make sure that this is working, I'm going to stop this application, go back to Anypoint Code Builder settings, and now I'm going to remove the argument that I just added there. Save, close, and I'm going to run this again. Now we can see that our application has failed — it has not deployed properly — and if you go here it will say that the value for key `env` is not found. So you will have to set that up in the settings.

### Conclusion

All right, that is all for this video. I hope you liked it. Please go to the GitHub tutorial repo in case you have any issues, or if you want to copy and paste stuff.

### Ending screen

Remember to subscribe to the YouTube channel, follow us on socials, and go to prostdev.com for more articles and videos. All right, see you next time. Bye!
