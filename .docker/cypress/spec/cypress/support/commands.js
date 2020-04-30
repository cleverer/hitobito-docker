// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  Cypress.log({
    displayName: "Logging in",
    message: "as " + email
  })
  cy.getCSRFToken().then(token => {
    console.log("Token: ", token)
    cy.request({
      url: "/users/sign_in",
      method: "POST",
      form: true,
      body: {
        "person[email]": email,
        "person[password]": password,
        "authenticity_token": token,
        "person[remember_me]": "0",
        "utf8": "✓",
      },
      log: false,
    })
  })
})

Cypress.Commands.add("logout", () => {
  Cypress.log({
    displayName: "Logging out"
  })
  cy.getCSRFToken().then(token => {
    cy.request({
      url: "/users/sign_out",
      method: "POST",
      form: true,
      body: {
        "_method": "delete",
        "authenticity_token": token
      },
      log: false,
    })
  })
})

Cypress.Commands.add("getCSRFToken", () => {
  return cy.get("head", { log: false }).then($head => {
    let $metaTag = $head.get("meta[name=csrf-token]")
    if ($metaTag && $metaTag.hasOwnProperty("length" && $metaTag.length)) {
      return $metaTag.first().prop("content")
    } else {
      return cy.request({ url: "/", log: false }).then(response => {
        const $html = Cypress.$(response.body)
        return Cypress.$($html[11]).prop('content') // TODO: Fix hardcoded
      })
    }
  })
})

Cypress.Commands.add('getInputByText', { prevSubject: 'optional'}, (subject, text, checkbox) => {
  if (subject) {
    if (checkbox)
      return cy.wrap(subject, { log: false }).contains(text).closest('.control-group', { log: false })
        .contains(checkbox).find('input[type="checkbox"]', { log: false }).first({ log: false })
      return cy.wrap(subject, { log: false }).contains(text).closest('.control-group', { log: false })
        .find('input:not([type="hidden"]), textarea, select', { log: false }).first({ log: false })
  } else {
    if (checkbox)
      return cy.contains(text).closest('.control-group', { log: false })
        .contains(checkbox).find('input[type="checkbox"]', { log: false }).first({ log: false })
    else
      return cy.contains(text).closest('.control-group', { log: false })
        .find('input:not([type="hidden"]), textarea, select', { log: false }).first({ log: false })
  }
})

Cypress.Commands.add('getFullUrl', (type, id) => {
  if (type == 'person') {
    cy.request({url: `/de/people/${id}`, followRedirect: false}).then(res => {
      let groupId = res.redirectedToUrl.match(/de\/groups\/(\d+)\/people\/\d+/)[1]
      return { url: res.redirectedToUrl, groupId: groupId}
    })
  } else if (type == 'event') {
    cy.request({url: `/de/events/${id}`, followRedirect: false}).then(res => {
      let groupId = res.redirectedToUrl.match(/de\/groups\/(\d+)\/events\/\d+/)[1]
      return { url: res.redirectedToUrl, groupId: groupId}
    })
  } else {
    throw {
      name: 'Invalid type Exception',
      message: 'Type needs to be "person" or "event"'
    }
  }
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
