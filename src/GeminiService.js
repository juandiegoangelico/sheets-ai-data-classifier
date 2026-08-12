/**
 * Módulo de Integração com a Google Gemini API (v1beta com Fallback Automático).
 */
var GeminiService = (function() {
  var API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

  function getApiKey() {
    var key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!key) {
      throw new Error("Chave GEMINI_API_KEY não configurada. Use o menu 'Configurar API Key'.");
    }
    return key;
  }

  /**
   * Chamada REST para o Gemini com fallback entre modelos suportados.
   */
  function callGemini(systemInstruction, userContent) {
    var apiKey = getApiKey();
    var candidateModels = ["gemini-2.5-flash", "gemini-flash-latest"];
    var lastError = null;

    var payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userContent }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    };

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-goog-api-key": apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    for (var i = 0; i < candidateModels.length; i++) {
      var model = candidateModels[i];
      var endpoint = API_BASE_URL + model + ":generateContent?key=" + apiKey;

      try {
        var response = UrlFetchApp.fetch(endpoint, options);
        var responseCode = response.getResponseCode();
        var responseText = response.getContentText();

        if (responseCode === 200) {
          var json = JSON.parse(responseText);
          if (
            json.candidates &&
            json.candidates.length > 0 &&
            json.candidates[0].content &&
            json.candidates[0].content.parts &&
            json.candidates[0].content.parts.length > 0
          ) {
            return json.candidates[0].content.parts[0].text;
          }
        } else {
          lastError = "Status " + responseCode + " (" + model + "): " + responseText;
          Logger.log("Falha no modelo " + model + ": " + lastError);
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    throw new Error("Falha na API Gemini: " + lastError);
  }

  return {
    callGemini: callGemini
  };
})();
