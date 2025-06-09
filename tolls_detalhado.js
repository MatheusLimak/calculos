

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
  const adicionalCLT = adicionalTransferencia ? salarioBrutoCLT * 0.25 : 0;
  const percentualincidencias = 0.368;
  const Basedeinss = (salarioBrutoCLT + adicionalCLT + tributaveis);
  const ferias = Basedeinss + ((Basedeinss) / 3);
  const remuneracaoMensal = (salarioBrutoCLT + diaria + tributaveis + naoTributaveis + adicionalCLT);
  const inssMensal = calcularINSS(Basedeinss);
  const irrfMensal = calcularIRRF(Basedeinss , inssMensal);
  const irrfferias = calcularIRRF(ferias , inssMensal);
  const fgtsmensal = (Basedeinss * 0.08);
  const decimoterceiro = (Basedeinss - inssMensal - irrfMensal) + fgtsmensal;
  const decimoterceirovisualizer = Basedeinss
  const fgtsferias = (ferias * 0.08);
  const liquidoferias = ferias - (inssMensal + irrfferias) + fgtsferias ;
  const fgtsanual = (fgtsmensal * 11) ;
  const liquidoCLTMensal = (remuneracaoMensal - inssMensal - irrfMensal) + fgtsmensal;
  const liquidoCLTAnual = (liquidoCLTMensal * 11) + liquidoferias + decimoterceiro;
  // BASES A
  const inssempresa = (Basedeinss) * 0.2; // 20% sobre o salário bruto
  const inssEmpresa = inssempresa > 0 ? inssempresa : 0;
  const ratajustado = (Basedeinss) * 0.03; // 3% sobre o salário bruto
  const fgts = (Basedeinss) * 0.08; // 8% sobre o salário bruto
  const custoterceiros = (Basedeinss) * 0.058; // 5,8% sobre o salário bruto
  const totaltributosempresa = (inssEmpresa + ratajustado + fgts + custoterceiros);
  const custoferias = ((salarioBrutoCLT + tributaveis) + ((salarioBrutoCLT + tributaveis)/3));
  const incferias = (custoferias *percentualincidencias);
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

  const basetetoinss = 8157.41;
  const insscontribuicaoindividual = basetetoinss * 0.2;
  const custocontador = 450.00;
  const custocontadoranual = custocontador * 12;
  const insscontribuicaoindividualanual = insscontribuicaoindividual * 12;
  const adicionalPJ = adicionalTransferencia ? salarioPJ * 0.25 : 0;
  const receitaMensal = salarioPJ + adicionalPJ + diaria + tributaveis + naoTributaveis;
  const FeriasPJ = salarioPJ + adicionalPJ;
  const receitaAnual = (receitaMensal * 11) + FeriasPJ;

  const faixas = [
    { limite: 180000, aliquota: 0.06, deducao: 0 },
    { limite: 360000, aliquota: 0.112, deducao: 9360 },
    { limite: 720000, aliquota: 0.135, deducao: 17640 },
    { limite: 1800000, aliquota: 0.16, deducao: 35640 },
    { limite: 3600000, aliquota: 0.21, deducao: 125640 },
    { limite: 4800000, aliquota: 0.33, deducao: 648000 }
  ];
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
   
    <link rel='stylesheet' href='style.css'>

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

      const basetetoinss = (8157.41);
      const insscontribuicaoindividual = (basetetoinss * 0.2);
      const custocontador = (450.00);
      const custocontadoranual = (custocontador * 12);
      const insscontribuicaoindividualanual = (insscontribuicaoindividual * 12);
      const adicionalPJ = adicionalTransferencia ? melhorSalario * 0.25 : 0;
      const receitaMensal = (melhorSalario + adicionalPJ + diaria + tributaveis + naoTributaveis); 
      const FeriasPJ = melhorSalario + adicionalPJ;
      const receitaAnual = (receitaMensal * 11) + FeriasPJ ;
      const faixas = [
        { faixa: '1ª Faixa', limite: 180000, aliquota: 0.06, deducao: 0 },
        { faixa: '2ª Faixa', limite: 360000, aliquota: 0.112, deducao: 9360 },
        { faixa: '3ª Faixa', limite: 720000, aliquota: 0.135, deducao: 17640 },
        { faixa: '4ª Faixa', limite: 1800000, aliquota: 0.16, deducao: 35640 },
        { faixa: '5ª Faixa', limite: 3600000, aliquota: 0.21, deducao: 125640 },
        { faixa: '6ª Faixa', limite: 4800000, aliquota: 0.33, deducao: 648000 }
      ];
      const faixaAplicada = faixas.find(f => receitaAnual <= f.limite) || faixas[faixas.length - 1];
      const impostoPJ = (receitaAnual * faixaAplicada.aliquota) - faixaAplicada.deducao;
      const impostoPJmensal = (impostoPJ / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const liquidoPJmelhorsalario = (receitaAnual - impostoPJ) - (insscontribuicaoindividualanual + custocontadoranual);
      const liquidoPJmensal = receitaMensal - (insscontribuicaoindividual +custocontador)
      const custoempresapjmensal = receitaMensal;
      const custoempresapjanual = receitaAnual;

    document.getElementById('resultadoPJ').innerHTML = `
      <link rel='stylesheet' href='style.css'>
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
      document.getElementById('VANTAGEMECONOMICACUSTO').textContent = (custoempresacltanual-receitaAnual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      



  }

function calcularIRRF(baseBruta, inss, dependentes = 0) {
  const valorPorDependente = 189.59;
  const descontoSimplificado = 607.20;
  const baseLegal = baseBruta - inss - (dependentes * valorPorDependente);
  const baseSimplificada = baseBruta - descontoSimplificado;

  const calcularIR = (base) => {
    if (base <= 2428.80) return 0;
    if (base <= 2826.65) return base * 0.075 - 182.16;
    if (base <= 3751.05) return base * 0.15 - 394.16;
    if (base <= 4664.68) return base * 0.225 - 675.49;
    return base * 0.275 - 908.73;
  };

  const irrfLegal = calcularIR(baseLegal);
  const irrfSimplificado = calcularIR(baseSimplificada);

  return Math.min(irrfLegal, irrfSimplificado);
}

function calcularINSS(salario) {
  const faixas = [
    { limite: 1518.00, aliquota: 0.075 },
    { limite: 2793.88, aliquota: 0.09 },
    { limite: 4190.83, aliquota: 0.12 },
    { limite: 8157.41, aliquota: 0.14 },
  ];

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
  return 951.62;
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