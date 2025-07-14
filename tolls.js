// script resumido

    function calcularComparativo() {
      const salario = parseFloat(document.getElementById('salario').value.replace(',', '.'));
      const diaria = parseFloat(document.querySelector('input[name="diaria"]:checked')?.value || 0);
      const adicionalTransferencia = document.getElementById('adicional').value === 'SIM';
      const tributaveis = parseFloat(document.getElementById('tributaveis').value) || 0;
      const naoTributaveis = parseFloat(document.getElementById('naoTributaveis').value) || 0;
      const quantidadedependente = parseFloat(document.getElementById('quantidadedependentes').value) || 0;
    


      if (isNaN(salario) || salario <= 0) {
        alert('Digite um salário válido.');

        
        return;
      }

      const overlay = document.getElementById('loading-overlay');
      overlay.style.display = 'flex';

      setTimeout(() => {
        overlay.style.display = 'none';
      }, 2000); // 2 segundos de carregamento
      //Verifica se o valor da diária é válido
      

      // Calcular o adicional de transferência (25% do salário bruto)
      const config = loadTaxConfig();
      const percentualAdicional = config.adicionais.percentualAdicionalTransferencia / 100;
      const adicional = adicionalTransferencia ? salario * percentualAdicional : 0;

      // ==== CÁLCULO PJ ==============================================================================================

      const basetetoinss = config.other.tetoINSS;
      const insscontribuicaoindividual = basetetoinss * 0.2;
      const custocontador = config.other.custoContador || 450.00;
      const custocontadoranual = (custocontador * 12);
      const insscontribuicaoindividualanual = (insscontribuicaoindividual * 12);

      const receitaMensal = (salario + adicional + diaria + tributaveis + naoTributaveis); 
      const receitaAnual = receitaMensal * 12;
      
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
      const liquidoPJ = (receitaAnual - impostoPJ) - (insscontribuicaoindividualanual + custocontadoranual);
      const liquidoPJmensal = receitaMensal - impostoPJmensal - insscontribuicaoindividual - custocontador;
      const custoempresapjmensal = receitaMensal;
      const custoempresapjanual = receitaAnual;

      document.getElementById('resultadoPJ').innerHTML = `
      <link rel='stylesheet' href='tolls.css'>
      <p class= 'titleresm'>Proventos</p>
      <br>
                <p><strong>Salário Bruto</strong> ${(salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Adicional de Transferência</strong> ${(adicional).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Diária de Viagem</strong> ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Outros Valores:</strong> R$ ${(tributaveis+naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <br>
      <p class= 'titleresm'>Descontos</p>
      <br>
      <p></p>
                <p><strong>Faixa:</strong> ${faixaAplicada.faixa}  / <strong>Alíquota:</strong> ${(faixaAplicada.aliquota * 100).toFixed(2)}% / <strong>Dedução:</strong> R$ ${(faixaAplicada.deducao/12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Imposto Mensal:</strong> R$ ${(impostoPJmensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <br>
      <p class= 'titleresm'>Custo Empresa</p>
      <br>
                <p style='text-align: center '><strong>Custo Empresa Mensal</strong> R$ ${receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style='text-align: center '><strong>Custo Empresa Anual</strong> R$ ${receitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <br>
                                    
      <p class= 'titleresm'>Liquido</p>
      <br>
        <p><strong>Líquido Mensal:</strong> R$ ${liquidoPJmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Líquido Anual:</strong> R$ ${liquidoPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      `;

      // ==== CÁLCULO CLT (simplificado) =========================================================================================================

      // base de cálculo do INSS
      const percentualincidencias = config.custosEmpresa.percentualIncidencias / 100;
      const Basedeinss = (salario + adicional + tributaveis);
      const remuneracaoMensal = (salario + diaria + tributaveis + naoTributaveis + adicional);

      // DESCONTOS EMPREGADOS
      const inssMensal = calcularINSS(Basedeinss);
      const irrfMensal = calcularIRRF(Basedeinss , inssMensal, quantidadedependente);

      // CUSTO EMPRESA
      const inssempresa = (Basedeinss) * (config.custosEmpresa.inssEmpresa / 100); // Dinâmico do painel admin
      const inssEmpresa = inssempresa > 0 ? inssempresa : 0;
      const ratajustado = (Basedeinss) * (config.custosEmpresa.rat / 100); // Dinâmico do painel admin
      const fgts = (Basedeinss) * (config.custosEmpresa.fgts.clt_normal / 100); // Dinâmico do painel admin
      const custoterceiros = (Basedeinss) * (config.custosEmpresa.terceiros / 100); // Dinâmico do painel admin

      //FÉRIAS
      const custoferias = ((salario + tributaveis) + ((salario + tributaveis) * (config.custosEmpresa.adicionalFerias / 100)));
      const incferias = (custoferias * percentualincidencias);

      //13º SALÁRIO

      const custo13o = (salario + tributaveis);
      const inc13o = (salario + tributaveis) * percentualincidencias;
      

      // LIQUIDO CLT
      const liquidoCLTMensal = remuneracaoMensal - inssMensal - irrfMensal;
      const liquidoCLTAnual = (liquidoCLTMensal * 12)+ (liquidoCLTMensal / 3);
      
      //consolidadores

      const totaltributosempresa = (inssEmpresa + ratajustado + fgts + custoterceiros);
      const total13o = (custo13o + inc13o);
      const totalferias = (custoferias + incferias);
      const custoempresacltmensal = (totaltributosempresa + remuneracaoMensal);
      const custoempresacltanual = ((totaltributosempresa + remuneracaoMensal) * 11) + total13o + totalferias;

      document.getElementById('VALORINSSDESCONTO').textContent = inssMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('VALORIRRFDESCONTO').textContent = irrfMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      document.getElementById('resultadoCLT').innerHTML = `

      <link rel='stylesheet' href='tolls.css'>
      <p class= 'titleresm'>Proventos</p>
          <br>
        <p><strong>Salário Bruto:</strong> R$ ${(salario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Adc. de Transferência:</strong> R$ ${(adicional).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Diária de Viagem:</strong> R$ ${(diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <br>
                    <p style='text-align: center '><strong>Outros Valores</strong></p>
         <p><strong>Tributáveis:</strong> R$ ${(tributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Não Tributáveis:</strong> R$ ${(naoTributaveis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <br>
                    <p class= 'titleresm'>Descontos Empregado</p>
                    <br>
        <p><strong>INSS Mensal:</strong> R$ ${inssMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>IRRF Mensal:</strong> R$ ${irrfMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <br>
        <p class= 'titleresm'>Custo Empresa</p>
          <br>
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
          <br>
        <p><strong>Líquido Mensal:</strong> R$ ${liquidoCLTMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Líquido Anual:</strong> R$ ${liquidoCLTAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>


      `;

      document.getElementById('CLTXPJ').innerHTML = `

      <link rel='stylesheet' href='tolls.css'>


      <p class= 'titleresm'>Custo Empresa</p>
      <p style='text-align: center '><strong> Vantagem Ecônomica</strong></p>
      <p><strong> Mensal:</strong> R$ ${(custoempresacltmensal-receitaMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong> Anual:</strong> R$ ${(custoempresacltanual - receitaAnual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      
      <br>    
        <br>     
      <p class= 'titleresm'>Liquido Empregado</p>

      <p style='text-align: center '><strong> Vantagem Ecônomica</strong></p>
      <p><strong> Mensal:</strong> R$ ${(liquidoPJmensal-liquidoCLTMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong> Anual:</strong> R$ ${(liquidoPJ - liquidoCLTAnual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <br>     

      `
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



  // Carregar os arquivos HTML
  postsData.forEach((post, index) => {
    fetch(post.file)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById(post.id);
        container.innerHTML = html;
        if (index === 0) container.classList.add('active'); // mostra o primeiro ao carregar
      });
  });

  // Troca automática
  let current = 0;

  function showNextPost() {
    const posts = document.querySelectorAll('.blog-post');
    posts[current].classList.remove('active');
    current = (current + 1) % posts.length;
    posts[current].classList.add('active');
  }

  // Espera os conteúdos carregarem antes de iniciar o intervalo
  window.addEventListener('load', () => {
    setInterval(showNextPost, 12000);
  });
    