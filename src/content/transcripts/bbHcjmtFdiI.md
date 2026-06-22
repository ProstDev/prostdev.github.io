---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone. My name is Alex Martinez and today I'm going to guide you through this awesome technology called CurieTech AI. I haven't been able to explore a whole ton about it yet, but we have here different kinds of agents you can use from their platform online. If you go to platform.curietech.ai or curietech.ai, you'll see the landing page and what different things it can do for you.

There are different kinds of products: coding agents, testing agents, documentation agents, code review agents, and migration documentation agents. Right now I've only been exploring the coding agents, but hopefully I can get to the other ones soon. You can do a test drive and sign up for free — you don't have to buy it or anything, you can just try it out.

The one I think is the most awesome so far (because I'm a DataWeave coder at heart) is the DataWeave Generator. It's pretty much like you give it a sample input and a sample output and it will try to generate the code for you. I've been trying it out for a few days and it's really cool. I only tried the no repository option, but there's also one with repository. You can also upload from your computer or use a mapping table, which is cool — apparently it's an Excel file that you can use.

### Understanding the DataWeave Generator

One of the things I noticed right away is that the sample input format is limited: you have XML, YAML, JSON, CSV, and EDI, which maybe are the most basic ones. I use text a lot, but it makes sense it doesn't accept text because that would be more complex. So let's start with JSON.

To test it out, I wanted to go back to my DataWeave programming challenges series. I thought Challenge #4 would be cool because there are actually two different ways of solving this one, so I'm kind of curious what it will do. The other cool thing about CurieTech is you can generate different input and output samples — not just one — so it can kind of look at different examples of how it works. And it reminded me of this challenge because I actually added three different scenarios of it.

### The Hanoi Tower challenge

The challenge is pretty much you have to solve the Tower of Hanoi kind of thing. You have three discs, you have to move them around to get from one point to another, but you can only put a smaller disc on top of a bigger disc.

Here are the three scenarios for the input. In the first scenario we have three disks and they're all in tower A: 1, 2, 3. We want them to be moved to tower C. In the second one, we have four discs. They're all in tower A: 1, 2, 3, 4. And we want to move them to tower C also. Scenario three adds another one — now we have seven discs in the target tower Y. So in the first two we had A, B, C; now we have X, Y, Z. It will start in tower Z from 1 to 7 and we want to move them to tower Y.

I thought this was a really nice one. Let me just put the output first. Sample one has to end up with seven moves — still three discs — and all three discs are in tower C. Oh, it removed the other scenarios when I added the next one. That sucks. If the product team is watching, maybe don't remove the scenarios just yet because someone created this article where you have the scenarios separated by input and output. Now I just have to go back and forth copying and pasting one by one. Scenario two ends up with the four discs in tower C, and the third one starts in tower Z and ends up in tower Y.

I also have here the link for the DataWeave Playground. If you click on this, you can open the DataWeave Playground and move around the things so you can play around with it. Right now this is not solved — the idea is that you solve it and this is the output you have to get. We'll use this to test it out. Let me add some notes — let's give the explanation here and then the rules. Submit. And let's see what it does.

### Testing CurieTech's solution

I've been playing around with the DataWeave generator before, but I hadn't actually created an account. This is the first account I created. I don't know if you saw my previous videos about using Cursor, but I kind of came here to try to use a code enhancer to see if it would apply best practices to my project automatically. It didn't, but maybe it's because I set it up wrong or something. But I would be very curious to try out the best practices thing with CurieTech. For now I'm just trying the DataWeave Generator because it's a really cool product that I really like.

It is taking a while to answer, but the previous ones that I did did not take that long. But anyway, what I was telling you is that this is a cool challenge because if we go and see what Felix did here, this is like the larger solution that he did — we have a few lines of code — but then he went ahead and created a super short solution which is only nine lines of code.

Okay, it generated it. It took 1 minute 39 seconds. But first let me try Felix's one. Felix is a DataWeave guru. So this is Felix's solution and the moves end up being seven as we wanted. Let me try the biggest one to see — I put here it was 127, but I'm not sure if that's the case. So this is the input of the largest one and the output was supposed to be 127. When we put this, Felix actually ends up with 127 with only nine lines of code. And that's why I thought this was a nice one — Felix was able to kind of cheat on it and just do a math operation instead of actually moving the things around with a recursive function or something. But that's fair. I mean, it works. It actually does the thing.

So what did CurieTech do? It's still a few lines of code. It's not that much. First let's put it here. And yeah, we still have 127. So it feels like it does work. Now let's take a look at the code and see what it did. It just has the output application JSON and then it says calculate minimum moves using the formula 2 to the power of n minus one. Isn't that what Felix did? Yeah: two to the power of discs minus one. This is awesome. So it actually figured out how to do it.

But Felix is just creating an update operator there and this DataWeave is just doing the mapping directly. Let me remove the comments just to see how many lines there are without the comments. Then preserve the number of disks. Yeah, this is fine. Felix is just not touching the discs. Then we have the target tower which is just a one-to-one mapping from target tower payload. Then we have the tower state. So this is doing payload towers map object. For each tower, check if it's the target tower. I feel like this is not necessary. It's putting out the towers and checking the key. If key as string equals payload target tower as string, then we're moving the discs. So: if target tower, fill with sequence one to n. Else if not target tower, empty array. That is fair. That is one way to do it. Definitely.

What Felix did here is just take the start tower, put an empty array, and then if this is the target tower, you're just taking the towers from the start tower and moving them to the target tower. So this DataWeave instead of getting the towers from the start tower to the target tower, what it's doing is just generating from one to whatever number (in this case seven). I mean it works. I don't know if it's the most performant way to do it. It seems like Felix's one is way more performant. But it works. It does work. So cool. That was one test.

### Testing Challenge #7

All right, now let's try this one. Challenge #7: modify certain values from a JSON structure. In this one I think I only have one scenario. Yeah. But we can tell CurieTech how this works. So let's start another DataWeave thing: new DataWeave generator task. This is going to be a JSON. So input data is this and output data is this. All right, and then the explanation of the problem. Let's just copy and paste it.

Create a DataWeave script that will update all the values to uppercase except the ones in which the field equals "thisName". For example, the first field name with the value "a" has to be transformed to "A". However, the field "thisName" with the value "def" should stay the same. Oh, I already know how to fix this. Well, yeah — I created the challenge. So we have A, B, C... there's a list, nothing here (this is just to bamboozle you), we have the DEF. DEF stays the same. This E will go uppercase, uppercase, uppercase, and lowercase, uppercase. Okay. So let's submit it.

And in the meantime, let me close the other thing and open this in the DataWeave Playground. And let's see how much it takes for this one. This should be easier in my opinion, but we'll see. Okay, let's see. I feel like that was a lot of code. That was a lot of code. Oh my god. No. No. This is not — I'm not even going to try to understand that. No, that is not. I mean, does it work first of all? So we end up with A, B, C, DEF, E, F, J, H, I, J, K... and yeah, so this is the same. But I know for a fact there is an easier way to do this than doing this whole thing.

So maybe for more complex examples this is not the best, but I can see kind of the mapping that it did and why it did it. Can I tell it this is not good or something? No, I can't. What's this library? No. Yeah, I cannot really tell it that this was not good code, but that's fine. Oh, there's a ladybug.

### Testing again without instructions

Anyway, what if I try it again? I wonder — will it create a different thing? Let's see. JSON, input, output. And what if I don't give it any instructions? And I just love ladybugs.

So this took 29 seconds and I think it generated a new code. Let me just put it here. "Transform value field name value any. If the value is a string and field name is not thisName, convert to uppercase." Fair. This is fair. "Function to transform objects recursively, handle different types of values." Yeah, this is better. This is 26 lines of code, but this is still not the best way to do it.

So I wonder if there's a way to keep teaching it what to do. I don't know if this is reading the DataWeave modules and functions because I can just go into my answer here. Yeah, mapLeafValues. I used mapLeafValues — simple as that. Let me just remove all the empty lines: eight lines of code. So pretty much get the mapLeafValues function and then check if the path minus one dot selector (this means the name of the field from the value) equals "thisName". Then I'll put the value without modification, else put the value in uppercase. So that's as easy as that. Oh, also mapLeafValues — but using the dollar sign expression instead of using the value/path expression.

So yeah, I don't know if CurieTech is just not reading the modules — for example, this is a tree module. Maybe that's it. But it would be a nice thing to teach it how to do it.

### Wrapping up and what's next

All right, that is all for this video. In my next video I will go ahead and test one of the other agents here. I don't know — like the integration generation or the coding enhancer, or maybe we can try some of the other things. There's sample data generation, there's diagram generator, document generator. This is really cool. I will try some of this definitely, but in my next video.

For now, I think this is really cool, but I kind of want to go back to my main focus, which was trying to get an agent to apply best practices to my MuleSoft project. So let's see if CurieTech can do it. We saw that Cursor can do it with rules if you tell it exactly what to do, which is nice — you don't have to teach it again, it can just go and read the rules. So if you didn't watch that with Cursor, just go ahead and check my previous video on my YouTube channel or on my playlist or on prostdev.com, and we'll see what else we can do with CurieTech.

All right, see you in the next video. Bye.
