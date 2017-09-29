/**
 * Class for containing time related convenienve methods
 */
export
default class Calendar {
  /**
   * Generates times of the day in increments of 30 minutes
   * @param {boolean} is24 - Whether to return 24 hour times or 12 hour.
   * @return {string[]} an array of 30 minute interval time slots
   */
  static time_slots(is24) {
    return Array.from({length: 49}, (_, i) => {
      let hour = Math.floor(i/2)
      let min = ('0'+(30*(i%2))).slice(-2)
      return (is24) ? (hour%24)+':'+min : ((hour%12)||12)+':'+min+(hour<12||hour==24?' AM':' PM')
    })
  }
}
