---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hello, hello everyone! My name is Alex Martinez, and today I come with a very short video,
because I just wanted to explain to you — in a video, not just in a blog post — what my
problem was and how I solved it, in case this happens to you too.

### The problem

Here's what was happening to me, and I didn't know why. I had several sets of arrays — arrays
of what I thought were strings, but that was not really what was happening.

For example, as you can see here, we only have one array, and in this array we have array one
and array two, just for demonstration purposes. We can see that in array one, the `item` is
actually a Key — you can see from here it's a type Key — whereas these others are Strings. But
when I was trying to do this, as you can see from the output, they all look like Strings: this
Key doesn't look any different from the Strings. So I thought they were all Strings. I was
wrong.

My problem started when I was trying to do `distinctBy` on the array. Here's the thing: if
this had not been a Key, this would correctly filter out the arrays that are repeating, like
these. But since one of them was a Key, this is what was happening to me — and because you
can't really see the difference between what is a Key and what is a String in the output, I
wasn't aware that it wasn't a String. I was forming this array somehow such that I was actually
storing Keys instead of Strings.

So I ended up with multiple arrays of different types — not all of them were Keys (because if I
were to make them all Keys it would also filter correctly, but that was not the case). It would
end up with something like this, and this would not filter correctly.

### Solution 1

There are two solutions I can think of for fixing this. One is to create a `map`. Here we don't
need the index, so just like this. And then we do another `map`, because first we're iterating
over each of these arrays — we have an array of arrays of Strings and Keys — so we have to map
again. In the second `map` we do `as String`, so now this Key is going to become a String, but
it will also check all of the different ones to make them a String too. Then we can do the
`distinctBy`, and now — even though this was a Key — it will still be filtered correctly.

So that is one solution, but it may be a little too expensive if you have a lot of different
items, because you're doing two `map`s and then the `distinctBy`, so you're kind of going
through the whole array.

### Solution 2

If you don't want to do that, or there's another way, or you cannot change the types of the
items, you can do this instead. Rather than doing two `map`s, we can keep the `distinctBy`, but
inside it this becomes `joinBy`. The separator can be whatever you want — it can be empty, a
comma, a dash, or whatever you want to make them different. In this case I'm just going to put
a comma.

So this means that when we do the `joinBy` on array one — let me just do it here really quickly
— array one, with the comma, this is what it ends up being, and its type is a String. If we do
a `typeOf`, this will be a String. And if we do the same with array two, this will also be a
String. If we take a look at this, it would be Key and String — so by doing this, we're
transforming the values inside into one big String instead of having the array. This
essentially becomes an array of Strings, instead of an array of arrays of Strings and Keys.

That's another way. This way you're outputting whatever is the same in the values, but you're
not actually changing the item — in case, for whatever reason, you cannot change it.

Just to make sure we can check on this: if I do zero, we get the first array, and if I do zero
again, we get the Key. So if I do `typeOf` on this whole thing, we end up seeing it as Key,
because that's the first thing that's coming. If I were to remove this, it would be String. So
that way we're keeping the same types of the values, if that's what you want. And if not, then
you can also do the `map` and change the actual item to be a String.

In my case, this is the solution that worked best for the use case I was doing, so this is what
I ended up doing — because going through all of the Keys was really expensive performance-wise.

### Ending

All right, that is all for this video. I hope you liked it, I hope this helps, and I will see
you in the next videos. Remember to subscribe and to follow me on all of my socials —
everything: LinkedIn, YouTube, and prostdev.com. All righty, see you then. Bye!
