import FormRegrasDoJogo from '../../pages/formRegrasDoJogo';

describe('Regras do Jogo', () => {
  beforeEach(() => {
    cy.visit('URL-DA-SUA-PAGINA');
  });

  it('deve configurar o período para expiração', () => {
    FormRegrasDoJogo.marcarNuncaExpirar();
    FormRegrasDoJogo.preencherPontuacoesExpirar(30);
    FormRegrasDoJogo.marcarReplicarConfiguracoes();
    FormRegrasDoJogo.clicarSalvar();
    
    // Adicione asserções para verificar se as configurações foram salvas corretamente
  });

  it('deve adicionar e remover perfis com permissão para adicionar pontuação manual', () => {
    FormRegrasDoJogo.selecionarPerfil('administrador');
    FormRegrasDoJogo.removerPerfil('administrador');
    
    FormRegrasDoJogo.selecionarPerfil('instrutor');
    FormRegrasDoJogo.removerPerfil('instrutor');
    
    FormRegrasDoJogo.selecionarPerfil('gestorDeTurma');
    FormRegrasDoJogo.removerPerfil('gestorDeTurma');
    
    // Adicione asserções para verificar se os perfis foram adicionados e removidos corretamente
  });
});
