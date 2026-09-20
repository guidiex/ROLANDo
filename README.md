# 🎛️ ROLANDo

**Digital Sound Pad**

ROLANDo es una botonera / sampler web diseñada como una consola de audio digital inspirada en hardware clásico.

Permite reproducir sonidos instantáneamente, modificarlos en tiempo real y trabajar tanto con bancos de 9 pads como con una consola completa de 45 pads.

## ✨ Características

- 🎵 40 sonidos incluidos
- 🎛️ Consola principal de 9 pads
- 🔵 Cambio de banco mediante botón BANK
- 🗂️ 5 bancos de sonidos
- 🔲 Modo alternativo de 45 pads
- 🏷️ Nombre del sonido visible en cada pad
- 🔊 Control de volumen
- ⚡ Control de velocidad
- 🎚️ Filtro de audio
- 🌊 Efecto echo
- 🟢 ON
- 🟡 RESET
- 🔴 OFF
- 📱 Diseño responsive para escritorio y dispositivos móviles
- 🎚️ Interfaz inspirada en samplers físicos

## 🎛️ Modos de uso

### BANK MODE

La consola utiliza 9 pads simultáneos.

El botón **BANK** permite recorrer:

`BANK 01 → 02 → 03 → 04 → 05 → BANK 01`

Cada banco carga automáticamente sus sonidos correspondientes.

### 45 PAD CONSOLE

El botón **45 PADS** cambia a una consola que permite acceder directamente a todos los sonidos desde una única matriz.

Actualmente contiene:

- 40 pads con sonidos
- 5 posiciones libres

## 🎚️ Controles

**VOL**  
Control de volumen general.

**SPEED**  
Modifica la velocidad de reproducción entre aproximadamente `0.25x` y `2x`.

**FILTER**  
Filtro pasa-bajos para modificar el carácter del sonido.

**ECHO**  
Añade delay y feedback.

## 🔊 Motor de audio

ROLANDo utiliza la **Web Audio API** del navegador.

Los efectos se procesan en tiempo real mediante:

- `AudioContext`
- `GainNode`
- `BiquadFilterNode`
- `DelayNode`
- Feedback de delay
- `MediaElementAudioSourceNode`

## 📁 Estructura

```text
ROLANDo/
│
├── index.html
├── style.css
├── app.js
│
├── sounds/
│   └── archivos .mp3
│
└── images/