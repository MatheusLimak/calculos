// Cálculo de Custo de Empregado - Sistema Específico
// Suporta: CLT Normal, Aprendiz, Estagiário

class CalculadoraCustoEmpregado {
  constructor() {
    this.config = loadTaxConfig();
    this.tiposEmpregado = {
      CLT_NORMAL: 'clt_normal',
      APRENDIZ: 'aprendiz', 
      ESTAGIARIO: 'estagiario',
      PJ: 'pj'
    };
  }

  // Configurações específicas por tipo de empregado
  getConfiguracaoTipo(tipo) {
    const configs = {
      [this.tiposEmpregado.CLT_NORMAL]: {
        inssEmpresa: this.config.custosEmpresa.inssEmpresa / 100, // Dinâmico do painel admin
        rat: this.config.custosEmpresa.rat / 100, // Dinâmico do painel admin
        fgts: this.config.custosEmpresa.fgts.clt_normal / 100, // Dinâmico do painel admin
        terceiros: this.config.custosEmpresa.terceiros / 100, // Dinâmico do painel admin
        ferias: true,
        decimoTerceiro: true,
        adicionalFerias: this.config.custosEmpresa.adicionalFerias / 100, // Dinâmico do painel admin
        percentualIncidencias: this.config.custosEmpresa.percentualIncidencias / 100, // Dinâmico do painel admin
        temBaseINSS: true,
        temIRRF: true
      },
      [this.tiposEmpregado.APRENDIZ]: {
        inssEmpresa: this.config.custosEmpresa.inssEmpresa / 100, // Dinâmico do painel admin
        rat: this.config.custosEmpresa.rat / 100, // Dinâmico do painel admin
        fgts: this.config.custosEmpresa.fgts.aprendiz / 100, // Dinâmico do painel admin
        terceiros: this.config.custosEmpresa.terceiros / 100, // Dinâmico do painel admin
        ferias: true,
        decimoTerceiro: true,
        adicionalFerias: this.config.custosEmpresa.adicionalFerias / 100, // Dinâmico do painel admin
        percentualIncidencias: this.config.custosEmpresa.percentualIncidencias / 100, // Dinâmico do painel admin
        temBaseINSS: true,
        temIRRF: true
      },
      [this.tiposEmpregado.ESTAGIARIO]: {
        inssEmpresa: 0.00, // Não há INSS empresa
        rat: 0.00, // Não há RAT
        fgts: this.config.custosEmpresa.fgts.estagiario / 100, // Dinâmico do painel admin
        terceiros: 0.00, // Não há terceiros
        ferias: false,
        decimoTerceiro: false,
        adicionalFerias: 0.00,
        percentualIncidencias: 0.00,
        descontoINSS: 0.00, // Não há desconto INSS
        temBaseINSS: false, // Estagiário não tem base de INSS
        temIRRF: true // Estagiário tem IRRF
      },
      [this.tiposEmpregado.PJ]: {
        inssEmpresa: 0.00, // PJ não tem INSS empresa
        rat: 0.00, // PJ não tem RAT
        fgts: this.config.custosEmpresa.fgts.pj / 100, // Dinâmico do painel admin
        terceiros: 0.00, // PJ não tem terceiros
        ferias: false,
        decimoTerceiro: false,
        adicionalFerias: 0.00,
        percentualIncidencias: 0.00,
        temBaseINSS: false, // PJ não tem base de INSS
        temIRRF: false, // PJ não tem IRRF
        custoContador: this.config.other.custoContador, // Dinâmico do painel admin
        inssContribuicaoIndividual: 0.20 // 20% sobre teto do INSS (valor fixo da legislação)
      }
    };
    
    return configs[tipo] || configs[this.tiposEmpregado.CLT_NORMAL];
  }

  // Calcular custo total do empregado
  calcularCustoEmpregado(dados) {
    const {
      salario,
      tipoEmpregado,
      diaria = 0,
      adicionalTransferencia = false,
      tributaveis = 0,
      naoTributaveis = 0,
      dependentes = 0
    } = dados;

    // Se for PJ, usar cálculo específico
    if (tipoEmpregado === this.tiposEmpregado.PJ) {
      return this.calcularCustoPJ(dados);
    }

    const configTipo = this.getConfiguracaoTipo(tipoEmpregado);
    
    // Cálculo do adicional de transferência
    const percentualAdicional = this.config.adicionais.percentualAdicionalTransferencia / 100;
    const adicional = adicionalTransferencia ? salario * percentualAdicional : 0;
    
    // Base de cálculo - diferenciada por tipo
    const baseInss = configTipo.temBaseINSS ? (salario + adicional + tributaveis) : 0;
    const baseIR = salario + adicional + tributaveis; // Base de IR sempre existe
    const remuneracaoMensal = salario + diaria + tributaveis + naoTributaveis + adicional;
    
    // Descontos do empregado
    const inssMensal = this.calcularINSS(baseInss, tipoEmpregado);
    const irrfMensal = this.calcularIRRF(baseIR, inssMensal, dependentes, tipoEmpregado);
    
    // Custo empresa
    const custosEmpresa = this.calcularCustosEmpresa(baseInss, configTipo);
    
    // Férias e 13º salário
    const custosAdicionais = this.calcularCustosAdicionais(salario, tributaveis, configTipo);
    
    // Líquido do empregado
    const liquidoMensal = remuneracaoMensal - inssMensal - irrfMensal;
    const liquidoAnual = this.calcularLiquidoAnual(liquidoMensal, configTipo);
    
    // Custo total empresa
    const custoMensal = this.calcularCustoMensal(remuneracaoMensal, custosEmpresa);
    const custoAnual = this.calcularCustoAnual(custoMensal, custosAdicionais, configTipo);
    
    return {
      // Dados de entrada
      dadosEntrada: {
        salario,
        tipoEmpregado,
        diaria,
        adicional,
        tributaveis,
        naoTributaveis,
        dependentes
      },
      
      // Descontos empregado
      descontos: {
        inssMensal,
        irrfMensal,
        liquidoMensal,
        liquidoAnual
      },
      
      // Custos empresa
      custosEmpresa: {
        ...custosEmpresa,
        mensal: custoMensal,
        anual: custoAnual
      },
      
      // Custos adicionais
      custosAdicionais,
      
      // Resumo
      resumo: {
        remuneracaoMensal,
        baseInss,
        baseIR,
        configTipo
      }
    };
  }

  // Calcular custo específico para PJ
  calcularCustoPJ(dados) {
    const {
      salario,
      diaria = 0,
      adicionalTransferencia = false,
      tributaveis = 0,
      naoTributaveis = 0
    } = dados;

    const configTipo = this.getConfiguracaoTipo(this.tiposEmpregado.PJ);
    
    // Cálculo do adicional de transferência
    const percentualAdicional = this.config.adicionais.percentualAdicionalTransferencia / 100;
    const adicional = adicionalTransferencia ? salario * percentualAdicional : 0;
    
    // Configurações PJ
    const basetetoinss = this.config.other.tetoINSS;
    const insscontribuicaoindividual = basetetoinss * configTipo.inssContribuicaoIndividual;
    const custocontador = configTipo.custoContador;
    const custocontadoranual = custocontador * 12;
    const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;
    
    // Receitas
    const receitaMensal = salario + adicional + diaria + tributaveis + naoTributaveis;
    const feriasPJ = salario + adicional;
    const receitaAnual = (receitaMensal * 11) + feriasPJ;
    
    // Cálculo do imposto PJ
    const faixas = this.config.pj;
    const faixaAplicada = faixas.find(f => receitaAnual <= f.limite) || faixas[faixas.length - 1];
    const impostoPJ = Math.max(0, (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao);
    const impostoPJmensal = impostoPJ / 12;
    
    // Líquido PJ
    const liquidoPJ = receitaAnual - impostoPJ - insscontribuicaoindividualanual - custocontadoranual;
    const liquidoPJmensal = receitaMensal - impostoPJmensal - insscontribuicaoindividual - custocontador;
    
    // Custo empresa (para PJ, é a própria receita)
    const custoMensal = receitaMensal;
    const custoAnual = receitaAnual;
    
    return {
      // Dados de entrada
      dadosEntrada: {
        salario,
        tipoEmpregado: this.tiposEmpregado.PJ,
        diaria,
        adicional,
        tributaveis,
        naoTributaveis,
        dependentes: 0
      },
      
      // Descontos empregado
      descontos: {
        inssMensal: insscontribuicaoindividual,
        irrfMensal: impostoPJmensal,
        liquidoMensal: liquidoPJmensal,
        liquidoAnual: liquidoPJ
      },
      
      // Custos empresa
      custosEmpresa: {
        inssEmpresa: 0,
        rat: 0,
        fgts: 0,
        terceiros: 0,
        totalMensal: 0,
        mensal: custoMensal,
        anual: custoAnual
      },
      
      // Custos adicionais
      custosAdicionais: {
        ferias: 0,
        decimoTerceiro: 0
      },
      
      // Resumo
      resumo: {
        remuneracaoMensal: receitaMensal,
        baseInss: 0,
        baseIR: receitaMensal,
        configTipo,
        // Dados específicos PJ
        faixaAplicada,
        impostoPJ,
        impostoPJmensal,
        insscontribuicaoindividual,
        custocontador
      }
    };
  }

  // Calcular INSS específico por tipo
  calcularINSS(baseBruta, tipoEmpregado) {
    if (tipoEmpregado === this.tiposEmpregado.ESTAGIARIO || baseBruta <= 0) {
      return 0; // Estagiários não têm desconto de INSS
    }
    
    const faixas = this.config.inss;
    const tetoINSS = this.config.other.tetoINSS;
    const valorMaximoINSS = this.config.other.valorMaximoINSS;
    
    let inss = 0;
    let salarioRestante = baseBruta;
    let limiteAnterior = 0;

    for (const faixa of faixas) {
      if (baseBruta > faixa.limite) {
        inss += (faixa.limite - limiteAnterior) * faixa.aliquota;
        limiteAnterior = faixa.limite;
      } else {
        inss += (baseBruta - limiteAnterior) * faixa.aliquota;
        inss = Math.round(inss * 100) / 100;
        return Math.min(inss, valorMaximoINSS);
      }
    }

    // Se chegou aqui, aplicar o valor máximo
    return valorMaximoINSS;
  }

  // Calcular IRRF específico por tipo
  calcularIRRF(baseBruta, inss, dependentes = 0, tipoEmpregado) {
    const configTipo = this.getConfiguracaoTipo(tipoEmpregado);
    
    if (!configTipo.temIRRF) {
      return 0; // Se não tem IRRF
    }
    
    // Para estagiário, não há dedução de INSS na base de cálculo do IR
    const inssParaIR = configTipo.temBaseINSS ? inss : 0;
    
    const valorPorDependente = this.config.other.valorPorDependente || 189.59;
    const descontoSimplificado = this.config.other.descontoSimplificado || 528.00;
    
    // Base legal: base bruta - INSS - dependentes
    const baseLegal = baseBruta - inssParaIR - (dependentes * valorPorDependente);
    // Base simplificada: base bruta - desconto simplificado
    const baseSimplificada = baseBruta - descontoSimplificado;

    const calcularIR = (base) => {
      if (base <= 0) return 0;
      
      // Verificar se está na faixa isenta (primeira faixa)
      if (base <= this.config.irrf[0].limite) {
        return 0; // Isento
      }
      
      // Usar as faixas configuradas dinamicamente
      for (const faixa of this.config.irrf) {
        if (base <= faixa.limite) {
          return Math.max(0, base * faixa.aliquota - faixa.deducao);
        }
      }
      // Se não encontrar faixa, usar a última
      const ultimaFaixa = this.config.irrf[this.config.irrf.length - 1];
      return Math.max(0, base * ultimaFaixa.aliquota - ultimaFaixa.deducao);
    };

    const irrfLegal = calcularIR(baseLegal);
    const irrfSimplificado = calcularIR(baseSimplificada);

    return Math.min(irrfLegal, irrfSimplificado);
  }

  // Calcular custos da empresa
  calcularCustosEmpresa(baseInss, configTipo) {
    return {
      inssEmpresa: baseInss * configTipo.inssEmpresa,
      rat: baseInss * configTipo.rat,
      fgts: baseInss * configTipo.fgts,
      terceiros: baseInss * configTipo.terceiros,
      totalMensal: baseInss * (configTipo.inssEmpresa + configTipo.rat + configTipo.fgts + configTipo.terceiros)
    };
  }

  // Calcular custos adicionais (férias e 13º)
  calcularCustosAdicionais(salario, tributaveis, configTipo) {
    const custos = {
      ferias: 0,
      decimoTerceiro: 0
    };
    
    if (configTipo.ferias) {
      const custoFerias = (salario + tributaveis) + ((salario + tributaveis) * configTipo.adicionalFerias);
      const incFerias = custoFerias * configTipo.percentualIncidencias;
      custos.ferias = custoFerias + incFerias;
    }
    
    if (configTipo.decimoTerceiro) {
      const custo13o = salario + tributaveis;
      const inc13o = custo13o * configTipo.percentualIncidencias;
      custos.decimoTerceiro = custo13o + inc13o;
    }
    
    return custos;
  }

  // Calcular líquido anual
  calcularLiquidoAnual(liquidoMensal, configTipo) {
    if (configTipo.ferias) {
      return (liquidoMensal * 12) + (liquidoMensal / 3); // 12 meses + 1/3 de férias
    }
    return liquidoMensal * 12;
  }

  // Calcular custo mensal empresa
  calcularCustoMensal(remuneracaoMensal, custosEmpresa) {
    return remuneracaoMensal + custosEmpresa.totalMensal;
  }

  // Calcular custo anual empresa
  calcularCustoAnual(custoMensal, custosAdicionais, configTipo) {
    let custoAnual = custoMensal * 12;
    
    if (configTipo.decimoTerceiro) {
      custoAnual += custosAdicionais.decimoTerceiro;
    }
    
    if (configTipo.ferias) {
      custoAnual += custosAdicionais.ferias;
    }
    
    return custoAnual;
  }

  // Formatar valores para exibição
  formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  // Gerar HTML detalhado do resultado
  gerarHTMLResultado(resultado) {
    const { dadosEntrada, descontos, custosEmpresa, custosAdicionais, resumo } = resultado;
    const configTipo = this.getConfiguracaoTipo(dadosEntrada.tipoEmpregado);
    
    // Se for PJ, usar template específico
    if (dadosEntrada.tipoEmpregado === this.tiposEmpregado.PJ) {
      return this.gerarHTMLResultadoPJ(resultado);
    }
    
    let html = `
      <link rel='stylesheet' href='tolls.css'>
      <p class='titleresm'>Tipo de Empregado: ${this.getNomeTipo(dadosEntrada.tipoEmpregado)}</p>
      <br>
      <p class='titleresm'>Proventos</p>
      <br>
      <p><strong>Salário Bruto:</strong> R$ ${this.formatarMoeda(dadosEntrada.salario)}</p>
      <p><strong>Adicional de Transferência:</strong> R$ ${this.formatarMoeda(dadosEntrada.adicional)}</p>
      <p><strong>Diária de Viagem:</strong> R$ ${this.formatarMoeda(dadosEntrada.diaria)}</p>
      <p><strong>Outros Valores Tributáveis:</strong> R$ ${this.formatarMoeda(dadosEntrada.tributaveis)}</p>
      <p><strong>Outros Valores Não Tributáveis:</strong> R$ ${this.formatarMoeda(dadosEntrada.naoTributaveis)}</p>
      <br>
      <p class='titleresm'>Descontos Empregado</p>
      <br>
    `;
    
    if (configTipo.temBaseINSS) {
      html += `<p><strong>INSS Mensal:</strong> R$ ${this.formatarMoeda(descontos.inssMensal)}</p>`;
    } else {
      html += `<p><strong>INSS Mensal:</strong> R$ 0,00 (Não aplicável)</p>`;
    }
    
    if (configTipo.temIRRF) {
      html += `<p><strong>IRRF Mensal:</strong> R$ ${this.formatarMoeda(descontos.irrfMensal)}</p>`;
    } else {
      html += `<p><strong>IRRF Mensal:</strong> R$ 0,00 (Não aplicável)</p>`;
    }
    
    html += `
      <p><strong>Líquido Mensal:</strong> R$ ${this.formatarMoeda(descontos.liquidoMensal)}</p>
      <p><strong>Líquido Anual:</strong> R$ ${this.formatarMoeda(descontos.liquidoAnual)}</p>
      <br>
      <p class='titleresm'>Custo Empresa</p>
      <br>
    `;
    
    if (configTipo.temBaseINSS) {
      html += `<p><strong>Base de INSS:</strong> R$ ${this.formatarMoeda(resumo.baseInss)}</p>`;
    } else {
      html += `<p><strong>Base de INSS:</strong> R$ 0,00 (Não aplicável)</p>`;
    }
    
    html += `<p><strong>Base de IR:</strong> R$ ${this.formatarMoeda(resumo.baseIR)}</p>`;
    
    if (configTipo.inssEmpresa > 0) {
      html += `<p><strong>INSS Empresa (${(configTipo.inssEmpresa * 100).toFixed(1)}%):</strong> R$ ${this.formatarMoeda(custosEmpresa.inssEmpresa)}</p>`;
    }
    
    if (configTipo.rat > 0) {
      html += `<p><strong>RAT (${(configTipo.rat * 100).toFixed(1)}%):</strong> R$ ${this.formatarMoeda(custosEmpresa.rat)}</p>`;
    }
    
    if (configTipo.fgts > 0) {
      html += `<p><strong>FGTS (${(configTipo.fgts * 100).toFixed(1)}%):</strong> R$ ${this.formatarMoeda(custosEmpresa.fgts)}</p>`;
    }
    
    if (configTipo.terceiros > 0) {
      html += `<p><strong>Terceiros (${(configTipo.terceiros * 100).toFixed(1)}%):</strong> R$ ${this.formatarMoeda(custosEmpresa.terceiros)}</p>`;
    }
    
    if (configTipo.decimoTerceiro) {
      html += `<p><strong>Custo 13º Salário:</strong> R$ ${this.formatarMoeda(custosAdicionais.decimoTerceiro)}</p>`;
    }
    
    if (configTipo.ferias) {
      html += `<p><strong>Custo Férias:</strong> R$ ${this.formatarMoeda(custosAdicionais.ferias)}</p>`;
    }
    
    html += `
      <br>
      <p style='text-align: center'><strong>Custo Empresa Mensal:</strong> R$ ${this.formatarMoeda(custosEmpresa.mensal)}</p>
      <p style='text-align: center'><strong>Custo Empresa Anual:</strong> R$ ${this.formatarMoeda(custosEmpresa.anual)}</p>
    `;
    
    return html;
  }

  // Gerar HTML específico para resultado PJ
  gerarHTMLResultadoPJ(resultado) {
    // Replicar exatamente o template do resultadoPJ do tolls.js
    const { dadosEntrada } = resultado;
    const salario = Number(dadosEntrada.salario) || 0;
    const diaria = Number(dadosEntrada.diaria) || 0;
    const adicionalTransferencia = Number(dadosEntrada.adicional) || 0;
    const tributaveis = Number(dadosEntrada.tributaveis) || 0;
    const naoTributaveis = Number(dadosEntrada.naoTributaveis) || 0;
    const config = loadTaxConfig();
    const basetetoinss = config.other.tetoINSS;
    const insscontribuicaoindividual = basetetoinss * 0.2;
    const custocontador = config.other.custoContador || 450.00;
    const custocontadoranual = custocontador * 12;
    const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;
    const adicional = adicionalTransferencia;
    const receitaMensal = salario + adicional + diaria + tributaveis + naoTributaveis;
    const receitaAnual = receitaMensal * 12;
    const faixas = config.pj.map((faixa, index) => ({
      faixa: `${index + 1}ª Faixa`,
      limite: faixa.limite,
      aliquota: faixa.aliquota,
      deducao: faixa.deducao
    }));
    const faixaAplicada = faixas.find(f => receitaAnual <= f.limite) || faixas[faixas.length - 1];
    const impostoPJ = Math.max(0, (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao);
    const impostoPJmensal = impostoPJ / 12;
    const liquidoPJ = (receitaAnual - impostoPJ) - (insscontribuicaoindividualanual + custocontadoranual);
    const liquidoPJmensal = receitaMensal - impostoPJmensal - insscontribuicaoindividual - custocontador;
    const custoempresapjmensal = receitaMensal;
    const custoempresapjanual = receitaAnual;
    return `
      <link rel='stylesheet' href='tolls.css'>
      <p class= 'titleresm'>Proventos</p>
      <br>
      <p><strong>Salário Bruto</strong> ${salario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Adicional de Transferência</strong> ${adicional.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Diária de Viagem</strong> ${diaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Outros Valores:</strong> R$ ${(tributaveis+naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <br>
      <p class= 'titleresm'>Descontos</p>
      <br>
      <p><strong>Faixa:</strong> ${faixaAplicada.faixa}  / <strong>Alíquota:</strong> ${(faixaAplicada.aliquota * 100).toFixed(2)}% / <strong>Dedução:</strong> R$ ${(faixaAplicada.deducao/12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Imposto Mensal:</strong> R$ ${(impostoPJmensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Custo Contador Mensal</strong> ${custocontador.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>INSS Contribuição Individual (TETO)</strong> ${insscontribuicaoindividual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <br>
      <p class= 'titleresm'>Custo Empresa</p>
      <br>
      <p style='text-align: center '><strong>Custo Empresa Mensal</strong> R$ ${custoempresapjmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p style='text-align: center '><strong>Custo Empresa Anual</strong> R$ ${custoempresapjanual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <br>
      <p class= 'titleresm'>Liquido</p>
      <br>
      <p><strong>Líquido Mensal:</strong> R$ ${liquidoPJmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Líquido Anual:</strong> R$ ${liquidoPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
  }

  // Obter nome do tipo de empregado
  getNomeTipo(tipo) {
    const nomes = {
      [this.tiposEmpregado.CLT_NORMAL]: 'CLT Normal',
      [this.tiposEmpregado.APRENDIZ]: 'CLT Aprendiz',
      [this.tiposEmpregado.ESTAGIARIO]: 'Estagiário',
      [this.tiposEmpregado.PJ]: 'PJ'
    };
    return nomes[tipo] || 'Desconhecido';
  }
}

// Instância global da calculadora
const calculadoraCusto = new CalculadoraCustoEmpregado();

// Função principal para executar o cálculo
function calcularCustoEmpregado() {
  const salario = parseFloat(document.getElementById('salario').value.replace(',', '.'));
  const tipoEmpregado = document.getElementById('tipoEmpregado').value;
  const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
  const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
  const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
  const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;
  const dependentes = parseFloat(document.getElementById('dependentes')?.value || 0);

  if (isNaN(salario) || salario <= 0) {
    alert('Digite um salário válido.');
    return;
  }

  // Mostrar loading
  const overlay = document.getElementById('loading-overlay');
  overlay.style.display = 'flex';

  setTimeout(() => {
    try {
      const resultado = calculadoraCusto.calcularCustoEmpregado({
        salario,
        tipoEmpregado,
        diaria,
        adicionalTransferencia,
        tributaveis,
        naoTributaveis,
        dependentes
      });

      // Atualizar resultados
      document.getElementById('resultadoCLT').innerHTML = calculadoraCusto.gerarHTMLResultado(resultado);
      
      // Atualizar cards de resumo
      atualizarCardsResumo(resultado);
      
      // Mostrar seções de resultado
      mostrarSecoesResultado();
      
    } catch (error) {
      console.error('Erro no cálculo:', error);
      alert('Erro ao realizar o cálculo. Verifique os dados inseridos.');
    } finally {
      overlay.style.display = 'none';
    }
  }, 1000);
}

// Atualizar cards de resumo
function atualizarCardsResumo(resultado) {
  const { descontos, custosEmpresa } = resultado;
  
  document.getElementById('SALARIOCLT').textContent = calculadoraCusto.formatarMoeda(resultado.dadosEntrada.salario);
  document.getElementById('CUSTOCLT').textContent = calculadoraCusto.formatarMoeda(custosEmpresa.anual);
  document.getElementById('LIQUIDOTOTALCLT').textContent = calculadoraCusto.formatarMoeda(descontos.liquidoAnual);
}

// Mostrar seções de resultado
function mostrarSecoesResultado() {
  const elementos = [
    '.group',
    '#quantidadedecalculosloading'
  ];
  
  elementos.forEach(selector => {
    const elemento = document.querySelector(selector);
    if (elemento) {
      elemento.style.display = 'flex';
    }
  });
}

// Função para executar com loading (mantida para compatibilidade)
function executarComLoading() {
  calcularCustoEmpregado();
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Configurar evento de mudança do tipo de empregado
  const tipoEmpregadoSelect = document.getElementById('tipoEmpregado');
  if (tipoEmpregadoSelect) {
    tipoEmpregadoSelect.addEventListener('change', function() {
      const tipo = this.value;
      const configTipo = calculadoraCusto.getConfiguracaoTipo(tipo);
      
      // Mostrar/ocultar campos baseado no tipo
      const camposAdicionais = document.querySelectorAll('.campo-adicional');
      camposAdicionais.forEach(campo => {
        if (tipo === calculadoraCusto.tiposEmpregado.ESTAGIARIO) {
          campo.style.display = 'none';
        } else {
          campo.style.display = 'block';
        }
      });
    });
  }
}); 