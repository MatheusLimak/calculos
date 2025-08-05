// Configurações padrão das tabelas
const DEFAULT_CONFIG = {
    irrf: [
        { limite: 2428.80, aliquota: 0, deducao: 0 },
        { limite: 2826.65, aliquota: 0.075, deducao: 182.16 },
        { limite: 3751.05, aliquota: 0.15, deducao: 394.16 },
        { limite: 4664.68, aliquota: 0.225, deducao: 675.49 },
        { limite: Infinity, aliquota: 0.275, deducao: 908.73 }
    ],
    inss: [
        { limite: 1518.00, aliquota: 0.075 },
        { limite: 2793.88, aliquota: 0.09 },
        { limite: 4190.83, aliquota: 0.12 },
        { limite: 8157.41, aliquota: 0.14 }
    ],
    plr: [
        { limite: 7640.80, aliquota: 0, deducao: 0 },
        { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
        { limite: 13167.00, aliquota: 0.15, deducao: 1317.23 },
        { limite: 16380.38, aliquota: 0.225, deducao: 2304.76 },
        { limite: Infinity, aliquota: 0.275, deducao: 3123.78 }
    ],
    pj: [
        { limite: 180000, aliquota: 0.06, deducao: 0 },
        { limite: 360000, aliquota: 0.112, deducao: 9360 },
        { limite: 720000, aliquota: 0.135, deducao: 17640 },
        { limite: 1800000, aliquota: 0.16, deducao: 35640 },
        { limite: 3600000, aliquota: 0.21, deducao: 125640 },
        { limite: 4800000, aliquota: 0.33, deducao: 648000 }
    ],
    other: {
        valorPorDependente: 189.59,
        descontoSimplificado: 607.20,
        tetoINSS: 8157.41,
        valorMaximoINSS: 951.62,
        custoContador: 450.00
    },
    adicionais: {
        percentualAdicionalTransferencia: 25.0,
        diariasViagem: [0, 708.93, 954.00, 1883.09, 2990.79]
    },
    custosEmpresa: {
        // Percentuais comuns (iguais para CLT Normal e Aprendiz)
        inssEmpresa: 20.0,        // 20%
        rat: 3.0,                 // 3%
        terceiros: 5.8,           // 5,8%
        percentualIncidencias: 36.8, // 36,8%
        adicionalFerias: 33.33,   // 33,33% (1/3)
        
        // FGTS por tipo de empregado (única diferença)
        fgts: {
            clt_normal: 8.0,      // 8%
            aprendiz: 2.0,        // 2%
            estagiario: 0.0,      // 0%
            pj: 0.0               // 0%
        }
    }
};

// Carregar configurações salvas ou usar padrão
function loadConfig() {
    try {
        const savedIRRF = localStorage.getItem('irrfConfig');
        const savedINSS = localStorage.getItem('inssConfig');
        const savedPLR = localStorage.getItem('plrConfig');
        const savedPJ = localStorage.getItem('pjConfig');
        const savedOther = localStorage.getItem('otherConfig');
        const savedAdicionais = localStorage.getItem('adicionaisConfig');
        const savedCustosEmpresa = localStorage.getItem('custosEmpresaConfig');
        
        const config = {
            irrf: savedIRRF ? JSON.parse(savedIRRF) : DEFAULT_CONFIG.irrf,
            inss: savedINSS ? JSON.parse(savedINSS) : DEFAULT_CONFIG.inss,
            plr: savedPLR ? JSON.parse(savedPLR) : DEFAULT_CONFIG.plr,
            pj: savedPJ ? JSON.parse(savedPJ) : DEFAULT_CONFIG.pj,
            other: savedOther ? JSON.parse(savedOther) : DEFAULT_CONFIG.other,
            adicionais: savedAdicionais ? JSON.parse(savedAdicionais) : DEFAULT_CONFIG.adicionais,
            custosEmpresa: savedCustosEmpresa ? JSON.parse(savedCustosEmpresa) : DEFAULT_CONFIG.custosEmpresa
        };
        
        return config;
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        return DEFAULT_CONFIG;
    }
}

// Salvar configurações
function saveConfig(config) {
    try {
        if (!config) {
            console.error('Configuração inválida para salvar');
            return false;
        }
        
        localStorage.setItem('irrfConfig', JSON.stringify(config.irrf || []));
        localStorage.setItem('inssConfig', JSON.stringify(config.inss || []));
        localStorage.setItem('plrConfig', JSON.stringify(config.plr || []));
        localStorage.setItem('pjConfig', JSON.stringify(config.pj || []));
        localStorage.setItem('otherConfig', JSON.stringify(config.other || {}));
        localStorage.setItem('adicionaisConfig', JSON.stringify(config.adicionais || {}));
        localStorage.setItem('custosEmpresaConfig', JSON.stringify(config.custosEmpresa || {}));
        showMessage('success', 'Configurações salvas com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showMessage('error', 'Erro ao salvar configurações!');
        return false;
    }
}

// Mostrar mensagens
function showMessage(type, message) {
    try {
        const successMsg = document.getElementById('successMessage');
        const errorMsg = document.getElementById('errorMessage');
        
        if (!successMsg || !errorMsg) {
            console.warn('Elementos de mensagem não encontrados');
            return;
        }
        
        if (type === 'success') {
            successMsg.textContent = message;
            successMsg.style.display = 'block';
            errorMsg.style.display = 'none';
        } else {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
        }
        
        setTimeout(() => {
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Erro ao mostrar mensagem:', error);
    }
}

// Renderizar tabela IRRF
function renderIRRFTable() {
    const config = loadConfig();
    const tbody = document.getElementById('irrfTableBody');
    tbody.innerHTML = '';
    
    config.irrf.forEach((faixa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}ª Faixa</td>
            <td><input type="number" value="${faixa.limite === Infinity ? '' : faixa.limite}" step="0.01" min="0" onchange="updateIRRF(${index}, 'limite', this.value)"></td>
            <td><input type="number" value="${(faixa.aliquota * 100).toFixed(2)}" step="0.01" min="0" max="100" onchange="updateIRRF(${index}, 'aliquota', this.value / 100)"></td>
            <td><input type="number" value="${faixa.deducao}" step="0.01" min="0" onchange="updateIRRF(${index}, 'deducao', this.value)"></td>
            <td><button class="remove-row-btn" onclick="removeIRRFRow(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar tabela INSS
function renderINSSTable() {
    const config = loadConfig();
    const tbody = document.getElementById('inssTableBody');
    tbody.innerHTML = '';
    
    config.inss.forEach((faixa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}ª Faixa</td>
            <td><input type="number" value="${faixa.limite}" step="0.01" min="0" onchange="updateINSS(${index}, 'limite', this.value)"></td>
            <td><input type="number" value="${(faixa.aliquota * 100).toFixed(2)}" step="0.01" min="0" max="100" onchange="updateINSS(${index}, 'aliquota', this.value / 100)"></td>
            <td><button class="remove-row-btn" onclick="removeINSSRow(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar tabela PLR
function renderPLRTable() {
    const config = loadConfig();
    const tbody = document.getElementById('plrTableBody');
    tbody.innerHTML = '';
    
    config.plr.forEach((faixa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}ª Faixa</td>
            <td><input type="number" value="${faixa.limite === Infinity ? '' : faixa.limite}" step="0.01" min="0" onchange="updatePLR(${index}, 'limite', this.value)"></td>
            <td><input type="number" value="${(faixa.aliquota * 100).toFixed(2)}" step="0.01" min="0" max="100" onchange="updatePLR(${index}, 'aliquota', this.value / 100)"></td>
            <td><input type="number" value="${faixa.deducao}" step="0.01" min="0" onchange="updatePLR(${index}, 'deducao', this.value)"></td>
            <td><button class="remove-row-btn" onclick="removePLRRow(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar tabela PJ
function renderPJTable() {
    const config = loadConfig();
    const tbody = document.getElementById('pjTableBody');
    tbody.innerHTML = '';
    
    config.pj.forEach((faixa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}ª Faixa</td>
            <td><input type="number" value="${faixa.limite === Infinity ? '' : faixa.limite}" step="0.01" min="0" onchange="updatePJ(${index}, 'limite', this.value)"></td>
            <td><input type="number" value="${(faixa.aliquota * 100).toFixed(2)}" step="0.01" min="0" max="100" onchange="updatePJ(${index}, 'aliquota', this.value / 100)"></td>
            <td><input type="number" value="${faixa.deducao}" step="0.01" min="0" onchange="updatePJ(${index}, 'deducao', this.value)"></td>
            <td><button class="remove-row-btn" onclick="removePJRow(${index})">Remover</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar outras configurações
function loadOtherConfigs() {
    try {
        const config = loadConfig();
        const valorPorDependenteElement = document.getElementById('valorPorDependente');
        const descontoSimplificadoElement = document.getElementById('descontoSimplificado');
        const tetoINSSElement = document.getElementById('tetoINSS');
        const valorMaximoINSSElement = document.getElementById('valorMaximoINSS');
        const custoContadorElement = document.getElementById('custoContador');
        
        if (valorPorDependenteElement) {
            valorPorDependenteElement.value = config.other.valorPorDependente;
        }
        if (descontoSimplificadoElement) {
            descontoSimplificadoElement.value = config.other.descontoSimplificado;
        }
        if (tetoINSSElement) {
            tetoINSSElement.value = config.other.tetoINSS;
        }
        if (valorMaximoINSSElement) {
            valorMaximoINSSElement.value = config.other.valorMaximoINSS;
        }
        if (custoContadorElement) {
            custoContadorElement.value = config.other.custoContador;
        }
    } catch (error) {
        console.error('Erro ao carregar outras configurações:', error);
    }
}

// Carregar configurações de adicionais
function loadAdicionaisConfigs() {
    try {
        const config = loadConfig();
        const percentualElement = document.getElementById('percentualAdicionalTransferencia');
        const diaria1Element = document.getElementById('diariaViagem1');
        const diaria2Element = document.getElementById('diariaViagem2');
        const diaria3Element = document.getElementById('diariaViagem3');
        const diaria4Element = document.getElementById('diariaViagem4');
        const diaria5Element = document.getElementById('diariaViagem5');
        
        if (percentualElement) {
            percentualElement.value = config.adicionais.percentualAdicionalTransferencia;
        }
        if (diaria1Element) {
            diaria1Element.value = config.adicionais.diariasViagem[0];
        }
        if (diaria2Element) {
            diaria2Element.value = config.adicionais.diariasViagem[1];
        }
        if (diaria3Element) {
            diaria3Element.value = config.adicionais.diariasViagem[2];
        }
        if (diaria4Element) {
            diaria4Element.value = config.adicionais.diariasViagem[3];
        }
        if (diaria5Element) {
            diaria5Element.value = config.adicionais.diariasViagem[4];
        }
    } catch (error) {
        console.error('Erro ao carregar configurações de adicionais:', error);
    }
}

// Atualizar IRRF
function updateIRRF(index, field, value) {
    const config = loadConfig();
    if (field === 'limite') {
        config.irrf[index].limite = value === '' ? Infinity : parseFloat(value);
    } else {
        config.irrf[index][field] = parseFloat(value);
    }
    saveConfig(config);
}

// Atualizar INSS
function updateINSS(index, field, value) {
    const config = loadConfig();
    config.inss[index][field] = parseFloat(value);
    saveConfig(config);
}

// Atualizar PLR
function updatePLR(index, field, value) {
    const config = loadConfig();
    if (field === 'limite') {
        config.plr[index].limite = value === '' ? Infinity : parseFloat(value);
    } else {
        config.plr[index][field] = parseFloat(value);
    }
    saveConfig(config);
}

// Atualizar PJ
function updatePJ(index, field, value) {
    const config = loadConfig();
    if (field === 'limite') {
        config.pj[index].limite = value === '' ? Infinity : parseFloat(value);
    } else {
        config.pj[index][field] = parseFloat(value);
    }
    saveConfig(config);
}

// Adicionar linha IRRF
function addIRRFRow() {
    const config = loadConfig();
    config.irrf.push({ limite: 0, aliquota: 0, deducao: 0 });
    saveConfig(config);
    renderIRRFTable();
}

// Adicionar linha INSS
function addINSSRow() {
    const config = loadConfig();
    config.inss.push({ limite: 0, aliquota: 0 });
    saveConfig(config);
    renderINSSTable();
}

// Adicionar linha PLR
function addPLRRow() {
    const config = loadConfig();
    config.plr.push({ limite: 0, aliquota: 0, deducao: 0 });
    saveConfig(config);
    renderPLRTable();
}

// Adicionar linha PJ
function addPJRow() {
    const config = loadConfig();
    config.pj.push({ limite: 0, aliquota: 0, deducao: 0 });
    saveConfig(config);
    renderPJTable();
}

// Remover linha IRRF
function removeIRRFRow(index) {
    const config = loadConfig();
    if (config.irrf.length > 1) {
        config.irrf.splice(index, 1);
        saveConfig(config);
        renderIRRFTable();
    } else {
        showMessage('error', 'Deve haver pelo menos uma faixa!');
    }
}

// Remover linha INSS
function removeINSSRow(index) {
    const config = loadConfig();
    if (config.inss.length > 1) {
        config.inss.splice(index, 1);
        saveConfig(config);
        renderINSSTable();
    } else {
        showMessage('error', 'Deve haver pelo menos uma faixa!');
    }
}

// Remover linha PLR
function removePLRRow(index) {
    const config = loadConfig();
    if (config.plr.length > 1) {
        config.plr.splice(index, 1);
        saveConfig(config);
        renderPLRTable();
    } else {
        showMessage('error', 'Deve haver pelo menos uma faixa!');
    }
}

// Remover linha PJ
function removePJRow(index) {
    const config = loadConfig();
    if (config.pj.length > 1) {
        config.pj.splice(index, 1);
        saveConfig(config);
        renderPJTable();
    } else {
        showMessage('error', 'Deve haver pelo menos uma faixa!');
    }
}

// Salvar IRRF
function saveIRRF() {
    const config = loadConfig();
    // Validar se os limites estão em ordem crescente
    for (let i = 1; i < config.irrf.length; i++) {
        if (config.irrf[i].limite <= config.irrf[i-1].limite) {
            showMessage('error', 'Os limites devem estar em ordem crescente!');
            return;
        }
    }
    saveConfig(config);
}

// Salvar INSS
function saveINSS() {
    const config = loadConfig();
    // Validar se os limites estão em ordem crescente
    for (let i = 1; i < config.inss.length; i++) {
        if (config.inss[i].limite <= config.inss[i-1].limite) {
            showMessage('error', 'Os limites devem estar em ordem crescente!');
            return;
        }
    }
    saveConfig(config);
}

// Salvar PLR
function savePLR() {
    const config = loadConfig();
    // Validar se os limites estão em ordem crescente
    for (let i = 1; i < config.plr.length; i++) {
        if (config.plr[i].limite <= config.plr[i-1].limite) {
            showMessage('error', 'Os limites devem estar em ordem crescente!');
            return;
        }
    }
    saveConfig(config);
}

// Salvar PJ
function savePJ() {
    const config = loadConfig();
    // Validar se os limites estão em ordem crescente
    for (let i = 1; i < config.pj.length; i++) {
        if (config.pj[i].limite <= config.pj[i-1].limite) {
            showMessage('error', 'Os limites devem estar em ordem crescente!');
            return;
        }
    }
    saveConfig(config);
}

// Salvar outras configurações
function saveOtherConfigs() {
    try {
        const config = loadConfig();
        const valorPorDependenteElement = document.getElementById('valorPorDependente');
        const descontoSimplificadoElement = document.getElementById('descontoSimplificado');
        const tetoINSSElement = document.getElementById('tetoINSS');
        const valorMaximoINSSElement = document.getElementById('valorMaximoINSS');
        const custoContadorElement = document.getElementById('custoContador');
        
        if (!valorPorDependenteElement || !descontoSimplificadoElement || !tetoINSSElement || !valorMaximoINSSElement || !custoContadorElement) {
            showMessage('error', 'Elementos de configuração não encontrados!');
            return;
        }
        
        config.other.valorPorDependente = parseFloat(valorPorDependenteElement.value);
        config.other.descontoSimplificado = parseFloat(descontoSimplificadoElement.value);
        config.other.tetoINSS = parseFloat(tetoINSSElement.value);
        config.other.valorMaximoINSS = parseFloat(valorMaximoINSSElement.value);
        config.other.custoContador = parseFloat(custoContadorElement.value);
        saveConfig(config);
    } catch (error) {
        console.error('Erro ao salvar outras configurações:', error);
        showMessage('error', 'Erro ao salvar configurações!');
    }
}

// Salvar configurações de adicionais
function saveAdicionaisConfigs() {
    try {
        const config = loadConfig();
        const diaria1Element = document.getElementById('diariaViagem1');
        const diaria2Element = document.getElementById('diariaViagem2');
        const diaria3Element = document.getElementById('diariaViagem3');
        const diaria4Element = document.getElementById('diariaViagem4');
        const diaria5Element = document.getElementById('diariaViagem5');
        const percentualElement = document.getElementById('percentualAdicionalTransferencia');
        
        if (!diaria1Element || !diaria2Element || !diaria3Element || !diaria4Element || !diaria5Element || !percentualElement) {
            showMessage('error', 'Elementos de configuração não encontrados!');
            return;
        }
        
        const diariaInputs = [
            diaria1Element.value,
            diaria2Element.value,
            diaria3Element.value,
            diaria4Element.value,
            diaria5Element.value
        ];
        let hasInvalid = false;
        const diarias = diariaInputs.map((val, idx) => {
            const num = parseFloat(val.replace(',', '.'));
            if (isNaN(num) || val === '') {
                hasInvalid = true;
            }
            return isNaN(num) ? 0 : num;
        });
        if (hasInvalid) {
            showMessage('error', 'Preencha todos os valores de diária de viagem corretamente!');
            return;
        }
        const percentual = parseFloat(percentualElement.value.replace(',', '.'));
        if (isNaN(percentual)) {
            showMessage('error', 'Preencha o percentual do adicional de transferência corretamente!');
            return;
        }
        config.adicionais.percentualAdicionalTransferencia = percentual;
        config.adicionais.diariasViagem = diarias;
        saveConfig(config);
    } catch (error) {
        console.error('Erro ao salvar configurações de adicionais:', error);
        showMessage('error', 'Erro ao salvar configurações!');
    }
}

// Restaurar configurações padrão IRRF
function restoreDefaultIRRF() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão do IRRF?')) {
        const config = loadConfig();
        config.irrf = [...DEFAULT_CONFIG.irrf];
        saveConfig(config);
        renderIRRFTable();
    }
}

// Restaurar configurações padrão INSS
function restoreDefaultINSS() {
    const config = loadConfig();
    config.inss = [...DEFAULT_CONFIG.inss];
    saveConfig(config);
    renderINSSTable();
}

// Restaurar configurações padrão PLR
function restoreDefaultPLR() {
    const config = loadConfig();
    config.plr = [...DEFAULT_CONFIG.plr];
    saveConfig(config);
    renderPLRTable();
}

// Restaurar configurações padrão PJ
function restoreDefaultPJ() {
    const config = loadConfig();
    config.pj = [...DEFAULT_CONFIG.pj];
    saveConfig(config);
    renderPJTable();
}

// Restaurar outras configurações padrão
function restoreDefaultOtherConfigs() {
    const config = loadConfig();
    config.other = DEFAULT_CONFIG.other;
    saveConfig(config);
    loadOtherConfigs();
}

// Restaurar configurações padrão adicionais
function restoreDefaultAdicionaisConfigs() {
    const config = loadConfig();
    config.adicionais = DEFAULT_CONFIG.adicionais;
    saveConfig(config);
    loadAdicionaisConfigs();
}

// Inicializar painel admin
function initAdminPanel() {
    try {
        renderIRRFTable();
        renderINSSTable();
        renderPLRTable();
        renderPJTable();
        loadOtherConfigs();
        loadAdicionaisConfigs();
        loadCustosEmpresaConfigs();
        if (typeof carregarHistorico === 'function') {
            carregarHistorico();
        }
    } catch (error) {
        console.error('Erro ao inicializar painel admin:', error);
    }
}

// Carregar configurações de custos empresariais
function loadCustosEmpresaConfigs() {
    try {
        const config = loadConfig();
        
        // Percentuais comuns
        document.getElementById('inssEmpresa').value = config.custosEmpresa.inssEmpresa;
        document.getElementById('rat').value = config.custosEmpresa.rat;
        document.getElementById('terceiros').value = config.custosEmpresa.terceiros;
        document.getElementById('percentualIncidencias').value = config.custosEmpresa.percentualIncidencias;
        document.getElementById('adicionalFerias').value = config.custosEmpresa.adicionalFerias;
        
        // FGTS por tipo
        document.getElementById('fgtsCltNormal').value = config.custosEmpresa.fgts.clt_normal;
        document.getElementById('fgtsAprendiz').value = config.custosEmpresa.fgts.aprendiz;
        document.getElementById('fgtsEstagiario').value = config.custosEmpresa.fgts.estagiario;
        document.getElementById('fgtsPj').value = config.custosEmpresa.fgts.pj;
        
    } catch (error) {
        console.error('Erro ao carregar configurações de custos empresariais:', error);
    }
}

// Salvar configurações de custos empresariais
function saveCustosEmpresaConfigs() {
    try {
        const config = loadConfig();
        
        // Percentuais comuns
        config.custosEmpresa.inssEmpresa = parseFloat(document.getElementById('inssEmpresa').value) || 20.0;
        config.custosEmpresa.rat = parseFloat(document.getElementById('rat').value) || 3.0;
        config.custosEmpresa.terceiros = parseFloat(document.getElementById('terceiros').value) || 5.8;
        config.custosEmpresa.percentualIncidencias = parseFloat(document.getElementById('percentualIncidencias').value) || 36.8;
        config.custosEmpresa.adicionalFerias = parseFloat(document.getElementById('adicionalFerias').value) || 33.33;
        
        // FGTS por tipo
        config.custosEmpresa.fgts.clt_normal = parseFloat(document.getElementById('fgtsCltNormal').value) || 8.0;
        config.custosEmpresa.fgts.aprendiz = parseFloat(document.getElementById('fgtsAprendiz').value) || 2.0;
        config.custosEmpresa.fgts.estagiario = parseFloat(document.getElementById('fgtsEstagiario').value) || 0.0;
        config.custosEmpresa.fgts.pj = parseFloat(document.getElementById('fgtsPj').value) || 0.0;
        
        if (saveConfig(config)) {
            showMessage('success', 'Configurações de custos empresariais salvas com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao salvar configurações de custos empresariais:', error);
        showMessage('error', 'Erro ao salvar configurações de custos empresariais!');
    }
}

// Restaurar configurações padrão de custos empresariais
function restoreDefaultCustosEmpresaConfigs() {
    try {
        const config = loadConfig();
        config.custosEmpresa = DEFAULT_CONFIG.custosEmpresa;
        
        if (saveConfig(config)) {
            loadCustosEmpresaConfigs();
            showMessage('success', 'Configurações de custos empresariais restauradas para o padrão!');
        }
    } catch (error) {
        console.error('Erro ao restaurar configurações de custos empresariais:', error);
        showMessage('error', 'Erro ao restaurar configurações de custos empresariais!');
    }
} 