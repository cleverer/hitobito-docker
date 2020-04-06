export const approve = (groupID, fullName, content = []) => {
  cy.visit(`/de/groups/${groupID}/pending_approvals`)
  cy.get(`a:contains("${fullName}")`).click()
  cy.get('a.btn:contains("Freigeben")').click()
  cy.get('input[id^=event_approval], textarea[id^=event_approval]').each(($el, $i) => {
    cy.wrap($el).type($i < content.length ? content[$i] : '-')
  })
  cy.get('button[type="submit"]:contains("Freigeben"):first').click()
  cy.url().should('match', /de\/groups\/\d+\/events\/\d+\/participations\/\d+/)
}
