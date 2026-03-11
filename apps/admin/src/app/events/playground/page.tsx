'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Calendar,
  MapPin,
  Users,
  User,
  CreditCard,
  Plus,
  X,
  Eye,
  EyeSlash,
  Copy,
  Check,
} from '@phosphor-icons/react'
import { Button } from '@repo/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'
import { Input } from '@repo/ui'
import { Label } from '@repo/ui'
import { Textarea } from '@repo/ui'
import AdminPageHeader from '@/components/admin/admin-page-header'
import { getAdminOrganizations } from '@/lib/admin-organizations-store'

interface EventFormData {
  name: string
  description: string
  organization: string
  date: string
  location: string
  registrationDeadline: string
  registrationType: 'individual' | 'team'
  maxPlayersPerTeam?: number
  priceType: 'perParticipant' | 'perTeam'
  registrationFee: string
}

interface PlayerData {
  id: string
  name: string
}

interface TeamRegistrationData {
  teamName: string
  coachName: string
  email: string
  phone: string
  players: PlayerData[]
}

interface IndividualRegistrationData {
  name: string
  email: string
  phone: string
  notes: string
}

export default function EventPlaygroundPage() {
  const [organizations] = useState(getAdminOrganizations())
  const [eventData, setEventData] = useState<EventFormData>({
    name: '',
    description: '',
    organization: '',
    date: '',
    location: '',
    registrationDeadline: '',
    registrationType: 'individual',
    maxPlayersPerTeam: 5,
    priceType: 'perParticipant',
    registrationFee: '',
  })

  const [teamRegistration, setTeamRegistration] = useState<TeamRegistrationData>({
    teamName: '',
    coachName: '',
    email: '',
    phone: '',
    players: [{ id: '1', name: '' }],
  })

  const [individualRegistration, setIndividualRegistration] = useState<IndividualRegistrationData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const [showPreview, setShowPreview] = useState(true)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  const handleEventChange = (field: keyof EventFormData, value: string | number) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTeamRegistrationChange = (field: keyof TeamRegistrationData, value: string) => {
    setTeamRegistration(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleIndividualRegistrationChange = (field: keyof IndividualRegistrationData, value: string) => {
    setIndividualRegistration(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addPlayer = () => {
    const newPlayerId = String(teamRegistration.players.length + 1)
    setTeamRegistration(prev => ({
      ...prev,
      players: [...prev.players, { id: newPlayerId, name: '' }]
    }))
  }

  const removePlayer = (playerId: string) => {
    if (teamRegistration.players.length > 1) {
      setTeamRegistration(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId)
      }))
    }
  }

  const updatePlayer = (playerId: string, name: string) => {
    setTeamRegistration(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, name } : p
      )
    }))
  }

  const copyEventConfig = () => {
    const config = {
      event: eventData,
      registrationForm: eventData.registrationType === 'team' ? teamRegistration : individualRegistration
    }
    
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)
  }

  const formatPrice = () => {
    const fee = parseFloat(eventData.registrationFee) || 0
    if (eventData.registrationType === 'individual') {
      return eventData.priceType === 'perParticipant' 
        ? `₱${fee.toFixed(2)} per participant`
        : `₱${fee.toFixed(2)} per person`
    } else {
      return eventData.priceType === 'perTeam'
        ? `₱${fee.toFixed(2)} per team`
        : `₱${fee.toFixed(2)} per player`
    }
  }

  const isEventValid = () => {
    return eventData.name && 
           eventData.organization && 
           eventData.date && 
           eventData.location && 
           eventData.registrationDeadline &&
           eventData.registrationFee
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Event & Registration Playground"
        description="Create events and preview registration forms in real-time"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeSlash className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyEventConfig}
              disabled={!isEventValid()}
            >
              {copiedToClipboard ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copiedToClipboard ? 'Copied!' : 'Copy Config'}
            </Button>
          </div>
        }
      />

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Event Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Creation
            </CardTitle>
            <CardDescription>
              Configure your event details and registration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Event Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Event Information</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    placeholder="e.g., Tuguegarao Basketball Open"
                    value={eventData.name}
                    onChange={(e) => handleEventChange('name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    value={eventData.description}
                    onChange={(e) => handleEventChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Select
                    value={eventData.organization}
                    onValueChange={(value) => handleEventChange('organization', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Event Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) => handleEventChange('date', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deadline">Registration Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={eventData.registrationDeadline}
                      onChange={(e) => handleEventChange('registrationDeadline', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Tuguegarao Sports Complex"
                    value={eventData.location}
                    onChange={(e) => handleEventChange('location', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Registration Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Registration Configuration</h3>
              
              <div>
                  <Label htmlFor="registrationType">Registration Type</Label>
                  <Select
                    value={eventData.registrationType}
                    onValueChange={(value: 'individual' | 'team') => handleEventChange('registrationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select registration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Individual
                        </div>
                      </SelectItem>
                      <SelectItem value="team">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              {eventData.registrationType === 'team' && (
                <div>
                  <Label htmlFor="maxPlayers">Max Players Per Team</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="2"
                    max="50"
                    value={eventData.maxPlayersPerTeam}
                    onChange={(e) => handleEventChange('maxPlayersPerTeam', parseInt(e.target.value) || 5)}
                  />
                </div>
              )}
            </div>

            {/* Registration Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Registration Pricing</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fee">Registration Fee (₱)</Label>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={eventData.registrationFee}
                    onChange={(e) => handleEventChange('registrationFee', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select
                    value={eventData.priceType}
                    onValueChange={(value: 'perParticipant' | 'perTeam') => handleEventChange('priceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={eventData.registrationType === 'individual' ? 'perParticipant' : 'perTeam'}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Per {eventData.registrationType === 'individual' ? 'Participant' : 'Team'}
                        </div>
                      </SelectItem>
                      {eventData.registrationType === 'team' && (
                        <SelectItem value="perParticipant">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Per Player
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEventValid() && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Pricing Summary:</p>
                  <p className="text-lg font-bold text-primary">{formatPrice()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Form Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Registration Form Preview
              </CardTitle>
              <CardDescription>
                Live preview of how users will register for your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEventValid() ? (
                <div className="space-y-6">
                  {/* Event Summary */}
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-bold text-lg">{eventData.name || 'Event Name'}</h3>
                    {eventData.description && (
                      <p className="text-sm text-muted-foreground mt-1">{eventData.description}</p>
                    )}
                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(eventData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {eventData.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {formatPrice()}
                      </div>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <div className="space-y-4">
                    {eventData.registrationType === 'individual' ? (
                      // Individual Registration Form
                      <div className="space-y-4">
                        <h4 className="font-medium">Individual Registration</h4>
                        
                        <div>
                          <Label htmlFor="ind-name">Full Name *</Label>
                          <Input
                            id="ind-name"
                            placeholder="Enter your full name"
                            value={individualRegistration.name}
                            onChange={(e) => handleIndividualRegistrationChange('name', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="ind-email">Email Address *</Label>
                          <Input
                            id="ind-email"
                            type="email"
                            placeholder="your@email.com"
                            value={individualRegistration.email}
                            onChange={(e) => handleIndividualRegistrationChange('email', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="ind-phone">Phone Number *</Label>
                          <Input
                            id="ind-phone"
                            type="tel"
                            placeholder="+1234567890"
                            value={individualRegistration.phone}
                            onChange={(e) => handleIndividualRegistrationChange('phone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="ind-notes">Notes (Optional)</Label>
                          <Textarea
                            id="ind-notes"
                            placeholder="Any additional information..."
                            value={individualRegistration.notes}
                            onChange={(e) => handleIndividualRegistrationChange('notes', e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm">
                            <strong>Registration Fee:</strong> {formatPrice()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Team Registration Form
                      <div className="space-y-4">
                        <h4 className="font-medium">Team Registration</h4>
                        <p className="text-sm text-muted-foreground">
                          Max {eventData.maxPlayersPerTeam} players per team
                        </p>
                        
                        <div>
                          <Label htmlFor="team-name">Team Name *</Label>
                          <Input
                            id="team-name"
                            placeholder="Enter your team name"
                            value={teamRegistration.teamName}
                            onChange={(e) => handleTeamRegistrationChange('teamName', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="coach-name">Coach / Contact Person *</Label>
                          <Input
                            id="coach-name"
                            placeholder="Coach or team contact name"
                            value={teamRegistration.coachName}
                            onChange={(e) => handleTeamRegistrationChange('coachName', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="team-email">Email Address *</Label>
                            <Input
                              id="team-email"
                              type="email"
                              placeholder="team@email.com"
                              value={teamRegistration.email}
                              onChange={(e) => handleTeamRegistrationChange('email', e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="team-phone">Phone Number *</Label>
                            <Input
                              id="team-phone"
                              type="tel"
                              placeholder="+1234567890"
                              value={teamRegistration.phone}
                              onChange={(e) => handleTeamRegistrationChange('phone', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Players ({teamRegistration.players.length}/{eventData.maxPlayersPerTeam})</Label>
                          <div className="space-y-2 mt-2">
                            {teamRegistration.players.map((player, index) => (
                              <div key={player.id} className="flex gap-2">
                                <Input
                                  placeholder={`Player ${index + 1} Name`}
                                  value={player.name}
                                  onChange={(e) => updatePlayer(player.id, e.target.value)}
                                />
                                {teamRegistration.players.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removePlayer(player.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            {teamRegistration.players.length < (eventData.maxPlayersPerTeam || 5) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPlayer}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Player
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm">
                            <strong>Registration Fee:</strong> {formatPrice()}
                          </p>
                          {eventData.priceType === 'perParticipant' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Total: ₱{(parseFloat(eventData.registrationFee) * teamRegistration.players.filter(p => p.name).length || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full" size="lg">
                      Register Now
                    </Button>

                    {/* Powered by Grit Footer */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-muted-foreground">Powered by</span>
                        <div className="flex items-center justify-center gap-2">
                          <Image
                            src="/logo/gritLogo2.webp"
                            alt="Grit Digital Performance"
                            width={20}
                            height={20}
                            className="object-contain shrink-0"
                          />
                          <div className="flex items-baseline" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            <span>Grit</span>
                            <span className="ml-1" style={{ color: '#e8192c', fontStyle: 'italic' }}>Hub</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the event details to see the registration form preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
