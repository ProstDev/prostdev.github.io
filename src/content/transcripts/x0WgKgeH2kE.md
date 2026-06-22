---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone, my name is Alex Martinez, and today I'm going to show you the differences between creating MUnit tests using CurieTech AI or Cursor AI. First let me show you the project we're working with.

This is a main flow where we receive a queue, process some variables, do an until-successful, and call a flow reference inside that. If everything went well, it publishes to a second queue and acknowledges Q1. If there was an error, it propagates to an error handler that sends a NACK to Q1 so the message can be retried.

Inside the `process-api-hr-flow` subflow, we have three different scenarios that can happen. First is the happy path: if the request arrives and everything is fine, it creates a successful response. If there's a connectivity error with the HR API call, it comes to the on-error-propagate handler and indicates it's a connection error — and because it's surrounded by until-successful, it will keep retrying until the retries are exhausted. The third scenario is if the error comes to the on-error-continue handler because, let's say, it was a bad request or something — not a connectivity error. It actually connected to the HR API but received an error back, so it will generate an error response.

There are different things we have to test. We need to check that everything is processed in the main flow, that a connectivity error triggers the until-successful retries and eventually a NACK if it can't connect. If the call is successful — or if it's a bad request (non-connectivity error) — the flow publishes to the second queue and acknowledges Q1. We could approach this by creating separate tasks for each flow and see what happens.

### CurieTech AI — Task 1 (main flow)

Let's start with the MUnit Test Generator in CurieTech. I'll upload our project, enable coverage, and select at most three MUnit scenarios. I have Java 17, Maven 3.9, and I'll select the main flow first. I'm going to submit that test. While that's happening, I can go back home, click MUnit Test Generator again, enable coverage, select again at most three scenarios — everything is the same except now I'll select the HR API call subflow. I'll submit that.

If everything goes well, these two tasks will generate 100% coverage for my whole project. It's really cool because I didn't have to explain anything — I just selected the flows and hit submit. Let's see what it generates.

For the first task, we already have an MUnit scenario generated. Looking at the details:

- **Test scenario 1:** Happy path where a message is received from MQ, processed, and the message is acknowledged.
- **Test scenario 2:** The HR API call fails with a connectivity error, triggering until-successful and eventually a NACK from the original queue — exactly what we expected.

For the second task, we can see it generated MUnit scenarios:

- **Test scenario 1:** Happy path where the HR API request is successful.
- **Test scenario 2:** Throws a connectivity error and returns an error response.

It's missing the third scenario where the HTTP request returns an error that's **not** a connectivity error, but we can fix that by adding notes.

After 2 minutes, it generated my MUnit scenarios. Both tests passed and my coverage is 90%, which makes sense because it's not checking the third scenario — the non-connectivity error path — but that's okay; we'll fix it.

The second task completed after 3 minutes 38 seconds. It generated the two tests and 27% coverage for the whole application (because this is just a subflow). We can see both test scenarios and the full XML. But now we know it's missing the three scenarios we need. That's totally fine — let's just upload the project again, enable coverage, select at most three scenarios, and now we'll add some notes.

### CurieTech AI — Task 2 (HR API call subflow with notes)

Here are my notes:

> Generate three different test case scenarios. One, happy path where the HR API call was successful. Two, connectivity error from the HR API call. Three, bad request error or any other error from the HR API call, which will result in the on-error-continue error handler and will create an error response.

I selected the HR API call flow and submitted.

While that runs, let's download the two tasks we know we want. I'll extract the generated zip file — everything is in there. I go to `src/test/munit` and copy the generated flows. Then I copy everything from `resources` into my project resources folder.

Now I can run Maven clean test. I know I could technically use the testing part from Anypoint Code Builder, but I've been having issues with that — my problem, I don't know why — so I run the tests with Maven in the command line.

Meanwhile, the third task is already generated. Looking at the scenarios:

- **Scenario 1:** Happy path where the HR API call is successful and returns a valid response.
- **Scenario 2:** HR API call fails due to a connectivity error, triggering on-error-propagate.
- **Scenario 3:** HR API call fails due to a bad request or any other error, triggering on-error-continue and creating an error response.

The behavior here is that it mocks the HTTP request connector to throw a non-connectivity error, like HTTP bad request or any other error — exactly what we wanted.

Back in my repo, I can see the tests passing. The first task generated 90.91% coverage, just like CurieTech predicted. The third task took 6 minutes 13 seconds because it was generating three scenarios instead of two. The three scenarios all passed, and the coverage is 36%, which is expected.

Now I'll download that code, extract it, and add it to my project — the flows go in `src/test/munit/flows`, the resources go in `resources`.

Let's run Maven clean test again. Now we can see we have **100% application coverage**.

Honestly, this was super easy to do. It only took me less than half an hour to generate 100% coverage for the whole thing. I only had to generate a second task once because it generated two tests instead of three, but that's fine — I just added notes for the next task and it generated exactly what I wanted. That's really cool. I give it 100 out of 100 and I would really recommend you try it out. I'll put this repo on my GitHub so you can take a look.

### Cursor AI — Attempt 1 (generic prompt)

Now let's try a little bit of Cursor and see what happens. I'm going to discard all my changes. MUnit is empty, resources is empty. Let's start again from scratch.

I'll open the main flow and let's see what Cursor can do. Let's start by asking something really generic and see if it can handle it: "Generate a unit test to have 100% coverage."

It's trying to generate a new test file for the main flow for both success and error scenarios, but it's having some issues. It seems to be stuck, but to be fair I'll start the stopwatch — we gave CurieTech a few minutes, so let's see what happens.

Oh, that was my bad — I was trying to start the stopwatch and clicked something. Okay, let's try this again. Send it again, click continue and revert. Now I'm going to add a stopwatch — starting now. Let's see what happens.

It's also worth mentioning that I'm using the **business account** for Cursor now, so I'm not on the free account anymore. I actually have some power now. Let's see.

It seems like it's trying to fix some errors. I don't see anything here, even though I see some code. Okay, I can see it's generating a flow. What? It's been 2 minutes. I'm going to stop this now.

I am very confused. This is a flow. This is another flow. These are just flows. This is not going to run at all. Let me reject everything it did.

### Cursor AI — Attempt 2 (detailed prompt with mocking instructions)

Alright, let's give it more detail. I'll tell it:

> Generate a unit test to be able to cover the different test case scenarios from the Mule app. One, happy path where the HR API call was successful. Two, connectivity error from the HR API call resulting in a NACK. Three, bad request error or any other error from the HR API call which will generate an error response but won't result in a NACK — it will actually result in an ACK like the happy path. Make sure to mock all the external calls like the HR API call or the Anypoint MQ calls.

I'm telling it to mock because Cursor is not specific to MuleSoft like CurieTech is — CurieTech just knows you need to mock things; you don't have to explain it.

I'm starting a new stopwatch now. Alright. It's been 7 minutes. I even went for a coffee and everything. I'm going to stop it.

So we have the happy path: it mocks a successful HR API response, mocks the Anypoint MQ publish operation, mocks the ACK operation. Connectivity error test: mocks an HTTP connectivity error, mocks the NACK, verifies the flow handled the error. Bad request error: mocks a bad request from the HR API, mocks the publish, mocks the ACK, and verifies behavior.

It says: "Each test case sets up the initial event, mocks all the external calls, verifies the behavior. To run these tests, use Maven clean test."

I already know how to run them. But I see **a lot of errors**. What is this? Why are there errors? There's just an `assertTrue`. What are you even testing here? Is this assert not null or something? And this is unknown, unknown. And what are you doing here? This is like a huge waste of my time. No — not using best practices. No. Let's just stop.

### Verdict

Pretty much what we're seeing here is: CurieTech is generating the MUnits beautifully. It does take a few tries, but we're talking 6 minutes, 3 minutes, 2 minutes. It pretty much makes sense when you don't have to give a lot of direction. I only had to give direction to one task, and I only used like three sentences. I would definitely use CurieTech for my MUnits anytime.

Cursor, on the other hand — I feel like CurieTech is like a senior developer that already knows what to do, and maybe you just have to give it some mild direction like "Okay, you missed this though," and they're going to be like "Oh yeah, you're right," and bang, here it is. But Cursor is like an intern, where you have to tell it exactly what to do. I mean, what are you even doing here? This is not even running. This doesn't even work. I'm not even going to try to run it because it clearly has a ton of issues. It needs a lot of direction.

Maybe in the future Cursor is going to be ready for MUnit tests, but right now MUnit tests are so specific and I doubt that a lot of people use them — even MuleSoft developers. So there's not a lot of information for Cursor to see out there on the internet. So it makes sense that it's struggling with it. Cursor definitely cannot handle MUnit tests. This was just awful. I would advise you to just go to CurieTech.

### Closing thoughts

Alright, you saw it. You can try it. I will put my repo with the tests from CurieTech out there if you want to check them out and verify that they are actually good. But just go ahead and try it — it's free. Just go to CurieTech.ai and try it out by yourself. Let me know if you make it work and what you did.

I'm just really happy with CurieTech. We've seen DataWeave already, now we're seeing MUnit. This is just awesome. We'll see how it works for further tasks.

Alright, that is all for this video. I will see you in the next video where we keep trying AI tools to make your life better. Bye!
