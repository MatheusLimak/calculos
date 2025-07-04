// Correções críticas do sistema

// CORREÇÕES CRÍTICAS PARA O SISTEMA
// Este arquivo contém as correções mais importantes identificadas na análise

// 1. VALIDAÇÃO DE ENTRADA ROBUSTA
function validateInputCritical(value, type = 'number', options = {}) {
    const {
        min = 0,
        max = Infinity,
        defaultValue = 0,
        allowNegative = false,
        allowZero = true,
        fieldName = 'campo'
    } = options;
    
    // Se valor é null, undefined ou string vazia
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    
    // Converter para string e limpar
    const cleanValue = String(value).replace(',', '.').trim();
    
    // Se ficou vazio após limpeza
    if (cleanValue === '') {
        return defaultValue;
    }
    
    // Tentar converter para número
    const num = parseFloat(cleanValue);
    
    // Verificar se é NaN
    if (isNaN(num)) {
        console.warn(`Valor inválido para ${fieldName}: "${value}", usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    // Verificar se é negativo (se não permitido)
    if (!allowNegative && num < 0) {
        console.warn(`Valor negativo não permitido para ${fieldName}: ${num}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    // Verificar se é zero (se não permitido)
    if (!allowZero && num === 0) {
        console.warn(`Valor zero não permitido para ${fieldName}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    // Verificar range
    if (num < min || num > max) {
        console.warn(`Valor fora do range [${min}, ${max}] para ${fieldName}: ${num}, usando padrão: ${defaultValue}`);
        return defaultValue;
    }
    
    return num;
}

// 2. FUNÇÃO PARA MOSTRAR MENSAGENS DE ERRO
function showErrorMessage(message, type = 'error') {
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

// 3. VALIDAÇÃO DE SALÁRIO
function validateSalaryCritical(value) {
    return validateInputCritical(value, 'number', {
        min: 0,
        max: 1000000,
        defaultValue: 0,
        allowNegative: false,
        allowZero: false,
        fieldName: 'salário bruto'
    });
}

// 4. VALIDAÇÃO DE DIÁRIA
function validateDailyAllowanceCritical(value) {
    return validateInputCritical(value, 'number', {
        min: 0,
        max: 10000,
        defaultValue: 0,
        allowNegative: false,
        allowZero: true,
        fieldName: 'diária de viagem'
    });
}

// 5. VALIDAÇÃO DE VALORES TRIBUTÁVEIS
function validateTaxableValuesCritical(value) {
    return validateInputCritical(value, 'number', {
        min: 0,
        max: 100000,
        defaultValue: 0,
        allowNegative: false,
        allowZero: true,
        fieldName: 'valores tributáveis'
    });
}

// 6. VALIDAÇÃO DE VALORES NÃO TRIBUTÁVEIS
function validateNonTaxableValuesCritical(value) {
    return validateInputCritical(value, 'number', {
        min: 0,
        max: 100000,
        defaultValue: 0,
        allowNegative: false,
        allowZero: true,
        fieldName: 'valores não tributáveis'
    });
}

// 7. VALIDAÇÃO DE SELEÇÃO DE RADIO BUTTON
function validateRadioSelectionCritical(name) {
    try {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (!selected) {
            console.warn(`Nenhuma opção selecionada para ${name}, usando padrão`);
            return null;
        }
        return selected.value;
    } catch (error) {
        console.error(`Erro ao validar seleção de radio ${name}:`, error);
        return null;
    }
}

// 8. VALIDAÇÃO DE CHECKBOX
function validateCheckboxCritical(id) {
    try {
        const checkbox = document.getElementById(id);
        if (!checkbox) {
            console.warn(`Checkbox ${id} não encontrado`);
            return false;
        }
        return checkbox.checked;
    } catch (error) {
        console.error(`Erro ao validar checkbox ${id}:`, error);
        return false;
    }
}

// 9. VALIDAÇÃO COMPLETA DE TODAS AS ENTRADAS
function validateAllInputsCritical() {
    const errors = [];
    
    try {
        // Validar salário bruto
        const salaryElement = document.getElementById('salario');
        if (salaryElement) {
            const salary = validateSalaryCritical(salaryElement.value);
            if (salary === 0) {
                errors.push('Salário bruto é obrigatório e deve ser maior que zero');
            }
        }
        
        // Validar diária de viagem
        const dailyAllowance = validateRadioSelectionCritical('diaria');
        if (dailyAllowance === null) {
            errors.push('Selecione uma opção de diária de viagem');
        }
        
        // Validar valores tributáveis
        const taxableElement = document.getElementById('tributaveis');
        if (taxableElement) {
            validateTaxableValuesCritical(taxableElement.value);
        }
        
        // Validar valores não tributáveis
        const nonTaxableElement = document.getElementById('naoTributaveis');
        if (nonTaxableElement) {
            validateNonTaxableValuesCritical(nonTaxableElement.value);
        }
        
        // Validar adicional de transferência
        const additionalElement = document.getElementById('adicional');
        if (additionalElement) {
            validateCheckboxCritical('adicional');
        }
        
    } catch (error) {
        console.error('Erro durante validação de entradas:', error);
        errors.push('Erro interno durante validação');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// 10. FUNÇÃO PARA FORMATAR MOEDA
function formatCurrencyCritical(value) {
    try {
        const num = parseFloat(value);
        if (isNaN(num)) return 'R$ 0,00';
        
        return num.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Erro ao formatar moeda:', error);
        return 'R$ 0,00';
    }
}

// 11. FUNÇÃO PARA FORMATAR PERCENTUAL
function formatPercentageCritical(value) {
    try {
        const num = parseFloat(value);
        if (isNaN(num)) return '0,00%';
        
        return num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + '%';
    } catch (error) {
        console.error('Erro ao formatar percentual:', error);
        return '0,00%';
    }
}

// 12. VALIDAÇÃO ROBUSTA DE CONFIGURAÇÕES
function validateConfigCritical(config) {
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

// 13. CARREGAMENTO SEGURO DE CONFIGURAÇÕES
function loadTaxConfigCritical() {
    try {
        // Carregar configurações salvas
        const savedIRRF = localStorage.getItem('irrfConfig');
        const savedINSS = localStorage.getItem('inssConfig');
        const savedPLR = localStorage.getItem('plrConfig');
        const savedPJ = localStorage.getItem('pjConfig');
        const savedOther = localStorage.getItem('otherConfig');
        const savedAdicionais = localStorage.getItem('adicionaisConfig');
        
        // Função para validar e parsear JSON com fallback
        function safeJSONParse(jsonString, defaultValue) {
            try {
                if (!jsonString) return defaultValue;
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : defaultValue;
            } catch (error) {
                console.error('Erro ao parsear JSON:', error);
                return defaultValue;
            }
        }
        
        // Função para validar e parsear objeto JSON com fallback
        function safeObjectParse(jsonString, defaultValue) {
            try {
                if (!jsonString) return defaultValue;
                const parsed = JSON.parse(jsonString);
                return typeof parsed === 'object' && parsed !== null ? parsed : defaultValue;
            } catch (error) {
                console.error('Erro ao parsear objeto JSON:', error);
                return defaultValue;
            }
        }
        
        // Configurações padrão
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
                diariasViagem: [0, 668.80, 900.00, 1776.50, 2821.50]
            }
        };
        
        const config = {
            irrf: safeJSONParse(savedIRRF, DEFAULT_CONFIG.irrf),
            inss: safeJSONParse(savedINSS, DEFAULT_CONFIG.inss),
            plr: safeJSONParse(savedPLR, DEFAULT_CONFIG.plr),
            pj: safeJSONParse(savedPJ, DEFAULT_CONFIG.pj),
            other: safeObjectParse(savedOther, DEFAULT_CONFIG.other),
            adicionais: safeObjectParse(savedAdicionais, DEFAULT_CONFIG.adicionais)
        };
        
        // Validar estrutura das configurações
        if (!validateConfigCritical(config)) {
            console.error('Estrutura de configuração inválida, usando padrões');
            return DEFAULT_CONFIG;
        }
        
        return config;
        
    } catch (error) {
        console.error('Erro crítico ao carregar configurações de impostos:', error);
        showErrorMessage('Erro ao carregar configurações. Usando valores padrão.', 'error');
        
        // Retornar configurações padrão em caso de erro
        return DEFAULT_CONFIG;
    }
}

// 14. FUNÇÃO PARA APLICAR CORREÇÕES EM FUNÇÕES EXISTENTES
function applyCriticalFixes() {
    try {
        // Substituir funções existentes pelas versões corrigidas
        if (typeof window.loadTaxConfig === 'function') {
            window.loadTaxConfig = loadTaxConfigCritical;
        }
        
        if (typeof window.showUserMessage === 'function') {
            window.showUserMessage = showErrorMessage;
        }
        
        console.log('Correções críticas aplicadas com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao aplicar correções críticas:', error);
        return false;
    }
}

// 15. EXECUTAR CORREÇÕES QUANDO O DOM ESTIVER PRONTO
document.addEventListener('DOMContentLoaded', function() {
    applyCriticalFixes();
});

// 16. EXPORTAR FUNÇÕES PARA USO GLOBAL
window.validateInputCritical = validateInputCritical;
window.validateSalaryCritical = validateSalaryCritical;
window.validateDailyAllowanceCritical = validateDailyAllowanceCritical;
window.validateTaxableValuesCritical = validateTaxableValuesCritical;
window.validateNonTaxableValuesCritical = validateNonTaxableValuesCritical;
window.validateRadioSelectionCritical = validateRadioSelectionCritical;
window.validateCheckboxCritical = validateCheckboxCritical;
window.validateAllInputsCritical = validateAllInputsCritical;
window.formatCurrencyCritical = formatCurrencyCritical;
window.formatPercentageCritical = formatPercentageCritical;
window.validateConfigCritical = validateConfigCritical;
window.loadTaxConfigCritical = loadTaxConfigCritical;
window.showErrorMessage = showErrorMessage;
