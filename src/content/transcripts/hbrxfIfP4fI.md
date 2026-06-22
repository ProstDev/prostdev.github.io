---
source: 'Edited from the spoken video for readability'
---

### What's new in this update

Hello hello everyone, my name is Alex Martinez, and today I'm going to show you a few of the
updates I made to my Data Cloud and MuleSoft integration. By this point I fully expect you to have
followed Parts 1 to 3 of the previous videos or articles — we're now at Part 5. I don't require you
to follow Part 4 (that's just for security reasons, if you want to secure your API or your app), but
Parts 1 to 3 you do need, because there's some specific configuration to set up for MuleSoft, Data
Cloud, and Postman.

Once you've done that, go to my **REST client request** and into Postman, where you'll be able to
download the latest Postman collection. Here's how the new collection looks: we have the four
previous operations — the insert and delete, which I just renamed to **streaming** — and the rest
are for **bulk**. So you should now have these five operations.

### Updating the deployed app

The second thing you should do is, also in my Data Cloud / MuleSoft integration repo, go to
**Releases** — there's now a **release 2.1.0** that handles the bulk operations. Scroll down and
you'll see the JAR; download that JAR and upload it into Runtime Manager. As I said before, you
should already have your application running in Runtime Manager, so just go there, click **Choose
file**, upload the new JAR, and click **Apply changes**. Now you're on the latest version of the
code.

Similarly, I have my API Manager set up with the basic authentication policies applied to my
application — but you don't have to do this if you don't want to.

### The four new bulk operations

So what changed? I have these five new operations — really four, because the bulk ones are: **get
all jobs**, **upsert** (you can choose CSV or JSON), **get job info**, and **delete job**.

Before I get into what's new, let me show you a little bit of the bulk process in Data Cloud.

### How the bulk process works

If we take a look at this diagram, this is the flow of Data Cloud. First we have **create job**, and
when we create a job the state is **open** (the blue circles are the operations you use in
MuleSoft). After you create a job you have to **upload the job data** — this still remains in the
open state, because you can keep uploading as much data as you want, and you have to close it
manually.

Once you're done uploading, there are two things you can do from the open state:

- **Continue** the rest of the process by closing the job with the **upload complete** state, or
- **Abort** everything — change the state to *aborted*, and then there's nothing more you can do
  with that job.

If you choose to continue and close the job with the upload complete state, Data Cloud takes the job
information and all your data and queues it with the state **in progress**. Once Data Cloud is done
processing, it depends on whether it was successful: if it was, your job is updated to **job
complete**; if it wasn't, it's updated to **failed**.

Now, if you want to **delete** a job, you can only delete it in one of these four states: **upload
complete**, **job complete**, **aborted**, or **failed**. As you can see from the arrows, those are
the four states where you can remove or delete the job.

### Get all jobs

Now that we have a bit more context on how the bulk works, first we have the **get all jobs**
operation. This returns all of the jobs you have — or have access to — in the Cloud, whether they're
open, closed, job complete, and so on; you'll see the full list. I'm not going to run this one,
because the jobs have critical information inside that I don't want to show you. But you don't have
to set up any query parameters or a body — you can just send it, once you've set up your Postman
collection.

### Upsert (CSV or JSON)

The second operation is the **upsert with a CSV**. In this request you do have to send some query
parameters — the same ones we've been using for the insert operation: the **source API name** and
the **object name**. Then in the body you send everything as CSV, and the Mule application takes it
and sends it to Data Cloud.

If you don't want to use CSV — say your data is in JSON — that's completely okay; you can use the
**upsert JSON** operation. It's the same thing, just a different body: it sends a JSON payload, and
inside the Mule application it transforms that JSON into CSV before sending it to Data Cloud.

Now, remember from our diagram that we have to first create the job, then upload all the data, then
close the job. This **upsert operation does those three steps for you**. At the end, if everything
went well, you'll receive a response with an **upload complete** state — which, going back to the
diagram, means everything went well, we continued, and we closed the job with upload complete so
Data Cloud can start processing.

### Get job info

In the response of that upsert you'll receive all the details of the job, including the **state** and
the **ID**. If you take that job ID and put it into the **get job info** operation, you'll be able to
retrieve all of the information for that job — including whether it's still upload complete, in
progress, failed, or job complete. So after you close the job, you only need to wait for Data Cloud
to process it: your job could be upload complete, in progress, or already processed and changed to
either job complete or failed.

### Delete job

Finally, another thing you can do with the job ID is **delete the job**. Going back to our diagram,
remember you can only delete a job that's in one of the four valid states. If you're sure you can
delete it, run this; if the state isn't one of those, you'll receive an error — and that's okay.

If your job is in the **open** state — meaning you only created it, or maybe uploaded data but never
closed it — that's also okay, because the Mule application is smart enough to know you're trying to
delete the job. Once it's in the open state, it will **abort the job** first and then delete it for
you.

### Wrapping up

So those are the four new operations I've added to my application. If you have any questions, please
don't hesitate to ask — I'm happy to help. And of course, if you want to look at the code, just go
into my GitHub repo: the whole Mule application is inside the Data Cloud integration
implementation, so you can check out how I generated all of this.

That's all for this video. I hope it's helpful, and I'll see you in more Data Cloud and MuleSoft
stuff later. Bye!
