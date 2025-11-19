// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const diceRollVibration = (numberOfDice: number) => {
  // Check if the Vibration API is supported in the browser
  if ('vibrate' in navigator) {
    // Vibration pattern for dice roll: three short bursts with pauses in between
    const vibrationPattern = [30, 130, 60, 130, 60, 90, 30]
    navigator.vibrate(vibrationPattern)
  }
}

