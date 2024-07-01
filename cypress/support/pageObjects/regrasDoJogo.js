class FormRegrasDoJogo {
  constructor() {
    this.elementos = {
      // Elementos da sessão "Período para Expiração"
      periodoParaExpiracao: {
        nuncaExpirar: '#expire_check',
        pontuacoesExpirar: '#score_expiration_days',
        replicarConfiguracoes: '#reply_to_partner_check',
        salvar: '#save_score_expiration'
      },
      
      // Elementos da sessão "Permissão para adicionar pontuação manual ao aluno"
      permissaoAdicionarPontuacao: {
        selectPerfisPermissao: 'input[aria-describedby="select2-organization_profiles-container"]',
        perfis: {
          administrador: 'li[data-select2-id="select2-data-select2-organization_profiles-result-llr7-110207"]',
          instrutor: 'li[data-select2-id="select2-data-select2-organization_profiles-result-llr7-110208"]',
          gestorDeTurma: 'li[data-select2-id="select2-data-select2-organization_profiles-result-9pbk-110209"]',
        },
        removerPerfil: {
          administrador: 'button[aria-describedby="select2-organization_profiles-container-choice-4269-110207"]',
          instrutor: 'button[aria-describedby="select2-organization_profiles-container-choice-welm-110208"]',
          gestorDeTurma: 'button[aria-describedby="select2-organization_profiles-container-choice-vaof-110209"]'
        }
      },

      // Elementos da sessão "Ranking completo na visão do aluno"
      rankingCompletoAluno: {
        exibirRanking: '#show_complete_ranking_for_students'
      },

      // Elementos da sessão "Customização do troféu"
      customizacaoTrofeu: {
        tipoTrofeu: '#trophy_settings_select',
        semPontuacaoImagem: '#trophies_1622_logo',
        pontosRequeridos1: '#trophies_1623_points_required',
        pontosRequeridos1Imagem: '#trophies_1623_logo',
        pontosRequeridos2: '#trophies_1624_points_required',
        pontosRequeridos2Imagem: '#trophies_1624_logo',
        pontosRequeridos3Imagem: '#trophies_1625_logo',
        salvarCustomizacao: '#save_trophy_settings'
      }
    }
  }

  // Métodos para interagir com os elementos da sessão "Período para Expiração"
  marcarNuncaExpirar() {
    cy.get(this.elementos.periodoParaExpiracao.nuncaExpirar).check();
  }

  desmarcarNuncaExpirar() {
    cy.get(this.elementos.periodoParaExpiracao.nuncaExpirar).uncheck();
  }

  preencherPontuacoesExpirar(dias) {
    cy.get(this.elementos.periodoParaExpiracao.pontuacoesExpirar).clear().type(dias);
  }

  marcarReplicarConfiguracoes() {
    cy.get(this.elementos.periodoParaExpiracao.replicarConfiguracoes).check();
  }

  desmarcarReplicarConfiguracoes() {
    cy.get(this.elementos.periodoParaExpiracao.replicarConfiguracoes).uncheck();
  }

  clicarSalvarPeriodoParaExpiracao() {
    cy.get(this.elementos.periodoParaExpiracao.salvar).click();
  }

  // Métodos para interagir com os elementos da sessão "Permissão para adicionar pontuação manual ao aluno"
  selecionarPerfil(perfil) {
    cy.get(this.elementos.permissaoAdicionarPontuacao.selectPerfisPermissao).click();
    cy.get(this.elementos.permissaoAdicionarPontuacao.perfis[perfil]).click();
  }

  removerPerfil(perfil) {
    cy.get(this.elementos.permissaoAdicionarPontuacao.removerPerfil[perfil]).click();
  }

  // Métodos para interagir com os elementos da sessão "Ranking completo na visão do aluno"
  marcarExibirRanking() {
    cy.get(this.elementos.rankingCompletoAluno.exibirRanking).check();
  }

  desmarcarExibirRanking() {
    cy.get(this.elementos.rankingCompletoAluno.exibirRanking).uncheck();
  }

  // Métodos para interagir com os elementos da sessão "Customização do troféu"
  selecionarTipoTrofeu(tipo) {
    cy.get(this.elementos.customizacaoTrofeu.tipoTrofeu).select(tipo);
  }

  trocarImagemSemPontuacao(caminhoImagem) {
    cy.get(this.elementos.customizacaoTrofeu.semPontuacaoImagem).attachFile(caminhoImagem);
  }

  preencherPontosRequeridos1(pontos) {
    cy.get(this.elementos.customizacaoTrofeu.pontosRequeridos1).clear().type(pontos);
  }

  trocarImagemPontosRequeridos1(caminhoImagem) {
    cy.get(this.elementos.customizacaoTrofeu.pontosRequeridos1Imagem).attachFile(caminhoImagem);
  }

  preencherPontosRequeridos2(pontos) {
    cy.get(this.elementos.customizacaoTrofeu.pontosRequeridos2).clear().type(pontos);
  }

  trocarImagemPontosRequeridos2(caminhoImagem) {
    cy.get(this.elementos.customizacaoTrofeu.pontosRequeridos2Imagem).attachFile(caminhoImagem);
  }

  trocarImagemPontosRequeridos3(caminhoImagem) {
    cy.get(this.elementos.customizacaoTrofeu.pontosRequeridos3Imagem).attachFile(caminhoImagem);
  }

  clicarSalvarCustomizacaoTrofeu() {
    cy.get(this.elementos.customizacaoTrofeu.salvarCustomizacao).click();
  }
}

// Adiciona comando customizado para acessar a página de configuração de Regras do jogo
Cypress.Commands.add('acessarPgConfigRegrasDoJogo', () => {
  const labels = Cypress.env('labels')
  const { breadcrumb } = labels.configComunicacao

  cy.visit(`/o/${Cypress.env('orgId')}/game_rules`)

  // Verificar se a página de configuração de Regras do jogo foi acessada com sucesso
  cy.contains('#page-breadcrumb', breadcrumb)
    .should('be.visible')
})

export default new FormRegrasDoJogo();
