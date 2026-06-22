---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, Alex here, back from vacations. This is the DataWeave challenge number seven. So in this challenge I am going to explain what we are going to do, but basically we are going to transform a JSON structure — or the values from a JSON structure — into something else.

### The challenge

First of all, this is our input JSON structure. We have different objects, different arrays, and so on — some of them are nested, some of them are not, and some of them have numbers and some of them don't. And that's all right.

What we are going to transform: first of all, we are going to transform every single value into uppercase, so "a" will be uppercase, "b" will be uppercase, and so on. But the second condition is that the values with the field name "this" are not going to be transformed. There are two fields, or two values, with this name "this": here we have "def" and here we have "h". Both of those values are not going to be transformed into uppercase.

So we end up with something like this: "a", "b", and "c" have been transformed to uppercase, but then "def" has not, it's still in lowercase. Then the same applies for the rest of them — all of them are in uppercase with the exception of "h", because of the "this" name field.

### Wrap-up

And that's all for this challenge. It sounds like it's super easy to do, but if you don't have the correct function you will have a hard time doing this. So I recommend you read the documentation first, because there is one function that is going to make your life way easier — you can just use this function and this problem will be solved with that. But you have to really read the documentation if you are not familiar with this function.

If you are watching this video from YouTube, you can go into the description of the video to find the link to this article, where you will find more clues if you still don't know what function I'm talking about. So that's it for this challenge. Good luck, and I will see you in other videos. Bye-bye!
