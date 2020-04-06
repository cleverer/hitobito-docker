export const register = (eventID, groupID) => {
  cy.visit(`/de/groups/${groupID}/events/${eventID}`)
  cy.get('a.btn:contains("Anmelden")').click()
  cy.get('button[type="submit"]:contains("Weiter"):first').click()
  cy.get('button[type="submit"]:contains("Anmelden")').click()
}

export const editRequest = (eventID, groupID, payload) => {
  cy.getCSRFToken().then(token => {
    payload.authenticity_token = token
    payload._method = 'patch'
    cy.request({
      url: `/de/groups/${groupID}/events/${eventID}`,
      method: 'POST',
      form: true,
      body: payload
    })
  })
}
