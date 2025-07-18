// Novo cálculo: encontrar salário bruto para atingir líquido desejado + valor X
// Requer que as funções de cálculo já existentes estejam disponíveis (ex: calcularINSS, calcularIRRF, etc.)

/**
 * Calcula o salário bruto necessário para atingir um líquido desejado (líquido base + ajusteExtra)
 * @param {Object} params - Parâmetros do cálculo
 * @param {number} params.salarioBrutoBase - Salário bruto inicial
 * @param {number} params.ajusteExtra - Valor extra a ser adicionado ao líquido
 * @param {string} params.tipoEmpregado - Tipo de empregado (clt_normal, aprendiz, estagiario, pj)
 * @param {number} params.diaria - Valor de diária
 * @param {boolean} params.adicionalTransferencia - Se há adicional de transferência
 * @param {number} params.tributaveis - Outros valores tributáveis
 * @param {number} params.naoTributaveis - Outros valores não tributáveis
 * @param {number} params.dependentes - Número de dependentes
 * @param {function} calcularLiquido - Função que retorna o líquido a partir do bruto e demais parâmetros
 * @returns {Object} - { salarioBrutoSugerido, liquidoAlvo, liquidoFinal, iteracoes }
 */
function calcularSalarioBrutoParaLiquidoAjustado(params, calcularLiquido) {
  const {
    salarioBrutoBase,
    ajusteExtra,
    tipoEmpregado,
    diaria = 0,
    adicionalTransferencia = false,
    tributaveis = 0,
    naoTributaveis = 0,
    dependentes = 0
  } = params;

  // Primeiro, calcula o líquido base
  const liquidoBase = calcularLiquido({
    salario: salarioBrutoBase,
    tipoEmpregado,
    diaria,
    adicionalTransferencia,
    tributaveis,
    naoTributaveis,
    dependentes
  });

  const liquidoAlvo = liquidoBase + ajusteExtra;
  let salarioBrutoSugerido = salarioBrutoBase;
  let liquidoFinal = liquidoBase;
  let iteracoes = 0;
  const maxIteracoes = 100;
  const tolerancia = 0.01; // R$ 0,01 de diferença

  // Estratégia: aumenta ou diminui o bruto até chegar no líquido alvo
  while (Math.abs(liquidoFinal - liquidoAlvo) > tolerancia && iteracoes < maxIteracoes) {
    iteracoes++;
    // Ajusta o bruto: se o líquido está abaixo, aumenta; se está acima, diminui
    if (liquidoFinal < liquidoAlvo) {
      salarioBrutoSugerido += Math.max(1, (liquidoAlvo - liquidoFinal) * 1.2); // passo adaptativo
    } else {
      salarioBrutoSugerido -= Math.max(1, (liquidoFinal - liquidoAlvo) * 0.8);
    }
    // Recalcula o líquido
    liquidoFinal = calcularLiquido({
      salario: salarioBrutoSugerido,
      tipoEmpregado,
      diaria,
      adicionalTransferencia,
      tributaveis,
      naoTributaveis,
      dependentes
    });
    // Log para depuração
    if (typeof window !== 'undefined' && window.console) {
      console.log(`[Ajuste] Iteração ${iteracoes}: Bruto=${salarioBrutoSugerido}, Líquido=${liquidoFinal}, Alvo=${liquidoAlvo}`);
    }
  }

  if (Math.abs(liquidoFinal - liquidoAlvo) > tolerancia) {
    // Não convergiu
    if (typeof window !== 'undefined' && window.console) {
      console.error('Não foi possível encontrar um salário bruto que atinja o líquido desejado. Último bruto:', salarioBrutoSugerido, 'Último líquido:', liquidoFinal, 'Alvo:', liquidoAlvo);
    }
    return {
      erro: true,
      mensagem: 'Não foi possível encontrar um salário bruto que atinja o líquido desejado. Tente ajustar os valores ou verifique os parâmetros.',
      salarioBrutoSugerido: salarioBrutoSugerido,
      liquidoAlvo: liquidoAlvo,
      liquidoFinal: liquidoFinal,
      iteracoes: iteracoes
    };
  }

  return {
    salarioBrutoSugerido: Math.round(salarioBrutoSugerido * 100) / 100,
    liquidoAlvo: Math.round(liquidoAlvo * 100) / 100,
    liquidoFinal: Math.round(liquidoFinal * 100) / 100,
    iteracoes
  };
}

// Exemplo de uso:
// importar as funções de cálculo já existentes do seu projeto e passar como calcularLiquido
// Exemplo:
// const resultado = calcularSalarioBrutoParaLiquidoAjustado({
//   salarioBrutoBase: 5000,
//   ajusteExtra: 500,
//   tipoEmpregado: 'clt_normal',
//   diaria: 0,
//   adicionalTransferencia: false,
//   tributaveis: 0,
//   naoTributaveis: 0,
//   dependentes: 0
// }, calcularLiquidoDoProjeto);

// module.exports = calcularSalarioBrutoParaLiquidoAjustado; // Se for usar em ambiente de módulos 