function exportarPDFVisaoEmpregado() {
  try {
    const termos = [
      "Custo Empresa",
      "Custo Total Empresa",
      "Encargos Empresa",
      "INSS patronal",
      "FGTS (empresa)",
      "Provisões (empresa)",
      "13º (empresa)",
      "Férias (empresa)",
      "Taxa administrativa (empresa)",
      "Custo indireto empresa",
      "Markup empresa"
    ].map(function(t) { return t.toLowerCase(); });

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Bloqueador de pop-up ativo. Autorize a abertura da janela para exportar.');
      return;
    }
    var doc = printWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>' + (document.title || 'Relatório') + ' - Visão Empregado</title></head><body></body></html>');
    doc.close();

    // Copiar estilos (links e estilos inline), sem scripts
    document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
      var newLink = doc.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      doc.head.appendChild(newLink);
    });
    document.querySelectorAll('style').forEach(function(style) {
      var newStyle = doc.createElement('style');
      newStyle.textContent = style.textContent;
      doc.head.appendChild(newStyle);
    });

    // Clonar conteúdo principal
    var main = document.querySelector('main.container') || document.body;
    var clone = main.cloneNode(true);

    // Garantir cabeçalho correto no clone
    var h1 = clone.querySelector('h1');
    if (h1) { h1.textContent = (h1.textContent + ' – Visão Empregado').replace(/\s+– Visão Empregado$/,' – Visão Empregado'); }

    // Remover botões do clone para evitar exibição na janela nova (mantém dados)
    clone.querySelectorAll('button, .btn').forEach(function(btn){ btn.parentNode && btn.parentNode.removeChild(btn); });

    // Remover os cards horizontais de custo (Custo PJ / Custo CLT)
    clone.querySelectorAll('#CUSTOPJ, #CUSTOCLT').forEach(function(span){
      var card = span.closest('.cartao, .card, .resultado-card');
      if (card && card.parentNode) card.parentNode.removeChild(card);
    });
    // Redundância por título do card
    clone.querySelectorAll('.card-header').forEach(function(h){
      var text = (h.textContent || '').toLowerCase();
      if (text.includes('custo pj') || text.includes('custo clt')) {
        var card = h.closest('.cartao, .card, .resultado-card');
        if (card && card.parentNode) card.parentNode.removeChild(card);
      }
    });

    // Remover card de Resultado (Anual)
    var resultadoSpan = clone.querySelector('#VANTAGEMECONOMICACUSTO');
    if (resultadoSpan) {
      var resCard = resultadoSpan.closest('.cartaoresultado, .cartao, .card, .resultado-card');
      if (resCard && resCard.parentNode) resCard.parentNode.removeChild(resCard);
    }
    clone.querySelectorAll('.card-header').forEach(function(h){
      var text = (h.textContent || '').toLowerCase();
      if (text.includes('resultado') && text.includes('anual')) {
        var card = h.closest('.cartaoresultado, .cartao, .card, .resultado-card');
        if (card && card.parentNode) card.parentNode.removeChild(card);
      }
    });

    // 1) Remover por atributos específicos
    clone.querySelectorAll('[data-role="custo-empresa"], .custo-empresa').forEach(function(el){ el.remove(); });

    // 2) Remover linhas de tabela cuja primeira célula contenha termos
    clone.querySelectorAll('table tr').forEach(function(tr){
      var cell = tr.querySelector('th, td');
      if (!cell) return;
      var text = (cell.textContent || '').toLowerCase();
      if (termos.some(function(t){ return text.includes(t); })) {
        tr.remove();
      }
    });

    // 3) Remover SOMENTE as seções de custo dentro dos cards, preservando o restante
    var headingSelectors = 'h1, h2, h3, h4, .card-header, .titleresm, .titulo, .title, .section-title';
    clone.querySelectorAll(headingSelectors).forEach(function(heading){
      var txt = (heading.textContent || '').toLowerCase();
      if (!termos.some(function(t){ return txt.includes(t); })) return;

      // Se o heading é de custo, remover ele e os próximos elementos até o próximo heading
      var parent = heading.parentElement;
      var current = heading;
      while (current) {
        var next = current.nextElementSibling;
        if (current.parentElement) current.parentElement.removeChild(current);
        if (!next) break;
        var isNextHeading = next.matches(headingSelectors);
        if (isNextHeading) break;
        current = next;
      }
    });

    // 4) Remover itens de lista e parágrafos avulsos que contenham termos de custo
    clone.querySelectorAll('p, li').forEach(function(el){
      var text = (el.textContent || '').toLowerCase().trim();
      if (termos.some(function(t){ return text.includes(t); })) {
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    });

    // 5) Na seção "Férias e 13º Salário", manter somente "FGTS Férias" e "FGTS Décimo Terceiro"
    var isHeadingFerias = function(txt){
      txt = (txt || '').toLowerCase();
      return (txt.includes('férias') || txt.includes('ferias')) && (txt.includes('13º') || txt.includes('13o') || txt.includes('13 '));
    };
    var isKeepFeriasItem = function(txt){
      txt = (txt || '').toLowerCase();
      return txt.includes('fgts férias') || txt.includes('fgts ferias') || txt.includes('fgts décimo terceiro') || txt.includes('fgts decimo terceiro');
    };
    clone.querySelectorAll('p').forEach(function(p){
      if (!isHeadingFerias(p.textContent)) return;
      var current = p.nextElementSibling;
      while (current) {
        var stop = false;
        // parar ao chegar em novo título/seção
        if (current.matches('h1, h2, h3, h4, .card-header, .titleresm, .titulo, .title, .section-title')) stop = true;
        if (stop) break;
        var txt = (current.textContent || '').toLowerCase();
        if (!isKeepFeriasItem(txt)) {
          var toRemove = current;
          current = current.nextElementSibling;
          if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove);
          continue;
        }
        current = current.nextElementSibling;
      }
    });

    // Inserir clone direto; o próprio h1 já indica Visão Empregado
    doc.body.appendChild(clone);

    var tryPrint = function() {
      try { printWindow.focus(); printWindow.print(); } catch (e) {}
    };
    if (printWindow.document.readyState === 'complete') {
      setTimeout(tryPrint, 300);
    } else {
      printWindow.onload = function() { setTimeout(tryPrint, 300); };
    }
  } catch (e) {
    console.error(e);
    alert('Falha ao gerar PDF – Visão Empregado.');
  }
}


