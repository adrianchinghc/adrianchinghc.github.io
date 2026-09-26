---
title: "Build vs Buy Software: How to Decide Now That AI Made Building Cheap"
seoTitle: "Build vs buy software: how to decide"
description: "I sold and delivered custom software for nine years. Here's how I decide build vs buy now that AI made building cheap."
date: "2026-10-07T11:30:00+08:00"
draft: false
topic: Software decisions
cta: leadmagnet
leadMagnet: AC-035
socialTitle: "Build it or buy it?"
socialDescription: "I sold and delivered custom software for nine years. Here's how I decide build vs buy now that AI made building cheap."
socialLabel: "SOFTWARE DECISIONS"
socialAction: "Read the guide →"
socialCover: scripts/assets/illustrations/ac-035-build-vs-buy-cover.webp
socialCoverAlt: "Screen-printed illustration on cobalt of machine parts on a workbench beside a complete machine on a shelf, split by a forked arrow."
---
{% from "article-figures.njk" import buildCostOwnershipCost, buildBuyQuestions, buildBuyRunOrder %}

Software got cheap to build. That's the trap.

I spent nine years selling and delivering custom software. Back then, "build it yourself" was rarely a real option. Building took too long and cost too much. So buying, or just sticking with a manual process, was the obvious call for most owners.

AI changed all of that, and it's changed how founders should weigh building software against buying it.

It cut build time down so much that "let's just build it" has quietly become the default answer to almost any operating problem.

A team can now ship something that looks like a real product in very little time. Looking good and being ready to run your business on are two different things. Launching a production-ready product still takes real technical foundations: security, data handling, reliability, someone who owns upkeep. Skip those, and a fast build turns into a disaster later, usually right when you can least afford it.

The cost of building fell. The cost of owning what you built did not. That means maintaining it, fixing it when it breaks, and being wrong about what you needed in the first place. The expensive mistake today isn't a failed build. It's a successful build of the wrong thing.

{{ buildCostOwnershipCost() }}

Before you decide whether to build, buy, automate, or fix anything, answer a more basic question first:

1. What stage is your business in?
2. How mature is the process you're trying to fix?

## Start with the stage, not the tool

I use two rough stages to think about this. They're not scientific thresholds. They're my read on how this tends to play out. Your numbers might land differently. Treat this as a gut check, not a rulebook.

**0–5 million: fix the process first.** At this stage, the process may not be stable or documented yet. There may be no SOP, no consistent way the work gets done. It might live in someone's head, or change every time. Automating an undefined process just makes the wrong thing happen faster. Write down how the work actually gets done, make it repeatable by hand, and only then look at tools.

**5 million onward: automate what's stable.** Once a process is proven and repeats the same way often enough, automation earns its keep. This is the stage where a workflow tool, a script, or an AI-assisted process can take a task off someone's plate. You finally know exactly what that task is supposed to do every time.

Only after the process is stable does the build-or-buy question even make sense to ask.

## Build or buy: the four questions that decide it

Once you're automating something real, you're choosing between custom software and an off-the-shelf SaaS product. That choice comes down to four practical questions. Each one ends with a call.

**1. Is your team technical, do they have the time and capacity, and do you need an internal tool?**

What it means: this is about capacity, not ambition. A technical team with slack in their schedule can absorb a build. A technical team already underwater can't, no matter how fast AI makes the first version.

How to judge it: if you pulled your best engineer off their current work for two to four weeks, would the business survive that? If yes, you likely have the capacity.

The call: if all three are true, technical, time, internal, build it. AI shortens the path to a working system.

**2. Is it internal, or does it face your customers?**

What it means: internal tools fail quietly. Customer-facing tools fail in public, in front of the people paying you.

How to judge it: ask who gets hurt first when something breaks, an employee who can flag it in Slack, or a customer who just churns. Also check whether the tool touches customer records, payroll, or a process the business depends on to run. Those raise the bar even for internal tools.

The call: going internal narrows exposure, but it doesn't remove the need for someone to own security, data handling, reliability, and upkeep. External or customer-facing software raises that bar further. You need a properly credentialed technical team, and someone has to explicitly own security. That's not optional, and a fast AI-assisted build doesn't get you around it.

**3. Who owns maintenance, and for how long?**

What it means: every build creates upkeep. The build itself might be fast now. The bug fixes and the "wait, why did this break" calls are still there six months later, and they still cost real time and money.

How to judge it: name the person who owns this in six months, today, before you approve the build. If you can't name someone, you don't have a maintenance plan. You have a countdown.

The call: no owner named, no build approved. A build without a named owner decays faster than bought software, because nobody outside your team is maintaining it for you.

**4. What's the total resource picture, not just the build?**

What it means: this is where the "AI made it cheap" logic falls apart. Building remains possible even for a non-technical team without much time to spare. But the real cost isn't the initial build. It's the time, the ongoing resources, the maintenance, and the risk of getting it wrong, stacked on top of everything else you're already running.

How to judge it: add up the build time, plus six months of expected fixes, plus the cost of your team's attention being somewhere other than the business. Compare that total to the price of buying the thing that already does it.

The call: if you want a specific outcome and don't have the time or the team to own a build, buying is usually the better call. What you'd be signing up for with a build isn't the build itself. It's the upkeep, the time, and the risk of being wrong.

{{ buildBuyQuestions() }}

**What about the "we can just no-code it" pitch?**

What it means: a no-code tool or an AI app builder doesn't change the four questions above, it just changes who's typing. The output is still software. It still touches whatever data you feed it, still needs someone watching for the day it breaks, and still needs a named owner six months from now, not just on launch day.

How to judge it: a no-code build that stores customer information or runs a process the business depends on carries the same exposure as one written in raw code. Speed of assembly isn't the same as being production-ready. Run it through the same four questions: is your team capable and do they have the time, is it internal or customer-facing, who owns maintenance in six months, and what's the total resource picture once you count the fixes.

The call: if nobody can answer those, "no-code" is just a faster way to end up with an unowned build.

## Put it together

Here's the order I'd actually run through, in a proposal review or a "should we build this" conversation.

1. **Is anything actually broken or costing you?** If not, leave it alone. Not every process needs to be fixed, automated, built, or bought.
2. **Is the process stable and documented?** If not, fix that first. Don't automate a mess.
3. **Is it worth automating?** If the process is proven and repeats often, start looking at tools or a custom workflow.
4. **Build or buy?** Run the four questions above.
   - Internal, technical team, has the time: build it, use AI to move faster, and name someone to own security and upkeep.
   - External or customer-facing: build only with a properly credentialed technical team that owns security, or buy.
   - Non-technical, short on time, want the outcome: buy.

{{ buildBuyRunOrder() }}

None of this is a universal formula. It's the judgment I'd bring to your specific proposal if you handed it to me across a table. The stage numbers are my judgment call.

Keep this checklist. Next time a build proposal, or a "we can just build this ourselves now" pitch, lands on your desk, run it through these questions before you approve the build. Add your email below and I'll send you the one-page version.
