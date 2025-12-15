
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Creates a WAV file Blob from base64 encoded raw PCM audio data.
 * Gemini TTS provides 24kHz, 16-bit, single-channel PCM audio.
 * @param base64Audio The base64 encoded audio string from Gemini API.
 * @returns A Blob representing the WAV file.
 */
export function createWavBlob(base64Audio: string): Blob {
  const pcmData = decode(base64Audio);
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  const headerLength = 44;
  const buffer = new ArrayBuffer(headerLength + pcmData.length);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk size
  view.setUint32(4, 36 + pcmData.length, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, byteRate, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  // Write PCM data
  const pcm = new Uint8Array(pcmData);
  const data = new Uint8Array(view.buffer, headerLength);
  data.set(pcm);

  return new Blob([view], { type: 'audio/wav' });
}
