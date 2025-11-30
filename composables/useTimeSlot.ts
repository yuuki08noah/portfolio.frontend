import { ref, readonly } from 'vue'

export const useTimeSlot = () => {
  const timeSlotDuration = ref(30)

  const setTimeSlotDuration = (duration: 15 | 30 | 60) => {
    timeSlotDuration.value = duration
  }

  const getTimeSlots = (startHour: number, endHour: number) => {
    const slots: string[] = []
    const totalMinutes = (endHour - startHour) * 60
    const numSlots = totalMinutes / timeSlotDuration.value

    for (let i = 0; i <= numSlots; i++) {
      const totalMinutesFromStart = startHour * 60 + i * timeSlotDuration.value
      const hour = Math.floor(totalMinutesFromStart / 60)
      const minute = totalMinutesFromStart % 60
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
    }

    return slots
  }

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startTotalMinutes = startHour * 60 + startMinute
    const endTotalMinutes = endHour * 60 + endMinute

    return endTotalMinutes - startTotalMinutes
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}m`
    }
  }

  return {
    timeSlotDuration: readonly(timeSlotDuration),
    setTimeSlotDuration,
    getTimeSlots,
    calculateDuration,
    formatDuration
  }
}
