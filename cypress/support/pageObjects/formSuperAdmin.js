class formSuperAdmin {
    elementos = {
        abaOutros: {
            seletor: 'a.dropdown-toggle:contains("Outros")'
        },
        menuDropdown: {
            enviarNewsletter: {
                seletor: 'a[href="/admin/newsletter"]'
            },
            liberarEventosPublicos: {
                seletor: 'a[href="/admin/public_events"]'
            },
            mudarTipoOrganizacao: {
                seletor: 'a[href="/admin/origin_type"]'
            },
            adicionarChaveFluxAPI: {
                seletor: 'a[href="/admin/flux_api_key"]'
            },
            camposCustomizados: {
                seletor: 'a[href="/admin/organization_custom_participant_fields"]'
            },
            ativarDesativarConfiguracoes: {
                seletor: 'a[href="/admin/enable_or_disable_settings_in_organization"]'
            },
            limpezaInativacaoOrganizacoes: {
                seletor: 'a[href="/admin/organization_cleaning_and_inactivation"]'
            },
            exigirNovoAceiteTermos: {
                seletor: 'a[href="/admin/update_default_term_twygo"]'
            },
            liberarAcessosViews: {
                seletor: 'a[href="/admin/release_access_to_views"]'
            }
        },
        // Campos customizados
        idOrg : {
            seletor: '#organization_id'
        },
        btnPreencher: {
            seletor: 'button:contains("Preencher")'
        },
        phone: {
            seletorHabilitar: 'input#without_list_phone_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_phone_required[type="checkbox"]'
        },
        cpf: {
            seletorHabilitar: 'input#without_list_cpf_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_cpf_required[type="checkbox"]'
        },
        rg: {
            seletorHabilitar: 'input#without_list_rg_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_rg_required[type="checkbox"]'
        },
        address: {
            seletorHabilitar: 'input#without_list_address_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_address_required[type="checkbox"]'
        },
        address2: {
            seletorHabilitar: 'input#without_list_address2_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_address2_required[type="checkbox"]'
        },
        city: {
            seletorHabilitar: 'input#without_list_city_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_city_required[type="checkbox"]'
        },
        district: {
            seletorHabilitar: 'input#without_list_district_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_district_required[type="checkbox"]'
        },
        address_number: {
            seletorHabilitar: 'input#without_list_address_number_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_address_number_required[type="checkbox"]'
        },
        zip_code: {
            seletorHabilitar: 'input#without_list_zip_code_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_zip_code_required[type="checkbox"]'
        },
        state: {
            seletorHabilitar: 'input#without_list_state_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_state_required[type="checkbox"]'
        },
        country: {
            seletorHabilitar: 'input#without_list_country_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_country_required[type="checkbox"]'
        },
        manager: {
            seletorHabilitar: 'input#without_list_manager_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_manager_required[type="checkbox"]'
        },
        team: {
            seletorHabilitar: 'input#without_list_team_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_team_required[type="checkbox"]'
        },
        department: {
            seletorHabilitar: 'input#without_list_department_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#without_list_department_required[type="checkbox"]'
        },
        enterprise: {
            seletorHabilitar: 'input#with_list_enterprise_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#with_list_enterprise_required[type="checkbox"]',
            seletorAdministracao: 'input#with_list_enterprise_show_on_admin[type="checkbox"]'
        },
        business_line: {
            seletorHabilitar: 'input#with_list_business_line_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#with_list_business_line_required[type="checkbox"]',
            seletorAdministracao: 'input#with_list_business_line_show_on_admin[type="checkbox"]'
        },
        number_of_employees: {
            seletorHabilitar: 'input#with_list_number_of_employees_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#with_list_number_of_employees_required[type="checkbox"]',
            seletorAdministracao: 'input#with_list_number_of_employees_show_on_admin[type="checkbox"]'
        },
        role: {
            seletorHabilitar: 'input#with_list_role_enabled[type="checkbox"]',
            seletorObrigatorio: 'input#with_list_role_required[type="checkbox"]',
            seletorAdministracao: 'input#with_list_role_show_on_admin[type="checkbox"]'
        },
        btnSalvar: {
            seletor: 'button.btn-success:contains("Salvar")'
        },
    }

    acessarAbaOutros() {
        cy.get(this.elementos.abaOutros.seletor)
            .click()
    }

    acessarEnviarNewsletter() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.enviarNewsletter.seletor)
            .click()
    }

    acessarLiberarEventosPublicos() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.liberarEventosPublicos.seletor)
            .click()
    }

    acessarMudarTipoOrganizacao() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.mudarTipoOrganizacao.seletor)
            .click()
    }

    acessarAdicionarChaveFluxAPI() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.adicionarChaveFluxAPI.seletor)
            .click()
    }

    acessarCamposCustomizados() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.camposCustomizados.seletor)
            .click()
    }

    acessarAtivarDesativarConfiguracoes() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.ativarDesativarConfiguracoes.seletor)
            .click()
    }

    acessarLimpezaInativacaoOrganizacoes() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.limpezaInativacaoOrganizacoes.seletor)
            .click()
    }

    acessarExigirNovoAceiteTermos() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.exigirNovoAceiteTermos.seletor)
            .click()
    }

    acessarLiberarAcessosViews() {
        this.acessarAbaOutros()
        cy.get(this.elementos.menuDropdown.liberarAcessosViews.seletor)
            .click()
    }

    preencherCamposCustomizados(idOrg) {
        cy.get(this.elementos.idOrg.seletor)
            .type(idOrg)
        cy.get(this.elementos.btnPreencher.seletor)
            .click()
        cy.wait(500); // Aguarda um pouco para garantir que a ação seja processada
    }

    configurarCamposCustomizados(camposOrg) {
        Object.keys(camposOrg).forEach(campo => {
            const acoes = Array.isArray(camposOrg[campo]) ? camposOrg[campo] : [camposOrg[campo]];
            const elemento = this.elementos[campo];
    
            if (!elemento) {
                throw new Error(`Campo ${campo} não encontrado nos elementos.`);
            }
    
            acoes.forEach(acao => {
                if (acao === 'habilitar' || acao === 'desabilitar') {
                    cy.get(elemento.seletorHabilitar).then($el => {
                        const estadoAtual = $el.prop('checked');
                        const estadoDesejado = acao === 'habilitar';
    
                        if (estadoAtual !== estadoDesejado) {
                            cy.wrap($el).click({ force: true });
                            cy.wait(250); // Aguarda um pouco para garantir que a ação seja processada
                        }
                    });
                } else if (acao === 'obrigatório' || acao === 'não obrigatório') {
                    cy.get(elemento.seletorObrigatorio).then($el => {
                        const estadoAtual = $el.prop('checked');
                        const estadoDesejado = acao === 'obrigatório';
    
                        if (estadoAtual !== estadoDesejado) {
                            cy.wrap($el).click({ force: true });
                            cy.wait(250); // Aguarda um pouco para garantir que a ação seja processada
                        }
                    });
                } else {
                    throw new Error(`Ação ${acao} não reconhecida para o campo ${campo}.`);
                }
            });
        });
    }

    salvar() {
        cy.get(this.elementos.btnSalvar.seletor)
            .click()
    }
}
export default new formSuperAdmin