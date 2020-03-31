describe('A Role', function() {
	beforeEach(() => {
        cy.login("hitobito-pbs@puzzle.ch", "hito42bito")
    })
    describe("When being batch moved", function() {
        beforeEach(function() {
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
        })
        it('correctly adds the new role', function() {
            cy.get("#flash").should('contain', "Eine Rolle wurde verschoben")

            cy.visit("/de/groups/1/people/31/history")
            cy.get("h2").contains("Rollen").next().contains("PowerUser")
        })
        it('correctly sets the end date of the old role', function () {    
            cy.visit("/de/groups/1/people/31/history")
            cy.get("h2").contains("Rollen").next().contains("PowerUser").closest("tr").find("td:last-child").should("have.text", "25.03.2020")
        })
      }) 
})