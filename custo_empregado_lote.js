// custo_empregado_lote.js

document.addEventListener('DOMContentLoaded', function() {
  // Botão para baixar modelo
  var btn = document.getElementById('btn-download-modelo-xlsx');
  if (btn) {
    btn.addEventListener('click', function() {
      console.log('Gerando modelo XLSX...');
      gerarModeloXLSX();
    });
  }

  // Upload de planilha
  document.getElementById('input-upload-xlsx').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      lerPlanilhaLote(e.target.files[0]);
    }
  });
});

// Gera e baixa o modelo de planilha
function gerarModeloXLSX() {
  const ws_data = [
    ['Nome', 'Salario', 'Tipo de Contrato', 'Diaria', 'Adicional', 'Tributaveis', 'NaoTributaveis', 'Dependentes'],
          ['(Nome completo)', '(Valor bruto)', '(clt_normal/aprendiz/estagiario/pj)', '(0/708.93/954.00/1883.09/2990.79)', '(SIM/NÃO)', '(Valor tributável)', '(Valor não tributável)', '(Número inteiro)'],
    ['João Silva', 5000, 'clt_normal', 0, 'NÃO', 0, 0, 0],
    ['Maria Santos', 3000, 'aprendiz', 0, 'NÃO', 0, 0, 1],
    ['Pedro Costa', 2000, 'estagiario', 0, 'NÃO', 0, 0, 0],
    ['Ana Oliveira', 8000, 'pj', 0, 'NÃO', 0, 0, 2],
    ['Carlos Lima', 6000, 'clt_normal', 708.93, 'SIM', 500, 200, 1],
    ['Fernanda Costa', 4500, 'clt_normal', 0, 'SIM', 0, 300, 0],
    ['Roberto Silva', 3500, 'aprendiz', 0, 'NÃO', 0, 0, 0]
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
  XLSX.writeFile(wb, 'modelo_custo_empregados.xlsx');
}

// Lê a planilha enviada e processa os dados
function lerPlanilhaLote(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, {header:1, defval: ''});
    processarLote(json);
  };
  reader.readAsArrayBuffer(file);
}

// Processa os dados do lote e calcula os custos
function processarLote(json) {
  if (json.length < 3) {
    alert('Planilha deve ter pelo menos o cabeçalho, linha de comentários e uma linha de dados!');
    return;
  }

  const headers = json[0];
  const dados = json.slice(2); // Pula cabeçalho e linha de comentários
  
  // Validar cabeçalhos
  const headersEsperados = ['Nome', 'Salario', 'Tipo de Contrato', 'Diaria', 'Adicional', 'Tributaveis', 'NaoTributaveis', 'Dependentes'];
  const headersValidos = headersEsperados.every(h => headers.includes(h));
  
  if (!headersValidos) {
    alert('Cabeçalhos inválidos! Use o modelo fornecido.');
    return;
  }

  // Criar instância da calculadora (usa as mesmas configurações do painel admin)
  const calculadora = new CalculadoraCustoEmpregado();

  // Processar cada linha
  const resultados = [];
  dados.forEach((row, index) => {
    if (row.length >= 8 && row[0] && row[1]) {
      try {
        const resultado = calcularEmpregadoLote(row, headers, calculadora);
        resultados.push(resultado);
      } catch (error) {
        console.error(`Erro na linha ${index + 3}:`, error); // +3 porque pulamos 2 linhas
        resultados.push({
          nome: row[0] || `Linha ${index + 3}`,
          erro: error.message
        });
      }
    }
  });

  // Exibir resultados
  exibirResultadosLote(resultados);
  
  // Armazenar resultados para download posterior (quando o usuário clicar no botão)
  window.resultadosLote = resultados;
}

// Calcula o custo de um empregado específico usando a mesma lógica da página principal
function calcularEmpregadoLote(row, headers, calculadora) {
  const nome = row[0];
  const salario = parseFloat(row[1]) || 0;
  const tipoContrato = row[2] || 'clt_normal';
  const diaria = parseFloat(row[3]) || 0;
  const adicional = row[4] === 'SIM' ? true : false;
  const tributaveis = parseFloat(row[5]) || 0;
  const naoTributaveis = parseFloat(row[6]) || 0;
  const dependentes = parseInt(row[7]) || 0;

  if (salario <= 0) {
    throw new Error('Salário deve ser maior que zero');
  }

  // Usar exatamente a mesma função da página principal
  const dados = {
    salario: salario,
    tipoEmpregado: tipoContrato,
    diaria: diaria,
    adicionalTransferencia: adicional,
    tributaveis: tributaveis,
    naoTributaveis: naoTributaveis,
    dependentes: dependentes
  };

  const resultado = calculadora.calcularCustoEmpregado(dados);

  return {
    nome: nome,
    tipoContrato: tipoContrato,
    salario: salario,
    salarioLiquido: resultado.descontos.liquidoMensal,
    salarioLiquidoAnual: resultado.descontos.liquidoAnual,
    custoEmpresa: resultado.custosEmpresa.mensal,
    custoEmpresaAnual: resultado.custosEmpresa.anual
  };
}

// Exibe os resultados na tela
function exibirResultadosLote(resultados) {
  let html = '<h3>Resultados do Cálculo em Lote:</h3>';
  html += '<div style="overflow-x: auto;">';
  html += '<table class="tabela-lote" style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
  html += '<thead><tr>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Nome</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Tipo</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Salário Bruto</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Salário Líquido (Mensal)</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Salário Líquido (Anual)</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Custo Empresa (Mensal)</th>';
  html += '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Custo Empresa (Anual)</th>';
  html += '</tr></thead><tbody>';

  resultados.forEach(resultado => {
    if (resultado.erro) {
      html += `<tr><td colspan="7" style="border: 1px solid #ddd; padding: 8px; color: red;">${resultado.nome}: ${resultado.erro}</td></tr>`;
    } else {
      html += '<tr>';
      html += `<td style="border: 1px solid #ddd; padding: 8px;">${resultado.nome}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">${resultado.tipoContrato}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">R$ ${resultado.salario.toFixed(2)}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">R$ ${resultado.salarioLiquido.toFixed(2)}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">R$ ${resultado.salarioLiquidoAnual.toFixed(2)}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">R$ ${resultado.custoEmpresa.toFixed(2)}</td>`;
      html += `<td style="border: 1px solid #ddd; padding: 8px;">R$ ${resultado.custoEmpresaAnual.toFixed(2)}</td>`;
      html += '</tr>';
    }
  });

  html += '</tbody></table></div>';
  
  // Adicionar botão para download dos resultados
  html += '<div style="text-align: center; margin-top: 20px;">';
  html += '<button class="btn" onclick="downloadResultados()">Baixar Resultados (.xlsx)</button>';
  html += '</div>';

  document.getElementById('resultado-lote').innerHTML = html;
}

// Gera e baixa a planilha de resultados
function gerarPlanilhaResultados(resultados) {
  const ws_data = [
    [
      'Nome',
      'Tipo de Contrato',
      'Salário Bruto',
      'Salário Líquido (Mensal)',
      'Salário Líquido (Anual)',
      'Custo Empresa (Mensal)',
      'Custo Empresa (Anual)'
    ]
  ];

  resultados.forEach(resultado => {
    if (!resultado.erro) {
      ws_data.push([
        resultado.nome,
        resultado.tipoContrato,
        resultado.salario,
        resultado.salarioLiquido,
        resultado.salarioLiquidoAnual,
        resultado.custoEmpresa,
        resultado.custoEmpresaAnual
      ]);
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
  XLSX.writeFile(wb, 'resultados_custo_empregados.xlsx');
}

// Função para download dos resultados (chamada pelo botão)
function downloadResultados() {
  if (window.resultadosLote) {
    gerarPlanilhaResultados(window.resultadosLote);
  }
} 