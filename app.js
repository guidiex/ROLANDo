/* =========================================
   ROLANDo
   DIGITAL SOUND PAD
   ========================================= */


/* =========================================
   SONIDOS
   ========================================= */

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


/* =========================================
   GENERAR BANCOS
   ========================================= */

const soundBanks = [];

for (
  let i = 0;
  i < allSounds.length;
  i += 9
) {

  soundBanks.push(
    allSounds
      .slice(i, i + 9)
      .map(file => `sounds/${file}`)
  );

}


/* =========================================
   DOM
   ========================================= */

const sampler =
  document.getElementById("sampler");

const bankPads =
  [...document.querySelectorAll("#bankPads .pad")];

const wallPads =
  document.getElementById("wallPads");

const bankMode =
  document.getElementById("bankMode");

const wallMode =
  document.getElementById("wallMode");

const modeButton =
  document.getElementById("modeButton");

const bankButton =
  document.getElementById("bankButton");

const bankNumber =
  document.getElementById("bankNumber");


/* POWER */

const onButton =
  document.getElementById("onButton");

const resetButton =
  document.getElementById("resetButton");

const offButton =
  document.getElementById("offButton");


/* CONTROLES */

const volume =
  document.getElementById("volume");

const speed =
  document.getElementById("speed");

const filter =
  document.getElementById("filter");

const echo =
  document.getElementById("echo");


/* DISPLAYS */

const volumeValue =
  document.getElementById("volumeValue");

const speedValue =
  document.getElementById("speedValue");

const filterValue =
  document.getElementById("filterValue");

const echoValue =
  document.getElementById("echoValue");


/* =========================================
   ESTADO
   ========================================= */

let poweredOn = true;

let currentBank = 0;

let currentMode = "bank";

const activeAudio = new Set();


/* =========================================
   AUDIO CONTEXT
   ========================================= */

let audioContext = null;

let masterGain = null;

let filterNode = null;

let dryGain = null;

let echoGain = null;

let delayNode = null;

let feedbackGain = null;


/* =========================================
   CREAR AUDIO
   ========================================= */

function initAudioContext() {

  if (audioContext) {
    return;
  }

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  audioContext =
    new AudioContextClass();


  masterGain =
    audioContext.createGain();

  filterNode =
    audioContext.createBiquadFilter();

  dryGain =
    audioContext.createGain();

  echoGain =
    audioContext.createGain();

  delayNode =
    audioContext.createDelay(2);

  feedbackGain =
    audioContext.createGain();


  filterNode.type =
    "lowpass";


  /* RUTA SECA */

  filterNode.connect(dryGain);

  dryGain.connect(masterGain);


  /* RUTA ECHO */

  filterNode.connect(delayNode);

  delayNode.connect(echoGain);

  echoGain.connect(masterGain);


  /* FEEDBACK */

  delayNode.connect(feedbackGain);

  feedbackGain.connect(delayNode);


  /* MASTER */

  masterGain.connect(
    audioContext.destination
  );


  updateAudioControls();

}


/* =========================================
   VOLUMEN
   ========================================= */

function getVolumeGain() {

  const amount =
    Number(volume.value) / 100;

  return (
    Math.pow(amount, 2.4) * 1.8
  );

}


/* =========================================
   FILTER
   ========================================= */

function getFilterFrequency() {

  const value =
    Number(filter.value) / 100;

  const aggressive =
    Math.pow(value, 2.2);

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


/* =========================================
   ACTUALIZAR AUDIO
   ========================================= */

function updateAudioControls() {

  volumeValue.textContent =
    volume.value;

  speedValue.textContent =
    speed.value;

  filterValue.textContent =
    filter.value;

  echoValue.textContent =
    echo.value;


  if (!audioContext) {
    return;
  }


  masterGain.gain.value =
    poweredOn
      ? getVolumeGain()
      : 0;


  filterNode.frequency.value =
    getFilterFrequency();


  delayNode.delayTime.value =
    0.28;


  const amount =
    Number(echo.value) / 100;

  const boosted =
    Math.pow(amount, 1.5);


  echoGain.gain.value =
    poweredOn
      ? boosted * 1.35
      : 0;


  feedbackGain.gain.value =
    poweredOn
      ? boosted * 0.88
      : 0;

}


/* =========================================
   NOMBRE DE SONIDO
   ========================================= */

function getSoundName(soundFile) {

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


/* =========================================
   REPRODUCIR SONIDO
   ========================================= */

async function playSound(
  sound,
  pad
) {

  if (
    !poweredOn ||
    !sound
  ) {
    return;
  }


  initAudioContext();


  if (
    audioContext.state ===
    "suspended"
  ) {

    try {
      await audioContext.resume();
    }
    catch (error) {
      console.error(error);
    }

  }


  const audio =
    new Audio(sound);

  audio.preload =
    "auto";


  audio.playbackRate =
    Number(speed.value) / 100;


  let source = null;


  try {

    source =
      audioContext
        .createMediaElementSource(
          audio
        );


    source.connect(
      filterNode
    );


    activeAudio.add({
      audio,
      source
    });


    if (pad) {

      pad.classList.add(
        "active"
      );

    }


    const cleanup = () => {

      if (pad) {

        pad.classList.remove(
          "active"
        );

      }


      for (
        const item of activeAudio
      ) {

        if (
          item.audio === audio
        ) {

          try {
            item.source.disconnect();
          }
          catch (error) {
            // Ya desconectado.
          }

          activeAudio.delete(
            item
          );

          break;

        }

      }

    };


    audio.addEventListener(
      "ended",
      cleanup,
      { once: true }
    );


    audio.addEventListener(
      "error",
      cleanup,
      { once: true }
    );


    await audio.play();

  }
  catch (error) {

    console.error(
      "No se pudo reproducir:",
      sound,
      error
    );

    if (pad) {

      pad.classList.remove(
        "active"
      );

    }

    if (source) {

      try {
        source.disconnect();
      }
      catch (disconnectError) {
        // Ignorar.
      }

    }

  }

}


/* =========================================
   PREPARAR PAD
   ========================================= */

function preparePad(pad) {

  pad.addEventListener(
    "click",
    () => {

      if (!poweredOn) {
        return;
      }

      const sound =
        pad.dataset.sound;

      if (!sound) {
        return;
      }

      playSound(
        sound,
        pad
      );

    }
  );

}


/* =========================================
   PADS DE BANCO
   ========================================= */

bankPads.forEach(
  preparePad
);


/* =========================================
   ACTUALIZAR BANCO
   ========================================= */

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
          getSoundName(sound);

        pad.disabled =
          false;

        pad.classList.remove(
          "empty"
        );

      }
      else {

        pad.dataset.sound =
          "";

        pad.textContent =
          "";

        pad.disabled =
          true;

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


/* =========================================
   BOTÓN BANK
   ========================================= */

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


/* =========================================
   45 PADS
   ========================================= */

function createWallPads() {

  wallPads.innerHTML =
    "";


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
        getSoundName(file);

    }
    else {

      pad.classList.add(
        "empty"
      );

      pad.disabled =
        true;

    }


    preparePad(pad);

    wallPads.appendChild(
      pad
    );

  }

}


/* =========================================
   CAMBIO DE MODO
   ========================================= */

modeButton.addEventListener(
  "click",
  () => {

    if (!poweredOn) {
      return;
    }


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


/* =========================================
   PARAR TODOS LOS SONIDOS
   ========================================= */

function stopAllAudio() {

  for (
    const item of activeAudio
  ) {

    try {

      item.audio.pause();

      item.audio.currentTime =
        0;

      item.source.disconnect();

    }
    catch (error) {
      console.error(error);
    }

  }


  activeAudio.clear();


  document
    .querySelectorAll(
      ".pad.active, .wall-pad.active"
    )
    .forEach(
      pad =>
        pad.classList.remove(
          "active"
        )
    );

}


/* =========================================
   POWER VISUAL
   ========================================= */

function updatePowerState() {

  sampler.classList.toggle(
    "powered-off",
    !poweredOn
  );


  onButton.classList.toggle(
    "active",
    poweredOn
  );


  offButton.classList.toggle(
    "active",
    !poweredOn
  );

}


/* =========================================
   ON
   ========================================= */

onButton.addEventListener(
  "click",
  async () => {

    poweredOn =
      true;


    initAudioContext();


    if (
      audioContext.state ===
      "suspended"
    ) {

      try {
        await audioContext.resume();
      }
      catch (error) {
        console.error(error);
      }

    }


    updateAudioControls();

    updatePowerState();

  }
);


/* =========================================
   OFF
   ========================================= */

offButton.addEventListener(
  "click",
  async () => {

    poweredOn =
      false;


    stopAllAudio();


    if (audioContext) {

      echoGain.gain.value =
        0;

      feedbackGain.gain.value =
        0;

      masterGain.gain.value =
        0;


      try {

        if (
          audioContext.state ===
          "running"
        ) {

          await audioContext.suspend();

        }

      }
      catch (error) {
        console.error(error);
      }

    }


    updatePowerState();

  }
);


/* =========================================
   RESET
   ========================================= */

resetButton.addEventListener(
  "click",
  () => {

    if (!poweredOn) {
      return;
    }


    volume.value =
      85;

    speed.value =
      100;

    filter.value =
      100;

    echo.value =
      0;


    [
      volume,
      speed,
      filter,
      echo
    ].forEach(
      input => {

        input.dispatchEvent(
          new Event(
            "input"
          )
        );

      }
    );


    resetButton.classList.add(
      "active"
    );


    setTimeout(
      () => {

        resetButton.classList.remove(
          "active"
        );

      },
      180
    );

  }
);


/* =========================================
   INPUTS
   ========================================= */

[
  volume,
  speed,
  filter,
  echo
].forEach(
  input => {

    input.addEventListener(
      "input",
      updateAudioControls
    );

  }
);


/* =========================================
   KNOBS
   ========================================= */

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


  const min =
    Number(input.min);

  const max =
    Number(input.max);

  const value =
    Number(input.value);


  let ratio;


  /*
   SPEED:
   hacemos que 100 quede
   visualmente en las 12.
  */

  if (
    input.id === "speed"
  ) {

    if (value <= 100) {

      ratio =
        0.5 *
        (
          (value - min) /
          (100 - min)
        );

    }
    else {

      ratio =
        0.5 +
        (
          0.5 *
          (
            (value - 100) /
            (max - 100)
          )
        );

    }

  }
  else {

    ratio =
      (value - min) /
      (max - min);

  }


  const angle =
    -135 +
    (
      ratio * 270
    );


  rotator.style.transform =
    `rotate(${angle}deg)`;

}


/* =========================================
   DRAG KNOBS
   ========================================= */

document
  .querySelectorAll(
    ".knob-shell"
  )
  .forEach(
    shell => {

      const input =
        shell.querySelector(
          ".knob-input"
        );


      let dragging =
        false;

      let startY =
        0;

      let startValue =
        0;


      const startDrag =
        event => {

          if (!poweredOn) {
            return;
          }


          dragging =
            true;


          startY =
            event.clientY;


          startValue =
            Number(
              input.value
            );


          shell.classList.add(
            "dragging"
          );


          if (
            shell.setPointerCapture
          ) {

            try {

              shell.setPointerCapture(
                event.pointerId
              );

            }
            catch (error) {
              // No es crítico.
            }

          }


          event.preventDefault();

        };


      const moveDrag =
        event => {

          if (
            !dragging ||
            !poweredOn
          ) {
            return;
          }


          const min =
            Number(input.min);

          const max =
            Number(input.max);


          const range =
            max - min;


          const sensitivity =
            range / 150;


          const deltaY =
            startY -
            event.clientY;


          let newValue =
            startValue +
            deltaY *
            sensitivity;


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


          input.dispatchEvent(
            new Event(
              "input"
            )
          );


          updateKnobVisual(
            input
          );

        };


      const endDrag =
        () => {

          dragging =
            false;

          shell.classList.remove(
            "dragging"
          );

        };


      shell.addEventListener(
        "pointerdown",
        startDrag
      );


      shell.addEventListener(
        "pointermove",
        moveDrag
      );


      shell.addEventListener(
        "pointerup",
        endDrag
      );


      shell.addEventListener(
        "pointercancel",
        endDrag
      );


      input.addEventListener(
        "input",
        () =>
          updateKnobVisual(
            input
          )
      );

    }
  );


/* =========================================
   INICIALIZACIÓN
   ========================================= */

createWallPads();

updateBank();

updatePowerState();

updateAudioControls();


[
  volume,
  speed,
  filter,
  echo
].forEach(
  updateKnobVisual
);