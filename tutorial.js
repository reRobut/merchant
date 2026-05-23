const TUTORIAL_STEPS = [
  { img: "assets/tut_wave.png",     text: "呀，新人吗？欢迎欢迎～" },
  { img: "assets/tut_smile.png",    text: "我是行会的秘书，叫我小秘就好啦。" },
  { img: "assets/tut_playful.png",  text: "看你一脸懵懵的……没关系！" },
  { img: "assets/tut_proud.png",    text: "本小姐破例给你讲一遍入门须知哦。" },

  { img: "assets/tut_point.png",    text: "我们这行就一句话——低买高卖。" },
  { img: "assets/tut_point.png",    text: "每座城的行情不同，到了就会刷新。" },
  { img: "assets/tut_shrug.png",    text: "在不同城市之间倒货，赚差价，就这么简单。" },
  { img: "assets/tut_playful.png",  text: "不过呢，你现在只能背10件货哦？" },
  { img: "assets/tut_shrug.png",    text: "连塞牙缝都不够……尽早弄辆像样的车吧。" },

  { img: "assets/tut_point.png",    text: "对了对了，汽油这个东西很妙的。" },
  { img: "assets/tut_point.png",    text: "买来可以当商品卖，也可以自己烧着跑。" },
  { img: "assets/tut_playful.png",  text: "别到半路没油趴窝了才想起来哦～" },
  { img: "assets/tut_smile.png",    text: "还有，医用品也一样，能卖也能在战斗中救命。" },

  { img: "assets/tut_serious.png",  text: "嗯……接下来是很重要的部分哦。" },
  { img: "assets/tut_serious.png",  text: "你可别走神。" },
  { img: "assets/tut_serious.png",  text: "路上不太平的——犯罪率越高，劫匪越多。" },
  { img: "assets/tut_serious.png",  text: "可能会被偷、被拦路抢劫……甚至遇到警察设卡。" },

  { img: "assets/tut_think.png",    text: "违禁品嘛，利润确实很诱人……" },
  { img: "assets/tut_point.png",    text: "但被查到的话，没收加罚款，扣你一半身家哦？" },
  { img: "assets/tut_proud.png",    text: "本小姐可不管你哭鼻子的。" },

  { img: "assets/tut_serious.png",  text: "路边有时候会躺着受伤的人。" },
  { img: "assets/tut_smile.png",    text: "你要是心善把人救了，说不定人家会跟着你干。" },
  { img: "assets/tut_point.png",    text: "但是——你得有乘客位才行。" },
  { img: "assets/tut_shrug.png",    text: "走路可带不了任何人的哦。" },
  { img: "assets/tut_playful.png",  text: "想招人？先升级载具吧～" },

  { img: "assets/tut_smile.png",    text: "最后啦～" },
  { img: "assets/tut_point.png",    text: "行会布告栏上有通缉令，留意一下。" },
  { img: "assets/tut_point.png",    text: "目标的姓和名对上你队伍里的人，就能提交领赏。" },
  { img: "assets/tut_laugh.png",    text: "全部对上的话，可是有大钱拿的！" },

  { img: "assets/tut_point.png",    text: "武器防具要先买进仓库，再装备给队员。" },
  { img: "assets/tut_playful.png",  text: "别忘了呀。" },
  { img: "assets/tut_proud.png",    text: "好啦好啦，本小姐能教的就这么多了。" },
  { img: "assets/tut_shrug.png",    text: "是发大财还是倾家荡产，看你自己咯。" },
  { img: "assets/tut_wave.png",     text: "加油吧，笨蛋～♪" },
];

const TUTORIAL_REPLAY_GREETING = "哈喽～又来找我了吗？嘛，果然离不开本小姐呢。好吧好吧，再给你讲一遍～";

let _tutIdx = 0;
let _tutTyping = false;
let _tutTypeTimer = null;
let _tutIsReplay = false;
let _tutReplayGreetingShown = false;

function tutorialStart(isReplay) {
  _tutIdx = 0;
  _tutIsReplay = !!isReplay;
  _tutReplayGreetingShown = false;
  if (_tutIsReplay) {
    _showReplayGreeting();
  } else {
    _tutRenderStep();
  }
  document.getElementById("tutorial-modal").classList.add("open");
}

function _showReplayGreeting() {
  _tutReplayGreetingShown = true;
  const portrait = document.getElementById("tutorial-portrait");
  portrait.src = "assets/tut_wave.png";
  _tutRenderDots();
  document.getElementById("tutorial-next").textContent = "好的好的～";
  document.getElementById("tutorial-skip").style.display = "none";
  _tutBounce();
  _typeText(TUTORIAL_REPLAY_GREETING);
}

function tutorialNext() {
  if (_tutTyping) {
    _tutFinishType();
    return;
  }

  if (_tutIsReplay && _tutReplayGreetingShown) {
    _tutReplayGreetingShown = false;
    document.getElementById("tutorial-skip").style.display = "";
    _tutRenderStep();
    return;
  }

  _tutIdx++;
  if (_tutIdx >= TUTORIAL_STEPS.length) {
    tutorialClose();
    return;
  }
  _tutRenderStep();
}

function tutorialSkip() {
  tutorialClose();
}

function tutorialClose() {
  if (_tutTypeTimer) clearInterval(_tutTypeTimer);
  document.getElementById("tutorial-modal").classList.remove("open");
  if (!_tutIsReplay) {
    showNewGame();
  }
}

function tutorialReplay() {
  tutorialStart(true);
}

function _tutBounce() {
  const portrait = document.getElementById("tutorial-portrait");
  portrait.classList.remove("bounce");
  void portrait.offsetWidth;
  portrait.classList.add("bounce");
}

function _tutRenderStep() {
  const step = TUTORIAL_STEPS[_tutIdx];
  const portrait = document.getElementById("tutorial-portrait");
  if (portrait.src.indexOf(step.img) === -1) {
    portrait.style.opacity = "0";
    setTimeout(() => {
      portrait.src = step.img;
      portrait.style.opacity = "1";
      _tutBounce();
    }, 200);
  } else {
    _tutBounce();
  }
  _tutRenderDots();
  const isLast = _tutIdx === TUTORIAL_STEPS.length - 1;
  document.getElementById("tutorial-next").textContent = isLast ? "出发！" : "▸";
  _typeText(step.text);
}

function _tutRenderDots() {
  const total = TUTORIAL_STEPS.length;
  const container = document.getElementById("tutorial-dots");
  const dotCount = 8;
  const stepsPerDot = total / dotCount;
  container.innerHTML = Array.from({ length: dotCount }, (_, i) => {
    const dotStart = Math.floor(i * stepsPerDot);
    const dotEnd = Math.floor((i + 1) * stepsPerDot);
    const cls = _tutIdx >= dotEnd ? "done" : _tutIdx >= dotStart ? "active" : "";
    return `<div class="tutorial-dot ${cls}"></div>`;
  }).join("");
}

function _typeText(fullText) {
  if (_tutTypeTimer) clearInterval(_tutTypeTimer);
  const el = document.getElementById("tutorial-text");
  _tutTyping = true;
  let idx = 0;
  el.innerHTML = '<span class="cursor-blink"></span>';
  _tutTypeTimer = setInterval(() => {
    if (idx >= fullText.length) {
      _tutFinishType();
      return;
    }
    const ch = fullText[idx];
    el.innerHTML = fullText.slice(0, idx + 1) + '<span class="cursor-blink"></span>';
    idx++;
  }, 40);
  el._fullText = fullText;
}

function _tutFinishType() {
  if (_tutTypeTimer) clearInterval(_tutTypeTimer);
  _tutTypeTimer = null;
  _tutTyping = false;
  const el = document.getElementById("tutorial-text");
  if (el._fullText) el.innerHTML = el._fullText;
}

(function patchNewGameButton() {
  window._showNewGameWithTutorial = function () {
    tutorialStart(false);
  };
  const btn = document.getElementById("t-new-game");
  if (btn) {
    btn.setAttribute("onclick", "_showNewGameWithTutorial()");
  }
})();
