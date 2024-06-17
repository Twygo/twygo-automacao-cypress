class aprendizagem{
	// Mapeamento de elementos da tela de Aprendizagem (Edição de Espaço)

    elementos = {
        checkInscrito: {
            seletor: 'td[id^="select-"]',
            tipo: 'td'
        },
        nome: {
            seletor: 'td[id^="name-"]',
            tipo: 'td'
        },
        empresa: {
            seletor: 'td[id^="enterprise-"]',
            tipo: 'td'
        },
        progresso: {
            seletor: 'td[id^="progress-score-"]',
            tipo: 'td'
        },
        comentarios: {
            seletor: 'td[id^="comment-"]',
            tipo: 'td'
        },
        frequencia: {
            seletor: 'td[id^="attendance-score-"]',
            tipo: 'td'
        },
        questionarios: {
            seletor: 'td[id^="pointer-"]',
            tipo: 'td'
        },
        correcoesQuestionarios: {
            seletor: 'td[id^="question-attempt-quantity-"]',
            tipo: 'td'
        },
        contato: {
            seletor: 'td[id^="contact-"]',
            tipo: 'td'
        },
        pontuacao: {
            seletor: 'td[id^="score-by-weight-"]',
            tipo: 'td'
        },
        aprovacao: {
            seletor: 'td[id^="student-certified-"]',
            tipo: 'td'
        },
        certificado: {
            seletor: 'td[id^="certificate-"]',
            tipo: 'td'
        },
        historico: {
            seletor: 'td[id^="history-"]',
            tipo: 'td'
        },
       btnVoltar:{
            seletor: '#back-button',
			tipo: 'button'
        },
        btnRelatorio:{
            seletor: '#export',
			tipo: 'button'
        },
        btnDownloadCsv:{
            seletor: '#menu-list-:rn:-menuitem-:ro:',
			tipo: 'button'
        },
        btnDownloadPdf:{
            seletor: '#menu-list-:rn:-menuitem-:rp:',
			tipo: 'button'
        },
        btnMostarDashboard:{
            seletor: '#dashboard-collapse-button',
			tipo: 'button'
        },
        btnAcoesEmMassa:{
            seletor: '#action-mass-select',
			tipo: 'button'
        },
        btnFiltro:{
            seletor: '#filter',
			tipo: 'svg'
        }
    }
}

export default new aprendizagem