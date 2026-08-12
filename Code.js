/**
 * Criação do menu personalizado na interface do Google Sheets.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 Automação Gemini")
    .addItem("Processar Classificação e Extração", "processBatchRows")
    .addSeparator()
    .addItem("Configurar API Key", "configureApiKey")
    .addToUi();
}

/**
 * Interface para gravação segura da chave de API nas propriedades do script.
 */
function configureApiKey() {
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt(
    "Configuração do Google Gemini",
    "Insira sua GEMINI_API_KEY (Google AI Studio):",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var apiKey = prompt.getResponseText().trim();
    if (apiKey) {
      PropertiesService.getScriptProperties().setProperty("GEMINI_API_KEY", apiKey);
      ui.alert("Chave GEMINI_API_KEY salva com sucesso!");
    }
  }
}

/**
 * Processamento em lote das linhas pendentes com escrita única no Sheets.
 */
function processBatchRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = 2; // Pula o cabeçalho
  var lastRow = sheet.getLastRow();

  if (lastRow < startRow) {
    SpreadsheetApp.getUi().alert("Nenhum dado encontrado para processamento.");
    return;
  }

  var range = sheet.getRange(startRow, 1, lastRow - startRow + 1, 5);
  var values = range.getValues();

  var systemInstruction =
    "Você é um motor de extração e classificação de dados corporativos. " +
    "Analise o texto fornecido e retorne estritamente um JSON estruturado com as chaves: " +
    "\"categoria\" (valores: Financeiro, Jurídico, Operacional, Suporte, Outros), " +
    "\"extração\" (resumo de valores, datas ou entidades), " +
    "\"urgencia\" (valores: Baixa, Média, Alta).";

  var updatedCount = 0;

  for (var i = 0; i < values.length; i++) {
    var rawText = values[i][0];
    var status = values[i][4];

    // Executa apenas se houver texto bruto e ainda não tiver sido concluído
    if (rawText && status !== "CONCLUÍDO") {
      try {
        var rawResponse = GeminiService.callGemini(systemInstruction, rawText);
        var parsed = JSON.parse(rawResponse);

        values[i][1] = parsed.categoria || "Indefinido";
        values[i][2] = parsed.extração || "N/A";
        values[i][3] = parsed.urgencia || "Baixa";
        values[i][4] = "CONCLUÍDO";
        updatedCount++;
      } catch (err) {
        values[i][4] = "ERRO: " + err.message;
      }
    }
  }

  // Gravação em lote em uma única chamada I/O
  range.setValues(values);
  SpreadsheetApp.getUi().alert("Processamento finalizado! Linhas atualizadas: " + updatedCount);
}
