# Calculadora de Custo PJ e CLT (Versão sem BDS)

Este projeto é uma calculadora web completa para análise comparativa de custos entre regimes de contratação CLT e PJ, incluindo funcionalidades para cálculo de INSS, IRRF, conversão entre regimes, estudo em lote e painel administrativo para configuração de tabelas e acompanhamento de acessos.

---

## Funcionalidades Detalhadas

### 1. **Cálculo de Custo de Empregado (Individual)**
- **O que faz:** Permite simular o custo total de contratação de um empregado em diferentes regimes (CLT normal, aprendiz, estagiário, PJ).
- **Como funciona:**
  - O usuário informa salário bruto, número de dependentes, diárias de viagem, adicionais e outros valores.
  - O sistema calcula automaticamente todos os encargos (INSS, IRRF, FGTS, férias, 13º, adicionais, etc.) e apresenta o custo total para a empresa e o valor líquido para o empregado.
  - Permite comparar rapidamente os custos entre os regimes.

### 2. **Cálculo de INSS e IRRF**
- **O que faz:** Calcula os descontos de INSS e IRRF de acordo com as tabelas vigentes.
- **Como funciona:**
  - O usuário informa o salário bruto, valores tributáveis e número de dependentes.
  - O sistema aplica as faixas e alíquotas corretas, mostrando o valor descontado de INSS e IRRF, além do salário líquido resultante.

### 3. **Conversão CLT para PJ**
- **O que faz:** Sugere o salário PJ equivalente ao salário CLT informado, considerando todos os encargos e benefícios perdidos ou ganhos na troca de regime.
- **Como funciona:**
  - O usuário informa o salário bruto CLT e pode ajustar diárias e adicionais.
  - O sistema calcula o valor PJ que proporcionaria um valor líquido semelhante ao do regime CLT, considerando impostos, INSS autônomo, custos de contador, férias, 13º, etc.
  - Exibe o salário PJ sugerido e detalha os cálculos para facilitar a negociação ou análise.

### 4. **Conversão PJ para CLT**
- **O que faz:** Sugere o salário CLT equivalente ao salário PJ informado, considerando todos os encargos e benefícios.
- **Como funciona:**
  - O usuário informa o salário PJ e pode ajustar diárias e adicionais.
  - O sistema calcula o salário bruto CLT que proporcionaria um valor líquido semelhante ao do regime PJ, considerando todos os descontos e benefícios do CLT.
  - Exibe o salário CLT sugerido e detalha os cálculos.

### 5. **Estudo em Lote (Cálculo para Múltiplos Empregados)**
- **O que faz:** Permite importar uma planilha Excel (.xlsx) com dados de vários empregados para calcular custos em massa.
- **Como funciona:**
  - O usuário baixa um modelo de planilha, preenche com os dados dos empregados (nome, salário, tipo de contrato, diárias, adicionais, dependentes, etc.) e importa de volta para o sistema.
  - O sistema processa cada linha, calcula todos os encargos e apresenta um relatório detalhado dos custos individuais e totais.
  - Ideal para simulações de folha de pagamento, estudos de viabilidade e comparativos em empresas.

### 6. **Painel Administrativo**
- **O que faz:** Permite ao administrador configurar as tabelas de impostos (INSS, IRRF, PLR, PJ), restaurar padrões e visualizar o histórico de acessos ao sistema.
- **Como funciona:**
  - Acesso via login (Admin) no rodapé do site.
  - Permite editar faixas e alíquotas, salvar configurações localmente e restaurar valores padrão.
  - Exibe histórico de acessos, com informações de data, navegador, sistema e usuário (se identificado).

### 7. **Validação Completa**
- **O que faz:** Página de testes para validação das configurações e cálculos do sistema.
- **Como funciona:**
  - Permite rodar testes automáticos para garantir que as fórmulas e configurações estão corretas.
  - Útil para desenvolvedores e administradores.

### 8. **Rastreamento de Acessos**
- **O que faz:** Coleta informações de uso para análise estatística local (sem backend).
- **Como funciona:**
  - Registra acessos, páginas visitadas, navegador, sistema operacional e dados do usuário (se identificado), tudo salvo no `localStorage` do navegador.

---

## Estrutura dos Arquivos

- `index.html` — Página inicial, menu de navegação e informações gerais.
- `calculocustoempregados.html` — Cálculo individual de custo de empregado.
- `calculoloteempregados.html` — Estudo em lote via importação de planilha.
- `CalculoINSSeIRRF.html` — Cálculo de INSS e IRRF.
- `ConversaoCLTparaPJ.html` / `ConversaoPJparaCLT.html` — Ferramentas de conversão salarial entre regimes.
- `admin_login.html` / `admin_panel.html` — Login e painel administrativo.
- `VALIDACAO_COMPLETA.html` — Página de testes e validação do sistema.
- `tolls.js`, `tolls_detalhado.js`, `custo_empregado.js`, `custo_empregado_lote.js` — Scripts de cálculo e lógica principal.
- `config_helper.js`, `config_centralized.js`, `admin_config.js` — Configurações centralizadas e helpers.
- `distribuicao_beneficio.js`, `dinamic_values.js`, `correcoes_criticas.js` — Scripts auxiliares para cálculos e ajustes.
- `site_tracker.js` — Rastreamento de acessos e estatísticas locais.
- `tolls.css`, `style.css` — Estilos visuais do sistema.
- `logo-engeform-neg_cop.PNG`, `Fundo Tela Gestão estratégica.png` — Imagens e identidade visual.

---

## Como Usar

1. **Abra o arquivo `index.html` em seu navegador** (Google Chrome, Firefox, Edge, etc.).
2. Navegue pelo menu para acessar as diferentes ferramentas de cálculo e conversão.
3. Para uso do painel administrativo, acesse "Admin" no rodapé e faça login.
4. Para estudo em lote:
   - Baixe o modelo de planilha disponível na página "Estudo em Lote".
   - Preencha os dados conforme instruções (não altere cabeçalhos, use vírgula como separador decimal, etc.).
   - Importe a planilha preenchida e visualize os resultados.
5. As configurações e histórico são salvos localmente no navegador (não há backend).

---

## Requisitos e Dependências

- **Navegador moderno** (recomendado: Chrome, Firefox, Edge).
- **JavaScript habilitado**.
- Para estudo em lote, é utilizado o [SheetJS](https://sheetjs.com/) via CDN para leitura de arquivos `.xlsx`.
- Não há dependências externas para instalação — basta abrir os arquivos HTML.

---

## Observações

- O sistema é totalmente client-side (sem banco de dados ou backend).
- As tabelas de impostos podem ser atualizadas via painel admin.
- Os dados de acesso e configurações são armazenados no `localStorage` do navegador.
- Para restaurar padrões, utilize a opção no painel admin.

---

## Autor

Criado por **Matheus Santos**, Analista de Business Intelligence, Engeform.

Se precisar de suporte ou encontrar algum problema, entre em contato com o autor ou utilize o painel administrativo para restaurar configurações. 