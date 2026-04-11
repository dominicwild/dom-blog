Prompt engineering is becoming an increasingly important part of the job, and I've noticed a lot of people writing bad
prompts. Many people seem to "vibe" their prompts, and the results vary widely. When AI doesn't deliver what they want
in one shot, they get frustrated and complain online that the model is getting "dumber," or they call it "super smart"
because it got everything right by chance.

The problem is that people don't know how to optimize their prompts for the outcome they want. This makes working with
AI frustrating.

I've written a lot of prompts so far, and I've learned what makes a good prompt and how to word things so the AI is more
likely to give you what you want. In this article, I'll cover some prompting techniques and fundamentals to help you
make better prompting decisions, with illustrative examples.

# How to Think About Prompting

Prompting is not a skill everyone will need to learn, because it is directly tied to how well you can communicate what
you want. If you are not a strong communicator, you will not be a strong prompter.

The key difference between a good prompter and a bad one is how clearly and simply you can express your ideas so the AI
does not have to "fill in the gaps". The more details you include in your prompt, the more you constrain the output,
which is exactly what you want. You do not want the AI guessing.

For example, you might include details like:

- explaining the architecture
- telling the AI where to put different pieces of code
- explaining which functions you want
- pointing out code you want the AI to reuse elsewhere

By adding these details, you make your assumptions explicit and you do not leave the AI to infer your coding standards
or what you expect from the task.

Most prompts go awry because they lack enough constraints, details, and edge-case descriptions. That is where planning
can help. Planning modes in harnesses like Cursor, Codex, or Claude are so valuable because a plan helps you prompt
better. It is, in effect, the AI prompting itself and extracting the information it needs from you in a form it can use
to execute the task more effectively. Still, that relies on you reading the plan (not everyone does).

You can still get surprises because your initial prompt is what feeds the plan. If your initial prompt is good, you get
a better plan out the other end with less need for modification. Which leads into my next point.

# Encode Intent

If you were to take anything from this article, I'd want you to take this. When you are crafting a prompt, always ensure
you include the intent.

No matter how well you describe things, no matter how much detail you include, you are going to miss details. This is a
fundamental reality of how communication works. You can't include every single detail all of the time. It is too
exhausting, and it is also almost impossible, especially in software engineering, where all of the details can matter a
lot. There'll be things you didn't think about. There will be things in your brain that you just assume will work a
certain way that the AI won't necessarily know or intuit from you.

So you have to describe your intent.

## Example: The CSV Export - Encoding Scope

Say that I give a prompt like the following:

> Add a CSV export feature for contacts to the admin dashboard.

This may be a very simple request. Maybe it's for an internal tool at your company. It doesn't need all the bells and
whistles of a production-grade system. You just want a simple button that exports the contacts in your internal tool.
That's all you expect, and that's all you want. Should be a one-minute job for the model, right?

Possibly, but there's a lot of room for interpretation here. The model doesn't know your context. It doesn't know what
you're expecting out of this. It knows that you want a CSV export feature, so it'll look at your database and the data
you have available: "Okay, we need a CSV with these fields." Maybe it provides more fields than you expect, maybe it
joins some tables, and then you have a bigger CSV. But that's not a big deal because you just want certain data out.
Maybe the extra data is even useful in the future?

However, this little prompt may take a lot longer to implement than you expect. The model may overcomplicate it in many
ways if it treats it as a production-grade feature request. Maybe it will add:

- excessive authentication and authorization checks
- audit logs, per-row error reporting, deduplication logic
- validation and retry logic
- integration tests and unit tests
- maybe even an end-to-end test

When actually all you wanted was a simple feature, implemented quickly, down and dirty. You didn't really care if it
broke or not. A feature that you could probably implement in 10 to 15 minutes yourself. Now the AI has overcomplicated
it, made the code hard to read and understand, and made the feature technically more thorough than you intended but
overcomplicated for your use case.

The crazy thing is, this all could have been circumvented by encoding your intent:

> Add a CSV export feature for contacts to the admin dashboard. I want the export feature to be simple, as it is just
> for internal use. It should be a simple button that exports all of the rows in the users table.

That small piece of extra text has dramatic impact on the outcome, because here you've encoded quite a few things:

1. Now the AI knows that it's for internal use, so it doesn't need to be production-grade secure.
2. You said it needs to be a _simple_ button that exports all the rows of the user table. The word "simple" biases it to
   not over-engineer. Specifying exactly what to export means you're not going to get anything crazy beyond your
   expectation.

Just including these few small details has dramatically improved the prompt.

## Example: The Quality Script - Encoding Audience

This is an example of encoding intent by describing the intended audience.

Here's another example that could go quite wrong:

> Make me a shell script that runs all of the quality checks in my codebase. The lint, the tests, the type check and
> code coverage. Exclude printing output that indicates success, only print errors for the failing checks.
> Including "[check]: PASS" for any passing checks.

That all sounds fairly innocent. You want a shell script for a coding agent so it knows when it has broken code. The
agent does a task, runs the quality script, and gets a token-optimized output with only the high-signal failures it
needs to fix. The agent ensures all quality gates pass before handing the work off to you.

Problem is, you haven't given it any context around what this script is going to be used for. Because you've asked it to
make a script, it naturally assumes the script is for you. You've told it what to do but not why it's doing it.

What it's probably going to do, as LLMs do with many scripts, is make it highly configurable. It'll add a bunch of flags
and modes that you didn't ask for:

- a flag to only run the lint check
- a flag to only run tests
- maybe a mode for just integration tests

It tries to infer other ways of running the script that you didn't even think about. You should encode this intent
better:

> Make me a shell script that runs all the quality checks in my codebase. I want this to be run by AI coding agents so
> that they can get high-signal error outputs. When they finish their task, they ensure that all of the quality gates
> inside the codebase are passing before sending it off to me for review.

This prompt is a lot better because now the AI cannot assume that you are the one running it. It is less likely to
assume that you need several different modes. It's clear that this should be a single-mode script that runs one way and
provides one output for one purpose. The output you get is better aligned with your intent. When the AI needs to guess
certain features or niceties, they can align more with what you expect because you've baked your expectation into the
prompt alongside what you wanted it to do.

Up above are simplified examples, you'd naturally add way more detail and constraints. But it illustrates the point.

## The Takeaway

When you're writing a prompt, don't only tell the model what to do. Tell it why it's doing it, what you expect the
outcome to be. Put in your expectations, your context. Tell it who it's doing it for. Then, when it guesses the bits you
missed, you won't be surprised when it writes something that completely diverges from your expectations.

This is not foolproof. The model can still go awry. But it helps a lot in getting the output that you want.

# Intent-Driven Prompting

Another technique is what I like to call intent-driven prompting. Some people may describe this
as [prompt chaining](https://www.promptingguide.ai/techniques/prompt_chaining), where you talk with the model and the
conversation history encodes your intent rather than just one singular message.

This is when you're brainstorming with a model about how a feature should be implemented: a series of back-and-forths.
This technique brings your intent for free into whatever you ask the model, because it becomes part of the chat history.
You don't tell it what to do. You just tell it what you want to achieve.

For example, you might say: "I have this invoice system. Users make invoices, and they need to make a lot of them.
They're having trouble because they need to click Create Invoice every single time and input all the data over and over
again. We'd like some sort of templating system to speed this up. Can you suggest some ideas?"

The model will give you suggestions. Maybe it runs with the templating idea, maybe it proposes alternatives. But at this
point the model knows your intent, which is great. If you critically examine the suggestions it gives back and tell it
why you reject some ideas, that is also signal for the model. It starts to refine its understanding of what you want.
The longer you have that back-and-forth, the bigger the context you build up for its judgement to align with yours.

If you build a plan at the end of that conversation, with agreement between you and the model about what you're going to
build, that plan will be strongly aligned with your intent. The entire conversation encoded your intent. The entire
conversation was about exactly what you wanted and how you wanted it to work. You're much more likely to get features
that align with that.

However, it doesn't encode technical details like authentication, how the technology lines up, or code reuse. That's a
separate concern. You get an intent-aligned plan, even if it's not technically aligned, which means there's a lot less
wasted effort building a feature you actually want. But the trade-off is the code generated may be problematic. It does
still need to be supplemented with technical language and description of _how_ it should be implemented to achieve a
robust code generation step.

The important lesson here is that telling the model what you want it to do and why you want it done are two equal sides
of the same coin, for both large features and small one-off scripts. You could also have a discussion with the model
brain storming technical implementation details too, to fully flesh out the plan.

# When Bad Prompts Work

You may be looking at all of this and thinking, "But I've sent pretty bad prompts and got pretty good answers. So do we
really need to think about prompting THIS deeply?" There's probably a reason for that. Let me go through an example.

> I have the following error.

```typescript
TypeError: Cannot
read
properties
of
undefined(reading
'id'
)
at
getUserDisplayName(src / lib / users / get - user - display - name.ts
:
27
:
18
)
at
mapCommentAuthor(src / features / comments / comment.mapper.ts
:
14
:
22
)
at
Array.map(<anonymous>)
...
```

This prompt may seem terrible. You've really not told it anything. You've not told it your intent, how to fix the error,
or any context. So you'd expect the AI to do a bad job.

In some circumstances, that might be true. If the error is too vague, the model might not know where to look. But you're
likely pasting this while running it locally, so the AI has the environment to reproduce it.

The error itself encodes an extraordinary amount of specific information, and LLMs are extremely good with this. The
error gives it exact file paths, line numbers, and a call stack. This prompt is actually pretty narrow in terms of
expected outcome: you have an error, you likely want it to not happen anymore. If it's in an isolated part of the
codebase that isn't super complicated, there's only a limited set of possibilities that could cause it. The AI can trace
through the code, find how the error occurs, test a fix, and go through a whole feedback loop of debugging.

This is different from feature development. When developing a new feature, the AI can't test-drive your brain. It can't
implement the same thing five times and get instant feedback. That feedback loop is slow: you look at what it's done,
tell it what's wrong, and iterate until it outputs something you're happy with. That's why encoding your intent is so
important for features, and less critical for specific error fixes where the error itself contains all the information
the model needs. AI can also "fill the gaps" itself, reading the codebase as context.

That's why this prompt, while bad by every heuristic I've described above, is actually effective.

## When It Falls Apart

This starts to fall apart when the error is more complicated or the fix is more opaque. Maybe this error happens and you
don't necessarily want it to go away. Maybe this is an expected failure mode of the application. Maybe there really is
going to be a missing ID in this flow, and instead of fixing it the way you want, the AI fixes it another way.

For instance, the AI might make it physically impossible for this error to ever happen by adding strict validation
further up the chain. Simple fix, but now some part of the UI requires a complicated data structure or setup that you
didn't want. The user experience is terrible because of a "fix" you never asked for.

What you should actually do in this situation is explain how the AI should fix it. If you don't know the reason for the
error, your first step should be to ask the AI to explain why the error happens, and then tell the AI how it should be
fixed.

In more complicated cases, where the model can't determine the cause from the prompt alone, you need to give it
reproducible steps. If you're in QA and you're reading this, you probably know a million ways why the prompt above is
really bad. You need to include details like:

- I click here on the UI
- I input this value
- I navigate over here
- I delete this entity
- I click this button
- I get the error

Then you explain what you would expect to happen instead. From that, the AI can infer what the fix should be. There's
still some ambiguity, because the fix might impact another part of the system, but encoding your intent and giving
reproduction steps gets you much closer.

## The Lesson

The lesson here is two-fold:

1. For simple, isolated cases, bad prompts may actually work.
2. In more complicated systems, they won't, and you need to include more details.

Many people will experience this as their systems grow. When you're in the early stages of a project, simple prompts
work effectively because the codebase is small, easy to reason about, and not a lot can go wrong. You'll get it right
most of the time, even with bad prompts. But as systems get more complicated, you'll need to put more into your prompts.
And in contexts where you're developing features rather than fixing errors, if you don't prompt well, your system will
accumulate features you don't need, dead code, and unnecessary complexity.

# Shortcuts for Specificity

So above is what I would consider the core principles of writing a good prompt: encode your intent and be as specific as
possible.

The problem is that being specific is exhausting. You cannot be hyper specific all of the time. It's just not realistic.

This is where we look to things that are slightly out of scope of this article, although the same prompting principles
apply.

## Persistent Intent with AGENTS.md and Skills

Sometimes you want intent encoded globally, in every single prompt you ever give. This is where things like skills and
`AGENTS.md` files come in. Skills are basically reusable markdown snippets that you can include whenever you want. This
depends on what harness you're using, whether it's Codex, Claude Code, Cursor, or any of the other popular ones. Usually
they all have the same concept: you type a forward slash in your harness, select your skill, and it pastes the content
into your prompt. The AI can also invoke skills programmatically when it deems them appropriate. `AGENTS.md` is included
in every prompt you ever send.

If you encode your intent in your `AGENTS.md` and your skills, it bakes your intent into every prompt you ever send. For
instance, putting the context of your project in an `AGENTS.md` file is enormously useful. It entirely grounds the model
in what you're doing.

Say you're making a proof-of-concept system, and you put that in your `AGENTS.md`: "This is a proof-of-concept system.
It doesn't need to be robust; it's not production grade; it doesn't need exhaustive tests; it just needs to work and
demonstrate different techniques." Now you don't need to think about that anymore. The AI is entirely aligned with it.
If you ask it to make a feature, it's not going to test like crazy, add configuration options, consider every edge case,
or go overboard with validation. It's more likely to focus on implementing something simple, aligned with what you
actually want.

You can also use this to steer the AI. For example, you could make a production-grade system but say it's a proof of
concept to bias the AI toward simpler code that matches your preferences. Even though you've "lied" to the AI, it's
still going to code in a certain way. If that way aligns with your expectations, it works effectively.

## The Limits of Encoded Intent

Sometimes it can be difficult to describe your intent if it is highly specific. "I want a production-grade system, but
not production grade in this area. It doesn't really need tests here, but we do need some tests, but not too many. Maybe
integration tests sometimes, if X, Y and Z." Trying to encode intent like that consistently is really difficult because
of all the different details that go into it. The more steps the AI needs to make judgments and guess, the more likely
it's going to get one of the dice rolls wrong, and from there it spirals in directions you don't want.

## Using Examples

Another way to encode details is by using examples. This
is [a well-known prompting](https://www.promptingguide.ai/techniques/fewshot) technique where you include a good example
and a bad example of something. You show what bad looks like, then show the same example done well. The model can see
the difference and learn from it. You should still encode your intent here too: explain why the good example is good,
not just why the bad one is bad.

## Golden Reference Files

A better approach for encoding examples is to reference files. Let's say you want the model to write tests in a specific
way. What you don't want to do is write down all the rules about how to write tests inside your `AGENTS.md`, because
that would be incredibly long, blow your context, and could bias the model in ways you don't want and overshadow other
important details.

Instead, give it a golden reference file: a test that follows all of your good practices. The model reads that file into
its context, and then it has a solid reference for how to write tests from that point on. All the test code it writes is
more likely to closely resemble that golden example versus some random file it finds in the codebase.

This is important because you might have test code that was generated by AI that is bad. If that happens to be the file
the model reads into its context as a reference, it's going to start coding like that, littering even more bad examples
like a plague. Having a designated reference file protects against this.

A lot of the reason models are inconsistent sometimes is that they don't load important files into their context. A
model may duplicate code simply because it hasn't ventured into a the part of the codebase with that function yet, so it
doesn't know that code exists to be reused. Validation is absolutely notorious for being duplicated by AI, because the
AI typically doesn't need to read the validation code to do its task.

# Conclusion

The key learning is to always encode your intent in your prompts. Encode it in your skills, in your `AGENTS.md` files,
everywhere that you possibly can. Make the AI's judgment align with your own. That way, you roll the dice in your favor.
You're still going to get output that you don't like sometimes, but this should make it much more likely that you'll get
AI output that is actually aligned with your preferences and what you want.