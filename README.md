# Testes Automatizados em Cypress - Twygo

Projeto de testes funcionais, automatizados, regressivos e de integração (API) da aplicação Twygo.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina para executar os testes automatizados.

As informações abaixo são para instalação e configuração no sistema operacional Windows.

## 🛠️ Sistemas operacionais suportados

- macOS 10.9 e superior (somente 64-bit)
- Linux Ubuntu 12.04 e superior, Fedora 21 e Debian 8 (somente 64-bit)
- Windows 7 e superior

## 📋 Instalações & Configurações - Windows

⏱️ Tempo estimado: 20m

🏗️ Pré-requisitos:

- Windows Terminal
    [Microsoft Store](https://www.microsoft.com/store/productid/9N0DX20HK701?ocid=pdpshare)

- Node.js 
    [Windows versão 18.16.0](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi)

- Git 
    [Downloads](https://git-scm.com/downloads)

- Visual Studio Code
    [Downloads](https://code.visualstudio.com/Download)

### 👣 Passos

1. Instalação dos pré-requisitos

2. Criar uma organização exclusiva para utilização nos testes automatizados

    - Para esta organização são necessárias as configurações:
        - Menu Ajuda Sophia
            - Excluir todos os dados da organização

        - SuperAdmin > Outros > Campos customizados para cadastro do participante
            Habilitar todos, mas não marcá-los como requeridos

            Habilitar campos para mostrar na administração

        - SuperAdmin > Outros > Ativar ou desativar configurações na organização
            - Permitir gestão de equipe na organização: habilitado

        - SuperAdmin > Assinaturas > Manutenção de assinaturas
            - Pesquisar pelo ID da organização
            - Editar
            - Aba Contratos > Editar o plano "Trial"
            - Alterar "Data de início da vigência" para 2 dias atrás
            - Alterar "Data de fim da vigência" para 1 dia atrás
            - Salvar
            - Ainda na aba de contratos > + Incluir contrato
            - Em "Código do plano" selecionar "AUTOMAÇÃO"
            - Na "Data de início da vigência" o dia atual
            - Em "Data de fim da vigência" uma data longa (ano atual +5, por exemplo)
            - Selecionar qualquer opção para "Tipo de contrato" e "Índice aplicado na renovação"
            - Salvar como novo

        - Configurações > Cobrança de inscrição
            Habilitar a cobrança de inscrição e configurar um gateway de cobrança (no momento, Asaas ou e.Rede)

        - Com o usuário administrador principal (aquele criado junto com a criação da organização)
            - Clicar no botão de seleção "perfil" > Configurações > Notificações > "desabilitar"

3. Clonar repositório

    No VSCode selecione a opção para Clonar repositório, clique em `GitHub` e selecione `Twygo\twygo-automacao-cypress`.

    Escolha o local onde deseja salvar o clone e confirme em `Ok`.

4. Yarn install

    Para instalar as dependências do projeto é necessário acessar a pasta do projeto na máquina local e então no terminal executar `yarn install`.

## ⚙️ Executando o Cypress

1. No terminal, execute `yarn cypress open`
2. Selecione `e2e`
3. Selecione o navegador que deseja realizar os testes

## 🛠️ Construído com

🧩[Cypress](https://www.cypress.io/)