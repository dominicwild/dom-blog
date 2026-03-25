# Stop Overcomplicating AI

The current AI landscape is full of unfounded beliefs and armchair theories. "AI Gurus" talk about *possible* micro
optimisations that apply to specific contexts with specific models against specific codebases, technologies and
languages. Whether these things will generalise to *you* is entirely unknown. Trying out all those things will drive you
mad, not even calling into question *how do you know it's even helping?*

The reality is most people are running around on their own britches, overcomplicating everything, as a lot do in the
software industry. This is my experience of the best way to get the most out of LLMs and why a lot of what you see most
people doing is bad, sub-optimal or at the very least, highly dubious.

## The Simple Truth

The key to getting the most of AI has been the same since its inception: **Use the least amount of AI you can.**

It's the non-deterministic black-box machine. Any decision point AI needs to make is a roll of the dice. The more you
roll, the more chances those dice catch fire along with the proceeding AI output. In practice, this means you need
*objective* guardrails that you can't argue with. These are things such as tests (unit, integration, e2e), linting, code
coverage, physical scripts that check *the state of something*. Tell your AI these must pass, you must have 100% code
coverage, the dev server *must run*, it'll ground it right back from any bogus decision it's made. The great part? It's
**FREE**, costs you zero tokens, zero context for these correctness guarantees.

Beyond solid safeguards, you need a solid codebase following practices that optimise for AI navigating and understanding
the codebase. All your context goes into predicting the next word which *includes* your existing code. If your existing
code was waved into existence with a wobbly spaghetti wand, it'll bias the AI to copy the existing patterns. AI will
replicate that spaghetti fast however, with careful attention, you can fix it just as fast. PR reviews, solid AI
reviews, code quality static analytic tools etc.

Prompting techniques? Tell the LLM what you want and it'll build it, it really is that simple at the level of
intelligence AI are at. The problem here is being specific enough; you need good communication skills or the capability
to break down problems into discrete chunks. This is all mostly solved with "Plan mode". AI can read your code, plan the
specific files to create, where, how etc. You just need to read it and critique. However, there is one important
distinction to this still: *You need to know what you're doing*. If you have no idea how a feature will work, what
technologies you will use, what those technologies are capable of, the AI can pull some of that legwork, but AI is very
bad at macro decisions. An AI could implement a whole feature. You throw it at a production grade system and it blows up
in seconds the moment 1000 users hit at once. You still need systems thinking, design thinking, knowing how to architect
technical solutions, otherwise you cannot leverage the full potential of AI.

That is all you really need to know to use AI at peak effectiveness today. Subagents, Skills, "AI Swarms", "Spec Driven
Development" and whatever else may exist are all decorations around the above principles. It doesn't mean they're bad or
even entirely ineffective, but fixating over them is scraping the last few grains of rice from the bottom of a bowl. An
even more important reason to not fuss over them is that *AI development outpaces them*. New models drop every 3 months,
leaps in intelligence keep happening. Today, you might need 4 personified models who play hot potato to give you a
thorough PR review? Tomorrow Claude Sonnet 44.435 drops; that's an expert in code review and all you have to do is
shout "go" and it does it without a decorated prompt telling "who's a good little code reviewer!? You are!". When AI
intelligence starts to plateau, then worry about the finer optimisations. For now? Just build things, deploy them, use
them.

## Common Traps

### The Model Fixation Problem

One of the major pitfalls I see people falling into with AI coding is using Claude. All. The. Time. Claude has this
renowned reputation for being the "best" coding model, in reality, it is *one* of the best, sitting next to Codex.
Claude can write simpler code, get solutions up and going faster *at the expense* of edge cases, stripping features,
scope and safety. This is usually why I see people who only use Claude have massive AGENTS.md files, more tools than
those $5 Aliexpress multi-tools that come with a free laser beam. All of which contribute to context rot, making the
performance overall worse, while optimising it for certain use-cases in their codebase. If you get to this point, you
really need to use Codex or better yet, try *any other model*.

The reality? You need to use all of them. While this sounds extreme, there is truth to it. Most likely you'll be using
one of the big 2, Codex or Claude variants. Each model has its strengths and weaknesses and you *need* to learn and
*experience* what those are. No article, video or benchmark is going to truly teach you this. Every now and then, try
out a new model to see where it falters, where it succeeds, attempt different prompts, wordings, tasks etc.

### Context Rot

Context rot is when your LLM's context starts getting to its limit, making the model dumber and it is very real. When
people hyperfixate on a specific model, they'll typically bloat their `AGENTS.md` with many different things. Usually
with instructions pertaining to previous mistakes the model made, "When editing X file, do this", "Working on feature X
you need to also check specific file Y", "DO NOT DO X/Y/Z EVER AGAIN FOR THE LOVE OF F# (F sharp)". These statements can
help temporarily; if unmanaged can quickly degrade any and every model's performance on your entire codebase. Sometimes
you may even write contradictions in your `AGENTS.md` as a result.

There are numerous solutions to these problems. All require a conscious approach to appending *anything* to your
`AGENTS.md`. One I recommend are "skills", as they are called today. Skills you can conditionally invoke to be put into
your context, an upmarket copy-paste. You manually call these out for the agent to use in tasks. It keeps your context
clean so models do not concern themselves with things which aren't relevant to their task.

MCP servers *also bloat your context*. Tool definitions are not free, they are sent with every request. There is
development in this space with the aptly
named ["tool search tool"](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool), you may find
something similar for your agent harness. Needless to say, the only thing you can do here is be aware and selective of
the tools you give AI access to (that's good practice anyway).

The simplest solution to this issue is to just tell the AI in the current session, if it's a temporary problem it doesn'
t need to know about on *every* single task it ever does.

Keep it simple; that is the core principle here. Every sentence in your `AGENTS.md` should be factual, devoid of
ambiguity and the need for decision making.

Tip: You can
use [AI to refine](https://github.com/softaworks/agent-toolkit/blob/main/skills/agent-md-refactor/README.md) your
`AGENTS.md` even.

## Your Skills Matter

### You Must Maintain Technical Judgment

The act of "coding" is now highly commoditized through AI. Writing code is no longer a bottleneck nor a time-consuming
process. The time taken to "know how to code" so to speak is eliminated. This shifts a much greater emphasis on the
prior stage: designing a technical solution to the problem. In AI speak, this translates to a prompt for the LLM to
implement. The focus is now on *actual* software engineering; the code itself is an implementation detail. Models make
good enough decisions these days you don't need to worry about code structure, how to write a for loop, code ninjutsu
etc.

Although, this does not mean the implementation details are *irrelevant*. You need to *review* AI output. You still need
to understand *how to read* code and *how it works* at a low enough level to grasp what is going on. This way you can
tell the LLM to fix X specific issue, in this specific way Y. LLMs are great at following instructions, seldom in highly
complex decision making.

Unattended, your skills *certainly will* degrade. It's exceedingly easy to get used to the AI solving all your problems.
Yell at the AI for being dumb, throw it an error, expect magic. Sometimes it truly is magic and it just fixes it. At
this point *you* become an entirely automatable process. Almost anyone can paste an error into an LLM and have it go and
fix the code. The skills you have as a developer need to change.

Typically to build an application you go through this sort of process: Find a problem => Design a technical solution to
that problem => Code it up. The last part "Code it up" may involve some additional research: what libraries do you use?
How do those libraries work? What's the syntax of the language for this feature? What should the shape of the code be?
Etc. The act of "coding" here is a lot of work, that's why we have dedicated jobs for this: Developers. It takes a lot
of time, effort and research, even then, you may go down many wrong paths before coming to an actual implementation.

If you let the LLM *steer you*, you will lose your skills. *You* must steer *it*. You must keep learning, reading,
researching etc. The only thing AI impacts is the need to learn libraries, frameworks and programming language *syntax*.
You still need to understand what each line of code does and its implications. If you don't, you run the risk of
degrading your skills and digging yourself into deep holes (if you find yourself in a security incident, critical system
failure, how will you fix it if you have no idea how that AI code works in the first place?).

### You Must Maintain Communication Skills

If you take one lesson from this section: **READ YOUR OWN AI SLOP** before you give it to someone else or commit it to
source control.

As AI has become more pervasive, the amount of times I've seen AI generated slides, articles, tickets, *Slack messages*
is insane. I've been using AI since the first drop of ChatGPT, it is excessively easy to see *when* something is AI
generated these days. The mannerisms are painted on the wall, it drives me crazy and as we get deeper into AI adoption,
it's going to drive your co-workers crazy too.

Beyond the repetitive writing and mannerisms, it also creates *real* problems. AI generated tickets are wrong, analysis
documents are wordy, vapid of meaning or at worst are pure *hallucinations*. I've had AI generated tickets for features
that describe things that just do not exist. Reams of discovery documents or code documentation that is false,
misleading or could be wrapped up in 1 sentence, vs the 2 paragraphs. AI generated text is at best not a good look and
at worst *damaging* to your work and time.

Most critically, relying on AI output actively *degrades your communication skills*. Your communication skills directly
correlate with how effective you even are at using AI in your work. Words with clarity and conciseness are what LLMs
work with the best. Going all caveman and reaching for that AI club to write a Slack message is not helping you, not
even in a development sense, in a *human* being sense. Communication is important and this should absolutely not be
delegated to an AI. Use AI to learn how to phrase things better yourself, rather than copy and pasting LLM text
verbatim. It will help you and everyone around you, more than you will ever realise.

To note, AI generating entire reams of documentation is not necessarily a *bad thing*, but you must *curate* it. Remove
LLMisms, noise, falsities. Do I really need to read the clickbait reading title "Why it addresses your problem (the
important bit)/(what really matters)"? Probably not.

---

Keep it simple. Use objective guardrails. Maintain your judgment. That's it. Experience AI for yourself, avoid being
taken in by the hype trains.