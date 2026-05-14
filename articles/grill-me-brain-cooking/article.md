# Grill Me, the Skill That Cooks Your Brain

`grill-me` is a popular AI Skill popularised by [Matt Pocock](https://www.youtube.com/@mattpocockuk). The skill itself
is quite simple:

```
Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

The intention is that you use this skill to squeeze out all details of an idea you have. Whether it is a plan, product
feature, or whole application architecture. The AI is just helping you think more, that sounds great, right!?

I think `grill-me` is generally _bad_ and illustrates a lot that's wrong with hype culture and specifically how it ties
in with AI. `grill-me` effectively outsources your critical thinking to
AI, [the prime trap of AI](https://larsfaye.com/articles/agentic-coding-is-a-trap). You might think "but grill-me
presents me with questions? I need to answer and think about them? Doesn't that promote critical thought?". The question
is a carrot on a stick, the AI has _supplied_ you that question, _supplied_ you that line of thought. In `grill-me` it
also often _supplies_ you with multiple choice _options_ and provides a _recommended_ option. This falls directly into
the trap of [choice architecture](https://thedecisionlab.com/reference-guide/psychology/choice-architecture), and that's
not a technical term, but a _psychological one_ from the field of behavioural economics.
> *Choice architecture*refers to the deliberate crafting of decision-making environments. By subtly shaping how options
> are presented, choice architecture influences individual decision-making, often without their explicit awareness.

This encourages you to _not think_ critically about the problem you're facing. The options presented narrow your field
of view of the problem space and also the decisions you could possibly make in that space. It makes answering feel like
thinking, while quietly moving the hard part of thinking, deciding what matters next, into the AI.

AI will always regress back to its homogenous origins, that is to say, the most common high-probability concepts in its
training data. It means you'll be making the same decisions everyone else is, while feeling like you're being productive
and being led down the same hole as every other person. The result? You're burning tokens, wasting time, and in the
worst case, `grill-me` becomes auto-spec-generation with extra steps: you click through AI-framed decisions and feel a
greater sense of false-ownership .

# Can We Fix It?

In its current form, _no_, not really. Asking AI for feedback or using it as a means of brainstorming itself is _not
bad_. The difference between you asking the AI for feedback and `grill-me` is that _you_ are driving the conversation.
_You_ are in control of where the train of thought is going. _You_ are making the decision. _You_ have to think of "what
is the next course of action here?". Versus `grill-me`, which is a conveyor belt of silver platters, you choose the one
to eat and the AI fetches the next four. You make AI answer _your_ questions, not the other way around.

The best way to frame this is:
> AI is good at highlighting new angles to a problem you're thinking about.

For instance, "What if this endpoint is hit by one million users?", "What if we toggle feature flags A, B, C, and D?" or
problem spaces that are bounded: "Are we GDPR compliant?", "Do we leak any PII?" etc. Essentially any scenario where a
check-list style interrogation would help, anything fuzzier than that lands you back in the trap.

A good `grill-me` skill is literally you, _yourself_, asking the AI targeted questions that spawn _from your own_ train
of thought. Then you _react_ to that feedback to drive your _next_ train of thought. You remain in control and thinking.

# Broader AI Hype Culture

`grill-me` highlights the issue with the broader AI hype culture: _no one knows what they're doing_, and _everyone_
rides the hype train of popular skills because they're popular, even if the skill is to _your_ detriment or the
detriment of your workflow.

So what can you do? I'd suggest the following:

- **Experiment**: Use other people's workflows, skills, and tools as inspiration and _not_ gospel. Take a skill, extract
  the bits you take inspiration from, and use them in your own skills or workflows.
- **Stay focused and _thinking_**: Resist the temptation to switch your brain off and use skills or workflows that
  encourage it. If you're not experiencing friction in your workflow, _that's a big red flag_. AI is here to write the
  code and do grunt work, _not_ do software engineering.
- **Learn**: AI is a whole new paradigm. You have to learn it from first principles. Don't shortcut it. Additionally,
  _understand_ what the AI code does; do not let it code something beyond your capabilities. Use it as a learning
  resource.

# Closing Remarks

There are many other examples of AI trends negatively impacting people's effectiveness with AI. This is but one of them.
The landscape is vast, complex, and rife with small details, exactly like learning to code all over again. If you take
one message from this article, let it be this: Make your own workflow; don't _become_ someone else's.