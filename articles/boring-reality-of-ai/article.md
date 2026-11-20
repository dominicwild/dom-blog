As engineers we like to control things, to consider every intricate detail and fit all the pieces together. When everyone programmed in assembly, every line of opcode was important; then we got C and the compiler took care of that. Now, with AI, we're at a new level of abstraction where the lines of even the higher-level languages don't matter anymore.

AI requires a mindset shift, and I find people are still unable to let go of the idea that each line of code matters. This manifests in the many ways people try to control AI.

# Skills

No skills or context files (like `AGENTS.md`) should ever teach your agent how to *write* good code. AIs are RL'ed on this incessantly already. There should not be a single code sample in any skills you make. If you find yourself doing this, you're likely fixating too much on code review or trying to optimise away nits. None of this improves AI performance in your codebase. AI is already good at coding; it doesn't need to be guided on that.

Instead, your skills should focus on *guiding* the AI and encompassing your engineering principles. We can all write a "good" test, for instance, then another engineer comes along and is horrified by our "good" test. What makes a good test to you? That is what the AI needs to know. Do you forbid mocks? Should tests be focused on testing a single behaviour? Always be formatted in `given`, `when`, `then`? Tell the AI this; write a skill *by hand* for it. If you get AI to generate it, it'll be full of extra baggage and you'll be tempted by that "oh yeah, that sounds good too", but the AI won't need it and it is all really just extra noise that regresses it to the mean. Skills should be short, sweet and to the point as much as possible.

# Don't Treat Context Like Code

You're not optimising your skills, `AGENTS.md` or anything in your AI workflow by reading how someone else did it, or taking someone else's skill off the shelf, or making a Frankenstein's monster from every influencer's "best" skills. All these skills are written against different models, contexts and ideals. Ignore them. There is no such skill that "makes better skills".

The only way to know whether a skill or tool or *any* AI "thing" works is to use it. Ask the AI to implement your idea and then see how it goes. That's all there is to it. AIs are non-deterministic machines; we can easily reason that all the context engineering makes sense, but testing it is another thing. The very highly effective teams, pre-AI, didn't all just use Rust or Kanban or Retros or Design Sessions; there's no one universal practice that is just "the best" for every team, person or company. You can't predict the outcome without actually *doing* it. Agents are very much the same way.

Implement some sort of change to your workflow and just work as you normally would. Then, get AI to analyse your past week of transcripts and ask "Is that skill X I added last week being effective? How did it impact my sessions?" and the AI will gladly look. If you want something more dedicated, ask an orchestrator agent "implement feature X. Also, run this as an experiment using Y, compare and contrast approaches" and now you have a more rigorous comparison. As a bonus, you can combine the best of both attempts to get a more robust implementation. Treat agentic engineering as a science, not an algorithm.

*(Incidentally, this is also why you can't really "test" a skill)*

# Constraints are the New Code

In order to harness the power of AI's speed, it *needs* to make decisions for us, a lot of them in code. We make decisions under many constraints in a codebase, implicitly and explicitly. Whether it is because some colleague told us "this is just how the code is laid out", so we code in that structure, or "we have to ensure everything is auditable", so you engineer every part of your system to be highly durable and resilient. All this lives outside the code, in our heads.

In the same vein as writing skills as guidance, to align the AI with your intent, so, too, must all these constraints. A project is an ever-growing set of decisions, and those must be written down for AI to make the correct decisions for your context. Decision records are the simplest way to do this: a simple set of documents in your codebase that describes the decisions you and the AI have made.

Code can also act as context. An architecture test or lint rule acts as a codified decision, one that can be actively enforced. Add these where you can, but noting down the *why* in a decision record is important for agents to understand what a "good" decision looks like for you. Agents are then able to infer and apply that understanding beyond its original context.

# It's Simpler Than You Think

How do you adopt AI in your codebase today? You just start using it. You don't need skills or even an `AGENTS.md`; just let the AI go and see what happens. Agents get better every day; they're being trained to make better software engineering decisions by default. You don't need any overengineered context management system, or to give them their own TypeScript tutorial in the codebase, or a custom harness. All AI truly needs to know is: what is your business? What is important to you? How can it judge what "good" is?

Our role is building systems that let it know what that "good" is. We build verifiers, whether it's deterministic rules such as lint, tests or good abstractions and codebase architecture. We inform the agents of the constraints we have, on technology, load, product direction, ways of working etc. We keep a human in the loop to inject our judgement, redirect the agents and then figure out how we can codify that or pop it down in text somewhere for the agent.

In the end, it's all about making a good developer experience. Make the right thing easy and the wrong thing hard. The right thing is not easy if you start with 200 skills, 55 tools and an AI-generated Mr Whippy of everyone else's `AGENTS.md`.
