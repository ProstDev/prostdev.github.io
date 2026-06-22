---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi, I'm Alex Martinez, and today I bring to you challenge number four of DataWeave. In this case we are going to see the Tower of Hanoi mathematical puzzle. If you are not familiar with it, don't worry, I will explain the rules of the game for you, and then you can just go ahead and try it out on your own.

### The input payload

We will have three different scenarios that you can see in the article — so if you're watching this from YouTube, go into the description of the video and click on the article in ProstDev so you can see the three different payloads that we are going to check. For the first payload we will have this one right here.

Since this is kind of a game, it will contain the number of moves, so you will be responsible for updating this field every time that you move one of the disks. Here you can see the total number of disks for this game — in this case there are three. Then the target tower that we are going to move this to is tower C (or the stick, or the stack, or whatever you want to call it — I'm just going to call it tower because it's just easier for me). And here you can see the three different towers, A, B, and C.

### The rules of the game

So now let me show you a visual representation of what all of this means in case you're not familiar with the game. This is a Tower of Hanoi game. Basically, here we have three disks, which is the one that we just saw in the payload. We start at zero moves, and the thing is that there are some rules:

- One rule is you can only move one of the disks per turn or per move. Here you can see it says "minimum moves: 7", so all of this puzzle can be solved with at least seven turns or seven moves. So you can only move one of these disks at a time from one of the stacks to the other one.
- The other thing is that you cannot put a bigger disk on top of a smaller disk. In this case this is number one, number two, and number three. So for example you cannot put disk number three on top of disk number one or disk number two, but you can put disk number one on top of disk number two or disk number three.

Let's solve this quickly. Done — so we did it in seven moves, as it was the minimum moves to do.

### Solving it in DataWeave

Now all you have to do is to do the same thing but in DataWeave. So once you finish doing all of the changes in DataWeave, you will end up with a payload similar to this one, where we have seven moves, we still have three disks, the target tower is still the same (it's C), the towers A and B are empty now (as we also had in our previous game that we solved), and the three stacks are going to be here — so here in C we have one, two, three, and they are also in order, they are not three, two, one, they are one, two, three. So you will have to solve and get to this answer.

### The other two scenarios

There are two other scenarios that I can show you. This is the second scenario: here we only have four disks, we have all of the four disks in tower A, and we are going to move them to tower C. So that part is still the same, but the rules of the game might change a little bit — well, not the rules, but the way that you code this might change a little bit depending on whether this is an odd or an even number, so pay attention to that.

And finally the third scenario. Here I am going to change things a little bit to make sure that you all are not cheating. Here we have seven disks, the target tower now is Y — now we're not using A, B, and C, we are using X, Y, and Z. So it's very important that you don't hard-code the name of the towers in your code, you have to make them dynamic. So now that the target tower is Y, we start with all of the disks on X, we're going to move them to the Y, and this is how this is going to end. This was done in 127 moves.

### Wrap-up

And that's it. I really hope you like this challenge. Remember to subscribe to the YouTube channel or at ProstDev.com so you can keep receiving notifications as soon as new content is available for you. I will keep doing these challenges for you, so please subscribe so you can get up to date all the time. Good luck, bye!
