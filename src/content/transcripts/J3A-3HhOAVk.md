---
source: 'Edited from the spoken video for readability'
---

### Intro

Hello everyone. My name is Alex and today I'm going to continue testing CurieTech AI with some DataWeave stuff. I don't know if you're familiar with this post that I created back in 2024 — more than a year ago — in which I tried different ways to solve the same problem. We have this input, and I'm going to go ahead and put it in CurieTech. 

So here I'm in CurieTech AI. I go to DataWeave Generator. I have my JSON. This is my input data. And then my output data is going to be something like this in which we are going to change some fields from the payload to generate something different — but then we also want to filter out the objects in which the criteria is less than (let's say) three for this example. The expected output should be like that. Let me tell it: find the most performant way. And let's submit it.

### The 2024 experiment

While we wait for that, let me show you the experiment that I did. I ran three different ways of achieving the same result, but here I tried doing it with 10,000 items instead of just two. The results were mind-blowing. We created filter-then-map — which is the fastest one — because you first filter the whole array and then you map it. But then we also created map-then-filter, which is the second most performant. So first it goes and does all the mapping to all of the objects and then it filters them out.

Finally we also tried to use just reduce, which in theory should only be using one iteration of the whole array. In theory reduce should be faster because it's only going through the whole array once instead of two times or more than one. But that was not the case. As we can see from here, filter-and-map took like 55 milliseconds, map-and-filter took seven, and only-reduce took almost 1 millisecond. This keeps changing if you keep running the code — as you can see it's going to keep doing different times — but it always remains first filter-and-map, then map-and-filter, and then only-reduce.

So here for example I have map-and-filter: first we're doing the map, then we're doing a filter. And then here, only-reduce: we are just doing the reduce and nothing else. And then in filter-and-map we are filtering first by the criteria and then we are doing the map.

### CurieTech's output

All right, and it finished in 34 seconds. So let's take a look at the code that it did. It is telling us "the current year 2024 hardcoded to match the expected output." Yeah, because I did it in 2024. So first we have the filter: it is doing the filter first (criteria less than three), then the map, and then doing the whole mapping from whatever I had. This is pretty much what I was expecting.

### Regenerating with tweaked criteria

And then let's say you made a mistake and instead of putting less than three you wanted to put equals zero. Let's do criteria should be less than two, I think, because what was the output? Oh yeah, the criteria was zero. So for example: criteria should be less than two instead of less than three. You can click on regenerate and this will again work on it. I don't know why it says 1 minute now.

Turns out it says 1 minute because the time that is showing is a cumulative time from the point the task was started until now. So because I was taking one minute to do the whole thing and then do the second task, it took almost two minutes from that point to this point. But yeah, you can just take a look at what is happening here — here you can take a look at the comments. So here "criteria should be less than two instead of less than three" and it generated it. You just have to keep scrolling down and here you can see criteria less than two. Here's the new code, so we can actually test this. Let's go ahead and take the input that we had and then let's copy the code with the less than two. And here we have it, and it is working as we wanted it to work.

### Final thoughts

Awesome. It was able to correctly create the filter first and the map second, so I'm happy with this. It actually followed the experiment that I did where I was able to see that filter-then-map was actually the most performant way. So if I had CurieTech back then, I would be able to see this way faster instead of having to manually do the whole experiment and timing them.

Awesome. Thank you, CurieTech fam. I like this. The DataWeave agent is going places. All right, that is all for this video. I will see you in the next experiment I do with AI. Bye.
