describe('マルバツゲーム', () => {
  it('urlが正しいこと', () => {
    cy.visit('/')
    cy.contains('次のプレイヤー: X')
  })
})
