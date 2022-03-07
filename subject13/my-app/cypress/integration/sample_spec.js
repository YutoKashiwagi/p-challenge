describe('マルバツゲーム', () => {
  it('urlが正しいこと', () => {
    cy.visit('/')
    cy.contains('次のプレイヤー: X')
  })

  it('Xが勝利すること', () => {
    cy.visit('/')

    cy.get('[data-qa=square0]').click()
    cy.contains('次のプレイヤー: O')

    cy.get('[data-qa=square1]').click()
    cy.contains('次のプレイヤー: X')

    cy.get('[data-qa=square3]').click()
    cy.contains('次のプレイヤー: O')

    cy.get('[data-qa=square4]').click()
    cy.contains('次のプレイヤー: X')

    cy.get('[data-qa=square6]').click()
    cy.contains('Winner: X')
  })
})
