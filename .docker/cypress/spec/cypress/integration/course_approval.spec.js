describe('The approval cascade', function () {
  beforeEach(() => {
    cy.loadDB()
		cy.login("hitobito-pbs@puzzle.ch", "hito42bito")
	})
  it('causes the warning badge in the course applications to turn into a success badge', function () {
    // prepare the course, needs to be open for applications
    cy.visit('/de/groups/2/events/84/edit')
    cy.get('select#event_state').select('Offen zur Anmeldung').should('have.value','application_open')
    cy.get('ul.nav-tabs a[href="#application"]').click()
    cy.get('input#event_application_opening_at').focus().clear().type('01.01.2020')
    cy.get('input#event_application_closing_at').focus().clear().type('31.12.2020')
    cy.get('input#event_requires_approval_abteilung').uncheck()
    cy.get('input#event_requires_approval_region').check()
    cy.get('input#event_requires_approval_kantonalverband').check()
    cy.get('input#event_requires_approval_bund').uncheck()
    cy.get('button[type="submit"]:contains("Speichern"):first').click()

    // imitate a person and initiate the participation
    cy.visit('/de/groups/13/people/469')
    cy.get('a.btn:contains("Imitieren")').click()
    cy.contains(/Du bist jetzt als .+ angemeldet/)
    cy.visit('/de/groups/2/events/84')
    cy.get('a.btn:contains("Anmelden")').click()
    cy.get('button[type="submit"]:contains("Weiter"):first').click()
    cy.get('button[type="submit"]:contains("Anmelden")').click()
    cy.get('a:contains("Imitation beenden")').click()

    // check the badge
    cy.visit('de/groups/2/events/84/application_market')
    cy.get('tbody#applications:contains("Haug Jonte / Ipsam")')
      .find('tr > td:eq(4) > span').should('have.attr','title', 'Kursfreigabe ausstehend')

    // approve the participation on the region level
    cy.visit('http://localhost:5002/de/groups/7/pending_approvals')
    cy.get('a:contains("Jonte Haug / Ipsam")').click()
    cy.get('a.btn:contains("Freigeben")').click()
    cy.get('input[id^=event_approval], textarea[id^=event_approval]').each(($el) => {
      cy.wrap($el).type('-')
    })
    cy.get('button[type="submit"]:contains("Freigeben"):first').click()

    // approve the participation on the canton level
    cy.visit('http://localhost:5002/de/groups/2/pending_approvals')
    cy.get('a:contains("Jonte Haug / Ipsam")').click()
    cy.get('a.btn:contains("Freigeben")').click()
    cy.get('input[id^=event_approval], textarea[id^=event_approval]').each(($el) => {
      cy.wrap($el).type('-')
    })
    cy.get('button[type="submit"]:contains("Freigeben"):first').click()

    // check the badge
    cy.visit('de/groups/2/events/84/application_market')
    cy.get('tbody#applications:contains("Haug Jonte / Ipsam")')
      .find('tr > td:eq(4) > span').should('have.attr','title', 'Kursfreigabe bestätigt')
  })
})
