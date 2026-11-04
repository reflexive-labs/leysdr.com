- **Fixed: the Decoders map jumped around.** It re-fitted itself to every aircraft several times a
  second, so it zoomed as aircraft appeared, moved and aged out. It now frames once, afterwards
  only zooms out when an aircraft would leave the view, and never moves when one disappears. Once
  you pan or zoom it stays where you put it; **Fit All** in its corner frames everything again.
  An aircraft not heard for half its silence window draws dimmed before it goes.
- **Fixed: decoded transmitters vanished and came back.** Leaving the Decoders place, switching
  decoder or a reconnect rebuilt the table from only the last 1000 records, so a transmitter whose
  records had scrolled out disappeared until it was heard again. The table now lasts the session
  and new history merges into it.
- **Fixed: `--for` recordings ran long or short.** On a busy Mac a `ley record --for 1s` could
  hold 1.1 s of audio, or stop a few milliseconds early by the clock, and a gated part could hold
  a few milliseconds more audio than its span. A duration is now cut at exactly its sample count,
  and audio is dated where its samples belong.
