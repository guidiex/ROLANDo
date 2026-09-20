// ======================================
// ROLANDo · DIGITAL SOUND PAD
// ======================================


// ======================================
// SONIDOS
// ======================================

const allSounds = [

  "a-quien-se-le-pudio-ocurrir.mp3",
  "ahi-lo-tenes-al-pelotudo_TlDTm41.mp3",
  "alarm-sound-effect.mp3",
  "camera_fotos.mp3",
  "dexter-meme.mp3",
  "directed-by-robert-b_voI2Z4T.mp3",
  "dry-fart.mp3",
  "enrique.mp3",
  "error.mp3",

  "gaspi-peruano.mp3",
  "gaspi.mp3",
  "l4tig9.mp3",
  "la-vida-es-un-carrusel.mp3",
  "levelup.mp3",
  "lira-paraArriba.mp3",
  "menem-estratosfera-parte-2.mp3",
  "mercado-pago.mp3",
  "metal-gear-alert-sound-effect_XKoHReZ.mp3",

  "minecraft-sheep2.mp3",
  "morning.mp3",
  "mosquito.mp3",
  "musica-aleluya.mp3",
  "musica-rosco-pasapalabra.mp3",
  "musica-tristee.mp3",
  "never-forgive-me-never-forget-me.mp3",
  "nokia-kick-ringtone.mp3",
  "nom-nom-nom_gPJiWn4.mp3",

  "old-sound-of-zombie-in-minecraft.mp3",
  "orb.mp3",
  "pepe-el-trompeta.mp3",
  "ponele-voluntad.mp3",
  "que-exagerado.mp3",
  "rimshot.mp3",
  "rizz-sound-effect.mp3",
  "the-rock-sound-effect.mp3",
  "van-damme-ganar-o-morir.mp3",

  "vine-boom.mp3",
  "wah-wah-sound-effect.mp3",
  "wrong-answer-sound-fx.mp3",
  "y2mate_XL9ozUG.mp3"

];


// ======================================
// CREAR BANKS AUTOMÁTICAMENTE
// 9 SONIDOS POR BANK
// ======================================

const soundBanks = [];

for (
  let i = 0;
  i < allSounds.length;
  i += 9
) {

  soundBanks.push(
    allSounds
      .slice(i, i + 9)
      .map(
        file =>
          `sounds/${file}`
      )
  );

}


// ======================================
// ELEMENTOS
// ======================================

const sampler =
  document.getElementById("sampler");


const bankPads =
  document.querySelectorAll(
    "#bankPads .pad"
  );


const wallPads =
  document.getElementById(
    "wallPads"
  );


const knobShells =
  document.querySelectorAll(
    ".knob-shell"
  );


const volume =
  document.getElementById("volume");

const speed =
  document.getElementById("speed");

const filter =
  document.getElementById("filter");

const echo =
  document.getElementById("echo");


const volumeValue =
  document.getElementById(
    "volumeValue"
  );

const speedValue =
  document.getElementById(
    "speedValue"
  );

const filterValue =
  document.getElementById(
    "filterValue"
  );

const echoValue =
  document.getElementById(
    "echoValue"
  );


const onButton =
  document.getElementById(
    "onButton"
  );

const resetButton =
  document.getElementById(
    "resetButton"
  );

const offButton =
  document.getElementById(
    "offButton"
  );


const bankButton =
  document.getElementById(
    "bankButton"
  );

const bankNumber =
  document.getElementById(
    "bankNumber"
  );


const bankMode =
  document.getElementById(
    "bankMode"
  );

const wallMode =
  document.getElementById(
    "wallMode"
  );

const modeButton =
  document.getElementById(
    "modeButton"
  );


// ======================================
// ESTADO
// ======================================

let poweredOn = true;

let currentBank = 0;

let currentMode = "bank";


// ======================================
// AUDIO ENGINE
// ======================================

const AudioContextClass =
  window.AudioContext ||
  window.webkitAudioContext;


let ctx = null;

let master = null;

let filterNode = null;

let delay = null;

let feedback = null;

let echoGain = null;


const activeAudios =
  new Set();


// ======================================
// VOL · SALVAJE
// ======================================

function getVolumeGain() {

  const amount =
    Number(volume.value) / 100;


  return (
    Math.pow(
      amount,
      2.4
    ) * 1.8
  );

}


// ======================================
// FILTER
// ======================================

function getFilterFrequency() {

  const value =
    Number(filter.value) / 100;


  const aggressive =
    Math.pow(
      value,
      2.2
    );


  const min = 70;

  const max = 20000;


  return (
    min *
    Math.pow(
      max / min,
      aggressive
    )
  );

}


// ======================================
// AUDIO INIT
// ======================================

function initAudio() {

  if (ctx) {
    return;
  }


  ctx =
    new AudioContextClass();


  // MASTER

  master =
    ctx.createGain();


  master.gain.value =
    getVolumeGain();


  master.connect(
    ctx.destination
  );


  // FILTER

  filterNode =
    ctx.createBiquadFilter();


  filterNode.type =
    "lowpass";


  filterNode.Q.value =
    0.7;


  filterNode.frequency.value =
    getFilterFrequency();


  filterNode.connect(
    master
  );


  // ECHO

  delay =
    ctx.createDelay(2);


  delay.delayTime.value =
    0.28;


  feedback =
    ctx.createGain();


  echoGain =
    ctx.createGain();


  feedback.gain.value = 0;

  echoGain.gain.value = 0;


  filterNode.connect(
    delay
  );


  delay.connect(
    echoGain
  );


  echoGain.connect(
    master
  );


  delay.connect(
    feedback
  );


  feedback.connect(
    delay
  );


  updateAudioControls();

}


// ======================================
// AUDIO CONTROLS
// ======================================

function updateAudioControls() {

  if (!ctx) {
    return;
  }


  master.gain.setTargetAtTime(
    getVolumeGain(),
    ctx.currentTime,
    0.01
  );


  filterNode.frequency.setTargetAtTime(
    getFilterFrequency(),
    ctx.currentTime,
    0.01
  );


  const amount =
    Number(echo.value) / 100;


  const boosted =
    Math.pow(
      amount,
      1.5
    );


  echoGain.gain.setTargetAtTime(
    boosted * 1.35,
    ctx.currentTime,
    0.01
  );


  feedback.gain.setTargetAtTime(
    boosted * 0.88,
    ctx.currentTime,
    0.01
  );

}


// ======================================
// NOMBRE PARA MOSTRAR
// ======================================

function getSoundName(
  soundFile
) {

  if (!soundFile) {
    return "";
  }


  let name =
    soundFile
      .split("/")
      .pop();


  name =
    name.replace(
      /\.mp3$/i,
      ""
    );


  name =
    name.replace(
      /[-_]+/g,
      " "
    );


  name =
    name.replace(
      /\s+/g,
      " "
    );


  return name.trim();

}


// ======================================
// PLAY
// ======================================

async function playSound(
  pad
) {

  if (!poweredOn) {
    return;
  }


  const soundFile =
    pad.dataset.sound;


  if (!soundFile) {
    return;
  }


  initAudio();


  if (
    ctx.state === "suspended"
  ) {

    await ctx.resume();

  }


  const audio =
    new Audio(
      soundFile
    );


  audio.playbackRate =
    Number(speed.value) / 100;


  audio.volume = 1;


  const source =
    ctx.createMediaElementSource(
      audio
    );


  source.connect(
    filterNode
  );


  const soundData = {
    audio,
    source
  };


  activeAudios.add(
    soundData
  );


  function cleanup() {

    activeAudios.delete(
      soundData
    );


    try {

      source.disconnect();

    }

    catch (error) {

      // Ya desconectado.

    }

  }


  audio.addEventListener(
    "ended",
    cleanup,
    {
      once: true
    }
  );


  audio.addEventListener(
    "error",
    cleanup,
    {
      once: true
    }
  );


  try {

    await audio.play();

  }

  catch (error) {

    console.error(
      "Error de audio:",
      soundFile,
      error
    );


    cleanup();

  }

}


// ======================================
// PREPARAR PAD
// ======================================

function preparePad(
  pad
) {

  pad.addEventListener(
    "pointerdown",
    () => {

      if (!poweredOn) {
        return;
      }


      if (
        !pad.dataset.sound
      ) {

        return;
      }


      pad.classList.add(
        "active"
      );


      playSound(
        pad
      );

    }
  );


  function release() {

    pad.classList.remove(
      "active"
    );

  }


  pad.addEventListener(
    "pointerup",
    release
  );


  pad.addEventListener(
    "pointerleave",
    release
  );


  pad.addEventListener(
    "pointercancel",
    release
  );

}


// ======================================
// PREPARAR 9 PADS
// ======================================

bankPads.forEach(
  preparePad
);


// ======================================
// ACTUALIZAR BANK
// ======================================

function updateBank() {

  const bank =
    soundBanks[currentBank];


  bankPads.forEach(
    (pad, index) => {

      const sound =
        bank[index];


      if (sound) {

        pad.dataset.sound =
          sound;


        pad.textContent =
          getSoundName(
            sound
          );


        pad.classList.remove(
          "empty"
        );

      }

      else {

        delete pad.dataset.sound;


        pad.textContent =
          "";


        pad.classList.add(
          "empty"
        );

      }

    }
  );


  bankNumber.textContent =
    String(
      currentBank + 1
    ).padStart(
      2,
      "0"
    );

}


// ======================================
// BOTÓN BANK
// ======================================

bankButton.addEventListener(
  "click",
  () => {

    if (!poweredOn) {
      return;
    }


    currentBank++;


    if (
      currentBank >=
      soundBanks.length
    ) {

      currentBank = 0;

    }


    updateBank();


    // Flash LED

    bankButton.classList.add(
      "pressed"
    );


    setTimeout(
      () => {

        bankButton.classList.remove(
          "pressed"
        );

      },
      120
    );

  }
);


// ======================================
// CREAR CONSOLA 45
// ======================================

function createWallPads() {

  wallPads.innerHTML = "";


  for (
    let i = 0;
    i < 45;
    i++
  ) {

    const pad =
      document.createElement(
        "button"
      );


    pad.type =
      "button";


    pad.className =
      "wall-pad";


    const file =
      allSounds[i];


    if (file) {

      pad.dataset.sound =
        `sounds/${file}`;


      pad.textContent =
        getSoundName(
          file
        );

    }

    else {

      pad.classList.add(
        "empty"
      );


      pad.disabled =
        true;

    }


    preparePad(
      pad
    );


    wallPads.appendChild(
      pad
    );

  }

}


createWallPads();


// ======================================
// CAMBIO DE MODO
// ======================================

modeButton.addEventListener(
  "click",
  () => {

    if (
      currentMode === "bank"
    ) {

      currentMode =
        "wall";


      bankMode.classList.add(
        "hidden"
      );


      wallMode.classList.remove(
        "hidden"
      );


      modeButton.textContent =
        "9 PAD MODE";

    }

    else {

      currentMode =
        "bank";


      wallMode.classList.add(
        "hidden"
      );


      bankMode.classList.remove(
        "hidden"
      );


      modeButton.textContent =
        "45 PADS";

    }

  }
);


// ======================================
// VOL
// ======================================

volume.addEventListener(
  "input",
  () => {

    volumeValue.textContent =
      volume.value;


    if (!ctx) {
      return;
    }


    master.gain.setTargetAtTime(
      getVolumeGain(),
      ctx.currentTime,
      0.01
    );

  }
);


// ======================================
// SPEED
// ======================================

speed.addEventListener(
  "input",
  () => {

    speedValue.textContent =
      speed.value;


    activeAudios.forEach(
      soundData => {

        soundData.audio.playbackRate =
          Number(speed.value) / 100;

      }
    );

  }
);


// ======================================
// FILTER
// ======================================

filter.addEventListener(
  "input",
  () => {

    filterValue.textContent =
      filter.value;


    if (!ctx) {
      return;
    }


    filterNode.frequency.setTargetAtTime(
      getFilterFrequency(),
      ctx.currentTime,
      0.01
    );

  }
);


// ======================================
// ECHO
// ======================================

echo.addEventListener(
  "input",
  () => {

    echoValue.textContent =
      echo.value;


    if (!ctx) {
      return;
    }


    const amount =
      Number(echo.value) / 100;


    const boosted =
      Math.pow(
        amount,
        1.5
      );


    echoGain.gain.setTargetAtTime(
      boosted * 1.35,
      ctx.currentTime,
      0.01
    );


    feedback.gain.setTargetAtTime(
      boosted * 0.88,
      ctx.currentTime,
      0.01
    );

  }
);


// ======================================
// KNOB VISUAL
// ======================================

function updateKnobVisual(
  input
) {

  const shell =
    input.closest(
      ".knob-shell"
    );


  if (!shell) {
    return;
  }


  const rotator =
    shell.querySelector(
      ".knob-rotator"
    );


  if (!rotator) {
    return;
  }


  const min =
    Number(input.min);

  const max =
    Number(input.max);

  const value =
    Number(input.value);


  let angle;


  // SPEED:
  // 100 queda centrado.

  if (
    input.id === "speed"
  ) {

    if (
      value <= 100
    ) {

      const ratio =
        (
          value - min
        ) /
        (
          100 - min
        );


      angle =
        -135 +
        ratio * 135;

    }

    else {

      const ratio =
        (
          value - 100
        ) /
        (
          max - 100
        );


      angle =
        ratio * 135;

    }

  }

  else {

    const ratio =
      (
        value - min
      ) /
      (
        max - min
      );


    angle =
      -135 +
      ratio * 270;

  }


  rotator.style.transform =
    `rotate(${angle}deg)`;

}


// ======================================
// ACTUALIZAR KNOBS
// ======================================

function updateAllKnobs() {

  knobShells.forEach(
    shell => {

      const input =
        shell.querySelector(
          ".knob-input"
        );


      if (input) {

        updateKnobVisual(
          input
        );

      }

    }
  );

}


// ======================================
// DRAG KNOBS
// ======================================

knobShells.forEach(
  shell => {

    const input =
      shell.querySelector(
        ".knob-input"
      );


    const visual =
      shell.querySelector(
        ".knob-visual"
      );


    if (
      !input ||
      !visual
    ) {

      return;

    }


    let dragging = false;

    let startY = 0;

    let startValue = 0;


    visual.addEventListener(
      "pointerdown",
      event => {

        if (!poweredOn) {
          return;
        }


        dragging = true;

        startY =
          event.clientY;

        startValue =
          Number(
            input.value
          );


        visual.setPointerCapture(
          event.pointerId
        );


        visual.classList.add(
          "dragging"
        );

      }
    );


    visual.addEventListener(
      "pointermove",
      event => {

        if (
          !dragging ||
          !poweredOn
        ) {

          return;

        }


        const deltaY =
          startY -
          event.clientY;


        const min =
          Number(input.min);


        const max =
          Number(input.max);


        const range =
          max - min;


        const change =
          (
            deltaY / 120
          ) * range;


        let newValue =
          startValue +
          change;


        newValue =
          Math.max(
            min,
            Math.min(
              max,
              newValue
            )
          );


        input.value =
          Math.round(
            newValue
          );


        updateKnobVisual(
          input
        );


        input.dispatchEvent(
          new Event(
            "input",
            {
              bubbles: true
            }
          )
        );

      }
    );


    function stopDragging(
      event
    ) {

      if (!dragging) {
        return;
      }


      dragging = false;


      visual.classList.remove(
        "dragging"
      );


      if (
        visual.hasPointerCapture(
          event.pointerId
        )
      ) {

        visual.releasePointerCapture(
          event.pointerId
        );

      }

    }


    visual.addEventListener(
      "pointerup",
      stopDragging
    );


    visual.addEventListener(
      "pointercancel",
      stopDragging
    );


    input.addEventListener(
      "input",
      () => {

        updateKnobVisual(
          input
        );

      }
    );

  }
);


// ======================================
// STOP ALL
// ======================================

function stopAllSounds() {

  activeAudios.forEach(
    soundData => {

      try {

        soundData.audio.pause();

        soundData.audio.currentTime =
          0;

        soundData.source.disconnect();

      }

      catch (error) {

        // Ignorar.

      }

    }
  );


  activeAudios.clear();


  document
    .querySelectorAll(
      ".pad, .wall-pad"
    )
    .forEach(
      pad => {

        pad.classList.remove(
          "active"
        );

      }
    );


  if (ctx) {

    feedback.gain
      .cancelScheduledValues(
        ctx.currentTime
      );


    echoGain.gain
      .cancelScheduledValues(
        ctx.currentTime
      );


    feedback.gain
      .setValueAtTime(
        0,
        ctx.currentTime
      );


    echoGain.gain
      .setValueAtTime(
        0,
        ctx.currentTime
      );


    if (
      ctx.state === "running"
    ) {

      ctx.suspend();

    }

  }

}


// ======================================
// POWER VISUAL
// ======================================

function updatePowerState() {

  onButton.classList.toggle(
    "active",
    poweredOn
  );


  offButton.classList.toggle(
    "active",
    !poweredOn
  );


  sampler.classList.toggle(
    "powered-off",
    !poweredOn
  );

}


// ======================================
// ON
// ======================================

onButton.addEventListener(
  "click",
  async () => {

    poweredOn = true;


    if (ctx) {

      await ctx.resume();

      updateAudioControls();

    }


    updatePowerState();

  }
);


// ======================================
// RESET
// ======================================

resetButton.addEventListener(
  "click",
  () => {

    volume.value = 85;

    speed.value = 100;

    filter.value = 100;

    echo.value = 0;


    volume.dispatchEvent(
      new Event("input")
    );

    speed.dispatchEvent(
      new Event("input")
    );

    filter.dispatchEvent(
      new Event("input")
    );

    echo.dispatchEvent(
      new Event("input")
    );


    updateAllKnobs();


    resetButton.classList.add(
      "active"
    );


    setTimeout(
      () => {

        resetButton.classList.remove(
          "active"
        );

      },
      160
    );

  }
);


// ======================================
// OFF
// ======================================

offButton.addEventListener(
  "click",
  () => {

    poweredOn = false;

    stopAllSounds();

    updatePowerState();

  }
);


// ======================================
// START
// ======================================

updateAllKnobs();

updateBank();

updatePowerState();