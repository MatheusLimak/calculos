// Configurações centralizadas do sistema
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
        valorMaximoINSS: 951.62
    },
    adicionais: {
        percentualAdicionalTransferencia: 25.0,
        diariasViagem: [0, 708.93, 954.00, 1883.09, 2990.79]
    }
};

// Função para validar entrada numérica
function validateNumericInput(value, min = 0, max = Infinity, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    
    // Converter vírgula para ponto e remover espaços
    const cleanValue = String(value).replace(',', '.').trim();
    const num = parseFloat(cleanValue);
    
    if (isNaN(num)) {
        console.warn(`Valor inválido: ${value}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    if (num < min || num > max) {
        console.warn(`Valor fora do range [${min}, ${max}]: ${num}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    return num;
}

// Função para mostrar mensagens de erro ao usuário
function showUserMessage(message, type = 'error') {
    try {
        // Tentar mostrar em um elemento de mensagem se existir
        const messageElement = document.getElementById('userMessage') || 
                              document.getElementById('errorMessage') || 
                              document.getElementById('successMessage');
        
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            messageElement.className = type === 'error' ? 'error-message' : 'success-message';
            
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        } else {
            // Fallback para alert se não houver elemento de mensagem
            if (type === 'error') {
                alert(`Erro: ${message}`);
            }
        }
    } catch (error) {
        console.error('Erro ao mostrar mensagem:', error);
        // Fallback final
        if (type === 'error') {
            alert(`Erro: ${message}`);
        }
    }
}

// Função para carregar configurações de impostos
function loadTaxConfig() {
    try {
        // Tentar carregar do localStorage (painel admin)
        const savedIRRF = localStorage.getItem('irrfConfig');
        const savedINSS = localStorage.getItem('inssConfig');
        const savedPLR = localStorage.getItem('plrConfig');
        const savedPJ = localStorage.getItem('pjConfig');
        const savedOther = localStorage.getItem('otherConfig');
        const savedAdicionais = localStorage.getItem('adicionaisConfig');
        const savedCustosEmpresa = localStorage.getItem('custosEmpresaConfig');
        
        if (savedIRRF && savedINSS && savedPLR && savedPJ && savedOther && savedAdicionais && savedCustosEmpresa) {
            return {
                irrf: JSON.parse(savedIRRF),
                inss: JSON.parse(savedINSS),
                plr: JSON.parse(savedPLR),
                pj: JSON.parse(savedPJ),
                other: JSON.parse(savedOther),
                adicionais: JSON.parse(savedAdicionais),
                custosEmpresa: JSON.parse(savedCustosEmpresa)
            };
        }
    } catch (error) {
        console.error('Erro ao carregar configurações do localStorage:', error);
    }
    
    // Configurações padrão (fallback)
    return {
        irrf: [
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
            { limite: 9922.28, aliquota: 0.075, deducao: 573.06 },
            { limite: 13167.00, aliquota: 0.15, deducao: 1317.23 },
            { limite: 16380.38, aliquota: 0.225, deducao: 2304.76 },
            { limite: Infinity, aliquota: 0.275, deducao: 3123.78 }
        ],
        pj: [
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
            inssEmpresa: 20.0,
            rat: 3.0,
            terceiros: 5.8,
            percentualIncidencias: 36.8,
            adicionalFerias: 33.33,
            fgts: {
                clt_normal: 8.0,
                aprendiz: 2.0,
                estagiario: 0.0,
                pj: 0.0
            }
        }
    };
}

// Função para validar configurações antes de salvar
function validateConfig(config) {
    try {
        if (!config || typeof config !== 'object') {
            return false;
        }
        
        // Validar arrays obrigatórios
        const requiredArrays = ['irrf', 'inss', 'plr', 'pj'];
        for (const key of requiredArrays) {
            if (!Array.isArray(config[key]) || config[key].length === 0) {
                console.error(`Configuração inválida: ${key} não é um array válido`);
                return false;
            }
        }
        
        // Validar objetos obrigatórios
        const requiredObjects = ['other', 'adicionais'];
        for (const key of requiredObjects) {
            if (!config[key] || typeof config[key] !== 'object') {
                console.error(`Configuração inválida: ${key} não é um objeto válido`);
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao validar configuração:', error);
        return false;
    }
} 