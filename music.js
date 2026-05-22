const MusicPlayer = (() => {

  const BGM_TRACKS = [
    { src: '1.mp3' },
    { src: '2.mp3' },
    { src: '3.mp3' },
  ];

  let audio = null;
  let currentTrack = 0;
  let muted = false;
  let started = false;
  const volume = 0.45;

  function createAudio(i) {
    if (audio) { audio.pause(); audio.src = ''; }
    audio = new Audio(BGM_TRACKS[i].src);
    audio.loop = BGM_TRACKS.length === 1;
    audio.volume = 0;
    audio.addEventListener('ended', () => {
      if (BGM_TRACKS.length > 1) {
        currentTrack = (currentTrack + 1) % BGM_TRACKS.length;
        createAudio(currentTrack);
        playWithFade();
      }
    });
  }

  function fadeTo(target, ms, cb) {
    if (!audio) { cb && cb(); return; }
    const steps = 30, iv = ms / steps;
    const start = audio.volume, delta = (target - start) / steps;
    let s = 0;
    clearInterval(audio._ft);
    audio._ft = setInterval(() => {
      s++;
      audio.volume = Math.min(1, Math.max(0, start + delta * s));
      if (s >= steps) { clearInterval(audio._ft); audio.volume = target; cb && cb(); }
    }, iv);
  }

  function playWithFade() {
    audio.volume = 0;
    audio.play().catch(() => {});
    fadeTo(muted ? 0 : volume, 1200);
  }

  function onFirstInteraction() {
    if (started) return;
    started = true;
    createAudio(currentTrack);
    playWithFade();
    updateUI();
  }

  function toggle() {
    if (!started) { onFirstInteraction(); return; }
    muted = !muted;
    if (muted) {
      fadeTo(0, 600);
    } else {
      if (audio.paused) audio.play().catch(() => {});
      fadeTo(volume, 600);
    }
    updateUI();
  }

  function updateUI() {
    const btn = document.getElementById('music-btn');
    if (!btn) return;
    btn.textContent = !started ? '♪' : muted ? '🔇' : '🔊';
    btn.classList.toggle('muted', muted);
  }

  function injectStyles() {
    if (document.getElementById('_mp_style')) return;
    const s = document.createElement('style');
    s.id = '_mp_style';
    s.textContent = `
      #music-btn {
        background: transparent;
        border: 1px solid var(--gold, #c9a84c);
        color: var(--gold, #c9a84c);
        border-radius: 3px;
        padding: 0;
        height: 2rem;
        width: 2.2rem;
        font-size: 1rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, opacity 0.2s;
      }
      #music-btn:hover { background: rgba(201,168,76,0.15); }
      #music-btn.muted { opacity: 0.45; border-color: var(--text3,#888); color: var(--text3,#888); }
      @keyframes _mp_pulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        50%      { box-shadow: 0 0 0 4px rgba(201,168,76,0.25); }
      }
      #music-btn:not(.muted) { animation: _mp_pulse 2.4s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }

  function ensureButton() {
    if (document.getElementById('music-btn')) return;
    const insert = () => {
      const save = document.getElementById('btn-save');
      if (!save) return;
      const btn = document.createElement('button');
      btn.id = 'music-btn';
      btn.className = 'btn-sm';
      btn.textContent = '♪';
      btn.onclick = toggle;
      save.after(btn);
      updateUI();
    };
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', insert)
      : insert();
  }

  function init() {
    injectStyles();
    ensureButton();
    document.addEventListener('click', onFirstInteraction);
    document.addEventListener('keydown', onFirstInteraction);
  }

  return { init, toggle };
})();

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', MusicPlayer.init)
  : MusicPlayer.init();
