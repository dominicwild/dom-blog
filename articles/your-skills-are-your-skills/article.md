In the midst of trying to figure out how AI fits into engineering at scale, the salesmen are scaling too. Everyone is trying to sell you "the solution" that "unlocks" AI: install this one simple framework, 50+ agents, 1,000+ vibe-coded skills, and you've solved software engineering. One hopes average engineering scepticism is enough to make you see why this is a bad idea. AI is inherently non-deterministic; if you throw a bunch of random ingredients you don't understand into the pot, you've created a hydra you cannot hope to understand or control. You can cut off or add more heads in an attempt to control it, but it's entirely unmaintainable. I think this is quite obvious, though, and I want to discuss something slightly less chaotic: Skill Marketplaces.

# Skills & Marketplaces

Skills are small, reusable Markdown files that the AI calls whenever it feels a request matches your skill's `description`. They're quite an effective context management technique. Like anything, though, you should only make and pull them in when you need them; _marketplaces tempt you otherwise._

Marketplaces present these shelves of "general" skills you can reuse. This begs the question: _is there such a thing as a reusable skill?_ I'd argue _no_. There are a lot of reasons for this:

- **Every codebase is different:** A skill assumes you want all its baggage. Whoever shaped that skill has shaped it from a particular context, codebase and _their own preferences_. Some of these may just not fit your codebase, or even work against it. It is exactly the same idea that there are no "general" rules of software; we break the common principles all the time: DRY, "SOLID", KISS, etc.
- **Every agent configuration is different:** This is MASSIVE. Agentic loops and systems are highly complex; every piece of context, tool and workflow influences behaviour, and it is exceedingly delicate. All these aspects affect how a model behaves, and how it interprets and uses the skill. Here are some of the knobs in this area:
    - **Other Skills:** You pick up a skill, but the creator had 10 other ones, and 3 commonly get loaded together. You don't see that, you don't get that, so the skill behaves entirely differently.
    - **The AI Model Itself:** GPT, Claude, Kimi, GLM, Grok all behave differently. Skills written for one need to mention certain things that others don't. A GPT skill will be highly verbose; a Claude one is looser. Skills don't carry a model restriction, so you may get completely different behaviour.
    - **Any Other Context:** `AGENTS.md`, rules, subagents, the codebase itself. Perhaps the most impactful is the tools the agent has access to, which would be _the harness_ itself and any bolt-ons you added, such as scripts, CLIs, APIs, etc. Some lines may just not make sense in a skill if you don't have that exact configuration.

All this creates a highly complex system that no general framework or skill can ever hope to encapsulate. Beyond this, people increasingly do not read these skills deeply, and they're vibe-coded. Which means most got this skill by saying "Hey agent, write me a code simplification skill", so you can get the same one by prompting your agent too.

_Note: the closest thing to an exception is a skill that teaches a tool, such as how to drive Blender or an API. These are easier to verify in isolation, since they either work or they don't. But they still inherit the complexity problems above: the harness, the model and the surrounding prompts all impact them, and how much the skill needs to say depends on what the model already knows. A skill that is three sentences may work for Fable and you may need a novel for GPT 5.6 Luna. They sit closer to the "use case" boundary I describe below._

# But What if There Were a Good General Skill?

Let's entertain this question. If one _did_ exist, how'd we find it?

One way could be crowd-sourced ratings: people thumbs-up "I approve of this, this helped me". If you've ever tried some software, or bought something online that is highly rated, you'll know this is not a reliable indicator. You try it and it's awful despite 95% of reviews being "good". They can be gamed and suffer from self-selection bias.

## We Can Test It!!!!

They cry from the hills. This is another way some marketplaces have tried to position "good" reusable skills. On the face of it, it seems rather credible. Tests are how we've caught regressions and proved our software works (or as close as we can) for decades. The problem is: You. Can't. Test. A. Skill. At least not in the way these marketplaces propose.

The difference between testing software and a skill is that software is deterministic. It behaves the same way every time, in the same runtime. Skills _do not_. AIs are stochastic, random. Their output is _never_ consistent. Agentic systems, as described before, are riddled with complexity in configuration combinations, and this affects the _randomness_ of the AI system itself. You cannot even hope to encapsulate this complexity in a "test" at the skill level.

Implementations of these tests often run a set of fictional scenarios with one model, the _one skill invoked_, in one small set of files, in one language, etc. This makes sense, because otherwise the test would be massively complex; the problem is _you're adding these skills TO complex systems_. Small, artificial, isolated, narrow scenarios are entirely useless for predicting how the skill is going to behave in _your agentic system_. This is even ignoring how imperfect some rubrics are.

To even entertain testing a skill sufficiently to prove its "generalness", you need to test against many: models, frameworks, languages, codebase sizes, libraries; the list goes on. All of a sudden it stops being cheap and easy to reason about. And the harsh part? It's STILL got low external validity, because your codebase and context are still dramatically far removed from these artificial scenarios. Any test of skills is giving you a false sense of confidence; they test nothing useful to you.

To me this is the classic example of trying to apply the practices we, as humans, use to make good software to AI, and it just doesn't fit. Square peg in a round hole. We need to be thinking beyond our own practices and how we can adapt them for AI.

# So We Can't Test Skills?

Kind of. I'd reframe this: we _can_ test skills by proxy, but testing skills directly is the wrong scope. Like hoping unit tests prove your application has no bugs when you have zero integration tests. We should instead test at the "agentic" loop entry point, or use-case level. I'd call these _benchmarks_ more so than tests.

For example, rather than test a skill, test the black box instead. You have a ticket refinement agent; it has many skills, tools, possibly even MCPs. Pop in a bad ticket, have a reference "golden answer" and build your tests _around that_. Now you can test whether your changes to that skill actually impact an output you care about, rather than some lab-rat-driven test that is of no use to anyone.

Do note, though, this still isn't _testing the skill_; it's testing more than that. It also suffers the same problem: it is not generalisable beyond your context. However, if this agentic loop is standardised, then it can be _made general_ and allow other people to tune it to their own context. Still isn't a "take off the shelf and start using" scenario, but it is closer.

# Conclusion

Skills _cannot_ be tested, but agentic loops can. Don't blindly grab skills from someone else; at best, use them for inspiration if you're stuck or want to experiment. The complexity of these agentic systems is far too great for them to ever be tested in isolation, and the complexity cost of pulling in a random skill is _far_ greater than that of pulling in a random library to solve a one-off problem, which is what we're used to. Benchmarks are the true tests for these systems.

Always think outside the box; not every human practice works for AI.
