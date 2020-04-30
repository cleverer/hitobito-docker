export const register = (eventID, groupID) => {
  cy.visit(`/de/groups/${groupID}/events/${eventID}`)
  cy.get('a.btn:contains("Anmelden")').click()
  cy.get('button[type="submit"]:contains("Weiter"):first').click()
  cy.get('button[type="submit"]:contains("Anmelden")').click()
}

export const editRequest = (eventID, payload) => {
  cy.getFullUrl('event', eventID).then(res => {
    cy.getCSRFToken().then(token => {
      Object.keys(payload).forEach(key => {
        payload[`event[${key}]`] = payload[key]
        delete payload[key]
      })
      payload.authenticity_token = token
      payload._method = 'patch'
      cy.request({
        url: res.url,
        method: 'POST',
        form: true,
        body: payload
      })
    })
  })
}
