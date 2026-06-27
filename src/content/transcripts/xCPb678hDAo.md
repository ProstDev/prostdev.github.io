---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hey everyone, Alex here. I don't know if you have seen, but I did a blog post about exposing
DataWeave: what is the difference between `map` and `filter` versus using `reduce`? I really,
really loved this one, so I thought I would make a video for you to see it in action and not
just read through the whole post. So let's do this.

### The example criteria

Pretty much this is the example criteria. I have an array of objects — I have two objects in
this case, just for an example — so we have `id`, `criteria`, and `yearOfBirth`. Pretty much
what's going to happen is that we need this output: depending on the criteria, for example
here, if the criteria is less than three, then this will continue to the output. So in this
case we have criteria zero and criteria five, so only this one should pass to the output.

Now the other thing is that we are also adding fields. In this example we are adding the
`isValid` field, because we need it for the `filter` that we are doing here after the `map`,
and we are also adding one additional field, whatever, and for example the field `years` that
is counting how many years this person has.

### Map then filter (the original)

So yes, I hear you — a lot of people told me, "Why are you doing the `filter` after the `map`?
You should do the `filter` before the `map`." And yes, I hear you. So this is one way, this is
the original way that the script was doing it. At any point you can pause this if you need to
take a look at the code; you can also see the code in the article, and you'll be able to find
the article in the description of the video.

In this first scenario we were doing the `map` first, so a whole iteration — let's say two
objects — and then we were doing the `filter`, so there's another iteration to the whole
thing. So we did a total of four processings of the objects.

### Filter then map

This is the second way: we have the `filter` first and then we do the `map`. So here in the
`filter` we do the `filter` first, so we are doing the whole iteration first, and then we are
discarding one object and keeping one object. So we did two, and then in the `map`, since we
only have one object now, we are doing three total iterations — or three objects instead of
four. So this is one object less if you do the `filter` before the `map`.

### The reduce approach

But then I thought, "Okay, is there a way that we can do just one iteration instead of more
than one?" And I came up with this `reduce`. For example, in this case, we do the `reduce`, we
are immediately checking what the criteria is. If the criteria is met, then we are adding the
object to the accumulator with the new fields, and if the criteria is not met, then we are
just continuing with the same accumulator that we had before. So in theory `reduce` is only
doing one iteration in total, so just two objects, right? We had four here, three here, and
one here. So in theory the `reduce` option should be the most performant one, because we are
only going through the whole thing once.

### Benchmarking all three (10,000 items)

You would think that, but I did this whole script that you can also find in the article.
Pretty much it's creating the items from this variable, because I'm creating 10,000 items
which have the `id`, the `criteria`, and the `yearOfBirth`, which are random integers. Then we
have the three different functions: we have map and filter, only reduce, or filter and map. As
we saw from the previous scripts, here we have the `map` and then we have the `filter`, and in
the only-reduce one we have the same thing. Now the criteria is going to be 50 instead of five
or three, because now we have more objects. And finally we have the filter and map, where we
are doing the `filter` before the `map`. So we have the three different options.

Then I created here some scripts to run this. It's timing each of the approaches and then
ordering them by the fastest one first, and the one that took longer is going to be at the
end. As you can see from here, filter and map took like five — I don't know how much that is.
Now I have map and filter, and we have only reduce. So only reduce took way longer than the
other two. Filter and map, and map and filter, are close, but filter and map ends up being way
less time.

So I can run this more times if I just do a small change to the script. As you can see, this
changed, and I can keep doing it — just adding spaces or something — and the times keep
changing. So you will have different times every time, but as you can see, the order stays the
same: filter and map, and map and filter, are always pretty much very close to each other, but
`reduce` is way, way longer. It takes way longer to run `reduce`. That was a shock for me.

### Verifying the functions actually run

And then the other thing, just in case you are not sure if this is actually running and
working for all of the functions — it is. If I come here, I have the same script as I did
before, but now it's outputting here the total time and the start and the end. So for example,
for this one I am timing just the filter and map, and I am actually outputting the results. If
I scroll down, you can see these are almost 40,000 lines of output. We have here the timestamp
at the end, and we are counting the total time by doing the same thing that we did in the other
script, which is the end minus the start, so we get the actual number. As we can see from here,
this number is super similar to this other number, so it is running.

Again, I can just keep making changes here to the script so I can rerun this, and this keeps
changing — the number will keep changing — but it stays pretty much the same. So if I were to
do, for example, instead of filter and map, I can take the only reduce and put it here, and the
time will change again. As with the other one that we saw, that number is pretty similar to
this number, right? And we can still see that we have almost 40,000 lines of output, so this is
actually running everything.

Again, I can run it several times just by modifying something in the script, like adding a
space or something like that, and this number keeps changing, but it never gets to how the
other number was. We can do the same for map and filter, and it will be very similar to filter
and map, but again just a tiny bit slower than the other one — but not as slow as the `reduce`.

### Ending

And that's all. This is a short video; I just wanted you to see this in action in case you
don't want to run everything on your own. That's fine, I got you. You have the article where
you can see all of the scripts. You have this example where you saw how the different functions
are working, then we saw this one which is actually comparing the three functions at the same
time, and then we also have this that is showing the actual results that are thousands and
thousands, because we are still running 10,000 here. If you want to try with more items, you
can of course change this, or if you want to try with less items — let's say five — you can
also change that and see the differences in the output.

So there's that. I hope you like this video. Please remember to follow me and subscribe to the
channel, because I will continue creating great content for you. If you have any suggestion,
any question, any comment that you have for me, make sure to comment — you can comment here in
the video, or you can comment on prostdev.com/blog articles, and I will make sure to follow up
there. You can also contact me however you like; just let me know what you think and I will
make sure to make adjustments for you. All right, that's all then. Bye!
