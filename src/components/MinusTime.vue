<script setup>
import { minutes, seconds } from './AddTime.vue'
function minusMinute() {
  if (minutes.value == 0) {
    minutes.value = 59
  } else {
    minutes.value--
  }
}

function minusSecond() {
  if (seconds.value == 0) {
    seconds.value = 59
  } else {
    seconds.value--
  }
}
</script>

<template>
  <div>
    <button id="resetbutton" @click="minusMinute">minute-</button>
    <button id="resetbutton" @click="minusSecond">second-</button>
  </div>
</template>
