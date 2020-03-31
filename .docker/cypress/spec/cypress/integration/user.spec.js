describe('The user', function () {
	beforeEach(() => {
	  cy.login("hitobito-pbs@puzzle.ch", "hito42bito")
	})
	it('can add a role', function () {
	  cy.visit("/de/groups/1/people/18")

		cy.get('a.btn.btn-small:contains("Rolle hinzufügen")').click()
		cy.get('#role_type_select').click()

		cy.get('div.chosen-search input').type("Webma{enter}")
		cy.get('#new_role button[type=submit]').last().click()

    cy.contains("Rolle Webmaster für Nika Zipp / Voluptate in Pfadibewegung Schweiz wurde erfolgreich erstellt.")
	})
  it('can add a new person', function () {
    cy.visit('/de/groups/1/roles/new')

    cy.get('a:contains("Neue Person erfassen")').click()

    cy.get('#role_new_person_first_name')
      .type('Marlies')
    cy.get('#role_new_person_last_name')
      .type('Sauerkraut')
    cy.get('#role_new_person_nickname')
      .type('Brexit')
    cy.get('#role_new_person_email')
      .type('marlies_sk88@example.com')

    cy.get('#role_type_select').click()
    cy.get('div.chosen-search input').type("Gesch{enter}")

    cy.get('form#new_role button[type="submit"]:first').click()

    cy.contains("Rolle Geschäftsleiter für Marlies Sauerkraut / Brexit in Pfadibewegung Schweiz wurde erfolgreich erstellt.")
  })
  it('can still add a new person, even with the same email', function () {
    cy.visit('/de/groups/1/roles/new')

    cy.get('a:contains("Neue Person erfassen")').click()

    cy.get('#role_new_person_first_name')
      .type('Marlies')
    cy.get('#role_new_person_last_name')
      .type('Sauerkraut')
    cy.get('#role_new_person_nickname')
      .type('Brexit')
    cy.get('#role_new_person_email')
      .type('marlies_sk88@example.com')

    cy.get('#role_type_select').click()
    cy.get('div.chosen-search input').type("Gesch{enter}")

    cy.get('form#new_role button[type="submit"]:first').click()

    cy.contains("Rolle Geschäftsleiter für Marlies Sauerkraut / Brexit in Pfadibewegung Schweiz wurde erfolgreich erstellt.")
  })
  it('can move a role', function () {
    cy.visit("/de/groups/1/people/18")
    cy.get('section.roles strong a[href]').click()
    cy.get('section.roles').should('not.exist')

    cy.get('#content .content-header .nav li:nth-child(2) a[href*=people]').click()
    cy.contains("Debitis").closest("tr").find("input[type=checkbox]").click()
    cy.get(".actions-enabled .actions a[href$=move]").click()

    cy.get("#role_type").select("Group::Bund::ItSupport")
    cy.get("#role_created_at").as("date-input").type("25.04.2020").closest("fieldset").find("legend").click()
    cy.get(".modal-footer button[type=submit]").click()
    cy.get("@date-input").should('not.be.visible')
    cy.get(".modal-footer button[type=submit]").click()

    cy.get("#flash").should('contain', "Eine Rolle wurde verschoben")
    cy.get("#quicksearch").as("quicksearch").type("Berner Mara Debitis")
    cy.get("@quicksearch").closest(".quicksearch").find(".dropdown-menu a[href]").first().click()

    cy.get('.content-header > .nav > :nth-child(2) > a').click()
    // History broken here…

  })
})
