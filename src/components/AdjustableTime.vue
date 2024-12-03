<script setup>
defineProps(['disableHours', 'timerStarted', 'hrs', 'mins', 'sec'])
const emit = defineEmits(['updateTime'])

function buttonClick(command) {
  emit('updateTime', command)
}
</script>

<template>
  <div class="timer-wrap" v-if="!timerStarted">
    <button v-if="!disableHours" id="resetbutton" @click="buttonClick('plusHour')">hour+</button>
    <button id="resetbutton" @click="buttonClick('plusMinute')">minute+</button>
    <button id="resetbutton" @click="buttonClick('plusSecond')">second+</button>
  </div>
  <div class="number">
    <div v-if="!disableHours">
      {{ hrs < 10 ? '0' + hrs + ':' : hrs + ':' }}
    </div>
    {{ mins < 10 ? '0' + mins : mins }}:{{ sec < 10 ? '0' + sec : sec }}
  </div>
  <div class="timer-wrap" v-if="!timerStarted">
    <button v-if="!disableHours" id="resetbutton" @click="buttonClick('minusHour')">hour-</button>
    <button id="resetbutton" @click="buttonClick('minusMinute')">minute-</button>
    <button id="resetbutton" @click="buttonClick('minusSecond')">second-</button>
  </div>
</template>

<style>
.timer-wrap {
  display: flex;
}
.number {
  text-align: center;
  display: flex;
}
</style>
