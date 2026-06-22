---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, my name is Alex Martinez, and today I'm going to show you how to authenticate to Data Cloud if you have to do it manually.

There are a lot of connectors that you can use where you don't have to manually do all the authentication — specifically for Data Cloud, there are some connectors for Data Cloud in MuleSoft that you can use so you don't have to manually do the authentication yourself. But I needed to do an operation that was not available in the Data Cloud connector, so I had to manually do the authentication in order to be able to use that.

It took me a while to figure out, because I did not know that you first have to do the authentication to Salesforce and then you can do the authentication to Data Cloud. As you can see, I'm not a Salesforce expert, so I was really struggling with this one because I wanted to do it from MuleSoft.

### Creating the project

So first of all, just click on "Develop integration". Yes, I am in Anypoint Code Builder — I just prefer it over Studio, but you can go ahead and do it in Studio as well. My project name is going to be "Data Cloud auth", and I am selecting the latest Mule runtime and the latest Java version. Click on "Create project".

All right, so once it's created, I'm just going to go ahead and build a new flow. Now inside this flow, I'm just going to show you really quickly: we have the Salesforce connectors — these can be either Salesforce CDP or Salesforce Data Cloud — and this is where you would use directly all of the operations that you need. But in my case I wanted to use the "Get all jobs" operation that is not currently available here, so I had to create it from scratch.

### Building the first request (authenticate to Salesforce)

All right, so the first thing is that you need to create a request that will be sent into Salesforce. So for this I am just going to create a new Transform Message. I kind of already had this preset, but you can see what you need for this Transform Message. In this case, because ACB doesn't let you use the UI yet for the Transform Message, that is okay, so you can use it directly here as a Transform Message and you can put the code here, or you can also put it in an external file, but for now let's just leave it simple.

Zooming in a little bit so you don't get lost. So first of all this output will have to be `application/x-www-form-urlencoded`, so this is going to be in that format. And then down here we can get started with our body. So this is going to be an object, and inside the object we're going to have first the client ID.

Also note, there are different ways to authenticate to the Salesforce API, or to retrieve the Salesforce authentication. In my case I am going to select the password type, but you are free to use whichever type that you want. So here's a client ID, I'm going to leave it empty for now, then we have the client secret, I'm also going to leave it empty for now, then we have the username and the password. Finally the grant type is going to be `password`.

So once again, you can go to the Salesforce documentation to make sure what is the request that you want to use. I tried using other ones but it didn't work for some reason for me — maybe I did something wrong — but this is the one that did work for me. So you'll have to do a Connected App so you can extract the client ID and client secret, and the Connected App has to be configured for the authentication. So I have a few videos and articles on how to do that configuration. And then just use your username and password that you used to log in to Salesforce.

### Setting the credentials as properties

For this case, because I want to show you that it actually works, I am going to have to add some properties to this so you don't see my credentials. All right, and here we have it: we have the Connected App client ID, Connected App client secret, Salesforce username, and Salesforce password.

So really quickly I'm going to set that up in the globals — so Properties, and we have here the Configuration Properties. So the file is going to be just `default.yaml` and that's it. You should have your global properties in another file, but just for the sake of this demo let's just do it like this. And then I'm going to create a new file here called `default.yaml`. In here we are going to set up our Connected App, and then we have client ID, secret, then we have Salesforce username and password. So now I just have to put my credentials here — and you can also do it in quotes just in case you're not sure if it's actually taking the correct value or not — and just put here your credentials, and I'll be right back.

All right, my credentials have been set, and now this is going to take them from the properties and put them here and send this as the payload.

### Sending the first HTTP request

So now we have to add the request, the HTTP request. First I'm going to go to the Advanced tab, and I want to save this as a variable, so this is going to be the Salesforce response variable, so I'm going to change the name to that as well. Now if I go back to General, this method is going to be a POST, and the URL is going to go to first the `login.salesforce.com` and after that to `/services/oauth2/token`.

So remember this URL: if you're trying to log in to just the general Salesforce.com service, then that is the URL that you need to get the authentication token from Salesforce. Remember, first step is to get it from Salesforce.

### Building the second request (authenticate to Data Cloud)

And after we receive the response, which is going to be saved in the SF response variable, then we need to create yet another request. So if we use another Transform Message, and now we need to do the second request to get the authentication for Data Cloud. So first of all, this format is going to be yet again the form URL encoded. Then we are going to do another object right here, and inside the object we are going to have the grant type once again, but now the value that we're going to send here is going to be hardcoded to this `urn:salesforce:grant-type:external:cdp`. So here CDP, this is what we are requesting, which is the Data Cloud access, or so I think.

After that we have to set up the subject token, and this is going to come from the variable that we just created, which is the Salesforce response from the request, so if we do `vars.salesforceResponse` and then inside here we're going to have an access token in the response, so we simply have to do `.access_token`. We're going to retrieve that access token that we got from our Salesforce response, and this is going to be sent there. And finally the subject token type, and this is going to be hardcoded once again, so now this is `urn:ietf:params:oauth:token-type:access_token`. I don't really know what that means, but okay, that's how it works. I did tell you I'm not very good at Salesforce.

And now we're going to send another HTTP request here, but now this is going to be interesting. But first let me go in Advanced and save this in a variable — so we named the other one Salesforce response, so let's call this Data Cloud response. I guess it's not really calling Data Cloud, it's still calling Salesforce, but I just want to make sure that I know the difference here.

All right, so if I go to General, first the method is going to be POST, then the URL — we're going to make this a `++` (concatenation), because the first thing that we're going to get from here is the variable, so the Salesforce response that we created earlier, we're going to use that one, but instead of (for example, here we got the access token) instead of getting that, we are going to get the `instance_url`. And after that we are going to concatenate a string, and this string is going to be `/services/a360/token`. So this is where we are going to be calling our second request, but we needed to get this instance URL and this access token from the first request in order to do this one.

And that is the whole authentication. After you receive this second response, you will once again retrieve the instance URL — but not from the second response, sorry, from the first one — and then you will be able to call the Data Cloud API to do whatever you wanted.

### Calling the Data Cloud API (get all jobs)

In my case it was to get all of the jobs that were currently available in my organization. So how to do that: we do another request, and now if I take a look at this request and I go — this method is going to be a GET, but then the URL, let's do a formula right here, and what we're going to have here is first of all a string saying `https://` and then we're going to add whatever we got from the `dcResponse.instance_url`. So this is again from the second response — you got an object and one of those properties was the instance URL, so you're going to use that to be the host. Plus, and then you can finally add the string of whatever you want the path to be — in my case I needed to use `/api/v1/ingest/jobs`. So this is the URL that I was trying to get to.

I just needed the Data Cloud response instance URL, and we also need to send a bearer token in the headers. But in this version of Anypoint Code Builder I cannot add the headers here, so I'm going to have to add them manually instead of using the UI, but that is okay because we're not afraid of using code. So pretty much you open this thing and then you close it, and then here inside you just have to look for HTTP headers, and here you have the CDATA. So inside the CDATA you can pretty much create an object, and inside the object we're going to add the authorization, and this is going to be `Bearer ` space (very important to leave the space right there) and then plus, and we're going to do `vars.dcResponse.access_token`. So from the Data Cloud response we are using the access token and the instance URL.

And that is all. We should be able to call this — wait, I'm missing the HTTP, so we need an HTTP listener. Connectors, HTTP Listener, and we need to add the global property for the listener, so let's do that quickly: HTTP Listener config, this one, and we're calling `localhost:8081`. Perfect. So now here we just have to select that HTTP listener. Let's do test right here, and that is all.

### Running and debugging

So that is all. Let me save this and run it. All right, this has been deployed, and let's send this and — ta-da! — we correctly get all the data from the response. I'm not going to show a lot of the data because I don't know if I can show it, but we can see that we are authenticating correctly.

Now let's see if we can debug. So first of all, I'm going to set up a breakpoint in the Transform Message — here's a listener, here's the transform, I have a breakpoint there — then let's do the HTTP request, and then the second transform, the request, and the final request to the actual thing that we need. So I set up breakpoints everywhere. Now let's run this again to see if we can stop and watch what's happening.

All right, this has been deployed, let's send the request, and now we stop here at the beginning. There's nothing in the Mule message, so we continue, and now we are at the request and we already have a Mule message here, and in our payload we correctly have all of the things that we have to set up. I'm not going to show all of them because of security issues, but we have the client ID and everything that we needed set up.

So after we continue, we can now see in the variables that we have the Salesforce response, and we have an access token that I'm not going to show, and we have more stuff like the instance URL and so on. So now if I continue once more, now we get to the HTTP request, we have the variable SF response, the Mule message now contains our new stuff which is the grant type and so on, everything that we set up right here. So now if we continue and send that request, now we have two variables, the Salesforce response and the DC response, both of them have access tokens and more stuff that I'm not going to show you. And finally if we finish, now we send the last request and we receive correctly the data from Data Cloud.

### Wrap-up

All right, that is all for this video. We learned how to manually do the authentication to Data Cloud using MuleSoft. Remember that you don't have to do this if the operation is already there in one of the MuleSoft connectors. So another thing that you could do would be to create your own connector, so you don't have to do this authentication manually — but I'm just waiting for the connector team to create that last operation that I'm missing from the Data Cloud connector, so this is just a temporary setback that I had to set up. But then I'm sure it's going to come out and I'm going to just update it to the new version of the connector. But for now, at least you'll learn how to actually do the authentication and everything in case you need to do your own API that is not in MuleSoft specifically — at least you can see all of the steps.

All right, that is all for this video. I'll see you later in another Data Cloud and MuleSoft, or just MuleSoft, video. Bye!
