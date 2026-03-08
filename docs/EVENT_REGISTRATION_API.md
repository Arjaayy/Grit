# Event Registration API Documentation

## Overview

The Event Registration API is a RESTful API service that allows sports organizations to manage events, registrations, and payments. This API is designed to be integrated into client websites built by Grit Digital Performance.

## Base URL
```
https://your-domain.com/api
```

## Authentication

All API requests (except organization creation) must include an API key in the `x-api-key` header:

```http
x-api-key: your_organization_api_key
```

## Endpoints

### Organizations

#### Create Organization
```http
POST /organizations
```

**Request Body:**
```json
{
  "name": "Denver Soccer Club",
  "email": "info@denversoccer.com",
  "phone": "+1-555-0123",
  "website": "https://denversoccer.com",
  "sportCategory": "soccer",
  "billingEmail": "billing@denversoccer.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Denver Soccer Club",
    "email": "info@denversoccer.com",
    "apiKey": "org_1234567890_abc123",
    "active": true,
    "verified": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Organization Details
```http
GET /organizations/{apiKey}?includeRevenue=true&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Denver Soccer Club",
    "email": "info@denversoccer.com",
    "apiKey": "org_1234567890_abc123",
    "events": [...],
    "registrations": [...],
    "revenue": {
      "totalRevenue": 50000,
      "totalTransactions": 100,
      "totalRoyalties": 2500,
      "organizationRevenue": 47500,
      "averageTransactionValue": 500
    }
  }
}
```

### Events

#### List Events
```http
GET /events?status=published
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event_123",
      "name": "Summer Soccer Camp",
      "slug": "summer-soccer-camp",
      "description": "Week-long soccer camp for ages 8-14",
      "startDate": "2024-06-15T09:00:00Z",
      "endDate": "2024-06-19T17:00:00Z",
      "location": "Denver Sports Complex",
      "price": 250.00,
      "currency": "USD",
      "status": "published",
      "maxParticipants": 50,
      "_count": {
        "registrations": 25
      }
    }
  ]
}
```

#### Create Event
```http
POST /events
```

**Request Body:**
```json
{
  "name": "Summer Soccer Camp",
  "description": "Week-long soccer camp for ages 8-14",
  "startDate": "2024-06-15T09:00:00Z",
  "endDate": "2024-06-19T17:00:00Z",
  "location": "Denver Sports Complex",
  "address": "123 Sports Ave",
  "city": "Denver",
  "state": "CO",
  "zipCode": "80202",
  "price": 250.00,
  "currency": "USD",
  "earlyBirdPrice": 200.00,
  "earlyBirdDeadline": "2024-05-01T23:59:59Z",
  "registrationStart": "2024-03-01T00:00:00Z",
  "registrationEnd": "2024-06-10T23:59:59Z",
  "maxParticipants": 50,
  "waitlistEnabled": true,
  "requiresApproval": false,
  "customFields": [
    {
      "name": "Emergency Contact",
      "type": "text",
      "required": true
    },
    {
      "name": "T-Shirt Size",
      "type": "select",
      "options": ["YS", "YM", "YL", "AS", "AM", "AL"],
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event_123",
    "name": "Summer Soccer Camp",
    "slug": "summer-soccer-camp",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Event Details
```http
GET /events/{eventId}
```

#### Update Event
```http
PUT /events/{eventId}
```

### Registrations

#### List Registrations
```http
GET /registrations?eventId={eventId}&status=confirmed
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "reg_123",
      "participantId": "john.doe@email.com",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phone": "+1-555-0123",
      "amount": 250.00,
      "paid": true,
      "status": "confirmed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create Registration
```http
POST /registrations
```

**Request Body:**
```json
{
  "eventId": "event_123",
  "participantId": "john.doe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1-555-0124",
    "relationship": "mother"
  },
  "customResponses": {
    "T-Shirt Size": "YM",
    "Emergency Contact": "Jane Doe - Mother - +1-555-0124"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reg_123",
    "participantId": "john.doe@email.com",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "amount": 250.00,
    "currency": "USD",
    "paid": false,
    "status": "pending",
    "paymentIntent": {
      "clientSecret": "pi_123_secret",
      "paymentIntentId": "pi_123"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Payment Processing

The API integrates with Stripe for payment processing. When creating a registration:

1. If the event has a price > $0, a Stripe Payment Intent is created
2. The client secret is returned for use with Stripe.js on the frontend
3. After successful payment, a webhook confirms the registration

### Webhook Endpoint

Stripe webhooks should be configured to send events to:
```
POST /api/payments
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per organization.

## SDK Examples

### JavaScript/Node.js

```javascript
// Create organization
const orgResponse = await fetch('/api/organizations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Denver Soccer Club',
    email: 'info@denversoccer.com',
    sportCategory: 'soccer',
    billingEmail: 'billing@denversoccer.com'
  })
});

const { apiKey } = (await orgResponse.json()).data;

// Create event
const eventResponse = await fetch('/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
  },
  body: JSON.stringify({
    name: 'Summer Camp',
    startDate: '2024-06-15T09:00:00Z',
    endDate: '2024-06-19T17:00:00Z',
    price: 250.00,
    // ... other fields
  })
});

// Create registration
const regResponse = await fetch('/api/registrations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
  },
  body: JSON.stringify({
    eventId: 'event_123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    // ... other fields
  })
});

const { paymentIntent } = (await regResponse.json()).data;

// Process payment with Stripe
const { error } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
  payment_method: {
    card: elements.getElement(CardElement),
    billing_details: { name: 'John Doe' }
  }
});
```

### Python

```python
import requests

# Create organization
org_response = requests.post('https://api.yourdomain.com/organizations', json={
    'name': 'Denver Soccer Club',
    'email': 'info@denversoccer.com',
    'sportCategory': 'soccer',
    'billingEmail': 'billing@denversoccer.com'
})

api_key = org_response.json()['data']['apiKey']

# Create event
event_response = requests.post('https://api.yourdomain.com/events', 
    headers={'x-api-key': api_key},
    json={
        'name': 'Summer Camp',
        'startDate': '2024-06-15T09:00:00Z',
        'endDate': '2024-06-19T17:00:00Z',
        'price': 250.00
    }
)
```

## Support

For API support, contact:
- Email: api-support@gritdigitalperformance.com
- Documentation: https://docs.gritdigitalperformance.com
- Status Page: https://status.gritdigitalperformance.com
