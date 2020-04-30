import { register, editRequest } from '../pages/event.js'
import { approve } from '../pages/pending_approvals.js'
import { imitate } from '../pages/person.js'

describe('Course approvals', function () {

  beforeEach(() => {
		cy.login("hitobito-pbs@puzzle.ch", "hito42bito")
	})

  context('Applications overview', function () {
    it('Approval turns the warning badge into a success badge', function () {
      // check the badge
      cy.visit(`/de/groups/2/events/83/application_market`)
      cy.get('tbody#participants tr:contains("Feld Lotta / Dicta")')
        .find('td:eq(3) > span').should('have.attr','title', 'Kursfreigabe ausstehend')

      approve(13, 'Lotta Feld / Dicta')

      // check the badge
      cy.visit(`/de/groups/2/events/83/application_market`)
      cy.get('tbody#participants tr:contains("Feld Lotta / Dicta")')
        .find('td:eq(3) > span').should('have.attr','title', 'Kursfreigabe bestätigt')
    })

    it('New participations show up under applications with warning badge, and success badge if approved', function () {
      const EVENT_ID = '84'
      const GROUP_ID = '2'

      editRequest(EVENT_ID, {
        'state': 'application_open',
        'application_opening_at': '01.01.2020',
        'application_closing_at': '31.12.2020',
        'requires_approval_abteilung': '0',
        'requires_approval_region': '1',
        'requires_approval_kantonalverband': '1',
        'requires_approval_bund': '0'
      })

      // imitate a person and initiate the participation
      imitate(469)
      register(EVENT_ID, GROUP_ID)
      cy.get('a:contains("Imitation beenden")').click()

      // check the badge
      cy.visit(`/de/groups/${GROUP_ID}/events/${EVENT_ID}/application_market`)
      cy.get('tbody#applications:contains("Haug Jonte / Ipsam")')
        .find('tr > td:eq(4) > span').should('have.attr','title', 'Kursfreigabe ausstehend')

      approve(7, 'Jonte Haug / Ipsam') // approve on region lvel
      approve(2, 'Jonte Haug / Ipsam') // approve on canton level

      // check the badge
      cy.visit(`/de/groups/${GROUP_ID}/events/${EVENT_ID}/application_market`)
      cy.get('tbody#applications:contains("Haug Jonte / Ipsam")')
        .find('tr > td:eq(4) > span').should('have.attr','title', 'Kursfreigabe bestätigt')
    })
  })

  context('Approval overview', function () {
    it('Content of the approval is displayed in the approval overview', function () {
      approve(13, 'Fine Rosenauer / Necessitatibus', ['Leiterin', 'Pfadistufe', 'Tip töppeli'])
      cy.visit(`/de/groups/8/events/94/approvals`)
      cy.get('strong:contains("Bewertung")').parent().should('contain', 'Tip töppeli')
    })
  })
})
