# Introduction

AI has dominated tech discourse for the past few years. It has had mixed reception in the programming space, from
hardcore vibe coders to those who won't even let the impure thought of AI enter their cerebrums. Personally, I’ve found
AI useful in reducing tedious tasks so I can spend more time on the parts of development I enjoy. Below, I’ll walk
through practical examples and principles that help make AI genuinely useful in everyday programming work.

# How to Use AI Effectively

> "I asked AI to build me a billion-dollar app and it didn't work"

The most common failure point in using AI is poor communication. People underestimate how much context and clarity AI
needs. It’s not magic—it’s a language model predicting the next word based on probability.

![Happy prompting](https://supernotes-resources.s3.amazonaws.com/image-uploads/c916266c-cbcb-4f86-94db-800be6ce80f4--image.png)

Here are a few principles that help get the best out of AI:

- **Be Specific**: While AI can be helpful in brainstorming, the more specific you are, the more likely you will get a
  good answer. LLMs are probabilistic machines, they're just predicting the next word. The more information they have to
  work with, the higher likelihood they'll provide you useful output
- **Be Focused**: Asking AI to do too many things, such as "build me this entire app" usually does not work out well.
  This benefits from the previous point, honing in on LLMs probability to give useful output. Break you task down into
  focused steps that the LLM can tackle one after another.
- **Be Aware of Chat History**: As you chat with LLMs you build up a chat history, this can distract the LLM. If you've
  had a long conversation on 4-5 distinct topics, the history may bias the LLM and make it act strangely or
  unintuitively fixated on something. In these cases, start a new chat, keep the chat history clean on distinct subjects
  to avoid noise the LLM needs to process.

Overall do not treat LLMs like a human. Take the mindset that the LLM cannot think for itself, assume it'll make every
mistake imaginable and write your prompt in a way that explicitly instructs it to avoid those mistakes. The bigger the
task you give, the harder this is to do. Therefore, focus on small tasks that require minimal context.

# Optimise your Workflow / Development Environment

In a project we all have little inefficiencies here and there. You always need to create this file when booting up the
server, setting up this new microservice requires setting up 4 containers through docker compose, you always need to
delete those files in that S3 bucket to restart your end to end test for a feature you're developing. These are perfect
candidates for automation—but often too minor to justify scripting from scratch.
![Optimise](https://supernotes-resources.s3.amazonaws.com/image-uploads/2420f9af-7558-4b3f-be8d-66df613e69e9--image.png)
However, this is a perfect task to give to an LLM. It's small, focused and fast to write if you know what you're doing.
I've done this myself while working on a client where I constantly needed to port forward to services to debug
behaviours in live environments, across numerous Kubernetes contexts. I had the LLM create a bash script, that took in a
JSON file of the Kubernetes context, pod name, name space etc. and it ran down this list and did the port forwarding for
me.

I have done this for many smaller things too, such as scripts to:

- Spin up a Kafka container
- Kills all processes running on port 80
- Orchestrate attaching debuggers to my tests

These aren’t hard problems, but LLMs save you minutes that add up fast.

# Extracting Meaning from Messy Data

One of the most useful features of LLMs is summarization. Poorly formatted logs, messy JSON, exception stacks—they’re a
pain to parse manually. Instead of scanning a long blob of JSON for an error, I ask the LLM to extract the exception,
identify the line number, and provide a rough diagnosis. It’s much faster and often more accurate.

# Tedious Work

This is usually work that just requires a lot of typing, but is trivial to complete.
![Tedious](https://supernotes-resources.s3.amazonaws.com/image-uploads/5ba1e587-7d91-4903-944e-abbe90a4b325--image.png)

For example:

- You're using a third party API, but they don't give you a library to TypeScript type definitions to work with. You can
  throw a set of responses or a single response at an AI and tell it to generate the types.
- You have a set of data, but it's in XML and your application needs it in JSON, get the AI to write a script to
  transform it or, if you have only a few documents, ask it to transform it all itself, without even needing a script.
- You have an array of JSON objects with 100 elements and you want to find all the common "category" values, ask an LLM
  giving it the data.
- You need to scrape a website to get some data, that requires navigating over deeply nested HTML with obscured CSS
  class names

These are all trivial to do by hand, but letting the LLM handle them can turn 10 minutes of effort into 10 seconds.

# Generating Tests

Some may let out an audible gasp at this suggestion. Writing good isolated tests often requires writing a lot of code.
Scaffolding, mocks and data set-up can be
an [extraordinary amount of busy work.](https://www.linkedin.com/pulse/unit-testing-software-quality-empirical-research-results-avteniev/)
Most of this is very repetitive and can be a lot to keep in your head for complex features. If AI can generate this
test, you can read and verify it is testing what is expected, why not generate the test? Especially if you must
meet [code coverage metrics](https://interrupt.memfault.com/blog/testing-vs-overhead), which make you end up testing
things which aren't of much value?

A tip for making the LLM more consistent in generating tests of a consistent style, is to give it some guidelines.
Making these guidelines can be quite tedious to fine tune sometimes however, you can also use LLMs to assist you in
making these
by [using an LLM prompt generator](https://github.com/abilzerian/LLM-Prompt-Library/blob/main/prompts/prompt_generation/Prompt%20Creator.md).

# Needle-in-a-haystack Google Searches

LLMs can sometimes be more effective Google searches. When you don't quite know the proper words to Google, the LLM can
fill this gap. It is effect to ask the LLM to "find people who have had a similar problem online and tell me how they
fixed it". Using this I have found people on StackOverflow and GitHub who have reported my specific issue and found a
solution, that were surprisingly hard to find manually.
![Needle in a haystack AI](https://supernotes-resources.s3.amazonaws.com/image-uploads/861987d1-91ef-49ba-9d8d-71111ffa4cf0--image.png)
This can also be useful if you're having the LLM assist with a problem and its getting stuck not making sense. When I
tried to Google for the same problem, it was much harder for me to find the resource that the LLM had found.

# Brain Storming / Discovery

LLMs can be a good resource to discover new solutions, technologies and approaches to problems. I think we've all made
Google searches for "real-time databases", "web socket alternatives" etc. and the top result is always full of generic "
top 10 real-time databases 2025 (published in 2024)", "you won't believe these aren't web sockets!". LLMs can cut out
this noise and find you established solutions without needing to shovel through the noise the top Google results give
you. Outside that, you can prompt the LLM to ask you questions you may not have considered and even highlight pitfalls
before you go to implementation.

# Conclusion

AI isn't magic, and it won’t build your dream app from a single prompt. But if you learn to use it effectively—by
breaking tasks down, being specific, and focusing on small wins—it can be a serious time-saver.

Used well, AI isn't just hype. It’s a tool that helps you focus on what matters and skip what doesn’t.
