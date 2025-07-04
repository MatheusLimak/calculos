// Arquivo de distribuição de benefício

// Variáveis globais para armazenar os valores originais
let valoresOriginais = {
  salarioPJ: 0,
  liquidoPJAnual: 0,
  custoPJAnual: 0,
  beneficioAnual: 0
};

// Função para mostrar a seção de distribuição quando há benefício positivo
function mostrarDistribuicaoBeneficio(beneficio) {
  console.log('=== FUNÇÃO MOSTRAR DISTRIBUIÇÃO BENEFÍCIO ===');
  console.log('Benefício recebido:', beneficio);
  console.log('Tipo do benefício:', typeof beneficio);
  
  if (beneficio > 0) {
    console.log('Benefício é positivo, armazenando valores originais...');
    
    try {
      // Armazenar valores originais
      const salarioPJElement = document.getElementById('SALARIOPJ');
      const liquidoPJElement = document.getElementById('LIQUIDOTOTALPJ');
      const custoPJElement = document.getElementById('CUSTOPJ');
      
      console.log('Elementos encontrados:', {
        salarioPJ: salarioPJElement,
        liquidoPJ: liquidoPJElement,
        custoPJ: custoPJElement
      });
      
      if (!salarioPJElement || !liquidoPJElement || !custoPJElement) {
        console.error('ERRO: Elementos não encontrados');
        return;
      }
      
      valoresOriginais.salarioPJ = parseFloat(salarioPJElement.textContent.replace(/\./g, '').replace(',', '.'));
      valoresOriginais.liquidoPJAnual = parseFloat(liquidoPJElement.textContent.replace(/\./g, '').replace(',', '.'));
      valoresOriginais.custoPJAnual = parseFloat(custoPJElement.textContent.replace(/\./g, '').replace(',', '.'));
      valoresOriginais.beneficioAnual = beneficio;

      console.log('Valores originais armazenados:', valoresOriginais);
      
      // Verificar se os valores são válidos
      if (isNaN(valoresOriginais.salarioPJ) || isNaN(valoresOriginais.liquidoPJAnual)) {
        console.error('ERRO: Valores originais são NaN');
        return;
      }

      // Mostrar a seção de distribuição
      const secaoDistribuicao = document.getElementById('distribuicao-beneficio');
      if (secaoDistribuicao) {
        secaoDistribuicao.style.display = 'block';
        console.log('Seção de distribuição exibida');
      } else {
        console.error('ERRO: Seção de distribuição não encontrada');
      }
      
      const valorBeneficioElement = document.getElementById('valor-beneficio');
      if (valorBeneficioElement) {
        valorBeneficioElement.textContent = beneficio.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
        console.log('Valor do benefício exibido');
      }

      // Configurar event listeners
      console.log('Configurando event listeners...');
      configurarEventListeners();
      console.log('Event listeners configurados');
      
    } catch (error) {
      console.error('ERRO ao mostrar distribuição:', error);
    }
  } else {
    console.log('Benefício não é positivo, ocultando seção');
    // Ocultar a seção se não há benefício
    const secaoDistribuicao = document.getElementById('distribuicao-beneficio');
    if (secaoDistribuicao) {
      secaoDistribuicao.style.display = 'none';
    }
  }
}

// Função para configurar os event listeners
function configurarEventListeners() {
  // Botão "Sim, distribuir"
  document.getElementById('btn-distribuir-sim').addEventListener('click', function() {
    document.getElementById('opcoes-distribuicao').style.display = 'block';
  });

  // Botão "Não, manter como está"
  document.getElementById('btn-distribuir-nao').addEventListener('click', function() {
    document.getElementById('distribuicao-beneficio').style.display = 'none';
  });

  // Botão "Calcular Distribuição"
  document.getElementById('btn-calcular-distribuicao').addEventListener('click', calcularDistribuicao);

  // Botão "Aplicar Distribuição"
  document.getElementById('btn-aplicar-distribuicao').addEventListener('click', aplicarDistribuicao);

  // Botão "Cancelar"
  document.getElementById('btn-cancelar-distribuicao').addEventListener('click', function() {
    document.getElementById('opcoes-distribuicao').style.display = 'none';
    document.getElementById('resultado-distribuicao').style.display = 'none';
  });
}

// Função para calcular a distribuição usando loop while
function calcularDistribuicao() {
  console.log('=== FUNÇÃO CALCULAR DISTRIBUIÇÃO INICIADA ===');
  
  try {
    const percentual = parseFloat(document.getElementById('percentual-distribuicao').value);
    console.log('Percentual selecionado:', percentual);
    
    if (isNaN(percentual) || percentual <= 0) {
      console.error('Percentual inválido:', percentual);
      alert('Percentual inválido selecionado');
      return;
    }

    console.log('Valores originais antes do cálculo:', valoresOriginais);
    
    if (!valoresOriginais.beneficioAnual || valoresOriginais.beneficioAnual <= 0) {
      console.error('Benefício original inválido:', valoresOriginais.beneficioAnual);
      alert('Benefício original inválido');
      return;
    }

    const valorDistribuirAnual = valoresOriginais.beneficioAnual * (percentual / 100);
    const valorDistribuirMensal = valorDistribuirAnual / 12;

    console.log('=== DEBUG DISTRIBUIÇÃO ===');
    console.log('Percentual selecionado:', percentual + '%');
    console.log('Benefício original:', valoresOriginais.beneficioAnual);
    console.log('Valor a distribuir anual:', valorDistribuirAnual);
    console.log('Valor a distribuir mensal:', valorDistribuirMensal);
    console.log('Salário PJ original:', valoresOriginais.salarioPJ);
    console.log('Líquido PJ original:', valoresOriginais.liquidoPJAnual);

    // Mostrar valores a distribuir
    document.getElementById('valor-distribuir').textContent = valorDistribuirAnual.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    document.getElementById('valor-distribuir-mensal').textContent = valorDistribuirMensal.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

    console.log('=== CHAMANDO FUNÇÃO DE CÁLCULO ===');
    
    // Calcular novos valores usando loop while para distribuir o valor
    const novosValores = calcularNovosValoresComDistribuicao(valorDistribuirAnual);

    console.log('=== RESULTADO DA FUNÇÃO DE CÁLCULO ===');
    console.log('Novos valores retornados:', novosValores);

    if (!novosValores) {
      console.error('ERRO: Não foi possível calcular a distribuição');
      alert('Erro ao calcular a distribuição. Verifique o console para mais detalhes.');
      return;
    }

    console.log('=== RESULTADO DO CÁLCULO ===');
    console.log('Novo salário PJ:', novosValores.novoSalarioPJ);
    console.log('Novo líquido PJ:', novosValores.novoLiquidoPJ);
    console.log('Novo benefício:', novosValores.novoBeneficio);
    console.log('Nova receita anual:', novosValores.novaReceitaAnual);

    // Verificar se os valores são válidos
    if (isNaN(novosValores.novoSalarioPJ) || isNaN(novosValores.novoLiquidoPJ)) {
      console.error('ERRO: Valores calculados são NaN');
      alert('Erro: Valores calculados são inválidos');
      return;
    }

    // Mostrar novos valores
    document.getElementById('novo-salario-pj').textContent = novosValores.novoSalarioPJ.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    document.getElementById('novo-liquido-pj').textContent = novosValores.novoLiquidoPJ.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    document.getElementById('novo-beneficio').textContent = novosValores.novoBeneficio.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

    console.log('=== MOSTRANDO RESULTADO ===');
    
    // Mostrar resultado
    document.getElementById('resultado-distribuicao').style.display = 'block';
    
    console.log('=== FUNÇÃO CALCULAR DISTRIBUIÇÃO FINALIZADA COM SUCESSO ===');
    
  } catch (error) {
    console.error('ERRO na função calcularDistribuicao:', error);
    console.error('Stack trace:', error.stack);
    alert('Erro inesperado ao calcular distribuição. Verifique o console para mais detalhes.');
  }
}

// Função principal que usa loop while para distribuir o benefício
function calcularNovosValoresComDistribuicao(valorDistribuirAnual) {
  console.log('=== INÍCIO DA FUNÇÃO ===');
  console.log('Valor a distribuir anual:', valorDistribuirAnual);
  console.log('Valores originais:', valoresOriginais);

  try {
    // Verificar se a função loadTaxConfig está disponível
    if (typeof loadTaxConfig !== 'function') {
      console.error('ERRO: loadTaxConfig não está disponível');
      return null;
    }

    console.log('loadTaxConfig encontrada, carregando configuração...');
    const config = loadTaxConfig();
    console.log('Configuração carregada:', config);

    if (!config) {
      console.error('ERRO: Não foi possível carregar a configuração');
      return null;
    }

    // Verificar se as faixas PJ existem
    if (!config.pj || config.pj.length === 0) {
      console.error('ERRO: Não há faixas PJ configuradas');
      console.log('Config PJ:', config.pj);
      return null;
    }

    console.log('Faixas PJ encontradas:', config.pj.length);

    // Valores básicos
    const basetetoinss = config.other?.tetoINSS || 7087.22;
    const insscontribuicaoindividual = basetetoinss * 0.2;
    const custocontador = config.other?.custoContador || 450.00;
    const custocontadoranual = custocontador * 12;
    const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;

    console.log('Valores básicos calculados:', {
      basetetoinss,
      insscontribuicaoindividual,
      custocontador,
      custocontadoranual,
      insscontribuicaoindividualanual
    });

    // Obter valores atuais
    const salarioPJAtual = valoresOriginais.salarioPJ;
    const liquidoPJOriginal = valoresOriginais.liquidoPJAnual;
    
    console.log('Valores atuais:', {
      salarioPJAtual,
      liquidoPJOriginal
    });

    // Obter valores dos inputs
    const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
    const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
    const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
    const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;
    const percentualAdicional = config.adicionais?.percentualAdicionalTransferencia / 100;

    console.log('Valores dos inputs:', {
      diaria,
      adicionalTransferencia,
      tributaveis,
      naoTributaveis,
      percentualAdicional
    });

    console.log('=== INÍCIO DO LOOP ===');

    // Loop while simples: aumentar salário PJ até o líquido PJ aumentar o valor desejado
    let novoSalarioPJ = salarioPJAtual;
    let liquidoPJAtual = liquidoPJOriginal;
    let tentativas = 0;
    const maxTentativas = 20; // Reduzido para debug
    const precisao = 1.0; // Aumentado para debug

    while (Math.abs(liquidoPJAtual - liquidoPJOriginal - valorDistribuirAnual) > precisao && tentativas < maxTentativas) {
      tentativas++;

      console.log(`\n--- Tentativa ${tentativas} ---`);
      console.log('Salário PJ atual:', novoSalarioPJ);

      // Calcular receita com o novo salário
      const adicionalPJ = adicionalTransferencia ? novoSalarioPJ * percentualAdicional : 0;
      const receitaMensal = novoSalarioPJ + adicionalPJ + diaria + tributaveis + naoTributaveis;
      const FeriasPJ = novoSalarioPJ + adicionalPJ;
      const receitaAnual = (receitaMensal * 11) + FeriasPJ;

      console.log('Receita calculada:', {
        adicionalPJ,
        receitaMensal,
        FeriasPJ,
        receitaAnual
      });

      // Calcular impostos PJ
      const faixaAplicada = config.pj.find(f => receitaAnual <= f.limite) || config.pj[config.pj.length - 1];
      console.log('Faixa aplicada:', faixaAplicada);

      const impostoPJ = (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao;
      liquidoPJAtual = receitaAnual - impostoPJ - insscontribuicaoindividualanual - custocontadoranual;

      console.log('Impostos e líquido:', {
        impostoPJ,
        liquidoPJAtual
      });

      // Calcular quanto já foi distribuído
      const valorDistribuido = liquidoPJAtual - liquidoPJOriginal;
      const diferenca = valorDistribuirAnual - valorDistribuido;

      console.log('Distribuição:', {
        valorDistribuido,
        diferenca,
        meta: valorDistribuirAnual
      });

      // Ajustar o salário baseado na diferença
      if (diferenca > 0) {
        // Precisa distribuir mais - aumentar salário
        novoSalarioPJ += diferenca / 12;
        console.log('Aumentando salário para:', novoSalarioPJ);
      } else if (diferenca < 0) {
        // Distribuiu demais - diminuir salário
        novoSalarioPJ += diferenca / 12;
        console.log('Diminuindo salário para:', novoSalarioPJ);
      }
    }

    console.log(`\n=== LOOP FINALIZADO ===`);
    console.log(`Tentativas: ${tentativas}`);
    console.log(`Valor distribuído final: ${(liquidoPJAtual - liquidoPJOriginal).toFixed(2)} vs Meta: ${valorDistribuirAnual.toFixed(2)}`);

    // Calcular valores finais
    const adicionalPJFinal = adicionalTransferencia ? novoSalarioPJ * percentualAdicional : 0;
    const receitaMensalFinal = novoSalarioPJ + adicionalPJFinal + diaria + tributaveis + naoTributaveis;
    const FeriasPJFinal = novoSalarioPJ + adicionalPJFinal;
    const receitaAnualFinal = (receitaMensalFinal * 11) + FeriasPJFinal;

    // Calcular impostos finais
    const faixaAplicadaFinal = config.pj.find(f => receitaAnualFinal <= f.limite) || config.pj[config.pj.length - 1];
    const impostoPJFinal = (receitaAnualFinal * faixaAplicadaFinal.aliquota) - faixaAplicadaFinal.deducao;
    const liquidoPJAnualFinal = receitaAnualFinal - impostoPJFinal - insscontribuicaoindividualanual - custocontadoranual;

    // Calcular novo benefício
    const custoCLTAnual = parseFloat(document.getElementById('CUSTOCLT').textContent.replace(/\./g, '').replace(',', '.'));
    const novoBeneficio = custoCLTAnual - receitaAnualFinal;

    const resultado = {
      novoSalarioPJ: novoSalarioPJ,
      novoLiquidoPJ: liquidoPJAnualFinal,
      novoBeneficio: novoBeneficio,
      novaReceitaAnual: receitaAnualFinal
    };

    console.log('=== RESULTADO FINAL ===');
    console.log(resultado);

    return resultado;

  } catch (error) {
    console.error('ERRO na função calcularNovosValoresComDistribuicao:', error);
    console.error('Stack trace:', error.stack);
    return null;
  }
}

// Função para aplicar a distribuição
function aplicarDistribuicao() {
  const percentual = parseFloat(document.getElementById('percentual-distribuicao').value);
  const valorDistribuirAnual = valoresOriginais.beneficioAnual * (percentual / 100);
  const novosValores = calcularNovosValoresComDistribuicao(valorDistribuirAnual);

  // Atualizar os valores na interface
  document.getElementById('SALARIOPJ').textContent = novosValores.novoSalarioPJ.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('LIQUIDOTOTALPJ').textContent = novosValores.novoLiquidoPJ.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('CUSTOPJ').textContent = novosValores.novaReceitaAnual.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('VANTAGEMECONOMICACUSTO').textContent = novosValores.novoBeneficio.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  // Atualizar o placeholder do salário sugerido
  document.getElementById('salario_bruto').placeholder = novosValores.novoSalarioPJ.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  // Recalcular e atualizar os resultados detalhados
  atualizarResultadosDetalhados(novosValores);

  // Ocultar a seção de distribuição
  document.getElementById('distribuicao-beneficio').style.display = 'none';
  document.getElementById('opcoes-distribuicao').style.display = 'none';
  document.getElementById('resultado-distribuicao').style.display = 'none';

  // Mostrar mensagem de sucesso
  alert(`Distribuição de ${percentual}% do benefício aplicada com sucesso!`);
}

// Função para atualizar os resultados detalhados
function atualizarResultadosDetalhados(novosValores) {
  const config = loadTaxConfig();
  const basetetoinss = config.other.tetoINSS;
  const insscontribuicaoindividual = basetetoinss * 0.2;
  const custocontador = config.other.custoContador || 450.00;
  const custocontadoranual = custocontador * 12;
  const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;

  const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
  const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
  const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
  const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;
  const percentualAdicional = config.adicionais.percentualAdicionalTransferencia / 100;

  const adicionalPJ = adicionalTransferencia ? novosValores.novoSalarioPJ * percentualAdicional : 0;
  const receitaMensal = novosValores.novoSalarioPJ + adicionalPJ + diaria + tributaveis + naoTributaveis;
  const FeriasPJ = novosValores.novoSalarioPJ + adicionalPJ;

  // Calcular impostos PJ
  const faixas = config.pj;
  const faixaAplicada = faixas.find(f => novosValores.novaReceitaAnual <= f.limite) || faixas[faixas.length - 1];
  const impostoPJ = (novosValores.novaReceitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao;
  const impostoPJmensal = (impostoPJ / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const liquidoPJmensal = receitaMensal - (insscontribuicaoindividual + custocontador);

  // Atualizar resultado PJ
  document.getElementById('resultadoPJ').innerHTML = `
    <link rel='stylesheet' href='tolls.css'>
    <p class='titleresm'>Proventos</p>
    <p><strong>Salário Bruto</strong> R$ ${(novosValores.novoSalarioPJ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Adicional de Transferência</strong> R$ ${(adicionalPJ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Diária de Viagem</strong> R$ ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Outros Valores:</strong> R$ ${(tributaveis + naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Descontos</p>
    <p><strong>Faixa:</strong> ${faixaAplicada.faixa || 'Faixa Aplicada'}  / <strong>Alíquota:</strong> ${(faixaAplicada.aliquota * 100).toFixed(2)}% / <strong>Dedução:</strong> R$ ${(faixaAplicada.deducao / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Imposto Mensal:</strong> R$ ${(impostoPJmensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Custo Contador Mensal</strong> R$ ${(custocontador).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>INSS Contribuição Individual (TETO)</strong> R$ ${(insscontribuicaoindividual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Custo Empresa</p>
    <p style='text-align: center '><strong>Custo Empresa Mensal</strong> R$ ${receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p style='text-align: center '><strong>Custo Empresa Anual</strong> R$ ${novosValores.novaReceitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Liquido</p>
    <p><strong>Líquido Mensal:</strong> R$ ${liquidoPJmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Líquido Anual:</strong> R$ ${novosValores.novoLiquidoPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  `;
}

// Função para resetar para valores originais
function resetarParaValoresOriginais() {
  document.getElementById('SALARIOPJ').textContent = valoresOriginais.salarioPJ.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('LIQUIDOTOTALPJ').textContent = valoresOriginais.liquidoPJAnual.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('CUSTOPJ').textContent = valoresOriginais.custoPJAnual.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  document.getElementById('VANTAGEMECONOMICACUSTO').textContent = valoresOriginais.beneficioAnual.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}
