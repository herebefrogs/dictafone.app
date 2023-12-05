import { formatDuration } from '$lib/helpers/format';

export const fireEvent = (eventName, transcript) => {
  // gtag('event', eventName, {
  //   'has_audio': !!transcript.audio,
  //   'length_audio': formatDuration(transcript.duration),
  //   'length_text': transcript.lines.map(line => line.text?.length ?? 0).reduce((total, lineLength) => total + lineLength, 0),
  // })
}
