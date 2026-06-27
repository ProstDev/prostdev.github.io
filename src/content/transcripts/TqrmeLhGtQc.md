---
source: 'Edited from YouTube auto-generated captions'
---

### Intro

Hello hello everyone, my name is Alex Martinez, and today we are going to learn how to upsert fields from an object in an array with the `update` operator in DataWeave.

### Use case

This is our use case. We have here an array of objects, and each object — let's say it's a user — has an `id`, a `name`, and some `notes`. We want to update one of those users with this information right here from this variable, `updateUser`.

In this case we have `id`, `notes`, and `newField`. Note that we don't have a name, but we want to match this `id` to the `id` from the array, and then update that information from there. In this case the name is not in the `updateUser` variable, so we want to keep the name from the original object. But for the notes, since we do have some notes, we want to update them here. And this is the important part of the video: we want to add this new field into the original object even though it's not originally there. That is why we need to upsert some fields.

### map function — iterate through the array and match the user to update

The first thing we need to do is match this `updateUser` `id` to one of the IDs from these users. To do that, we have the array `users` and we are going to do a `map`. We do the user here, remove that, and then inside we are going to add a conditional. So if we select here `if`/`else`, then we can add some conditions: if nothing matches, let's just leave `user`, but if something matches we want to match the `user.id` to what we have in `updateUser.id`.

I'm going to just put three question marks here so I can see if the rest of my code is working, and as I can see, it is working — it's just not outputting anything yet because I haven't implemented this specific path. Note that I'm using this operator (`~=`) instead of `==`. This is because the `==` operator will not match if I have something like this, but if I use the other operator it will match, because it's only making sure that the coerced values match and not the actual type of the value.

### update operator — update each field with the new values

Once we have this conditional, now we can get started with the `update` operator. We are going to update the user that does match the `id`, and then add the `update` operator like this. As you can see, it is using cases — each case will be one different field. The only field that we do not want to change is the `id` field, because we already know that they match, so why bother.

So `case n` — this is just the name of the variable, you can put whatever you want here, I'm just going to put `name`. Sorry, `case n at @name`: if there is something at `@name`, that would be inside the object, inside the `user.name`. In this case it would be "Alex 2" because I'm using the other `id`. Then what I want to do is update that with `updateUser.name`, and as you can see, we are getting a `null`. I'll get back to that, but for now let me continue with the rest of the cases.

So `case n at @notes`, then I want `updateUser.notes`, and as you can see it has been updated correctly. Let's continue now with `case n at @newField`, `updateUser.newField`. In this case, as you can see, nothing is being added, because we are getting the values from the user, and because this user doesn't have the new field, it's not putting it right here. This is where our upsert operator will come in handy — but before we do that, let's address something.

### default — keep original values when needed

We did notice that the name now is appearing as `null`, because I am just setting `updateUser.name`, which is `null` since I don't have any name in `updateUser`. If I did have something here — let's put `name` "1 2 3" — then this would be updated with "1 2 3". But because that's not the case, nothing is being output.

So what we can do here is simply add the `default` keyword and then say `user.name`. So if `updateUser.name` doesn't have anything or is `null`, then please use whatever is inside `user.name` — in this case "Alex 2" — so nothing is being changed. Another way I can do that: because I already have this variable being created here, I can take that `n` and put it right here, and it is the same value. I can just repeat the same thing for all of the cases, just in case I need to use it later.

Once we have this covered, now even if I remove the notes, this will still have the value it had before. So this is exactly what I want.

### upsert operator — insert the new field into the original object

Now, to add this new field, I need to use the upsert operator from the `update` operator. That is super simple to do: I just have to add an exclamation mark (`!`) right here, and now it is saying, "if this new field does not exist, then please create it" — and it is being created properly.

### Conditionals inside the update operator — avoid null values per field

Now the other tricky part here: once I have this code, if I'm going to update some user but I don't have this new field — let's remove it — then this field will still be created, but with a `null` value. So it depends: if that's what you're looking for, then cool, but if you don't want that, there are two different ways to fix it.

One way is to add a conditional right here. It doesn't look as fancy, but you can do it. You're pretty much saying: take this from here, `if` `newField` is not empty, then do this thing, but if it is empty, don't do anything. So now if I don't have the `newField`, it's not being created, but if I do have it, then it is going to be created. That is exactly what we want in this case.

### do — create a local scope if needed

A super quick note: if you don't want to put this same line twice, you can also use a `do` operator. For example, here inside the `if` we can open a `do`, and then this whole thing will be inside the `do`, the `else` will be outside, and we can close the `do` right here. So now with this we're creating a local scope, so we can create a variable and say `newF`, for example, and we can simply take all of these from here, `newF`, and we can also update this with `newF`. Now `newF` will be this, and this will be `user.newField`, and now it also works.

So you can also do something like that if you don't want to keep repeating stuff — it depends on however you want to do it. In this case I'm just going to leave it without the `do` so we can continue with the other example.

So if you don't want to do that whole thing, because it was a lot, we should just remove this `if` and leave it like it was before. Perfect.

### skipNullOn — avoid null values in the whole output

Now if we remove the new field one more time, we have the new field `null`. So the other thing you can do: if you go to the output directive right here, if you're using JSON, then you'll be able to do `skipNullOn` and you can select anything from an object or everywhere. In this case I'm just going to select `everywhere`, and now everything that is `null` will be erased from here.

Let me demonstrate with another field really quickly. If I add a test field right here — oops, sorry, if I put it as `null` — and I put this back, then this will also be removed. As you can see, both of these fields are removed. So it also depends if that's what you're looking for, or if that's not what you wanted.

### Ending

But this is how you use the upsert operator, and how you can also add some conditional values to each field if you want to — it goes right here, remember that. That is all for this video. I hope this was helpful, and I will see you in the next video. Bye!
