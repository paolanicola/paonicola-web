import {
  dateExistsInAppointments,
  getNewMonthViewByDate,
  getOptionsTime,
  nextAvailableDate,
  tileDisabled,
  getAppointmentId,
} from './utils'

describe('nextAvailableDateShouldBeNull', () => {
  test('returns next available date should be null', () => {
    const appointments = [{ date: '2022-06-22' }]

    const result = nextAvailableDate(appointments)

    expect(result).toBe(null)
  })
})

describe('nextAvailableDate', () => {
  test('returns next available date', () => {
    const appointments = [
      { id: 3348, date: '2027-04-01', available_hours: '19:30' },
      { id: 3343, date: '2027-07-07', available_hours: '18:00' },
      { id: 3345, date: '2027-07-07', available_hours: '18:30' },
      { id: 3344, date: '2027-08-01', available_hours: '18:30' },
    ]

    const result = nextAvailableDate(appointments)

    expect(result).toBe('2027-04-01')
  })
})

describe('dateExistsInAppointments', () => {
  test('returns true if date exists in appointments', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-06-24' },
    ]
    const localDate = '2023-06-23'

    const result = dateExistsInAppointments(appointments, localDate)

    expect(result).toBe(true)
  })

  test('returns false if date does not exist in appointments', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-06-24' },
    ]
    const localDate = '2023-06-25'

    const result = dateExistsInAppointments(appointments, localDate)

    expect(result).toBe(false)
  })
})

describe('tileDisabled', () => {
  test('returns false if there is an appointment on the date (month view)', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-06-24' },
    ]
    const date = new Date('2023-06-22')
    const view = 'month'

    const result = tileDisabled(appointments, { date, view })

    expect(result).toBe(false)
  })

  test('returns true if there is no appointment on the date (month view)', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-06-24' },
    ]
    const date = new Date('2023-06-25')
    const view = 'month'

    const result = tileDisabled(appointments, { date, view })

    expect(result).toBe(true)
  })

  // Add more tests for other view types if needed
})

describe('getOptionsTime', () => {
  test('returns available hours for the given date', () => {
    const appointments = [
      { date: '2023-06-22', available_hours: '10:00' },
      { date: '2023-06-22', available_hours: '12:00' },
      { date: '2023-06-23', available_hours: '14:00' },
    ]
    const localDate = '2023-06-22'

    const result = getOptionsTime(appointments, localDate)

    expect(result).toEqual([
      { value: '10:00', label: '10:00' },
      { value: '12:00', label: '12:00' },
    ])
  })
})

describe('getNewMonthViewByDate', () => {
  test('returns the next month view date', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-07-01' },
    ]
    const activeStartDate = new Date('2023-06-01')
    const view = 'month'
    const action = 'next'

    const result = getNewMonthViewByDate(
      appointments,
      activeStartDate,
      view,
      action
    )

    expect(result).toBe('2023-07-01')
  })

  test('returns the next month view date 2', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-09-01' },
    ]
    const activeStartDate = new Date('2023-07-01')
    const view = 'month'
    const action = 'next'

    const result = getNewMonthViewByDate(
      appointments,
      activeStartDate,
      view,
      action
    )

    expect(result).toBe('2023-09-01')
  })

  test('returns the next month view date different year', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-08-01' },
      { date: '2024-01-01' },
    ]
    const activeStartDate = new Date('2023-09-01')
    const view = 'month'
    const action = 'next'

    const result = getNewMonthViewByDate(
      appointments,
      activeStartDate,
      view,
      action
    )

    expect(result).toBe('2024-01-01')
  })

  test('returns the next month view date different year v2', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-08-01' },
      { date: '2024-02-01' },
    ]
    const activeStartDate = new Date('2023-09-01')
    const view = 'month'
    const action = 'next'

    const result = getNewMonthViewByDate(
      appointments,
      activeStartDate,
      view,
      action
    )

    expect(result).toBe('2024-02-01')
  })

  test('returns the previous month view date', () => {
    const appointments = [
      { date: '2023-06-22' },
      { date: '2023-06-23' },
      { date: '2023-05-31' },
    ]
    const activeStartDate = new Date('2023-06-01')
    const view = 'month'
    const action = 'prev'

    const result = getNewMonthViewByDate(
      appointments,
      activeStartDate,
      view,
      action
    )

    expect(result).toBe('2023-05-31')
  })

  // Add more tests for other scenarios if needed
})

describe('getAppointmentId', () => {
  const appointments = [
    { id: 3327, date: '2026-07-05', available_hours: '06:00' },
    { id: 3330, date: '2026-07-06', available_hours: '07:30' },
    { id: 3336, date: '2027-03-03', available_hours: '08:30' },
  ]

  test('returns appointment ID 3327 for date "2026-07-05" and time "06:00"', () => {
    const result = getAppointmentId(appointments, '2026-07-05', '06:00')
    expect(result).toBe(3327)
  })

  test('returns appointment ID 3330 for date "2026-07-06" and time "07:30"', () => {
    const result = getAppointmentId(appointments, '2026-07-06', '07:30')
    expect(result).toBe(3330)
  })

  test('returns appointment ID 3336 for date "2027-03-03" and time "08:30"', () => {
    const result = getAppointmentId(appointments, '2027-03-03', '08:30')
    expect(result).toBe(3336)
  })

  test('returns null for non-existent date and time', () => {
    const result = getAppointmentId(appointments, '2026-07-07', '09:00')
    expect(result).toBe(null)
  })
})
