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
    cy.visit("/de/groups/1/people/31")
    cy.get("#content .content-header").contains("Debitis")
    cy.get('section.roles').find(".btn").click()
		cy.get('#role_type_select').click().find("input.chosen-search-input").type("PowerUser{enter}")
    cy.get("#role_created_at").as("date-input").type("25.02.2020").closest("fieldset").find("legend").click()
    cy.get(".bottom button[type=submit]").click()

    cy.get("#flash").should('contain', "Rolle").and('contain', "wurde erfolgreich erstellt.")

    cy.visit("/de/groups/1/people")
    cy.contains("Debitis").closest("tr").find("input[type=checkbox]").click()
    cy.get(".actions-enabled .actions a[href$=move]").click()

    cy.get("#role_type").select("Group::Bund::ItSupport")
    cy.get("#role_created_at").as("date-input").type("25.03.2020").closest("fieldset").find("legend").click()
    cy.get(".modal-footer button[type=submit]").click()
    cy.get("@date-input").should('not.be.visible')

    cy.get(".modal-footer button[type=submit]").click()

    cy.get("#flash").should('contain', "Eine Rolle wurde verschoben")
    cy.get("#quicksearch").as("quicksearch").type("Berner Mara Debitis")
    cy.get("@quicksearch").closest(".quicksearch").find(".dropdown-menu a[href]").first().click()

    cy.get('.content-header > .nav > li:nth-child(2) > a').as('history-tab').click()
    cy.get('.content-header > .nav > li:nth-child(2)').should('have.class', "active")

    cy.get("h2").contains("Rollen").next().contains("PowerUser").closest("tr").find("td:last-child").should("have.text", "25.03.2020")

  })
})
