class FormRegrasDoJogo {
  // Mapeamento de elementos da sessão "Período para Expiração"
  get checkboxNuncaExpirar() {
    return cy.get('#expire_check');
  }

  get inputPontuacoesExpirar() {
    return cy.get('#score_expiration_days');
  }

  get checkboxReplicarConfiguracoes() {
    return cy.get('#reply_to_partner_check');
  }

  get btnSalvar() {
    return cy.get('#save_score_expiration');
  }

  // Mapeamento de elementos da sessão "Permissão para adicionar pontuação manual ao aluno"
  get selectPerfisPermissao() {
    return cy.get('input[aria-describedby="select2-organization_profiles-container"]');
  }

  get opcaoAdministrador() {
    return cy.get('li[data-select2-id="select2-data-select2-organization_profiles-result-llr7-110207"]');
  }

  get opcaoInstrutor() {
    return cy.get('li[data-select2-id="select2-data-select2-organization_profiles-result-llr7-110208"]');
  }

  get opcaoGestorDeTurma() {
    return cy.get('li[data-select2-id="select2-data-select2-organization_profiles-result-9pbk-110209"]');
  }

  get btnRemoverPerfilAdministrador() {
    return cy.get('button[aria-describedby="select2-organization_profiles-container-choice-4269-110207"]');
  }

  get btnRemoverPerfilInstrutor() {
    return cy.get('button[aria-describedby="select2-organization_profiles-container-choice-welm-110208"]');
  }

  get btnRemoverGestorDeTurma() {
    return cy.get('button[aria-describedby="select2-organization_profiles-container-choice-vaof-110209"]');
  }

  // Métodos para interagir com os elementos
  marcarNuncaExpirar() {
    this.checkboxNuncaExpirar.check();
  }

  desmarcarNuncaExpirar() {
    this.checkboxNuncaExpirar.uncheck();
  }

  preencherPontuacoesExpirar(dias) {
    this.inputPontuacoesExpirar.clear().type(dias);
  }

  marcarReplicarConfiguracoes() {
    this.checkboxReplicarConfiguracoes.check();
  }

  desmarcarReplicarConfiguracoes() {
    this.checkboxReplicarConfiguracoes.uncheck();
  }

  clicarSalvar() {
    this.btnSalvar.click();
  }

  selecionarPerfil(perfil) {
    this.selectPerfisPermissao.click();
    switch (perfil) {
      case 'Administrador':
        this.opcaoAdministrador.click();
        break;
      case 'Instrutor':
        this.opcaoInstrutor.click();
        break;
      case 'Gestor de turma':
        this.opcaoGestorDeTurma.click();
        break;
    }
  }

  removerPerfil(perfil) {
    switch (perfil) {
      case 'Administrador':
        this.btnRemoverPerfilAdministrador.click();
        break;
      case 'Instrutor':
        this.btnRemoverPerfilInstrutor.click();
        break;
      case 'Gestor de turma':
        this.btnRemoverGestorDeTurma.click();
        break;
    }
  }
}

export default new FormRegrasDoJogo();
