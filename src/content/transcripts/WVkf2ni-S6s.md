---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hello hello everyone, welcome to the Data Cloud and MuleSoft integration series. My name is Alex Martinez, and today we are going to see how to do all of the prerequisites — or the settings — that you'll need to have ready for Salesforce Data Cloud in order for this integration to work.

If you're new to MuleSoft, or you don't know MuleSoft at all, that is completely fine. This series is intended for Data Cloud users, and I am going to guide you through everything that you'll need in order to have this integration ready and running.

### Creating the Connected App

All right, so the first thing we're going to do is to go to `login.salesforce.com`, write down your username and your password that you use to log in to Salesforce. So the first thing we're going to do is to go to the Setup right here on the top right corner, click on that, then right here in this screen go to the Quick Find and search for "App Manager", click on that so you can open it.

Once it's open, click on "New Connected App" right here in the corner, and we're going to be filling out the following details. First, for the Connected App name, we're going to select "MuleSoft Integration Connected App" — this can be any name that you want, just make sure that you know what the name is. The API name is going to appear there immediately. Then select your contact email — just make sure it's an actual email, because you'll receive some link there.

After that, go here to where it says "Enable OAuth Settings" and check this. For the Callback URL we're just going to add `login.salesforce.com/services/oauth2/callback` — you can also find this link here if you hover over the Callback URL. In this case we will not be using this, so we're just setting it up because it's a required field.

Next, for the Selected OAuth Scopes, we're going to be selecting the CDP scopes. So first of all we have "Access all Data Cloud API resources" — click on Add. Next we have "Manage Data Cloud calculated insights data", "Manage Data Cloud identity resolution", "Manage Data Cloud Ingestion API data" (I for sure know that we're going to be needing that one), "Manage Data Cloud profile data", "Manage user data via web browsers", "Perform ANSI SQL queries on Data Cloud data" (for sure we're going to need that one), and "Perform segmentation on Data Cloud data". As a disclaimer, I am not 100% sure if we need all of these scopes because I am not a Data Cloud expert, but I am pretty sure that we might need — at least we need the Ingestion API one and the query one. So you can figure out if these are all really needed or not; this is just for an example.

And then finally, if you scroll down here, "Enable Client Credentials Flow" — make sure you have that. So "anyone with a consumer key and consumer secret can access your org on behalf of the selected user" — yes, press OK, we are aware of that. So when you run this, the credentials thing, you just have to make sure that no one else has your credentials. That is all for this part. So just scroll down and click on "Save". Changes can take up to 10 minutes; click on "Continue".

### Generating the consumer key and secret

Once you're in the details page, scroll down where it says "Enable OAuth Settings" and click on "Manage Consumer Details". It will send a verification code to your email, and then you have to input it here and click on "Verify".

Now here at the top of the screen you'll see some consumer details — I am not showing them on purpose because I don't want you to see them. But here where you have the staged consumer details, you can click on "Generate", and this will generate a new consumer secret and consumer key. Once you have them set up right here, please copy those two, keep them somewhere safe because you're going to use them, and then click on "Apply". Once you click on Apply it will take them from here and put them up on the screen where I am not showing it.

So if at any point you feel that your credentials have been compromised — you need to change them for whatever reason — you can just come here and click on "Generate" and regenerate some new ones, and click on "Apply" so they go to the top of the screen. So that is all for the Connected App.

### OAuth and OpenID Connect settings

Now let's move on to the OAuth settings. Once more, inside the Setup part, in the Quick Find let's look for "OAuth and OpenID Connect Settings", so click on that. The only thing you have to check here is that you have the "Allow OAuth Username-Password Flows" set to ON. If you don't have it, please set it to ON; if you do, then perfect.

### Configuring the Ingestion API

Now let's move on to the Ingestion API settings. So if you go here and look for "Ingestion API", you'll be able to see here "Data Cloud Configuration", select "Ingestion API" and click on "New" right here to the right side of the screen. In the connector name we're going to be using "MuleSoft Ingestion API". I already have this set up, so once you have this you'll be able to click on "Save" and move on to the next screen.

Now once you're here, you have to take a note of the source API name that you see here — in my case it's `MuleSoft_core_Ingestion_API` — because we're going to be using this later in our MuleSoft application.

Now I already uploaded my schema, so that's why you can see objects here, but if you don't have any schema, please go to the description of the video where I have the article, and you'll be able to see a YAML schema that you can use. You can also go to the GitHub repo. Click on "Update Schema" or "Upload Schema" and put here your YAML schema — you can use the one that I put in the example or you can use a new one.

Once you have that, you'll be able to see a schema similar to this. If you use the same example that I did, then you'll have the object name "exercises" and the object name "runner profiles". Take a note of these two object names because you'll also be using them in the Mule application.

### Creating the Data Stream

So that is all for the settings. Now let's go back to the Data Cloud home page. From the homepage, make sure you select here on the apps icon, search for "Data Cloud", and click on the Data Cloud with the bunny — you should have just one, but in case you have more, this is the one that we'll be using.

Next, select the "Data Streams" tab. If you cannot see it for whatever reason, you can click on "More" and you'd be able to see it here. I already have this set up, but you will not, so you'll have to click on "New", then look for "Ingestion API" and click on "Next". Select here your MuleSoft Ingestion API. In my case, because I already have all of the objects selected, I don't have any available options here, but if this is the first time that you do this, you'll be able to see the two objects, "exercises" and "runner profiles", and you'll have to select them both.

Then inside that configuration, for both objects — for the exercises and the runner profiles — you'll select the category "Profile", and in the primary key `MA_ID`. Click on "Next", select the default data space, and click on "Deploy". Again, I am not showing these steps because I already have it set up, but once you do those steps you'll be able to see what I'm seeing right now.

So for example, if I open my MuleSoft Ingestion API runner profiles, I'll be able to see my object API name (which you'll be using in your query if you're doing a SELECT), and here are the fields of all of the object's fields that you've uploaded in your YAML schema. As you can see here, I have the `MA_ID` key as a primary key, so this is the one that I'll be using to delete objects or records.

### Recap of the credentials you need

And we're done. That is all the setup that we have to do in Salesforce Data Cloud before getting started with the MuleSoft integration.

Just to recap, you should have a text file similar to what I have right now, and we're going to be setting up the following fields:

1. The **Salesforce username** — this value will be whatever you use to log into Salesforce.com.
2. The **Salesforce password** — this is the same password that you use to log into Salesforce.com.
3. The **CDP consumer key** — this is the consumer key that you generated after you did the whole thing with the email (which I wasn't able to show you because I didn't want you to see my consumer key and secret).
4. The **CDP consumer secret** — those two are the ones that you generated from the Connected App.
5. The **source API name** that you generated from the Ingestion API — if you're using the same example that I did, then your name would be the MuleSoft integration API.
6. The **object name**, which is the object name that came with the YAML schema — if you're using the example that I did, this should either be "exercises" or "runner profiles".

And then, just as a note, I wanted you to remember what the object ID (aka the primary key) is that you set up for your YAML schema or your objects in Data Cloud — in my case it was `MA_ID`.

### Wrap-up

All right, that is all for this video. Please subscribe so you can receive notifications as soon as we publish new content. I'll be continuing with this Data Cloud series, and if you have any more suggestions on what else I should be creating content about, please feel free to comment or send me a message directly, whatever you prefer. Remember to follow us on all of our socials, to subscribe at ProstDev.com, and to subscribe on youtube.com/prostdev please. And I'll see you in the next Data Cloud integration video. I hope this was helpful, and I'll see you then. Bye!
