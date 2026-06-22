---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hi everyone, Alex here. Today we are going to check out the DataWeave programming challenge number six.

### The challenge

In this challenge we have a list of four different numbers — three of them are positive and there's one negative.

The first thing we are going to do is to get the factorial of each positive number from this list, so we would end up with something like this. In this case I am asking you to create a tail-recursive function to do this procedure. You can also use `reduce` if you want, but the challenge is to create a tail-recursive function so you can get more comfortable creating tail-recursive functions.

And also notice that this doesn't work with a regular recursive function — that's why it has to be tail-recursive. Why? Because this 300 is going to reach the limit of the regular recursion, which is 255.

The second step is to sum all of the results, so all of the numbers from here we're going to sum up, so we end up with a number similar to this.

The third step is to retrieve the digits, or the characters, located at the positions from 20 to 25, like this. Now you have to make sure that you are returning a number and not a string — in this case you can see that there are no double quotes here, so this is indeed a number and not a string.

### Wrap-up

So that's all for this challenge. I wish you good luck trying to solve it, and remember, try to use tail-recursive functions instead of `reduce` or a regular recursive function, which is not going to work.

If you're watching this from YouTube, go into the description of the video to find the link to the article so you can see all of the details, and you can also post your own solution in the comments there. Remember to subscribe to ProstDev.com so you receive notifications as soon as new articles come out, and also subscribe to this channel on YouTube so you receive notifications as soon as new videos come out. All right, good luck!
