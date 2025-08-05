// Função para carregar e aplicar valores dinâmicos nas páginas
function loadDynamicValues() {
    try {
        const config = loadTaxConfig();
        
        // Atualizar percentual de adicional de transferência
        const labelsAdicional = document.querySelectorAll('label[for="adicional"]');
        labelsAdicional.forEach(label => {
            label.textContent = `Adicional de Transferência (${config.adicionais.percentualAdicionalTransferencia}% sobre o salário bruto):`;
        });
        
        // Atualizar opções de diária de viagem
        const diariaContainer = document.getElementById('diaria');
        if (diariaContainer) {
            diariaContainer.innerHTML = '';
            
            config.adicionais.diariasViagem.forEach((valor, index) => {
                const label = document.createElement('label');
                label.innerHTML = `<input type='radio' name='diaria' value='${valor}'> R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                diariaContainer.appendChild(label);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar valores dinâmicos:', error);
        // Se houver erro, manter os valores padrão
    }
}

// Função para obter o percentual de adicional de transferência
function getPercentualAdicionalTransferencia() {
    try {
        const config = loadTaxConfig();
        return config.adicionais.percentualAdicionalTransferencia / 100; // Retorna como decimal
    } catch (error) {
        console.error('Erro ao obter percentual de adicional:', error);
        return 0.25; // Valor padrão apenas em caso de erro crítico
    }
}

// Função para obter as diárias de viagem
function getDiariasViagem() {
    try {
        const config = loadTaxConfig();
        return config.adicionais.diariasViagem;
    } catch (error) {
        console.error('Erro ao obter diárias de viagem:', error);
        return [0, 708.93, 954.00, 1883.09, 2990.79]; // Valores padrão
    }
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    loadDynamicValues();
}); 