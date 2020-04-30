import { editRequest } from '../pages/event.js'
import { root_user, unspunne_smw as event } from '../support/constants.js'

describe('A course', function () {

  beforeEach(() => {
		cy.login(root_user.login, root_user.pw)
	})

  it('can be edited via the UI or a request, the result is the same', function () {
    cy.getFullUrl('event', event.ID).then((res) => {
      cy.wrap(res.url).as('event_url')
    })

    cy.get('@event_url').then((url) => {
      cy.visit(`${url}/edit`)
    })
    cy.getInputByText('Name').focus().clear().type(event.FIELDS['name'])
    cy.getInputByText('Ort / Adresse').focus().clear().type(event.FIELDS['location'])
    cy.getInputByText('Status').select('Offen zur Anmeldung')
    cy.getInputByText('Motto').focus().clear().type(event.FIELDS['motto'])
    cy.get('.nav-tabs').contains('Anmeldung').click()
    cy.getInputByText('Anmeldebeginn').focus().clear().type(event.FIELDS['application_opening_at'])
    cy.getInputByText('Anmeldeschluss').focus().clear().type(event.FIELDS['application_closing_at'])
    cy.getInputByText('Empfehlung der Anmeldungen nötig durch', 'Abteilung').uncheck()
    cy.getInputByText('Empfehlung der Anmeldungen nötig durch', 'Region').check()
    cy.getInputByText('Empfehlung der Anmeldungen nötig durch', 'Kantonalverband').check()
    cy.getInputByText('Empfehlung der Anmeldungen nötig durch', 'Bundesebene').uncheck()
    cy.contains('Speichern').first().click()

    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).as('json_ui')
    })

    cy.app('clean')
    cy.app('start_transaction')

    cy.login(root_user.login, root_user.pw)

    editRequest(event.ID, event.FIELDS)

    // note: the JSON API does not return all fields, so there may still be differences
    // for example the requires_approval fields are not included
    // also note: newlines (e.g. in location) may cause problems due to encoding as either \n or \r\n
    cy.get('@event_url').then((url) => {
      cy.request(`${url}.json`).then((response) => {
        expect(this.json_ui.body.events).to.deep.equal(response.body.events)
      })
    })
  })
})
