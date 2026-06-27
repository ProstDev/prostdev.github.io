---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hey guys, this is Leonardo Gonzalez from Mexico City. In this video I'm going to do a very quick tutorial for our friends at ProstDev, one of my favorite MuleSoft development communities. So this video is about a new Anypoint Studio feature in the newest version, which is `7.10.0`, that has been available since last week. What I want to show you is the new notification center for new versions of connectors. This will help us get some recommendations when new connector versions are available.

### Release Notes

As of this new version, it's no longer necessary to go to the Anypoint connector release notes right here to discover which are the new versions of the connectors that we are using in our Mule applications. For example, I'm using here the File connector and the Database connector, so we can do this with a few clicks in our applications.

As you can see, the new version was released last week, and the release notes indicate that this new feature is already available. So we are going to try it. This is saying that Anypoint Studio `7.10.0` introduces a new notification mechanism to help us keep up to date with the newest version of each module in Anypoint Exchange. So let's try it.

I already have downloaded the latest version of Anypoint Studio. If you don't, you can download it right here on the official Anypoint Studio website, so you can do that. This already installs my latest version of Anypoint Studio.

### Demo

So all we have to do is right click on our Mule project and choose the Manage Dependencies option, and finally the Manage Modules option. That's it. The blue dots on the left of the version of each connector indicate that there is a new version of that connector available in Anypoint Exchange.

So to update them to the latest version, it's very easy: we just have to click on the Update version button right here for each of these connectors, and that should be it. Just click on Apply and Close, and that's it. All versions of our connectors are now up to date.

As you can see in the `pom.xml` file, this guy was `1.10.0`, now it's `1.10.3`. And also, where is the other one, which is the File connector? This guy also was `1.3.0`, now it's `1.3.4`.

### Ending

So that's it. You are on the latest version now. Thank you guys, happy coding!
