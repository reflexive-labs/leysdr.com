- **ADS-B.** A new decoder hears aircraft on 1090 MHz: `ley decode aircraft` prints each
  identification, position and velocity, and `ley track aircraft` keeps a table of aircraft by
  callsign. Its recipe sets the gain to 40 dB: on an R820T dongle over `rtl_tcp` (2026-11-02),
  30 dB decoded nothing and 40 dB decoded 19 messages in 9 s. An aircraft leaves the table after
  120 s with no message.
- **The Decoders place (⌘3).** A third place beside Radio and Library: a sidebar of installed
  decoders and their running jobs, and for each a log of records, a table of transmitters, a map
  when records carry a position, and an inspector for the selected record. The inspector names a
  transmitter, and `ley label` reads the same name. A decoder started here keeps running after
  the app quits, until Stop.
- **Starting a decoder says where it will run.** The page shows whether a decoder runs beside
  what you hear, takes an idle radio, or needs the radio from you; in that case Start asks "Take
  the radio?" naming your channel. A decoder no radio can hear has Start switched off and says why.
- **Notify Me.** A decoder's page builds a watch from its fields (SAME's county, an APRS
  callsign, a place and radius for anything with a position) and posts a macOS notification on
  each match. The daemon runs the watch, so it notifies with the app closed. The sidebar lists
  each watch with its condition and a Stop.
- **Decode With.** The Library's context menu and a recording's inspector run any installed
  decoder over an audio or IQ recording. The inspector's Decoded row says how many records each
  decoder found, with a link to its page. `ley decode <decoder> --recording <id>` does the same.
- **Decoding from the Radio.** A row per running decoder tops the Radio sidebar with its count
  and opens its page, and the waterfall tags an APRS or other audio decoder's transmitter by name
  on the row it was heard in. View > Show Decoded Names turns the tags off.
- **Changed: `ley tune` will not pause a decoder.** `ley tune`, `ley set freq`, `ley spectrum`,
  `ley waterfall` and the other verbs that retune a radio refuse a move that would pause a running
  job (a decoder, a watch, a recording or a scan) and list it: `retuning to 150.000 MHz would
  pause the aprs decoder on 144.390 MHz; --retune moves it anyway`. Before, only recordings and
  other clients' channels stopped a retune.
- **Changed: the app asks before it moves a radio a job uses.** "Move the radio?" lists every job
  the move would pause, for a click or a typed frequency outside the span, a band, a narrower
  width or Scan band; a drag asks once. Cancel leaves the radio where it is.
- **A radio comes back.** When a decoder, a scan or a take-over moved the radio and ends, the
  radio returns to the tuning it found, unless you moved it since. A job paused by a move says
  who moved it ("paused: the app tuned NESDR SMArt v5 to 146.520 MHz"), and the Radio inspector's
  Claims group lists who is using the radio, "paused by the app at 14:05" among them.
- **Who uses a radio.** `ley state` lists each capture's users: channels, jobs, views and you.
  `--dry-run` on `ley decode`, `ley record` and `ley scan`, and `dry_run` on the MCP tools, say
  where a job would run and what it would pause, and start nothing. Several decoders share one
  capture, and an IQ recording starts a new part each time its radio is retuned.
- **Readable records everywhere.** Each decoder's manifest carries display templates, so `ley
  decode`, `ley records`, `ley watch`, `ley track` and the MCP tools print one line a person reads.
  AIS static reports and SAME alerts, which printed raw bytes, now read as text. Fields have
  labels ("Transmitter", "Callsign", "County"), which `ley track`'s column heads, `ley watch`'s
  banner and the app use.
- **Changed: `ley track` lists rows by name.** Rows were newest-heard first, so a live ADS-B
  table moved on every redraw; `--sort heard` keeps that order. `--json` and the MCP
  `list_entities` tool follow.
- **`--gain` on `ley decode` and `ley watch`**, and on the MCP decode and watch tools, overrides
  a recipe's gain when the job sets up the radio. A job on a radio it shares keeps that radio's
  gain and says which.
- **The decoder list** leaves out `speech-scripted` and `iqstat`, which exist for tests.
- **Fixes.** `ley decode`, `ley watch` and `ley track` end with the reason when the daemon
  declines their job, where they waited forever. `ley watch --detach` reports a decline rather
  than "left running", and the MCP `watch` and `start_decode_job` tools return it. A relative
  `--socket` reaches the daemon. The decoder inspector's values line up in one column. Renaming a
  bookmark added from a scan hit on a bookmarked frequency edits that bookmark.
- **Fixed: a decoder started just after another program released the dongle ran at 0 dB.**
  A daemon that started while `rtl_tcp` (or SDR++, GQRX) held the dongle never learned its gain
  table, so a decoder that opened the dongle afterwards asked for 40 dB and got 0 dB, and heard
  nothing. Opening the dongle now reads its tuner and gains, a fixed gain on a stage with no table
  is refused rather than set to 0 dB, and the `ley decode` banner names the gain. A decode job
  whose radio stops delivering samples for 5 s now says so (`no samples from … for 5 s`).
- **Fixed: a transcription of a recording lost overs.** A recording of more than nine overs came
  back with most of them missing and no warning. The engine now waits for the speech decoder
  instead of dropping an over, and a finished job's detail says how many overs have no record
  (`3 of 20 overs have no record`).
- **The Library lists transmissions, not files.** A row is one transmission with its transcript
  line under it, and a file that holds several overs (any recording made before this release, or
  with a long `--hang`) is a row for each, which plays that over alone. The inspector describes
  the transmission and its recording. When a transcription leaves some transmissions without
  words, the page says how many, with Transcribe again beside the count. Show in Finder moved to a
  row's context menu.
- **Changed: a recording is one file per transmission.** A gated recording now closes a file
  500 ms after the key-down in `ley record`, the MCP `record` tool and a live speech job's clips,
  as the app's record button already did; it was 5 s, which put an exchange of several overs in
  one file. `--hang 5s` (MCP `hang_ms`) keeps the old behaviour.
- **Changed: `ley record` skips the dead air.** With no `--gate`, an NFM or AM recording with a
  squelch set is gated, so a repeater is recorded only while it is keyed; WFM, IQ and `--squelch
  off` still record continuously, and `--gate none` asks for that on any channel. The banner
  names the gate the daemon chose. The daemon also removes, at start, recordings that hold no
  file and were left from before an empty recording was discarded.
