# Leyline positioning and website framework

Use this framework to guide the site's copy, section order and choice of screenshots. It
defines the audience, three lasting product promises and how releases add evidence for them.

## Audience and positioning

Write first for someone who knows radio, uses a Mac and wants a useful connection between
their receiver and their computer. They know terms such as squelch, waterfall and callsign;
they need Leyline's behavior and terms explained. Clicking, scripting and asking an assistant
are different ways into the same product.

The public headline is **Software defined radio, made for the Mac.** The proposition beneath
it is:

> Leyline brings listening, decoding and recording together on the Mac, with the same radio
> available through the app, terminal and assistants.

The headline and proposition should remain useful across releases. Individual protocols,
interfaces and optional services supply evidence for them.

## Product promises

| Promise                             | What it means to the user                                                          | Evidence                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Explore the radio around you.       | Find signals, tune them and hear what is happening.                                | Spectrum, waterfall, band rail, scanning, modes, tone discovery and memories by band. |
| Make something of what you receive. | Read what a signal carries, keep transmissions and return to them later.           | Decoders, recordings, speech text, search, watches and the Library.                   |
| Work the way you prefer.            | Use a Mac interface, a command or an assistant while keeping control of the radio. | The shared engine, `ley`, MCP, visible assistant steps and explicit radio handoffs.   |

Each promise describes a lasting benefit. New capabilities should strengthen an existing
promise before we consider adding or changing one.

Across all three, explain concrete behavior, visible state, explicit control and where data
goes. Show what the user can do and what happens next.

## Message hierarchy

1. **Positioning** establishes whom Leyline serves, its category and why it belongs on their
   Mac. Change it when the intended audience or purpose changes substantially.
2. **Product promises** explain the enduring benefits. Revisit them when sustained product
   development reveals a benefit that the existing framework cannot explain.
3. **Proof** supplies specific behavior, supported capabilities and screenshots. Update this
   with each release.

A release's largest feature does not automatically change the homepage headline or become
its first feature. Give evidence prominence according to how well it explains the product to
a visitor. Keep version announcements and release chronology in the release notes at
`/download`.

## Website narrative

The homepage follows the visitor's understanding:

1. Establish what Leyline is and how to start.
2. Show how receiving works: tune, listen, explore bands and keep useful frequencies.
3. Show what can be done with received signals: decode, record, revisit and watch.
4. Explain the ways to operate the radio and the control shared between them.
5. State requirements and offer the download.

Use the promises to choose and order examples; their exact wording need not become section
headings. The hero introduces the whole product. Feature headings describe lasting tasks and
outcomes. Keep related explanations together, such as the assistant and its provider settings.

Preserve the site's existing layout, typography, colors and radio animation as copy evolves.
Use screenshots to demonstrate behavior at a readable size. Each additional image should
explain something useful enough to justify the page space.

## Voice and claims

Use plain words, the behavior and its reason. Explain unfamiliar Leyline terms in context.
Prefer a concrete action over an adjective, and keep conditions beside the claims they qualify.

- Call the assistant "the assistant". Avoid AI-powered, smart, intelligent, copilot, "the AI",
  seamless and magic. Avoid comparisons with other SDR software.
- Keep API keys optional. The assistant uses conversation and tool results, which can include
  decoded records; speech sends each over's audio to the selected supported provider. Explain
  those flows separately from decoding on the Mac and fetching map tiles from Apple.
- A key is stored in the login keychain and sent to its chosen provider or endpoint. An AI
  subscription is not an API key. State usage behavior without promising cost or accuracy.
- Aircraft decoding shows transmitted addresses, callsigns and message fields. It does not
  supply registrations, aircraft types, operators or routes. Reception depends on the antenna
  and location; avoid range or reliability promises, "real-time flight tracker" and "radar".
- One dongle has one tuning. Describe what would pause and how Leyline reports it. Do not
  imply unrelated frequencies can all be received at once.
- Claim only built decoders and supported modes. Speech-to-text does not add digital voice
  decoding. Maps fetch tiles over the network.
- Take screenshots from a pinned `shots-*` release and keep their alt text from `shots.json`.
  Signal fixtures are simulated; captions must preserve that distinction. Scripted speech
  examples do not establish transcription accuracy on real radio audio.

## Release review

Before editing the site for a release, answer:

1. Which existing promise does each addition strengthen?
2. What can we demonstrate more convincingly?
3. Which existing sentence or image should change?
4. Does this reveal a lasting gap in the framework?

Update proof and supporting copy first. Change a promise only when the release reflects a
sustained change in what Leyline is for or whom it serves. Review the resulting page as a
whole: its balance should explain Leyline beyond the current release.

### Applying the framework to 0.3

| Addition                        | Promise strengthened                                              | Website treatment                                                                         |
| ------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Aircraft and the Decoders place | Make something of what you receive.                               | Extend decoder coverage and explain logs, tables, fields and reported positions.          |
| Callsigns on the waterfall      | Explore the radio around you; make something of what you receive. | Connect a decoded name to the signal's row and frequency with the APRS waterfall capture. |
| Decode a recording              | Make something of what you receive.                               | Extend the Library story to running recordings through compatible decoders later.         |
| Watches with the app closed     | Make something of what you receive.                               | Explain useful matches and notifications beside decoding.                                 |
| Radio handoffs and dry-run      | Work the way you prefer.                                          | Explain one tuning, what would pause and how to preview a radio change in Ways.           |

The map capture supplies the main decoding evidence. Expandable table and waterfall captures
show the other views without lengthening the initial page. Ways shows the window following
the terminal, with an expandable example of a scan pausing APRS and a dry-run sharing an
existing capture. Each caption describes the published image and identifies simulated signals.
The image choices preserve the page's positioning and narrative order.

Product facts and image rules for this pass come from the app repository's
[0.2 handoff](https://github.com/reflexive-labs/leysdr/blob/main/docs/plans/site-0.2.md) and
[0.3 handoff](https://github.com/reflexive-labs/leysdr/blob/main/docs/plans/site-0.3.md).
