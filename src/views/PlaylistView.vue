<script setup>
import { ref } from 'vue'
import AdjustableTime from '../components/AdjustableTime.vue'
import { addMinute, addSecond, minusMinute, minusSecond } from '../clock.js'
import draggable from 'vuedraggable';
const openDialog = ref(false)
const exercises = ref([])
const message = ref('')
const noBreak = ref(false)
const exerciseMinutes = ref(0)
const exerciseSeconds = ref(0)
const breakMinutes = ref(0)
const breakSeconds = ref(0)
const sets = ref(1)
const currentInterval = ref(null)
const isRunning = ref(false)
const colorFromScript = ref('blue')

function updateTime(command, type) {
  switch (command) {
    case 'plusMinute':
      if (type == 'exercise') {
        exerciseMinutes.value = addMinute(exerciseMinutes.value)
      } else {
        breakMinutes.value = addMinute(breakMinutes.value)
      }
      break
    case 'plusSecond':
      if (type == 'exercise') {
        exerciseSeconds.value = addSecond(exerciseSeconds.value)
      } else {
        breakSeconds.value = addSecond(breakSeconds.value)
      }
      break
    case 'minusMinute':
      if (type == 'exercise') {
        exerciseMinutes.value = minusMinute(exerciseMinutes.value)
      } else {
        breakMinutes.value = minusMinute(breakMinutes.value)
      }
      break
    case 'minusSecond':
      if (type == 'exercise') {
        exerciseSeconds.value = minusSecond(exerciseSeconds.value)
      } else {
        breakSeconds.value = minusSecond(breakSeconds.value)
      }
      break
  }
}



function disableBreak() {
  if (noBreak.value) {
    noBreak.value = false
  } else {
    breakMinutes.value = 0
    breakSeconds.value = 0
    noBreak.value = true
  }
}

function resetDialog() {
  openDialog.value = false
  breakMinutes.value = 0
  breakSeconds.value = 0
  exerciseMinutes.value = 0
  exerciseSeconds.value = 0
  message.value = ''
  sets.value = 1
}

function addExercise() {
  while (sets.value) {
    exercises.value.push({
      name: message.value === '' ? 'Exercise' : message.value,
      exMins: exerciseMinutes.value,
      exSecs: exerciseSeconds.value,
      breakMins: breakMinutes.value == 0 && breakSeconds.value == 0 ? null : breakMinutes.value,
      breakSecs: breakMinutes.value == 0 && breakSeconds.value == 0 ? null : breakSeconds.value,
    })
    sets.value--
    console.log(exercises.value)
  }
  resetDialog()
}

function deleteExercise(index) {
  exercises.value.splice(index, 1)
}

function decreaseSets() {
  if (sets.value > 1) {
    sets.value--
  }
}

async function startWorkout() {
  isRunning.value = true

  for (const interval of exercises.value) {
    if (!isRunning.value) break // Allow stopping the sequence

    // Set the current interval and start the timer
    colorFromScript.value = 'blue'
    currentInterval.value = interval.name
    exerciseMinutes.value = interval.exMins
    exerciseSeconds.value = interval.exSecs
    await runTimer()
    if (interval.breakMins !== null) {
      exerciseMinutes.value = interval.breakMins
      exerciseSeconds.value = interval.breakSecs
      currentInterval.value = 'Break'
      colorFromScript.value = 'red'
      await runTimer()
    }
  }
  colorFromScript.value = 'blue'
  // End of all intervals
  isRunning.value = false
  currentInterval.value = null
}

function runTimer() {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (exerciseSeconds.value == 0) {
        if (exerciseMinutes.value !== 0) {
          exerciseMinutes.value--
          exerciseSeconds.value = 59
        } else {
          clearInterval(timer)
          resolve()
        }
      } else {
        exerciseSeconds.value--
      }
    }, 1000)
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="openDialog" class="mask">
      <div class="modal" style="opacity: 100%">
        <h2>Add Exercise</h2>
        <input v-model="message" placeholder="Exercise name" def />
        <AdjustableTime
          :disable-hours="true"
          :mins="exerciseMinutes"
          :sec="exerciseSeconds"
          @update-time="(commandString) => updateTime(commandString, 'exercise')"
        ></AdjustableTime>
        <input type="checkbox" id="noBreak" @click="disableBreak" />
        <label for="noBreak">No Break</label>
        <div v-if="!noBreak">
          <AdjustableTime
            :disable-hours="true"
            :mins="breakMinutes"
            :sec="breakSeconds"
            @update-time="(commandString) => updateTime(commandString, 'break')"
          ></AdjustableTime>
        </div>
        <div class="set-wrap">
          <button  @click="decreaseSets">Minus</button>
          <div>{{ sets }}</div>
          <button  @click="sets++">Plus</button>
        </div>
        <button @click="addExercise" :disabled="exerciseMinutes == 0 && exerciseSeconds == 0">
          Add Exercise
        </button>
        <button @click="resetDialog">Close</button>
      </div>
    </div>
    <div v-if="isRunning" class="modal">
      <p>{{ currentInterval }}: {{ exerciseMinutes }}:{{ exerciseSeconds }}</p>
    </div>
  </Teleport>
  <button  @click="openDialog = true">Add Exercise</button>
  <button  @click="startWorkout" :disabled="exercises.length == 0">Start</button>

  <draggable v-model="exercises" tag="ul" item-key="index">
    <template #item="{ element: lapTime }" >
      <li class="drag-el">
    {{ lapTime.name == 'Exercise' ? lapTime.name + ' ' + (exercises.indexOf(lapTime) + 1) : lapTime.name }}
    {{ lapTime.exMins < 10 ? '0' + lapTime.exMins : lapTime.exMins }}:{{
      lapTime.exSecs < 10 ? '0' + lapTime.exSecs : lapTime.exSecs
    }}
    {{
      lapTime.breakMins == null
        ? ''
        : 'Break ' +
          (lapTime.breakMins < 10 ? '0' + lapTime.breakMins : lapTime.breakMins) +
          ':' +
          (lapTime.breakSecs < 10 ? '0' + lapTime.breakSecs : lapTime.breakSecs)
    }}
    <button @click="deleteExercise(index)">Delete</button>
  </li>
    </template>
  </draggable>
</template>

<style scoped>
.set-wrap {
  display: flex;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: v-bind('colorFromScript');
}

.mask {
  background-color: black;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 995;
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
}
.drag-el {
  color: hsla(160, 100%, 37%, 1);
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>
