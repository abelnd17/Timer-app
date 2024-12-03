<script setup>
import { ref } from 'vue'
const buttonName = ref('Lap')
const isRunning = ref(false)
const lapTimes = ref([])
let timeBegan = null,
  stoppedDuration = 0,
  timeStopped = null,
  started = null,
  firstStart = true

function clockRunning() {
  let currentTime = new Date(),
    timeElapsed = new Date(currentTime - timeBegan - stoppedDuration),
    hour = timeElapsed.getUTCHours(),
    min = timeElapsed.getUTCMinutes(),
    sec = timeElapsed.getUTCSeconds(),
    ms = timeElapsed.getUTCMilliseconds()

  document.getElementById('number').innerHTML =
    (hour > 9 ? hour : '0' + hour) +
    ':' +
    (min > 9 ? min : '0' + min) +
    ':' +
    (sec > 9 ? sec : '0' + sec) +
    '.' +
    (ms > 90 ? Math.floor(ms / 10) : '0' + Math.floor(ms / 10))
}

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  if (firstStart) {
    firstStart = false
  } else {
    buttonName.value = 'Lap'
  }
  isRunning.value = true
  if (timeBegan === null) {
    timeBegan = new Date()
  }
  if (timeStopped !== null) {
    stoppedDuration += new Date() - timeStopped
  }
  started = setInterval(clockRunning, 10)
}

function pauseTimer() {
  isRunning.value = false
  buttonName.value = 'Reset'
  timeStopped = new Date()
  clearInterval(started)
}

function otherButtonAction() {
  if (buttonName.value == 'Lap') {
    saveLapTime()
  } else {
    resetTimer()
  }
}

function saveLapTime() {
  lapTimes.value.push(document.getElementById('number').innerHTML)
}

function resetTimer() {
  clearInterval(started)
  firstStart = true
  buttonName.value = 'Lap'
  isRunning.value = false
  lapTimes.value.splice(0, lapTimes.value.length)
  stoppedDuration = 0
  timeBegan = null
  timeStopped = null
  document.getElementById('number').innerHTML = '00:00:00.00'
}
</script>

<template>
  <div class="wrapper">
    <div id="number">00:00:00:00</div>
    <button v-if="firstStart" id="resetbutton" disabled>{{ buttonName }}</button>
    <button v-else id="resetbutton" class="resetbutton" @click="otherButtonAction">
      {{ buttonName }}
    </button>
    <button @click="toggleTimer()">{{ isRunning ? 'Pause' : 'Start' }}</button>
    <li v-for="(lapTime, index) in lapTimes" :key="lapTime.index">
      Lap {{ index + 1 }} {{ lapTime }}
    </li>
  </div>
</template>

<style>
.wrapper {
  height: auto;
  text-align: center;
}

.wut {
  background-color: aqua;
}

.sure {
  background-color: chartreuse;
}
</style>
