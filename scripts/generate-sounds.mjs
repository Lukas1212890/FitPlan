import { mkdirSync, writeFileSync } from "node:fs";

const sampleRate = 44100;
const duration = 0.42;
const samples = Math.floor(sampleRate * duration);
const pcm = Buffer.alloc(samples * 2);

for (let index = 0; index < samples; index++) {
  const time = index / sampleRate;
  const attack = Math.min(1, time / 0.035);
  const release = Math.min(1, (duration - time) / 0.09);
  const envelope = Math.max(0, Math.min(attack, release));
  const tone = Math.sin(2 * Math.PI * 720 * time) + Math.sin(2 * Math.PI * 1080 * time) * 0.18;
  pcm.writeInt16LE(Math.round(tone * envelope * 0.46 * 32767), index * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/fitplan-beep.wav", import.meta.url), Buffer.concat([header, pcm]));
