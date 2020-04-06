export const imitate = (personID, groupID) => {
  cy.getCSRFToken().then(token => {
    cy.request({
      url: `/de/groups/${groupID}/people/${personID}/impersonate`,
      method: 'POST',
      form: true,
      body: {
        '_method': 'post',
        'authenticity_token': token
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      Cypress.log({
        displayName: 'Imitating',
        message: `person ${personID} from group ${groupID}`
      })
    })
  })
}
