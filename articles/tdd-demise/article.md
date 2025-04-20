My views on TDD have shifted considerably over of my career. When I first heard of it at university, I thought, “That
sounds excessive—writing so many tests?” Later, when I encountered it on a large-scale project, it felt surprisingly
satisfying and effective. But more recently, I’ve come to believe that TDD often *kills productivity*. That’s an
intentionally strong statement, and like most things, the reality is more nuanced. I don’t think TDD is inherently
bad—but like any methodology, its value depends on how and where it’s used.

# TDD - What's it good for?

TDD shines when tackling large, complex problems. Without clear structure, it's easy to fall into the trap of building
an unplanned, tangled solution—addressing edge cases as they appear, rewriting bits of logic haphazardly, and ultimately
summoning the tendrils of the spaghetti codebase. TDD imposes discipline: “What’s the simplest test case I can make
pass?” That question slows you down and structures your thinking, situationally in a good way.

This methodical pace forces you to build only what’s needed, step-by-step. Each test captures an explicit requirement,
catches regressions early, and builds confidence. Your tests will catch any regressions, or even, assumptions you have
made. You have a testable artifact at each stage in the process. Heck, it even ensures your solution is easily testable
and can come with good design aspects for free such as encapsulation and low coupling.

# Where TDD Becomes a Problem

The problem is that while you’re stepping through this process you’re cementing yourself into your first design. Think
of it like carving a wooden structure piece by piece and gluing each part down before seeing the full picture. You end
up introducing unnecessary patterns, abstractions, or structure.
![Complex house](https://supernotes-resources.s3.amazonaws.com/image-uploads/5eda8525-6de0-4b3a-863e-1fe80114a73a--image.png)
By the time you’ve written enough tests and built enough functionality, you may realize your design is flawed—or worse,
there's a much simpler way to solve the problem. But now, rewriting things becomes costly. You've got dozens (or
hundreds) of failing tests, many of which now break because of changes in your design or approach.

This often leads to one of two outcomes:

- You abandon or rewrite many of your tests, defeating the original goal of safety.
- You avoid making beneficial design changes because the cost of rewriting the tests is too high.

The first version of any solution is usually the worst one. You’re still exploring the problem space, learning where the
real complexity lies. Ironically, TDD can obstruct this learning process by discouraging iteration. I'd argue in this
scenario, tests are a means to an end to understand the problem space. If you opt to redesign your solution, you don't
gain any benefit from following TDD a second time around. Your second design will have far fewer pieces carved, be a
much simpler shape and stand more firm.
![Simple house](https://supernotes-resources.s3.amazonaws.com/image-uploads/e4cf7e4a-655d-4f05-b71a-4d42a26970bd--image.png)
This doesn’t mean you shouldn’t write tests at all—higher-level end-to-end tests are still useful for catching
regressions—but you should be more selective. Instead of writing unit tests by default, ask yourself: *What value will
this test provide?*

# TDD vs. Prototyping

TDD and prototyping are at odds. TDD favors incremental refinement of a fixed direction, while prototyping is about
rapid exploration and learning. Once you’ve internalized the skills TDD teaches—breaking down problems, writing testable
code—you may no longer need to follow the strict TDD workflow.
![two roads](https://supernotes-resources.s3.amazonaws.com/image-uploads/bd7e5e95-cf80-4282-bb11-7676389ef4a2--image.png)
A side effect of strict TDD is excessive testing of implementation details. For example, changing an error message,
moving a function, or extracting a class and 5 test suites fail because your mock is broken, a trivial error string
changed, an argument wasn’t passed to a function anymore etc. these tests waste your time. These aren’t real
regressions—but your test suite treats them as such. You end up wasting time fixing tests that no longer serve a
purpose.

You can mitigate this with better testing practices—focusing on behavior rather than internals—but TDD often leads to
this problem by its very nature. Tests are written to drive your understanding of the problems solution space, not to
catch meaningful regressions.

# Are All Unit Tests Just Bad?

No—but they often provide the *least* valuable signal when things change. Unit tests make you hyper-aware of internal
changes that don’t necessarily impact user-facing behavior. This can be useful in high-assurance environments (e.g.
aerospace, medical software) where safety is paramount for users lives.

But for most products, especially those where you can ship fixes quickly, it’s more important to optimize feedback
loops: deploy time, rollback capability, error reporting, and yes—test runtime. In this context, I prefer *safety
nets* (e.g. graceful error handling, observability) over *guardrails* (e.g. rigid unit tests). Optimise for speed of
delivery, detecting the bug, understanding it and swiftly deploying the fix.

## Conclusion

TDD is a tool. It’s useful for decomposing complex problems and building confidence in unfamiliar systems. But should
you use it by default—on every feature, in every project? Probably not and rarely, for most developers.

If you're working on a CRUD app or prototyping a new idea, it’s often faster and more productive to build iteratively,
write fewer but higher-level tests, and refactor as you go. TDD can help when you’re stuck—but don’t let it become a
rigid rule. Use it deliberately, not religiously.