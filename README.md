State of things
===============
The essential features work on Chrome desktop in a very barebone way (no nice UI, no sensible routing, all in one page)
- start/stop/pause/resume a transcription recording
- live transcription with start/end times of each utterance (a group of sentences until there is a pause in diction)
- read/listen/download/delete past transcripts
- language selector (en/fr only but can be expanded)
- speech volume visualizer ala Google Meet

Why is it abandonned/not released?
==================================
Turns out Chrome on Android does not fire SpeechRecognition "result" events. This event is used to append new transcription snipped to the recording, therefore the live transcription never happens and the recording's transcript is always empty.

Further more, SpeechRecognition "end" event is only fired once. So even if "result" events were occuring, the transcription engine could not be restarted to catch the next
utterance, leading to incomplete transcripts.

Mobile support is essential for the app to be useful, so there is little incentive
in making it pretty/production ready if speech recognition doesn't work on one of the
2 main smartphones (safari for iOS not tested)