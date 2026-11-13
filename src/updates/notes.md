- **Fixed: a failing radio was opened again and again.** A dongle that stopped answering (empty
  USB descriptors, register writes timing out) was re-opened every 2 to 60 s, and each open could
  make the driver reset it, which can stall other devices on the same USB hub. After three
  failures in a row the radio now reads `NOT_ANSWERING` in `ley devices`, `ley state` and the
  app's device menu, with what to do: "unplug it and plug it back in, ideally into a port on the
  back of the Mac". Leyline leaves it alone until it is replugged. A radio another program holds
  still reads `IN_USE` and is checked again as before.
- **Fixed: a capture whose radio stopped sending samples still read `active`.** After 5 s with no
  samples a capture now reads `STALLED`, "no samples from <radio> for 5 s", and goes back to
  active when samples return. After 30 s Leyline closes and reopens the radio once; a radio that
  still sends nothing is marked not answering.
- **Speech on a channel that never goes quiet.** A transmission longer than 30 s is cut into
  pieces at the quietest moment near each 30 s, with nothing lost between them, so FM broadcast, a
  NOAA weather station or a channel with the squelch off is transcribed rather than dropped after
  ten minutes. A continuous recording, which has no squelch openings, can be transcribed now: `ley
  transcribe` and the Library's Transcribe count every minute of it. Each piece after the first
  is marked `continues`.
- **Fixed: speech on FM broadcast heard distorted audio.** A live speech job always made its own
  NFM channel. Start in the Decoders place now transcribes the channel you are listening to, in
  its mode and through its squelch, and `ley decode speech --channel this` does the same. With
  only `--freq`, the job's channel takes the band's mode, as `ley tune` does: WFM on broadcast FM,
  AM on airband.
- **The cost of that is stated first.** A channel whose squelch never closes sends all of its
  audio, 60 minutes an hour. `ley decode speech` and `ley watch speech` on a channel with its
  squelch off, in WFM, or on FM or AM broadcast or NOAA weather say so before they start and ask;
  `--yes` skips the question.
- **The Decoders log reads top to bottom.** The newest record is at the bottom, as `ley decode`
  prints it, and the log follows it. Scroll up and it stops: new records wait below without
  moving what you are reading, counted on a **↓ N new** button in the corner that takes you back
  down. Scrolling back to the bottom follows again. A log whose records name no transmitter or
  kind, such as speech's, no longer keeps an empty column for each: the words start beside the
  time, and a column appears once a record has something to put in it.
- **The Decoders inspector says each thing once.** A field the record's line already shows whole,
  such as speech's text, is no longer listed again under Fields, and the description under each
  field has moved into its label's tooltip. The raw bytes are folded away under **Raw · N
  bytes**, which stays open once you open it; a long payload shows eight lines and **Show all**.
  A record whose raw bytes are only its text again, a speech transcript, has no Raw at all.
