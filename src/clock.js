export function addHour(hours) {
  if (hours == 23) {
    hours = 0
  } else {
    hours++
  }
  return hours
}

export function addMinute(minutes) {
  if (minutes == 59) {
    minutes = 0
  } else {
    minutes++
  }
  return minutes
}

export function addSecond(seconds) {
  if (seconds == 59) {
    seconds = 0
  } else {
    seconds++
  }
  return seconds
}

export function minusHour(hours) {
  if (hours == 0) {
    hours = 23
  } else {
    hours--
  }
  return hours
}

export function minusMinute(minutes) {
  if (minutes == 0) {
    minutes = 59
  } else {
    minutes--
  }
  return minutes
}

export function minusSecond(seconds) {
  if (seconds == 0) {
    seconds = 59
  } else {
    seconds--
  }
  return seconds
}
