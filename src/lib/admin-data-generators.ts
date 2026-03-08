import {
  type AdminOrganization,
  type AdminEvent,
  type AdminParticipant,
  type AdminPayment,
} from '@/lib/admin-mock-data'

const orgNames = [
  'Denver Soccer Academy', 'Colorado Sports League', 'Boulder High Athletics',
  'Mountain View FC', 'Rocky Mountain Volleyball Club', 'Front Range Basketball',
  'Summit County Track Club', 'Aspen Winter Sports Academy', 'Grand Junction Cyclery',
  'Fort Collins Lacrosse', 'Pueblo Baseball Academy', 'Steamboat Springs Ski Club',
]

const eventNames = [
  'Summer Soccer Camp', 'Basketball Tournament', 'Football Training Camp',
  'Volleyball Championship', 'Track & Field Meet', 'Swimming Gala',
  'Cycling Grand Prix', 'Lacrosse Showcase', 'Baseball Clinic',
  'Ski & Snowboard Camp', 'Tennis Open', 'Cross Country Invitational',
]

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Cameron', 'Drew', 'Quinn']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
const cities = ['Denver', 'Boulder', 'Colorado Springs', 'Fort Collins', 'Aspen', 'Vail', 'Grand Junction', 'Pueblo', 'Steamboat Springs', 'Durango']
const states = ['CO']

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString().split('T')[0]
}

function randomEmail(name: string): string {
  const domains = ['email.com', 'mail.com', 'example.org']
  const clean = name.toLowerCase().replace(/\s+/g, '.')
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return `${clean}@${domain}`
}

function randomPhone(): string {
  const area = randomInt(200, 999)
  const prefix = randomInt(200, 999)
  const line = randomInt(1000, 9999)
  return `(${area}) ${prefix}-${line}`
}

function randomId(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let suffix = ''
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}_${suffix}`
}

export function generateMockOrganizations(count = 12): AdminOrganization[] {
  return Array.from({ length: count }, () => ({
    id: randomId('org'),
    name: orgNames[Math.floor(Math.random() * orgNames.length)],
    type: ['League', 'School', 'Club'][Math.floor(Math.random() * 3)] as 'League' | 'School' | 'Club',
    contactPerson: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    email: randomEmail(firstNames[Math.floor(Math.random() * firstNames.length)]),
    phone: randomPhone(),
    totalEventsHosted: randomInt(0, 50),
  }))
}

export function generateMockEvents(organizations: AdminOrganization[], count = 25): AdminEvent[] {
  return Array.from({ length: count }, () => {
    const org = organizations[Math.floor(Math.random() * organizations.length)]
    return {
      id: randomId('evt'),
      name: eventNames[Math.floor(Math.random() * eventNames.length)],
      organizationId: org.id,
      organizationName: org.name,
      date: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      location: `${cities[Math.floor(Math.random() * cities.length)]}, ${states[0]}`,
      registrationStatus: ['Open', 'Closed'][Math.floor(Math.random() * 2)] as 'Open' | 'Closed',
      price: randomInt(50, 999),
      registrationsCount: randomInt(0, 200),
    }
  })
}

export function generateMockParticipants(events: AdminEvent[], count = 80): AdminParticipant[] {
  return Array.from({ length: count }, () => {
    const event = events[Math.floor(Math.random() * events.length)]
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
    return {
      id: randomId('par'),
      name,
      email: randomEmail(name),
      eventId: event.id,
      eventName: event.name,
      paymentStatus: ['Paid', 'Pending', 'Failed', 'Refunded'][Math.floor(Math.random() * 4)] as 'Paid' | 'Pending' | 'Failed' | 'Refunded',
      registrationDate: randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date()),
    }
  })
}

export function generateMockPayments(participants: AdminParticipant[], events: AdminEvent[]): AdminPayment[] {
  return participants.map((p) => {
    const event = events.find((e) => e.id === p.eventId)
    return {
      id: randomId('pay'),
      participantId: p.id,
      participantName: p.name,
      eventId: p.eventId,
      eventName: p.eventName,
      amount: event?.price ?? 0,
      paymentStatus: p.paymentStatus,
      transactionId: `pi_${randomId('').replace('_', '')}`,
    }
  })
}
