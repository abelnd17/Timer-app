<script setup>
import { ref } from 'vue'
function addMinute() {
  if (minutes.value == 59) {
    minutes.value = 0
  } else {
    minutes.value++
  }
}

function addSecond() {
  if (seconds.value == 59) {
    seconds.value = 0
  } else {
    seconds.value++
  }
}
</script>

<template>
  <div>
    <button id="resetbutton" @click="addMinute">minute+</button>
    <button id="resetbutton" @click="addSecond">second+</button>
  </div>
</template>

<script>
export const minutes = ref(0)
export const seconds = ref(0)
</script>
