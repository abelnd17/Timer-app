<script setup>
import { ref } from 'vue'
import AdjustableTime from '../components/AdjustableTime.vue'
import { addHour, addMinute, addSecond, minusHour, minusMinute, minusSecond } from '../clock.js'

const paused = ref(true)
let started = null
const timerStarted = ref(false)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

function updateTime(command) {
  switch (command) {
    case 'plusHour':
      hours.value = addHour(hours.value)
      break
    case 'plusMinute':
      minutes.value = addMinute(minutes.value)
      break
    case 'plusSecond':
      seconds.value = addSecond(seconds.value)
      break
    case 'minusHour':
      hours.value = minusHour(hours.value)
      break
    case 'minusMinute':
      minutes.value = minusMinute(minutes.value)
      break
    case 'minusSecond':
      seconds.value = minusSecond(seconds.value)
      break
  }
}

function timerRun() {
  if (seconds.value == 0) {
    if (minutes.value !== 0) {
      minutes.value--
      seconds.value = 59
    } else {
      if (hours.value !== 0) {
        hours.value--
        minutes.value = 59
        seconds.value = 59
      } else {
        clearInterval(started)
        timerStarted.value = false
      }
    }
  } else {
    seconds.value--
  }
}

function toggleTimer() {
  if (timerStarted.value && !paused.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  paused.value = false
  timerStarted.value = true

  started = setInterval(timerRun, 1000)
}

function resetTimer() {
  clearInterval(started)
  hours.value = 0
  minutes.value = 0
  seconds.value = 0
  paused.value = true
  timerStarted.value = false
}

function pauseTimer() {
  paused.value = true
  clearInterval(started)
}
</script>

<template>
  <div>
    <AdjustableTime
      @updateTime="updateTime"
      :disable-hours="false"
      :timer-started="timerStarted"
      :hrs="hours"
      :mins="minutes"
      :sec="seconds"
    ></AdjustableTime>
  </div>
  <div>
    <button id="resetbutton" @click="resetTimer" :disabled="!timerStarted">Reset</button>
    <button
      id="resetbutton"
      @click="toggleTimer"
      :disabled="hours == 0 && minutes == 0 && seconds == 0"
    >
      {{ paused ? 'Start' : 'Pause' }}
    </button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .number {
    text-align: center;
  }
}
</style>
