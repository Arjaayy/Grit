export type AdminOrganization = {
  id: string
  name: string
  type: 'League' | 'School' | 'Club'
  contactPerson: string
  email: string
  phone: string
  totalEventsHosted: number
}

export type AdminEvent = {
  id: string
  name: string
  organizationId: string
  organizationName: string
  date: string
  location: string
  registrationStatus: 'Open' | 'Closed'
  price: number
  registrationsCount: number
}

export type AdminParticipant = {
  id: string
  name: string
  email: string
  eventId: string
  eventName: string
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  registrationDate: string
}

export type AdminPayment = {
  id: string
  participantId: string
  participantName: string
  eventId: string
  eventName: string
  amount: number
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  transactionId: string
}

export const mockOrganizations: AdminOrganization[] = [
  {
    id: 'org_1',
    name: 'Denver Soccer Academy',
    type: 'Club',
    contactPerson: 'John Smith',
    email: 'info@denversoccer.com',
    phone: '(303) 555-0123',
    totalEventsHosted: 12,
  },
  {
    id: 'org_2',
    name: 'Colorado Sports League',
    type: 'League',
    contactPerson: 'Sarah Johnson',
    email: 'admin@cosportsleague.com',
    phone: '(720) 555-0456',
    totalEventsHosted: 8,
  },
  {
    id: 'org_3',
    name: 'Boulder High Athletics',
    type: 'School',
    contactPerson: 'Mike Davis',
    email: 'athletics@boulderhigh.edu',
    phone: '(303) 555-0789',
    totalEventsHosted: 5,
  },
]

export const mockEvents: AdminEvent[] = [
  {
    id: 'evt_1',
    name: 'Summer Soccer Camp',
    organizationId: 'org_1',
    organizationName: 'Denver Soccer Academy',
    date: '2026-07-15',
    location: 'Denver, CO',
    registrationStatus: 'Open',
    price: 499,
    registrationsCount: 45,
  },
  {
    id: 'evt_2',
    name: 'Basketball Tournament',
    organizationId: 'org_2',
    organizationName: 'Colorado Sports League',
    date: '2026-08-20',
    location: 'Boulder, CO',
    registrationStatus: 'Closed',
    price: 199,
    registrationsCount: 32,
  },
  {
    id: 'evt_3',
    name: 'Football Training Camp',
    organizationId: 'org_3',
    organizationName: 'Boulder High Athletics',
    date: '2026-09-10',
    location: 'Colorado Springs, CO',
    registrationStatus: 'Open',
    price: 299,
    registrationsCount: 28,
  },
]

export const mockParticipants: AdminParticipant[] = [
  {
    id: 'par_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    eventId: 'evt_1',
    eventName: 'Summer Soccer Camp',
    paymentStatus: 'Paid',
    registrationDate: '2026-06-20',
  },
  {
    id: 'par_2',
    name: 'Jordan Lee',
    email: 'jordan.lee@email.com',
    eventId: 'evt_1',
    eventName: 'Summer Soccer Camp',
    paymentStatus: 'Pending',
    registrationDate: '2026-06-22',
  },
  {
    id: 'par_3',
    name: 'Taylor Nguyen',
    email: 'taylor.nguyen@email.com',
    eventId: 'evt_2',
    eventName: 'Basketball Tournament',
    paymentStatus: 'Paid',
    registrationDate: '2026-07-30',
  },
]

export const mockPayments: AdminPayment[] = [
  {
    id: 'pay_1',
    participantId: 'par_1',
    participantName: 'Alex Rivera',
    eventId: 'evt_1',
    eventName: 'Summer Soccer Camp',
    amount: 499,
    paymentStatus: 'Paid',
    transactionId: 'pi_3N7xXyZ8abc123',
  },
  {
    id: 'pay_2',
    participantId: 'par_2',
    participantName: 'Jordan Lee',
    eventId: 'evt_1',
    eventName: 'Summer Soccer Camp',
    amount: 499,
    paymentStatus: 'Pending',
    transactionId: 'pi_3N7xXyZ8def456',
  },
  {
    id: 'pay_3',
    participantId: 'par_3',
    participantName: 'Taylor Nguyen',
    eventId: 'evt_2',
    eventName: 'Basketball Tournament',
    amount: 199,
    paymentStatus: 'Paid',
    transactionId: 'pi_3N7xXyZ8ghi789',
  },
]
