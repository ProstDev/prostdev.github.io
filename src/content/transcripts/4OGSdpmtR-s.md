---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi there, I'm Alex Martinez — you can call me Alex. In today's video we'll see three different ways to concatenate objects in DataWeave 2.0. I'll also explain what I mean by object concatenation, so don't worry about that.

You may be familiar with other languages' concatenation functions, especially when using two strings, for example. Well, this can also be achieved in DataWeave with the `++` (plus plus) function, like this. Now, how can we concatenate objects? Let's find out.

### What is object concatenation?

When I say this, I mean the action of combining two different objects and creating one single object containing all the fields (or keys) and values of those objects. For example, we have these two JSON objects and we want to achieve this in the end: one single object that contains everything that the other two objects had. This is object concatenation.

If we translate this example to DataWeave, it looks like this. Here we have our two objects and the output object that we want as a result. So let's talk about the three options that we have to achieve this.

### Option 1: Plus Plus

The most commonly used way to achieve object concatenation in DataWeave is the `++` (plus plus) function. The code would look something like this. You can see why this is one of the favorites: it's easy to read and understand, and it's very intuitive. You just have to say object one plus object two.

There is another syntax to do the same thing, still using the `++` function. In this syntax you are writing the function first and then positioning the first and second arguments inside parentheses, separated by a comma. Either way is correct — it just depends on what you're used to, or what the standard practice is in your project. Both the parentheses syntax and `++` do the same thing.

### Option 2: Object destructor

The second way we can achieve object concatenation is using an object destructor, or the curly brackets and parentheses: `{( )}`. This syntax can be cleaner to see in code, but it can also be a bit confusing for new developers if they're not familiar with the use of the object destructor.

I'm sure you're wondering how this works if you haven't seen this syntax before. Well, when there are parentheses inside curly brackets, the parentheses become object destructors. The object in question is separated into keys and values, and these are then added to the new object that's being created by the outer curly brackets.

Let me do that explanation step by step.

- **Step one:** the parentheses destroy object one and object two into their key-value pairs. This basically means: get rid of the outer curly brackets that are surrounding the two objects. Now we only have key-value pairs that don't belong to any object. Of course, we wouldn't be able to see that in code, because you can't have key-value pairs that don't belong to any object.
- **Step two:** create a new object that contains all these key-value pairs. This is why you need to have those outer curly brackets — they will put together the key-value pairs that the parentheses broke down.

I bet now that you understand how it works, you want to change all your old transformations from using `++` to using object destructors. At least, that was my first reaction, to be honest.

### Option 3: Object destructor with an array

The third and final way we can achieve object concatenation is using an object destructor with an array. Wait, say that again.

In case you're not familiar with DataWeave syntax, you can create an array of any type of data using square brackets. For example, to create an array of numbers you can write it like this. You can also create an array of strings — boom. An array of objects — boom. An array of arrays. I guess you follow me.

Why would I use arrays if I can just use parentheses for my object destructors? Okay, just hear me out. Isn't it a bit annoying to have to add parentheses for each of the objects? Sometimes I forget to add them and end up with syntax errors, because you can't just do this — you can't just create outer parentheses for all of the objects. You have to surround each object in parentheses.

So it turns out that the parenthesis destructors not only destroy an object into key-value pairs, they also destroy arrays containing objects. What?! You can do something like this. See, now you can list your objects inside an array using square brackets, and then use the object destructor — I mean the curly brackets and the parentheses — on that array: `{([ ])}`.

Yes, this is the most complex syntax out of the three that we saw today. It can be quite confusing for new developers, and you may have to write this explanation out in your internal project's documentation if you don't want to keep repeating the same thing every time you get a new resource. Lucky for you, you can send them the link to this video.

### Recap

Okay, to recap: there are three options to concatenate objects in DataWeave 2.0.

- You can use the most popular choice by Mule developers, the `++` (plus plus) function. Remember that any of these syntaxes are correct.
- You can opt for a cleaner but less known option, using the object destructor `{( )}`.
- Or the most complex one — but without having to surround each object in parentheses — the object destructor with an array `{([ ])}`.

Do you know of any more ways to achieve the same object concatenation output in DataWeave? Leave me a comment and let me know — I would love to hear more suggestions or questions about this video.

### Ending

This video's written version can be found under prostdev.com/blog with the name "Combining objects: concatenation in DataWeave 2.0". You can create a new account there and give a like to this blog post to be able to save it in your profile, that way you can have this information handy when you need it.

This is all for this video. Thank you so much for watching. Subscribe to this channel for more technology content. This is Alex — thank you and have a great day. See you on the next video!
