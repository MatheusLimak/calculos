// Validador de entrada para o sistema de calculadora
class InputValidator {
    
    // Validar entrada numérica com range e valor padrão
    static validateNumber(value, options = {}) {
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
    
    // Validar salário bruto
    static validateSalary(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 1000000,
            defaultValue: 0,
            allowNegative: false,
            allowZero: false,
            fieldName: 'salário bruto'
        });
    }
    
    // Validar diária de viagem
    static validateDailyAllowance(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 10000,
            defaultValue: 0,
            allowNegative: false,
            allowZero: true,
            fieldName: 'diária de viagem'
        });
    }
    
    // Validar valores tributáveis
    static validateTaxableValues(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 100000,
            defaultValue: 0,
            allowNegative: false,
            allowZero: true,
            fieldName: 'valores tributáveis'
        });
    }
    
    // Validar valores não tributáveis
    static validateNonTaxableValues(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 100000,
            defaultValue: 0,
            allowNegative: false,
            allowZero: true,
            fieldName: 'valores não tributáveis'
        });
    }
    
    // Validar número de dependentes
    static validateDependents(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 20,
            defaultValue: 0,
            allowNegative: false,
            allowZero: true,
            fieldName: 'número de dependentes'
        });
    }
    
    // Validar percentual
    static validatePercentage(value) {
        return this.validateNumber(value, {
            min: 0,
            max: 100,
            defaultValue: 0,
            allowNegative: false,
            allowZero: true,
            fieldName: 'percentual'
        });
    }
    
    // Validar seleção de radio button
    static validateRadioSelection(name) {
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
    
    // Validar checkbox
    static validateCheckbox(id) {
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
    
    // Validar elemento DOM existe
    static validateElement(id) {
        try {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`Elemento ${id} não encontrado no DOM`);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Erro ao validar elemento ${id}:`, error);
            return false;
        }
    }
    
    // Validar todos os campos de entrada de uma vez
    static validateAllInputs() {
        const errors = [];
        
        try {
            // Validar salário bruto
            const salaryElement = document.getElementById('salario');
            if (salaryElement) {
                const salary = this.validateSalary(salaryElement.value);
                if (salary === 0) {
                    errors.push('Salário bruto é obrigatório e deve ser maior que zero');
                }
            }
            
            // Validar diária de viagem
            const dailyAllowance = this.validateRadioSelection('diaria');
            if (dailyAllowance === null) {
                errors.push('Selecione uma opção de diária de viagem');
            }
            
            // Validar valores tributáveis
            const taxableElement = document.getElementById('tributaveis');
            if (taxableElement) {
                this.validateTaxableValues(taxableElement.value);
            }
            
            // Validar valores não tributáveis
            const nonTaxableElement = document.getElementById('naoTributaveis');
            if (nonTaxableElement) {
                this.validateNonTaxableValues(nonTaxableElement.value);
            }
            
            // Validar adicional de transferência
            const additionalElement = document.getElementById('adicional');
            if (additionalElement) {
                this.validateCheckbox('adicional');
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
    
    // Formatar número para exibição
    static formatCurrency(value) {
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
    
    // Formatar percentual para exibição
    static formatPercentage(value) {
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
}

// Função global para validação rápida
function validateInput(value, type = 'number', options = {}) {
    switch (type) {
        case 'salary':
            return InputValidator.validateSalary(value);
        case 'daily':
            return InputValidator.validateDailyAllowance(value);
        case 'taxable':
            return InputValidator.validateTaxableValues(value);
        case 'nonTaxable':
            return InputValidator.validateNonTaxableValues(value);
        case 'dependents':
            return InputValidator.validateDependents(value);
        case 'percentage':
            return InputValidator.validatePercentage(value);
        default:
            return InputValidator.validateNumber(value, options);
    }
} 