---
source: 'Edited from the spoken video for readability'
---

### Introduction

Hello there, Alex here! So you are here because you want to learn more about APIs, and that is exactly what we are going to be doing in this video. We are going to learn the basics of APIs without getting too deep into it, and also learning what is the API-led connectivity approach from MuleSoft.

Now remember, this is a live stream and the only thing that I did was edit it down for you to make it shorter, more compact, and easier for your digestion. So I hope you like this video and I will see you in the next session. Now let's watch it!

All right, so if you go to my blog prostdev.com and then you go to the part here that says blog, you will find the list of all of the things that I've done. If you go here to others and scroll down, you will find the Understanding APIs series. So this is the series that I'm going to go through right here. The first one, and I'm also going to put the links there so you can have them and follow with me if that's better for you.

So the first part is basically just getting started from the beginning. What is an API? If you have absolutely no idea what an API is, this first part is basically trying to give you some basic idea but not really getting into the details. So I'm going to go kind of quickly through all of these posts because I just want to show you the bigger picture of what we are going to be doing, but again you can go through them on your own and that is completely fine.

### What is an API?

In summary, this is how I look at it. We have here the implementation of the API, or the API if you want to just look at it that way, and this implementation can be created in a bunch of different languages, right? In MuleSoft, in Ruby, Python, PHP, Node, you name it. So this API, for example, the API that we're going to create is going to be created on MuleSoft, but it can be created in a number of languages or tools.

And the fun thing about APIs is that you don't know and you don't care what they are made of when you are using them. So for example, if I were to use the Twitter API, I don't care if it's created on Java, on Python, on Ruby, whatnot. I am just going to be sending something and receiving something, and that's the fun part. All of these APIs can be created and managed however they want, and the only thing you need to worry about is how to call it and what you're going to receive in return.

So here I wrote that it basically has like four different aspects to it. It has inputs, so you send something to the API, or it has an input that it receives. Something inside the API, it has operations, which is what you want the API to do with the input that you sent. It has outputs, what is going to return to you, and it has data types. So what kind of data are you going to be sending or receiving back? It has of course a lot of different things, but this is just a quick intro to it.

So for example, we have request and response. Whatever you send to the API is a request, and whatever you get back from the API is a response. So now putting it all together, I came out with this diagram that I like very much because it's simple. And if you already know about APIs, this is way too simple, but if you are new to APIs, this is perfect because you're just getting started.

So this is the way that I look at it. You, please feel free to create any other diagram that makes you feel better if it improves how you look at it. This is just how I look at it. So we have the implementation of the API, or the API itself, whatever you want to call it. Here you have the request. You send the request into the API and you get a response back from the API, right?

So in the request you send your input along with the data type and the operation. We're going to see some examples a little bit, or analogies, so this makes a little bit more sense. So you send your input data with the data type. It can be a JSON format, a CSV format, a number, I don't know, whatever. And the operation, which is what you want the API to do with that information. And then you get a response which is the output with the data type. So this data type can also be JSON, CSV, XML, a number, or it can also be like nothing. It's just like something that comes back to let you know if the operation was successful or not, or like what happened inside the API because you cannot look into it.

### Analogies and Examples

Part two is the analogies and examples. So let me put that in the chat. All right, so this is a diagram that we came to, and then the first analogy is a restaurant.

For example, here we have another diagram. You are the client, right? And you arrive to a restaurant and they give you a menu, or you take the menu and you take a look at the menu to see what is available for you to request, right? You cannot request anything that is out of the menu because they won't have it. They are literally listing whatever is available for you to order.

So you take a look at it and then you make a request to the server and say, "Hey, I want a hamburger," for example. And the server is going to do their thing. Like, you don't know what the server is doing. You don't know if they're going back to the kitchen, if they're writing it down, if they are just telling it, if they are inputting it in a computer. You don't know what the server is doing, right? And you don't care. You just care that you requested a hamburger and that you get back exactly what you requested, which is a hamburger.

So you make a request with your input and your operation, I guess. You make a request. You say, "I want a hamburger with, let's say, pickles," or "no pickles," "with no onions," "with extra cheese." I don't know, you give it options to be personalized to you. The server is like, "Okay, I got your request, I will be right back." They go, and then they come back with your dish. And that's it. That's an analogy of an API because you are making a request and you're getting a response, and the response is hopefully the same thing that you asked for. And you also get the menu saying, "This is what's available for you to order." That's pretty much it. So the server would be the API, and you are requesting something and getting something in return, which is a response.

Then we have a calculator. You would also probably wouldn't care about what the calculator has on its inside. You don't really care about what happens when you push a button or what happens when you put some batteries on it, whatever. It functions in its own way and you don't necessarily know how it functions on the inside. You just know that if you press some buttons, you get something in return, right?

So in this case, let's say that you input 2 + 2. So two and two would be the inputs, and the operation would be the plus because you're telling it what to do with these two inputs. With 2 + 2, you can also say 2 - 2, and it's the same input, just a different operation, right? So this is what you are requesting to the calculator, and the calculator, once you press equals, it will output a four.

And in this case we also have data types because two, two, and four are numbers, and that is our data type. Our request data type is a number, and our response data type is also a number. And as we saw from previously, we have input with data type plus operation. We have inputs, data types, operations, and at the end we have the output with data types, which is output, and the data type is a number. Here's a request, here's a response, and we don't care what's inside the calculator. We just care that we send something and we get something in return. That's pretty much it.

Then we have some like more real life examples, I would say. So for example, if you have an HR system and you have listed everything in a CSV format, I hope you can see, you have everything listed in a CSV format. You have the employee ID, you have the employee first name, the employee last name, and then you send all of these as a request and say, "Get the employees' first day of employment." So then the API returns this CSV, which also contains the same things that you sent in the request, but it adds a new field at the end, which is the first day, and there you have the dates. So that is another example.

Here's another example. That was a CSV. This is a JSON. So here you send this as a request. This is your input, this is your data type, which is JSON, and the operation is, "Can you please get the employees' first day of employment?" which is the same but with a different data type. And the API will respond another JSON with the same information that you sent: employee ID, employee first name, employee last name, and the first day of employment. So this is a JSON instead of a CSV. It's exactly the same operation, it's exactly the same input or data, it is just in a different data format.

Now some real life APIs, if you want to check them out: Twitter API, Slack API, Google Maps API, or Facebook APIs.

### HTTP Methods

Part three: what are HTTP methods? As I said, I'm going to kind of rush into this because I just want to get the basics done before we start explaining some more other stuff.

So we had the calculator analogy and we broke down the four aspects, which is the inputs, the data type, the operation, and then we have in the response the output and the data type, right? And then for the human resources API, we did the same thing. So we had here the operation is an addition, right? And then on the HR API we have here the request, response. Inputs is this, data type is CSV, and the operation is a GET. So this is where it gets interesting. This is a GET operation. Then the output, we have the same thing, and then it's a CSV. Remember that the operation only goes in the request, not in the response, right? Because you are just telling the API what you want the API to do with your input.

So there are some different HTTP methods that exist in real life for the APIs. We have these examples: GET, POST, PUT, PATCH, and DELETE. Those are the most important ones, I would say, but there are more. So if you want to take a look at the whole list, it's going to be there in the post.

In summary, GET is used here to read or retrieve data from the server or API. So we used GET in the Human Resources API example because we are just telling it, "Get some information for me," or "Get some information for me." It's also good that the names are kind of straightforward, right? I'm going to skip this in a little bit because I just want to go to DELETE. So GET and DELETE are the easiest, right? Get information, delete information. Simple as that.

But the fun stuff is when we have POST, PUT, and PATCH, because it really depends on how you design your API is how you are going to use these methods. I have seen APIs that simply use POST for everything. They never use PUT or PATCH. That depends on the architecture of your API.

But if we follow what MuleSoft is telling us here about designing your API, is that POST should be used when you want to create new data. So for example, if you want to create a new employee in your Human Resources API example, you would use POST to create a new employee.

Then PUT is mostly used to update or replace existing data, but it can also be used to create new data. And that is where the confusion starts. The difference with POST is that PUT is an idempotent method, which means that sending the same information more than once will have the same effect.

So what's the difference then? If you try to create, for example, a new employee using POST and you send it once and you send it twice, like the same information, and you send it three times, you will be creating three different employees with the same information, which is a duplicate, right? But if you use PUT, again according to design principles, you will not be creating duplicate data. If you send the same information three times to the API but using PUT, you will only be creating one new employee because it's the same information and we don't want duplicates. That's the main difference.

Again, you can code it however you want. I have seen APIs that only use POST. There's no right or wrong here. It's just how you prefer to do it. If you prefer to stick to MuleSoft standards, then you should follow this. If not, that's all right.

Then we have PATCH, and this is used to update or modify parts of existing data. So the difference between PATCH and PUT, because PUT is also used to update, is that with PUT you would normally send like the whole information, for example the whole data of your employee. And with PATCH you would only use a small part. So if you were to change, for example, the name of your employee because you had a typo, if you use PUT you would have to send the name, the last name, the ID, the first day, whatever more information you have. But if you were to use PATCH, you could only send, for example, the ID and the first name, and it would update using the ID of your employee. It would update just the first name that you sent. That is the difference. And PATCH can also be an idempotent method depending on how your API works.

### What is a URI?

Part number four: what is a URI? So here we have an example using a joke API. If you click on it, here I have a URI which is official-joke-api.appspot.com/random_joke, and I get a random joke. "When do doctors get angry? When they run out of patients." Haha, okay. So there's an example, and we are now going to take a look at what is this URI.

If I go here, so the complete URI is https://official-joke-api.appspot.com/random_joke. The protocol is https, which is Hypertext Transfer Protocol Secure. It can also be HTTP. It can also be a lot more, but we are just focusing on the REST APIs which are using HTTP.

The host, the host for this URI would be basically everything that is in between the double slash and the next slash. So official-joke-api.appspot.com, or also like whatever has the main domain. Then that is your host.

And then we have a path, which is /random_joke, because if you change the path to something else, maybe we have something else here. Yeah, so for example, this is /random_joke and this is /jokes/random. So that's different. And then here we have, for example, /random/10. That's a different path. Or here we have /jokes/10, which is also a different path, and so on. Like, the host is always the same, official-joke-api.appspot.com, which is where your API is living. And then depending on the path that you use is what you will be accessing or what you will be getting back.

### Query Parameters

Intro to Postman and query parameters. I'm not going to go through Postman right now because we don't need it, but if you go through the article that I just posted, then you can try it out to see, to follow through everything that's here and see if that works better for you to understand.

So this is creating a new... this is Postman. It's basically to send requests to APIs and to be able to see the response in a better way. So for example, you saw like I opened my browser calling the random joke and I received a weird format that if you are not familiar with JSON, then you might have a little difficulty trying to understand it.

If you use Postman, for example, this is how it looks like. You have the HTTP method, which is a GET. Let me zoom in a little bit. And then here you have the URL, which is official-joke-api, blah blah blah, /random_joke. And then you click on send here, and it will send this request and receive a response, which is this one. And this is a different joke. So here you can see, for example, that there's an ID, there's a type, there's a setup, and there's a punchline. That's why Postman is, well, it has a bunch more neat things to Postman, but that's mainly why you would use it if you're just getting started.

So what are query parameters? For example, if you go to Google and put google.com/search and then there is this question mark q=cats, that is the query parameter. So we have the protocol https, the host is google.com, then the path is /search, and the query parameter. The name of the query parameter is q and the value is cats. So basically we are using the search path because that is where Google is using, I don't know, its logic, and then we are sending the query, which is cats. So we are looking for cats.

What are the elements of a query parameter? We have the question mark, then we have the equals, and if we were to have more query parameters, we would be using this sign. I don't know what that name is. So for example, here we have whatever this path, and then we put a question mark, which means that the query parameters are going to be started here. We have query parameter number one, which is cats, and then we have the ampersand symbol, I guess. Then we have query parameter number two equals dogs, and query parameter number three equals squirrels. This is just an example. It won't work, of course.

And then here's a more complex example. If you go to expedia.com and search for a hotel, after you click on search, you can take a look at how your browser looks like, and you will notice that it has query parameters. So for example, here, this is just an example. I searched for adults=2, and then d1, day one I guess, is 2020-11-23, and then day two is this, destination is Toronto, Toronto and vicinity, blah blah blah, and date is this, regionID is this, rooms is one, and so on. Like, you can see that there are more query parameters being sent.

So you can also put this in Postman so you can see the different query parameters, because in Postman you can just go here to the Params tab and it will list them for you in a way better way. So you can see adult, day, date one, date two, destination and date, rooms, and so on. So this is easier to read.

### HTTP Status Codes

Now what are HTTP status codes? This is the last post that I created. I think I just ran out of time when I was creating them, so I wasn't able to continue the series. But there are more things to it, like headers. Actually, just headers. Headers are basically like parameters. The difference is that headers don't go into the URL. They just go in the request, but they don't go into the URL. It's kind of hard to understand, so if you download Postman you can check it out. I think, yeah, here, for example, you have parameters, authentication, and headers. So if you go to headers, you can see that there are eight headers being sent that you are not sending. It's just Postman that's sending them for you. I don't know, stuff like what is the data type that you're sending, or where are you sending this information from, like from Postman, for example, or more information that would be needed by the API.

So what are HTTP status codes? We have been focusing on the request, right? We have seen the inputs, the data types, the operation, which is the HTTP methods, and we saw the query parameters and a little bit of the headers, which all goes in the request. But then what goes in the response, apart from the data type? HTTP status codes.

So let's see. There are a ton. Here is a complete list of HTTP status codes. Like, a lot. But they are separated by like the first digit. You have, if it starts with one, it's just informational. If it starts with two, is a success. Means that it's a success. There are different types of successes. If it starts with three, it's a redirection. Four, client error. And five, server error. And here you can see all of the different error codes.

Again, these are standards that you could be using for your APIs, but you can honestly do whatever you want with your API. I have also seen APIs that only have 200, 400, and 500, and that's it. It really depends on what you want your API to do.

And there are also some stars here, which means that these are the most popular APIs, and HTTP status codes to use in your APIs. Like, if you want to give a success back, you can send 200 OK, which is the one that I have seen the most. You can also send 201, which means created, or 204, which means no content. So like, something was done. Like, 201, if I understand, is created and returns back the information that the API created so you can see. And 204 is, it means like it was successful, it was created, but there is no content for you. So just know that it worked.

For example, 400 is a bad request. It means like you, from the client side, you did something wrong with the request. So for example, when you were ordering in the restaurant, you ordered something that did not exist, so they are not able to do that. But it was your fault, not their fault, basically.

401, unauthorized, means that something in your, like for example your username and password that you use to access the API, are not correct. So it's unauthorized for you to get into the API.

403, Forbidden. I don't remember exactly what it means, but that's for some reason you weren't able to access the operation or the resource that you were trying to get, or just you couldn't do the operation. I don't know, something like that. I don't know them all like by memory, but they're there. You can just consult them.

404, not found. That is, I'm sure you have seen this when you are trying to access something that doesn't exist. So for example, let me take this URL and put something weird at the end. And once I access, it's going to tell me that it doesn't exist. So we couldn't find this page. If I were to send this from Postman, you would see that it would return a 404 error because it doesn't exist. And so on.

And then the 500 errors, like 500 internal server error, means that there was something wrong from the API side, not from your side. So you did everything great. You sent the right authorization, the right request. Everything you sent was okay. There was just an internal error in the API that they couldn't solve, so they will send you a 500 to let you know that there was something wrong from their side, from the API side, and not from your side.

And I put a joke here because it's nice to lighten the mood a little bit. A parent tells the teenager to clean the room. The teenager responds 202. And the parent goes away. Some hours later, the parent comes back to see that the room is still dirty and asks, "Why isn't it clean yet?" The teenager answers, "I said 202, not 200." I'm sure that's not funny, but it was funny for me.

### API-Led Connectivity

Anyway, so we have this image. This is basically what we call an application network representation, right? For example, like, let's say you have Salesforce APIs that you connect to MuleSoft APIs. You have Workday, you have Twitter. You can connect to your car, connect to your smartwatch, to SAP, to Facebook. Like, you name it. There are different APIs in the world and you can integrate them or connect them using MuleSoft, right?

So now what is API-led connectivity? This is basically it. It's just an approach, an architectural approach that you can take, or that we tend to do with the APIs that we design using MuleSoft. Maybe you will start taking a better look at how this all looks when we start implementing it, because they will start like talking to each other and so on. Or maybe we won't even get to use API-led connectivity in this case because it's just a simple API and we are not connecting like a bigger system.

But basically there are three layers to this approach. We have Experience APIs, Process APIs, and System APIs. Experience, Process, System. And what happens is that the ones at the top, the Experience APIs, are the ones that will be connecting directly to the client. So for example, here we have an API that is for connecting to a mobile application. Or here we have a web API that is connecting to a computer. We can have another one for your smartwatch, another one for your car, and so on, right? So these APIs are the ones that are going to be created to talk to those specific devices, for example.

Then in the Process API, we are going to be handling all of the orchestration. Or better, if I go to the System APIs at the bottom, these are the APIs that are connecting directly to external systems, like FedEx or a database, and I don't know, an SQL Oracle database, SAP, Salesforce, or even just like an e-commerce database or an e-commerce system. All of the APIs that will be located here are the ones talking directly to these systems. And that is all that they are doing. They are taking the information from the Process API, they are translating it to match the other APIs, the external APIs. And then when the external API comes back with their answer, the System API is responsible for transforming, or it also depends on your architecture, but that's all these System APIs do. They just connect to the external systems.

So in theory, you should have one System API per external system.

And the Process APIs that are in the middle of the two are basically the ones that create all of the orchestration, translation, whatever needs to be done. For example, from the mobile API, you talk to the shipment status, you talk to the order status, and you talk to the order history API. And then from the shipment status API, you talk to FedEx and you talk to the call center, it says right here. Or the order history talks to customers and talks to orders, and so on, right? So this is how the API-led connectivity approach works. It's basically just, again, a guide for you to design better systems.

### Wrap-up

That's all from me. I hope you like it, and I will see you then on the next session on June 14 at the same time to start designing our API then. All righty, see you then. Later, bye!
