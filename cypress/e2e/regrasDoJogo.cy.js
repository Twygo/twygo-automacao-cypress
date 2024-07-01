import RegrasDoJogo from '../pageObjects/regrasDoJogo';

describe('Testes da página Regras do Jogo', () => {
    const regrasDoJogo = new RegrasDoJogo();

    before(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ]);

        cy.loginTwygoAutomacao();
        cy.alterarPerfil('administrador');
        cy.acessarPgConfigRegrasDoJogo();
        cy.logout();
    });

    beforeEach(() => {
        // Ignora mensagens de erro conhecidas
        cy.ignorarCapturaErros([
            "Unexpected identifier 'id'"
        ]);
        
        cy.loginTwygoAutomacao();
        cy.alterarPerfil('administrador');
        cy.visit('/regras-do-jogo');
    });

    afterEach(() => {
        cy.ativarCapturaErros()
    })

    context('Sessão "Período para Expiração"', () => {
        it('Deve configurar e salvar o período para expiração', () => {
            regrasDoJogo.desmarcarNuncaExpirar();
            regrasDoJogo.preencherPontuacoesExpirar(30);
            regrasDoJogo.marcarReplicarConfiguracoes();
            regrasDoJogo.clicarSalvarPeriodoParaExpiracao();

            // Asserções para verificar as configurações salvas
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.nuncaExpirar).should('not.be.checked');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.pontuacoesExpirar).should('have.value', '30');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.replicarConfiguracoes).should('be.checked');
        });

        it('Deve reverter as configurações do período para expiração', () => {
            regrasDoJogo.preencherPontuacoesExpirar('');
            regrasDoJogo.desmarcarReplicarConfiguracoes();
            regrasDoJogo.marcarNuncaExpirar();
            regrasDoJogo.clicarSalvarPeriodoParaExpiracao();

            // Asserções para verificar as configurações revertidas
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.nuncaExpirar).should('be.checked');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.pontuacoesExpirar).should('have.value', '');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.replicarConfiguracoes).should('not.be.checked');
        });
    });

    context('Sessão "Permissão para adicionar pontuação manual ao aluno"', () => {
        it('Deve verificar e selecionar perfis que irão ter a permissão', () => {
            cy.get(regrasDoJogo.elementos.permissaoAdicionarPontuacao.selectPerfisPermissao).click();
            cy.get('body').then(($body) => {
                if ($body.find('option').length > 0) {
                    cy.get('option').should('contain', 'Administrador');
                    cy.get('option').should('contain', 'Instrutor');
                    cy.get('option').should('contain', 'Gestor de turma');
                }
            });
        });

        it('Deve selecionar e desmarcar perfis', () => {
            regrasDoJogo.selecionarPerfil('administrador');
            regrasDoJogo.selecionarPerfil('instrutor');
            regrasDoJogo.selecionarPerfil('gestorDeTurma');

            // Asserções para verificar as configurações salvas
            cy.get(regrasDoJogo.elementos.permissaoAdicionarPontuacao.selectPerfisPermissao)
              .find('option:selected').should('contain', 'Gestor de turma');

            // Remover perfis e desmarcar permissão
            regrasDoJogo.removerPerfil('administrador');
            regrasDoJogo.removerPerfil('instrutor');
            regrasDoJogo.removerPerfil('gestorDeTurma');

            // Asserções para verificar as configurações revertidas
            cy.get(regrasDoJogo.elementos.permissaoAdicionarPontuacao.selectPerfisPermissao).should('not.have.value');
        });
    });

    context('Sessão "Ranking completo na visão do aluno"', () => {
        it('Deve marcar e desmarcar "Exibir ranking completo"', () => {
            regrasDoJogo.marcarExibirRanking();
            // Asserções para verificar se o checkbox foi marcado
            cy.get(regrasDoJogo.elementos.rankingCompletoAluno.exibirRanking).should('be.checked');

            regrasDoJogo.desmarcarExibirRanking();
            // Asserções para verificar se o checkbox foi desmarcado
            cy.get(regrasDoJogo.elementos.rankingCompletoAluno.exibirRanking).should('not.be.checked');
        });
    });

    context('Sessão "Customização do troféu"', () => {
        it('Deve configurar o tipo de troféu e salvar', () => {
            regrasDoJogo.selecionarTipoTrofeu('Customizado');

            // Asserção para verificar a seleção do tipo de troféu
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.tipoTrofeu).should('have.value', 'Customizado');

            regrasDoJogo.trocarImagemSemPontuacao('Sophia_estudiosa.png');
            regrasDoJogo.preencherPontosRequeridos1(100);
            regrasDoJogo.trocarImagemPontosRequeridos1('Sophia_estudiosa.png');
            regrasDoJogo.preencherPontosRequeridos2(500);
            regrasDoJogo.trocarImagemPontosRequeridos2('Sophia_estudiosa.png');
            regrasDoJogo.trocarImagemPontosRequeridos3('Sophia_estudiosa.png');
            regrasDoJogo.clicarSalvarCustomizacaoTrofeu();

            cy.reload();

            // Asserções para verificar se os campos estão preenchidos conforme esperado
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.tipoTrofeu).should('have.value', 'Customizado');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.semPontuacaoImagem)
              .should('have.attr', 'src').and('include', 'Sophia_estudiosa.png');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.pontosRequeridos1)
              .should('have.value', '100');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.pontosRequeridos1Imagem)
              .should('have.attr', 'src').and('include', 'Sophia_estudiosa.png');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.pontosRequeridos2)
              .should('have.value', '500');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.pontosRequeridos2Imagem)
              .should('have.attr', 'src').and('include', 'Sophia_estudiosa.png');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.pontosRequeridos3Imagem)
              .should('have.attr', 'src').and('include', 'Sophia_estudiosa.png');
        });

        it('Deve redefinir configurações de customização do troféu', () => {
            regrasDoJogo.selecionarTipoTrofeu('Por colocação');

            cy.reload();

            // Asserções para verificar se os campos estão configurados conforme esperado
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.tipoTrofeu).should('have.value', 'Por colocação');
            // Asserções adicionais conforme a configuração inicial
        });
    });

    context('Verificação final', () => {
        it('Deve verificar se as configurações foram revertidas após recarregar a página', () => {
            cy.reload();
            
            // Asserções para verificar a configuração inicial
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.nuncaExpirar).should('be.checked');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.pontuacoesExpirar).should('have.value', '');
            cy.get(regrasDoJogo.elementos.periodoParaExpiracao.replicarConfiguracoes).should('not.be.checked');
            cy.get(regrasDoJogo.elementos.permissaoAdicionarPontuacao.selectPerfisPermissao).should('not.have.value');
            cy.get(regrasDoJogo.elementos.rankingCompletoAluno.exibirRanking).should('not.be.checked');
            cy.get(regrasDoJogo.elementos.customizacaoTrofeu.tipoTrofeu).should('have.value', 'Por colocação');
        });
    });
});
