export const diceRollVibration = (numberOfDice: number) => {
  return
  const duration = 333 + numberOfDice * 10
  const pattern = createVibrationPatternForSingleDie(duration, 0.1, 5)
  console.log('pattern', pattern)
  // Check if the Vibration API is supported in the browser
  if ('vibrate' in navigator) {
    // Vibration pattern for dice roll: three short bursts with pauses in between
    const vibrationPattern = [30, 130, 60, 130, 60, 90, 30]
    navigator.vibrate(vibrationPattern)
  } else {
    alert('Vibration API is not supported on this device.')
  }
}

/**
 * Generates a vibration pattern for a single die roll based on the vibrations caused by the roll.
 * The amplitude of vibrations is modeled using a damped harmonic oscillator.
 * The function returns an array where odd indices represent the duration of active vibration (above the threshold),
 * and even indices represent the duration of no vibration (below the threshold).
 * The pattern always starts with a vibration period if the initial amplitude exceeds the threshold.
 *
 * @param {number} totalDuration - The total duration to monitor vibrations in milliseconds.
 * @param {number} threshold - The threshold amplitude for vibrations to be considered significant.
 * @param {number} accuracy - The granularity of the simulation, in milliseconds.
 * @returns {number[]} An array representing the vibration pattern, with durations in milliseconds.
 *
 * @example
 * // Creates a vibration pattern for a single die over a duration of 2000 milliseconds
 * // with a threshold of 0.5 and an accuracy of 5 milliseconds.
 * const pattern = createVibrationPatternForSingleDie(2000, 0.5, 5);
 * console.log(pattern); // Outputs: [100, 20, 30, 20, ...] (example output)
 *
 * @author ChatGPT - OpenAI
 */
function createVibrationPatternForSingleDie(
  totalDuration: number,
  threshold: number,
  accuracy: number
) {
  // Constants for the model (should be determined based on physical properties)
  const baseEnergy = 0.01 // Base energy for one die
  const dampingCoefficient = 0.1
  const angularFrequency = 2 * Math.PI * 5 // 5 Hz as an example frequency

  // Convert total duration from milliseconds to seconds for the calculation
  totalDuration /= 1000
  accuracy /= 1000 // Convert accuracy to seconds as well

  let vibrationPattern = []
  let lastVibrationTime = 0 // Timestamp of the last switch between vibrating and not
  let isVibrating = false // Initial vibration state

  // Initialize the vibration state based on the initial amplitude
  let initialEnergy = baseEnergy // Energy for one die
  let initialAmplitude = Math.cos(angularFrequency * 0) * initialEnergy // time = 0 for initial amplitude
  if (initialAmplitude > threshold) {
    isVibrating = true
    vibrationPattern.push(0) // Start with a vibration period
  }

  // Use a loop to calculate the amplitude at each step and construct the pattern
  for (let time = 0; time <= totalDuration; time += accuracy) {
    let energy = baseEnergy // Energy for one die
    let amplitude =
      Math.exp(-dampingCoefficient * time) *
      Math.cos(angularFrequency * time) *
      energy

    // Determine whether the current amplitude exceeds the threshold
    let currentVibration = amplitude > threshold

    // If we just crossed the threshold, add the current segment to the pattern
    if (vibrationPattern.length === 0 || currentVibration !== isVibrating) {
      vibrationPattern.push(0) // Start a new segment
      lastVibrationTime = time
      isVibrating = !isVibrating // Toggle the vibration state
    }

    // Update the duration of the current segment
    vibrationPattern[vibrationPattern.length - 1] =
      Math.floor((time - lastVibrationTime) / accuracy) * accuracy * 1000
  }

  // Ensure we start with a vibration if the first segment is a pause
  if (vibrationPattern.length && !(initialAmplitude > threshold)) {
    vibrationPattern.unshift(accuracy * 1000) // Prepend a short vibration period
  }

  return vibrationPattern
}
