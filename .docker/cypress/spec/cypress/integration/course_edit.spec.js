import { editRequest } from '../pages/event.js'

describe('A course', function () {
  const EVENT_ID = '113'
  const GROUP_ID = '14'
  const FIELDS = {
    'event[name]': 'Jim Knopf auf Hoher See',
    'event[location]': 'Hohe See',
    'event[state]': 'application_open',
    'event[motto]': 'Jim Knopf und die wilden 13',
    'event[application_opening_at]': '01.01.2020',
    'event[application_closing_at]': '31.12.2020',
    'event[requires_approval_abteilung]': '0',
    'event[requires_approval_region]': '1',
    'event[requires_approval_kantonalverband]': '1',
    'event[requires_approval_bund]': '0',
    'event[application_conditions]': '', // so that it is not null
    'event[cost]': ''
  }

  beforeEach(() => {
		cy.login('hitobito-pbs@puzzle.ch', 'hito42bito')
	})

  it('can be edited via the UI or a request, the result is the same', function () {
    cy.visit(`/de/groups/${GROUP_ID}/events/${EVENT_ID}/edit`)
    cy.get('input#event_name').focus().clear().type(FIELDS['event[name]'])
    cy.get('textarea#event_location').focus().clear().type(FIELDS['event[location]'])
    cy.get('select#event_state').select('Offen zur Anmeldung').should('have.value','application_open')
    cy.get('input#event_motto').focus().clear().type(FIELDS['event[motto]'])
    cy.get('ul.nav-tabs a[href="#application"]').click()
    cy.get('input#event_application_opening_at').focus().clear().type(FIELDS['event[application_opening_at]'])
    cy.get('input#event_application_closing_at').focus().clear().type(FIELDS['event[application_closing_at]'])
    cy.get('input#event_requires_approval_abteilung').uncheck()
    cy.get('input#event_requires_approval_region').check()
    cy.get('input#event_requires_approval_kantonalverband').check()
    cy.get('input#event_requires_approval_bund').uncheck()
    cy.get('button[type="submit"]:contains("Speichern"):first').click()
    cy.url().should('contain', `/de/groups/${GROUP_ID}/events/${EVENT_ID}`)

    cy.request(`/de/groups/${GROUP_ID}/events/${EVENT_ID}.json`).as('json_ui')

    cy.app('clean')
    cy.app('start_transaction')

    cy.login('hitobito-pbs@puzzle.ch', 'hito42bito')

    editRequest(EVENT_ID, GROUP_ID, FIELDS)

    // note: the JSON API does not return all fields, so there may still be differences
    // for example the requires_approval fields are not included
    // also note: newlines (e.g. in location) may cause problems due to encoding as either \n or \r\n
    cy.request(`/de/groups/${GROUP_ID}/events/${EVENT_ID}.json`).then((response) => {
      expect(this.json_ui.body.events).to.deep.equal(response.body.events)
    })
  })
})
