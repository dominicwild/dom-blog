I've been using AI to code since the very beginning, all the way back in 2021 when GitHub Copilot
was [in technical preview](https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/).
I'd use it to generate tests, and often Java functions that needed obscure date logic. It would regularly reach for date
APIs I'd never even heard of (`TemporalAdjusters` are gnarly), so it was a useful learning tool as well. It was very
useful for boilerplate tests too, able to infer test structure from all the other tests around it. Sure, it still had
issues and syntax problems my IDE could correct, but for simple cases it sped things up.

# Enter ChatGPT

The first _big_ AI jump beyond autocomplete in my IDE. It could write code and answer _real_ questions with startling
accuracy, most of the time. Annoyingly, it was constrained to its training data, so it could not always answer questions
about the latest SDKs or news.

It could also _write full-on portions of applications_. This was a major step up from the one-off tiny functions that
Copilot's preview could unreliably produce. My workflow evolved into using ChatGPT to create whole pieces of my
applications. Nothing crazy: often simple integrations with libraries, encapsulated classes or specific functions (as I
did with Copilot). Good examples would be a caching class, date functions, rate limiters, SQL, or some detail-orientated
code (such as an algorithm modified to my needs, or complex loops). These tasks were never _hard_; they were just the
busywork of reading docs, finding the golden nugget of a function in a library and composing it all together. ChatGPT at
this point could even generate the accompanying tests, which passed first try 70% of the time.

# Advent of Agentic Engineering with Cursor

ChatGPT dropped in late 2022, and Cursor followed soon after in early 2023. Cursor was the next big leap in integrating
AI into my workflow. No longer did I need to write lengthy prompts and construct the agent's context in chats myself:
_the agent could build its own context_. As Cursor evolved, it gave models the ability to call tools _against the
environment they were running in_. They could inspect, learn and understand the files they needed, and integrate much
larger pieces of work. I shifted from building the leaf nodes of my code to the integrations between them.

Previously, the AI was utterly incapable of using functions that were _in my codebase_ to compose its solutions, and
even when it tried, it would make loaded assumptions, get parameters wrong, produce faulty outputs and so on. This
new-found capability meant _entire features_ could be built autonomously with AI, if you pushed it hard enough.
Guardrails and workflows that forced the models to write tests and get them passing made their code leaps and bounds
more reliable.

However, this wasn't without its shortcomings. Code was ugly and sometimes entirely nonsensical. For example, a SQL
statement fetching _every user_ from the database, then iterating over them to _find one user_. Insanity. TypeScript
code littered with `any`, defensive guards for impossible scenarios, overcomplicated code and missed tests. It still
required a lot of human review. Models at this point were also not good at verifying that their work was complete and
functioned end to end. You could not confidently ship anything without reading every line critically.

## New Horizons

Even more interestingly, AI was becoming useful for more than just coding. Asking agents to trawl the logs on your
computer, or asking how a feature in a codebase worked, was increasingly useful. No longer was a long ramp-up required
to get started working in a codebase. It wouldn't always surface all the necessary details, but it could easily cite the
files _you_ could go and read.

One-off autonomous tools were now increasingly valuable too. I had always hated tedious flows, bad developer experience
in repos, and manual processes that should really have scripts. I'd only ever had time to hand-craft a handful of these
for the things I did most frequently. Now, making them was cheap and fast, removing friction anywhere I could imagine
it. ChatGPT could write these back in 2022 too, but Cursor letting the AI run and self-verify those scripts was an
entirely new level.

Code review was another rising use case. In my experience, it is very rare to find good PR reviewers. Bugs easily slip
through the net, and it takes a keen eye to find them; some are almost impossible to spot, just a one-liner or a few
extra characters. Spotting those in a review requires deep concentration and knowledge of the task that was worked on.
AI could gather this context in mere minutes and highlight important gaps. Again, it was never perfect. To get adequate
PR reviews you _had_ to prompt it very specifically, otherwise you got the "[CRITICAL] Missing `log.warn` on line 32"
comment, or massive hallucinations. Even then, you'd still get some that threw you for a loop.

## New Models

Meanwhile, there was still a whole untapped dimension of _model choice_. In the beginning only GPT models were
available, until the boom of Claude, Gemini and their variants (plus open weights later). GPT models, much as they are
today, are very surgical instruments. They're very sensitive to prompts and do exactly as you say, which meant a steep
communication requirement, plus upfront planning, to get the best out of them. When Claude entered the scene, things
changed. Claude was much looser, much more eager to fill in the gaps and give you features you never asked for, yet on
average people appreciated it more than GPT models. It lowered the barrier to entry for getting _valuable_ and _useful_
results from these models.

_(Meanwhile, Gemini sat in the corner trying to fit together two Lego bricks that clearly did not fit, and it's still
there to this very day)_

Model choice now became important: Claude specialising in front-end design, GPT excelling at backend tasks. Cost, speed
and agentic systems were also coming into the frame. As models became more capable, their prices rose too, and choosing
the right model for the right task became a consideration in its own right.

# The Big AI Boom

Models and the tools around them just kept getting more capable. Skills, subagents, MCP (_shudder_), guardrails,
`AGENTS.md` files, rules and so on. However, it was model advancement that _really_ made AI boom across software
engineering. Sonnet 3.5 was the culprit: more capable, with better _taste_ and intuition, it lowered the bar even
further, accomplishing even more with less legwork.

Cursor building deeper integrations helped a lot here too. Models could now look at terminals, spin up browsers, _plan_,
go into special debug modes and more. They became more reliable and, most importantly, capable of long-horizon tasks:
working for hours, even days, without drifting off into madness. You could leave a prompt with a model and come back a
day later to a fully functioning app, albeit one with cracks at the edges. It still took further iteration before you
got something truly refined.

At this point I had AI making whole features, configuring VPSs, debugging my own machine, _fixing gosh-darn Windows
updates_, everything. My engineering shifted from building applications to building the _agentic workflows_ that built
those systems in the first place: tuning model behaviour with my user rules, writing special `AGENTS.md` files, and
creating the scripts, tools and the whole dog's dinner that allowed models to verify their work. By now, I could
reliably get a model to _make the thing I wanted work_. It would compile, with unit, integration and e2e test coverage.
The app would build and work, with most edge cases covered. I shifted into a QA role across my code review iterations.

The code still wasn't perfect, though. Sometimes there was nonsense you could spot at first glance, or duplicate code
everywhere. Ugly crevices of code would grow and grow as models duplicated those behaviours. Large PRs meant _days_ of
reviewing, especially because I'd never code reviewed this intensely before. Lots of parallel subagents often meant a
10k+ line PR coming my way, even after code review agents had caught the low-hanging fruit.

# Coding Faster than Comprehension

_(Hey, it's the name of the article!)_

As AI advanced, I found myself struggling to keep pace with _the sheer amount of code_ being generated. I started
prioritising which code _to review_, since reviewing all of it was not worth it. Not strictly because I wanted to go
fast, but because I rarely saw large problems in most of the code I did review. Instead, I took a risk-based approach,
only looking at high-impact code, where getting it wrong would have dire consequences. Code relating to security,
correctness and performance met that bar. It made code review much more manageable _at speed_.

It's worth mentioning that code quality like this did not come for free. Strict quality gates, verification loops and
numerous code review agents put this code through cycle after cycle. And with that comes _cost_. It's not cheap. If
you're willing to shell out enough on inference, you can afford to spend less human time reviewing code. Human code
review is now a trade-off between cost and risk, with risk dipping the more verification loops you have. Even when I
went looking through backend code changes, I often found almost nothing to flag, given how tight my loops were and _just
how much code_ was being generated.

## Dark Factories

"Dark factory" is the term people use for this: an AI system that turns specifications into code, where humans judge and
iterate _without ever looking at the code_. That doesn't mean a purely _vibe-coded_ app; there are plenty of checks and
balances, as I've mentioned throughout this article. At some point, this is where I think we're heading if we are to
develop at the pace of AI.

At the same time, though, AI codes _far faster_ than we can comprehend. At a fundamental level, I do not think you can
scale and design a system that has grown beyond your own understanding. We need a way to review code without reading
vast amounts of it.

### Decision Logs

When I was using Fable, it randomly started writing down my decisions. At first I was taken aback. Really? _More
Markdown_ in my repo? But I let it run to see where it took me. I even formalised the process in my `AGENTS.md`: all
decisions per feature area are recorded, along with their accepted consequences. Models would start making decisions
_for me_ and noting them down in these logs. This turned out to be a gold mine. Reading these decision logs _became_ a
sky-high PR review, and they're broadly accurate too. In combination with good PR descriptions and interrogating the
model on its implementation, this has become my replacement for reading code. I've found it a highly effective way to
keep some level of grip on _how_ a codebase works, and to keep better pace with how fast AI lets you go.

Decision logs are useful beyond being informative. I've had AI code review agents argue "this code is bad" and suggest
an improvement. An improvement I am aware of, and have descoped or accepted. The agents have _no way_ of knowing this.
Decision logs record that context, and make code review agents more effective as a result. It got me thinking:
codebases, before AI, were codified human knowledge. Human understanding, converted into language syntax. AI can now do
most of that without us even looking. So what's the next layer above? A software system is a series of _technical
decisions_ you make. In principle, you could take a set of decision documents and have AI faithfully reproduce a
software system. That is the direction it has me thinking about software.

Should every project operate this way? To some degree, yes. For critical applications you should still read the code
that matters, but you should also have far more guardrails and verification loops, which are more effective than any
human eye over code will ever be. Decision logs let you and the AI keep a finger on the pulse of how the codebase is
evolving and, moreover, stay _aligned_.

# Conclusion

This has been a chronological walkthrough of my experience coding with AI and how I've evolved my process over the past
five years. With every increase in model capability, all parts of these emergent software-producing systems become
easier, more reliable and cheaper to build. It's an exciting time, and there has never been more opportunity to learn
than there is now.