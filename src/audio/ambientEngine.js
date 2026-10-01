/*
 * Ambient sound, synthesised in the browser so no recorded audio needs to
 * be licensed or downloaded: mountain wind from filtered noise whose
 * colour and loudness drift slowly, and now and then a soft, distant
 * bowl-like tone. It starts only after the listener asks for it.
 *
 * To use a recording instead, place it in public/audio/ and swap
 * createWind() for an <audio> element routed into `master`.
 */

const WIND_LEVEL = 0.22;
const MASTER_LEVEL = 0.5;

function noiseBuffer(ctx, seconds = 4) {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // brown noise: integrated white noise, soft and low like wind
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.2;
  }
  return buffer;
}

function lfo(ctx, frequency, depth, target) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = frequency;
  gain.gain.value = depth;
  osc.connect(gain).connect(target);
  osc.start();
  return osc;
}

function createWind(ctx, destination) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.loop = true;

  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 420;
  band.Q.value = 0.7;

  const level = ctx.createGain();
  level.gain.value = WIND_LEVEL;

  source.connect(band).connect(level).connect(destination);
  source.start();
  // slow, unrelated swells in pitch and strength: gusts
  const sources = [lfo(ctx, 0.05, 160, band.frequency), lfo(ctx, 0.083, 0.08, level.gain), lfo(ctx, 0.031, 0.06, level.gain)];
  return [source, ...sources];
}

function strikeBowl(ctx, destination) {
  const now = ctx.currentTime;
  const fundamental = 196 + Math.random() * 24;
  [1, 2.71, 5.12].forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = fundamental * ratio;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045 / (i + 1), now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 7 - i * 1.6);
    osc.connect(gain).connect(destination);
    osc.start(now);
    osc.stop(now + 7.2);
  });
}

export function createAmbientEngine() {
  let ctx = null;
  let master = null;
  let nodes = [];
  let bowlTimer = null;

  const scheduleBowl = () => {
    bowlTimer = window.setTimeout(() => {
      if (ctx?.state === 'running') strikeBowl(ctx, master);
      scheduleBowl();
    }, 22000 + Math.random() * 26000);
  };

  return {
    async start() {
      if (!ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return false;
        ctx = new AudioContext();
        master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);
        nodes = createWind(ctx, master);
      }
      await ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(MASTER_LEVEL, ctx.currentTime, 1.2);
      window.clearTimeout(bowlTimer);
      scheduleBowl();
      return true;
    },

    stop() {
      if (!ctx) return;
      window.clearTimeout(bowlTimer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      window.setTimeout(() => ctx?.state === 'running' && ctx.suspend(), 1800);
    },

    dispose() {
      window.clearTimeout(bowlTimer);
      nodes.forEach((n) => n.stop());
      ctx?.close();
      ctx = null;
      nodes = [];
    },
  };
}
