let melhorSalario = 0; // Agora todas as funções enxergam isso

function atingirLiquidoPJ() {
  const salarioBrutoCLT = parseFloat(document.getElementById('salario').value.replace(',', '.'));
  const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
  const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
  const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
  const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;

if (isNaN(salarioBrutoCLT) || salarioBrutoCLT <= 0) {
        alert('Digite um salário válido.');

        
        return;
      }

      const overlay = document.getElementById('loading-overlay');
      overlay.style.display = 'flex';

      setTimeout(() => {
        overlay.style.display = 'none';
      }, 2000); // 2 segundos de carregamento
      //Verifica se o valor da diária é válido


  //CALCULO DO SALÁRIO CLT
  const config = loadTaxConfig();
  const percentualAdicional = config.adicionais.percentualAdicionalTransferencia / 100;
  const adicionalCLT = adicionalTransferencia ? salarioBrutoCLT * percentualAdicional : 0;
  const percentualincidencias = config.custosEmpresa.percentualIncidencias / 100;
  const Basedeinss = (salarioBrutoCLT + adicionalCLT + tributaveis);
  const ferias = Basedeinss + (Basedeinss * (config.custosEmpresa.adicionalFerias / 100));
  const remuneracaoMensal = (salarioBrutoCLT + diaria + tributaveis + naoTributaveis + adicionalCLT);
  const inssMensal = calcularINSS(Basedeinss);
  const irrfMensal = calcularIRRF(Basedeinss , inssMensal);
  const irrfferias = calcularIRRF(ferias , inssMensal);
  const fgtsmensal = (Basedeinss * (config.custosEmpresa.fgts.clt_normal / 100));
  const decimoterceiro = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
  const decimoterceirovisualizer = Basedeinss
  const fgtsferias = (ferias * (config.custosEmpresa.fgts.clt_normal / 100));
  const liquidoferias = ferias - (inssMensal + irrfferias) + fgtsferias ;
  const fgtsanual = (fgtsmensal * 11) ;
  const liquidoCLTMensal = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
  const liquidoCLTAnual = (liquidoCLTMensal * 11) + liquidoferias + decimoterceiro;
  // BASES A
  const inssempresa = (Basedeinss) * (config.custosEmpresa.inssEmpresa / 100); // Dinâmico do painel admin
  const inssEmpresa = inssempresa > 0 ? inssempresa : 0;
  const ratajustado = (Basedeinss) * (config.custosEmpresa.rat / 100); // Dinâmico do painel admin
  const fgts = (Basedeinss) * (config.custosEmpresa.fgts.clt_normal / 100); // Dinâmico do painel admin
  const custoterceiros = (Basedeinss) * (config.custosEmpresa.terceiros / 100); // Dinâmico do painel admin
  const totaltributosempresa = (inssEmpresa + ratajustado + fgts + custoterceiros);
  const custoferias = ((salarioBrutoCLT + tributaveis) + ((salarioBrutoCLT + tributaveis) * (config.custosEmpresa.adicionalFerias / 100)));
  const incferias = (custoferias * percentualincidencias);
  const custo13o = (salarioBrutoCLT + tributaveis);
  const inc13o = (salarioBrutoCLT + tributaveis) * percentualincidencias;
  const total13o = (custo13o + inc13o);
  const totalferias = (custoferias + incferias);
  const custoempresacltmensal = (totaltributosempresa + remuneracaoMensal);
  const custoempresacltanual = ((totaltributosempresa + remuneracaoMensal) * 11) + total13o + totalferias;
  

  
  
  //CALCULO DO SALÁRIO PJ



  ////

let salarioMin = 1000;
let salarioMax = 1000000;
let melhorSalario = 0;
const precisao = 0.01;
const maxTentativas = 1000;
let tentativa = 0;

while (tentativa < maxTentativas) {
  tentativa++;
  let salarioPJ = (salarioMin + salarioMax) / 2;

  // Carregar configurações dinâmicas
  const basetetoinss = config.other.tetoINSS;
  const insscontribuicaoindividual = basetetoinss * 0.2;
  const custocontador = config.other.custoContador || 450.00;
  const custocontadoranual = custocontador * 12;
  const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;
  const adicionalPJ = adicionalTransferencia ? salarioPJ * percentualAdicional : 0;
  const receitaMensal = salarioPJ + adicionalPJ + diaria + tributaveis + naoTributaveis;
  const FeriasPJ = salarioPJ + adicionalPJ;
  const receitaAnual = (receitaMensal * 11) + FeriasPJ;

  // Usar tabelas PJ dinâmicas do admin_panel
  const faixas = config.pj;
  const faixaAplicada = faixas.find(f => receitaAnual <= f.limite) || faixas[faixas.length - 1];
  const impostoPJ = (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao;
  const liquidoPJ = receitaAnual - impostoPJ - insscontribuicaoindividualanual - custocontadoranual;

  const diferenca = liquidoPJ - liquidoCLTAnual;

  if (Math.abs(diferenca) <= precisao) {
    melhorSalario = salarioPJ;
    break;
  }

  if (diferenca > 0) {
    salarioMax = salarioPJ;
  } else {
    salarioMin = salarioPJ;
  }




    
  }
document.getElementById('tentativas').textContent = tentativa.toLocaleString('pt-BR');


  //CALCULO DO SALÁRIO PJ


  

  document.getElementById('salario_bruto').placeholder = melhorSalario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById('resultadoCLT').innerHTML = `
   
    <link rel='stylesheet' href='tolls.css'>

                                    <p class= 'titleresm'>Proventos</p>

        <div<p><strong>Salário Bruto:</strong> R$ ${(salarioBrutoCLT).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </div>
        <p><strong>Adc. de Transferência:</strong> R$ ${(adicionalCLT).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Diária de Viagem:</strong> R$ ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Outros Valores Tributáveis:</strong> R$ ${(tributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Outros Valores Não Tributáveis:</strong> R$ ${(naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <br>
                    <p style='text-align: center '><strong>Férias e 13º Salário</strong></p>
         <p><strong>Férias: </strong> R$ ${(ferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>FGTS Férias: </strong> R$ ${(fgtsferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>INSS / Terceiros / RAT ajustado: Sobre Férias:</strong> R$ ${(incferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Décimo Terceiro: </strong> R$ ${(decimoterceirovisualizer).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>FGTS Décimo Terceiro: </strong> R$ ${(fgts).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>INSS / Terceiros / RAT ajustado: Sobre 13º Salário: </strong> R$ ${(inc13o).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                       
                    <br>
                                    <p class= 'titleresm'>Descontos Empregado</p>

        <p><strong>INSS Mensal:</strong> R$ ${inssMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>IRRF Mensal:</strong> R$ ${irrfMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <br>
                                    <p class= 'titleresm'>Custo Empresa</p>

        <p><strong>Base de INSS</strong> : R$ ${Basedeinss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>INSS EMPRESA</strong> (20%) : R$ ${inssempresa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><strong>RAT AJUSTADO</strong> (3%) : R$ ${ratajustado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>FGTS</strong>  (8%) : R$ ${fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>TERCEIROS</strong>: R$ ${custoterceiros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>CUSTO 13º SALÁRIO</strong>: R$ ${(total13o).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>CUSTO FÉRIAS</strong>: R$ ${(totalferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <br>
        <p style='text-align: center '><strong>Custo Empresa Mensal</strong> : R$ ${custoempresacltmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p style='text-align: center '><strong>Custo Empresa Anual</strong> : R$ ${custoempresacltanual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>      
          <br>

                                      <p class= 'titleresm'>Líquido Salarial</p>

        <p><strong>Líquido Mensal:</strong> R$ ${liquidoCLTMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Líquido Anual:</strong> R$ ${liquidoCLTAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Líquido Férias</strong> R$ ${liquidoferias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>  
        <p><strong>Líquido 13º</strong> R$ ${decimoterceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;

      // Carregar configurações dinâmicas para o cálculo final
      const basetetoinss = config.other.tetoINSS;
      const insscontribuicaoindividual = (basetetoinss * 0.2);
      const custocontador = config.other.custoContador || 450.00;
      const custocontadoranual = (custocontador * 12);
      const insscontribuicaoindividualanual = (insscontribuicaoindividual * 12);
      const adicionalPJ = adicionalTransferencia ? melhorSalario * percentualAdicional : 0;
      const receitaMensal = (melhorSalario + adicionalPJ + diaria + tributaveis + naoTributaveis); 
      const FeriasPJ = melhorSalario + adicionalPJ;
      const receitaAnual = (receitaMensal * 11) + FeriasPJ ;
      
      // Usar tabelas PJ dinâmicas do admin_panel
      const faixas = config.pj.map((faixa, index) => ({
        faixa: `${index + 1}ª Faixa`,
        limite: faixa.limite,
        aliquota: faixa.aliquota,
        deducao: faixa.deducao
      }));
      const faixaAplicada = faixas.find(f => receitaAnual <= f.limite) || faixas[faixas.length - 1];
      const impostoPJ = (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao;
      const impostoPJmensal = impostoPJ / 12;
      const liquidoPJmelhorsalario = (receitaAnual - impostoPJ) - (insscontribuicaoindividualanual + custocontadoranual);
      const liquidoPJmensal = receitaMensal - (insscontribuicaoindividual + custocontador + impostoPJmensal);
      const custoempresapjmensal = receitaMensal;
      const custoempresapjanual = receitaAnual;

    document.getElementById('resultadoPJ').innerHTML = `
      <link rel='stylesheet' href='tolls.css'>
      <p class= 'titleresm'>Proventos</p>

                <p><strong>Salário Bruto</strong> ${(melhorSalario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Adicional de Transferência</strong> ${(adicionalPJ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Diária de Viagem</strong> ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Outros Valores:</strong> R$ ${(tributaveis+naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <br>
      <p class= 'titleresm'>Descontos</p>
      <p></p>
                <p><strong>Faixa:</strong> ${faixaAplicada.faixa}  / <strong>Alíquota:</strong> ${(faixaAplicada.aliquota * 100).toFixed(2)}% / <strong>Dedução:</strong> R$ ${(faixaAplicada.deducao/12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Imposto Mensal:</strong> R$ ${(impostoPJmensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Custo Contador Mensal</strong> ${(custocontador).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>INSS Contribuição Individual (TETO)</strong> ${(insscontribuicaoindividual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                
      <br>
      <p class= 'titleresm'>Custo Empresa</p>
                <p style='text-align: center '><strong>Custo Empresa Mensal</strong> R$ ${receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style='text-align: center '><strong>Custo Empresa Anual</strong> R$ ${receitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <br>
                                    
      <p class= 'titleresm'>Liquido</p>
        <p><strong>Líquido Mensal:</strong> R$ ${liquidoPJmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Líquido Anual:</strong> R$ ${liquidoPJmelhorsalario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      `;



      document.getElementById('CUSTOCLT').textContent = custoempresacltanual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('LIQUIDOTOTALCLT').textContent = liquidoCLTAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('CUSTOPJ').textContent = receitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('LIQUIDOTOTALPJ').textContent = liquidoPJmelhorsalario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('SALARIOPJ').textContent = melhorSalario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('SALARIOCLT').textContent = salarioBrutoCLT.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Cálculo do resultado para CLT x PJ: custoCLT - custoPJ (tendência positiva)
      // Se positivo: custo CLT é maior que PJ (prejuízo ao converter para CLT)
      // Se negativo: custo CLT é menor que PJ (benefício ao converter para CLT)
      const resultadoCLTparaPJ = custoempresacltanual - receitaAnual;
      document.getElementById('VANTAGEMECONOMICACUSTO').textContent = resultadoCLTparaPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Mostrar seção de distribuição do benefício se for positivo
      if (typeof mostrarDistribuicaoBeneficio === 'function') {
        mostrarDistribuicaoBeneficio(resultadoCLTparaPJ);
      }



  }

function calcularIRRF(baseBruta, inss, dependentes = 0) {
  const config = loadTaxConfig();
  const valorPorDependente = config.other.valorPorDependente;
  const descontoSimplificado = config.other.descontoSimplificado;
  const baseLegal = baseBruta - inss - (dependentes * valorPorDependente);
  const baseSimplificada = baseBruta - descontoSimplificado;

  const calcularIR = (base) => {
    // Usar as faixas configuradas dinamicamente
    for (const faixa of config.irrf) {
      if (base <= faixa.limite) {
        return base * faixa.aliquota - faixa.deducao;
      }
    }
    // Se não encontrar faixa, usar a última
    const ultimaFaixa = config.irrf[config.irrf.length - 1];
    return base * ultimaFaixa.aliquota - ultimaFaixa.deducao;
  };

  const irrfLegal = calcularIR(baseLegal);
  const irrfSimplificado = calcularIR(baseSimplificada);

  return Math.min(irrfLegal, irrfSimplificado);
}

function calcularINSS(salario) {
  const config = loadTaxConfig();
  const faixas = config.inss;
  const tetoINSS = config.other.tetoINSS;
  const valorMaximoINSS = config.other.valorMaximoINSS;

  let inss = 0;
  let salarioRestante = salario;
  let limiteAnterior = 0;

  for (const faixa of faixas) {
    if (salario > faixa.limite) {
      inss += (faixa.limite - limiteAnterior) * faixa.aliquota;
      limiteAnterior = faixa.limite;
    } else {
      inss += (salario - limiteAnterior) * faixa.aliquota;
      return Math.round(inss * 100) / 100;
    }
  }
  return valorMaximoINSS;
}


function executarComLoading() {
  // Mostra a tela de carregamento
  document.getElementById('loading-overlay').style.display = 'flex';
  setTimeout(async () => {
    try {
      await atingirLiquidoPJ();
    } catch (erro) {
      console.error('Erro ao executar função:', erro);
    }
    document.getElementById('loading-overlay').style.display = 'none';
  }, 4000)
}

function atingirLiquidoCLT() {
  const salarioMensalPJ = parseFloat(document.getElementById('salario_pj').value.replace(',', '.'));
  const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
  const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
  const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
  const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;

  if (isNaN(salarioMensalPJ) || salarioMensalPJ <= 0) {
    alert('Digite um salário PJ válido.');
    return;
  }

  const overlay = document.getElementById('loading-overlay');
  overlay.style.display = 'flex';

  setTimeout(() => {
    overlay.style.display = 'none';
  }, 2000);

  // CALCULO DO SALÁRIO PJ (FIXO - INPUT DO USUÁRIO)
  const config = loadTaxConfig();
  const basetetoinss = config.other.tetoINSS;
  const insscontribuicaoindividual = basetetoinss * 0.2;
  const custocontador = config.other.custoContador || 450.00;
  const custocontadoranual = custocontador * 12;
  const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;
  const percentualAdicional = config.adicionais.percentualAdicionalTransferencia / 100;
  const adicionalPJ = adicionalTransferencia ? salarioMensalPJ * percentualAdicional : 0;
  const receitaMensalPJ = salarioMensalPJ + adicionalPJ + diaria + tributaveis + naoTributaveis;
  const FeriasPJ = salarioMensalPJ + adicionalPJ;
  const receitaAnualPJ = (receitaMensalPJ * 11) + FeriasPJ;

  // Usar tabelas PJ dinâmicas do admin_panel
  const faixas = config.pj;
  const faixaAplicada = faixas.find(f => receitaAnualPJ <= f.limite) || faixas[faixas.length - 1];
  const impostoPJ = (receitaAnualPJ * faixaAplicada.aliquota) - faixaAplicada.deducao;
  const liquidoPJAnual = receitaAnualPJ - impostoPJ - insscontribuicaoindividualanual - custocontadoranual;

  // ALGORITMO DE BUSCA BINÁRIA PARA ENCONTRAR SALÁRIO CLT
  let salarioMin = 1000;
  let salarioMax = 1000000;
  let melhorSalarioCLT = 0;
  const precisao = 0.01;
  const maxTentativas = 1000;
  let tentativa = 0;

  while (tentativa < maxTentativas) {
    tentativa++;
    let salarioBrutoCLT = (salarioMin + salarioMax) / 2;

    // CALCULO DO SALÁRIO CLT (TESTE)
    const percentualAdicional = config.adicionais.percentualAdicionalTransferencia / 100;
    const adicionalCLT = adicionalTransferencia ? salarioBrutoCLT * percentualAdicional : 0;
    const percentualincidencias = config.custosEmpresa.percentualIncidencias / 100;
    const Basedeinss = (salarioBrutoCLT + adicionalCLT + tributaveis);
    const ferias = Basedeinss + (Basedeinss * (config.custosEmpresa.adicionalFerias / 100));
    const remuneracaoMensal = (salarioBrutoCLT + diaria + tributaveis + naoTributaveis + adicionalCLT);
    const inssMensal = calcularINSS(Basedeinss);
    const irrfMensal = calcularIRRF(Basedeinss, inssMensal);
    const irrfferias = calcularIRRF(ferias, inssMensal);
    const fgtsmensal = (Basedeinss * (config.custosEmpresa.fgts.clt_normal / 100));
    const decimoterceiro = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
    const fgtsferias = (ferias * (config.custosEmpresa.fgts.clt_normal / 100));
    const liquidoferias = ferias - (inssMensal + irrfferias) + fgtsferias;
    const liquidoCLTMensal = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
    const liquidoCLTAnual = (liquidoCLTMensal * 11) + liquidoferias + decimoterceiro;

    const diferenca = liquidoCLTAnual - liquidoPJAnual;

    if (Math.abs(diferenca) <= precisao) {
      melhorSalarioCLT = salarioBrutoCLT;
      break;
    }

    if (diferenca > 0) {
      salarioMax = salarioBrutoCLT;
    } else {
      salarioMin = salarioBrutoCLT;
    }
  }

  document.getElementById('tentativas').textContent = tentativa.toLocaleString('pt-BR');
  document.getElementById('salario_clt_sugerido').placeholder = melhorSalarioCLT.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // CALCULO FINAL COM O MELHOR SALÁRIO CLT ENCONTRADO
  const adicionalCLTFinal = adicionalTransferencia ? melhorSalarioCLT * percentualAdicional : 0;
  const percentualincidencias = config.custosEmpresa.percentualIncidencias / 100;
  const Basedeinss = (melhorSalarioCLT + adicionalCLTFinal + tributaveis);
  const ferias = Basedeinss + (Basedeinss * (config.custosEmpresa.adicionalFerias / 100));
  const remuneracaoMensal = (melhorSalarioCLT + diaria + tributaveis + naoTributaveis + adicionalCLTFinal);
  const inssMensal = calcularINSS(Basedeinss);
  const irrfMensal = calcularIRRF(Basedeinss, inssMensal);
  const irrfferias = calcularIRRF(ferias, inssMensal);
  const fgtsmensal = (Basedeinss * (config.custosEmpresa.fgts.clt_normal / 100));
  const decimoterceiro = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
  const decimoterceirovisualizer = Basedeinss;
  const fgtsferias = (ferias * (config.custosEmpresa.fgts.clt_normal / 100));
  const liquidoferias = ferias - (inssMensal + irrfferias) + fgtsferias;
  const fgtsanual = (fgtsmensal * 11);
  const liquidoCLTMensal = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
  const liquidoCLTAnual = (liquidoCLTMensal * 11) + liquidoferias + decimoterceiro;

  // BASES CLT
  const inssempresa = (Basedeinss) * (config.custosEmpresa.inssEmpresa / 100);
  const inssEmpresa = inssempresa > 0 ? inssempresa : 0;
  const ratajustado = (Basedeinss) * (config.custosEmpresa.rat / 100);
  const fgts = (Basedeinss) * (config.custosEmpresa.fgts.clt_normal / 100);
  const custoterceiros = (Basedeinss) * (config.custosEmpresa.terceiros / 100);
  const totaltributosempresa = (inssEmpresa + ratajustado + fgts + custoterceiros);
  const custoferias = ((melhorSalarioCLT + tributaveis) + ((melhorSalarioCLT + tributaveis) * (config.custosEmpresa.adicionalFerias / 100)));
  const incferias = (custoferias * percentualincidencias);
  const custo13o = (melhorSalarioCLT + tributaveis);
  const inc13o = (melhorSalarioCLT + tributaveis) * percentualincidencias;
  const total13o = (custo13o + inc13o);
  const totalferias = (custoferias + incferias);
  const custoempresacltmensal = (totaltributosempresa + remuneracaoMensal);
  const custoempresacltanual = ((totaltributosempresa + remuneracaoMensal) * 11) + total13o + totalferias;

  // RESULTADO CLT
  document.getElementById('resultadoCLT').innerHTML = `
    <link rel='stylesheet' href='tolls.css'>
    <p class='titleresm'>Proventos</p>
    <div><p><strong>Salário Bruto:</strong> R$ ${(melhorSalarioCLT).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </div>
    <p><strong>Adc. de Transferência:</strong> R$ ${(adicionalCLTFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Diária de Viagem:</strong> R$ ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Outros Valores Tributáveis:</strong> R$ ${(tributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Outros Valores Não Tributáveis:</strong> R$ ${(naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p style='text-align: center '><strong>Férias e 13º Salário</strong></p>
    <p><strong>Férias: </strong> R$ ${(ferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>FGTS Férias: </strong> R$ ${(fgtsferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>INSS / Terceiros / RAT ajustado: Sobre Férias:</strong> R$ ${(incferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Décimo Terceiro: </strong> R$ ${(decimoterceirovisualizer).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>FGTS Décimo Terceiro: </strong> R$ ${(fgts).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>INSS / Terceiros / RAT ajustado: Sobre 13º Salário: </strong> R$ ${(inc13o).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Descontos Empregado</p>
    <p><strong>INSS Mensal:</strong> R$ ${inssMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>IRRF Mensal:</strong> R$ ${irrfMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Custo Empresa</p>
    <p><strong>Base de INSS</strong> : R$ ${Basedeinss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>INSS EMPRESA</strong> (20%) : R$ ${inssempresa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>RAT AJUSTADO</strong> (3%) : R$ ${ratajustado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>FGTS</strong>  (8%) : R$ ${fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>TERCEIROS</strong>: R$ ${custoterceiros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>CUSTO 13º SALÁRIO</strong>: R$ ${(total13o).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>CUSTO FÉRIAS</strong>: R$ ${(totalferias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p style='text-align: center '><strong>Custo Empresa Mensal</strong> : R$ ${custoempresacltmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p style='text-align: center '><strong>Custo Empresa Anual</strong> : R$ ${custoempresacltanual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>      
    <br>
    <p class='titleresm'>Líquido Salarial</p>
    <p><strong>Líquido Mensal:</strong> R$ ${liquidoCLTMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Líquido Anual:</strong> R$ ${liquidoCLTAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Líquido Férias</strong> R$ ${liquidoferias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>  
    <p><strong>Líquido 13º</strong> R$ ${decimoterceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  `;

  // RESULTADO PJ
  const faixasPJ = config.pj.map((faixa, index) => ({
    faixa: `${index + 1}ª Faixa`,
    limite: faixa.limite,
    aliquota: faixa.aliquota,
    deducao: faixa.deducao
  }));
  const faixaAplicadaPJ = faixasPJ.find(f => receitaAnualPJ <= f.limite) || faixasPJ[faixasPJ.length - 1];
  const impostoPJmensal = (impostoPJ / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const liquidoPJmensal = receitaMensalPJ - (insscontribuicaoindividual + custocontador + (impostoPJ / 12));

  document.getElementById('resultadoPJ').innerHTML = `
    <link rel='stylesheet' href='tolls.css'>
    <p class='titleresm'>Proventos</p>
    <p><strong>Salário Bruto</strong> R$ ${(salarioMensalPJ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Adicional de Transferência</strong> R$ ${(adicionalPJ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Diária de Viagem</strong> R$ ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Outros Valores:</strong> R$ ${(tributaveis + naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Descontos</p>
    <p><strong>Faixa:</strong> ${faixaAplicadaPJ.faixa}  / <strong>Alíquota:</strong> ${(faixaAplicadaPJ.aliquota * 100).toFixed(2)}% / <strong>Dedução:</strong> R$ ${(faixaAplicadaPJ.deducao / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Imposto Mensal:</strong> R$ ${(impostoPJmensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Custo Contador Mensal</strong> R$ ${(custocontador).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>INSS Contribuição Individual (TETO)</strong> R$ ${(insscontribuicaoindividual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Custo Empresa</p>
    <p style='text-align: center '><strong>Custo Empresa Mensal</strong> R$ ${receitaMensalPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p style='text-align: center '><strong>Custo Empresa Anual</strong> R$ ${receitaAnualPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <br>
    <p class='titleresm'>Liquido</p>
    <p><strong>Líquido Mensal:</strong> R$ ${liquidoPJmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p><strong>Líquido Anual:</strong> R$ ${liquidoPJAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  `;

  // ATUALIZAR CARTÕES RESUMO
  document.getElementById('CUSTOCLT').textContent = custoempresacltanual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('LIQUIDOTOTALCLT').textContent = liquidoCLTAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('CUSTOPJ').textContent = receitaAnualPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('LIQUIDOTOTALPJ').textContent = liquidoPJAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('SALARIOPJ').textContent = salarioMensalPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('SALARIOCLT').textContent = melhorSalarioCLT.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // Cálculo do resultado para CLT x PJ: custoCLT - custoPJ (tendência positiva)
  // Se positivo: custo CLT é maior que PJ (prejuízo ao converter para CLT)
  // Se negativo: custo CLT é menor que PJ (benefício ao converter para CLT)
  const resultadoCLTparaPJ = custoempresacltanual - receitaAnualPJ;
  document.getElementById('VANTAGEMECONOMICACUSTO').textContent = resultadoCLTparaPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function executarComLoadingReverso() {
  // Mostra a tela de carregamento
  document.getElementById('loading-overlay').style.display = 'flex';
  setTimeout(async () => {
    try {
      await atingirLiquidoCLT();
    } catch (erro) {
      console.error('Erro ao executar função:', erro);
    }
    document.getElementById('loading-overlay').style.display = 'none';
  }, 4000);
}