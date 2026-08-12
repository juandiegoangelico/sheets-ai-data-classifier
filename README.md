# ⚡ Google Sheets + Gemini AI: Classificador & Extrator de Dados

Automação *serverless* desenvolvida em **Google Apps Script** integrada à **API do Google Gemini** (`gemini-2.5-flash` e `gemini-flash-latest`) para processamento de linguagem natural, extração estruturada de entidades e classificação semântica em lote no **Google Sheets**.

---

## 🎯 Problema Operacional Resolvido
Processamento e triagem manual de registros não estruturados (solicitações financeiras, notificações trabalhistas e tickets operacionais), reduzindo o tempo de conferência e eliminando erros humanos de categorização.

## 🚀 Funcionalidades
- **Classificação Automática:** Segmenta textos em categorias (*Financeiro*, *Jurídico*, *Operacional*, *Suporte*).
- **Extração Semântica Estruturada:** Identifica dados-chave, valores monetários e prazos diretamente no formato JSON.
- **Detecção de Urgência:** Avalia criticidade operacional (*Baixa*, *Média*, *Alta*).
- **Arquitetura Resiliente:** Processamento em lote em requisição única de I/O (`setValues`), controle de status (`CONCLUÍDO`) e *fallback* automático entre modelos de IA.
- **Segurança de Credenciais:** Armazenamento isolado da chave via `PropertiesService.getScriptProperties()`.

---

## 🛠️ Stack Tecnológica
- **Google Apps Script (Motor V8)**
- **Google Gemini API (`gemini-2.5-flash` / `gemini-flash-latest`)**
- **Google Sheets API**
- **JSON Schema Output Control (`responseMimeType: "application/json"`)**

---

## 📋 Como Configurar e Utilizar

### 1. Preparação da Planilha
Crie uma planilha no Google Sheets com as seguintes colunas na Linha 1:
- **Coluna A:** `Texto Bruto (Entrada)`
- **Coluna B:** `Categoria (IA)`
- **Coluna C:** `Dados Extraídos (IA)`
- **Coluna D:** `Urgência (IA)`
- **Coluna E:** `Status de Processamento`

### 2. Instalação do Script
1. No menu da planilha, acesse **Extensões > Apps Script**.
2. Copie os arquivos da pasta `/src` deste repositório para o editor:
   - `Code.js` (código de interface e lote)
   - `GeminiService.js` (serviço de integração)
3. Salve o projeto (`Ctrl + S` ou `Cmd + S`).

### 3. Execução
1. Recarregue a página da planilha.
2. Acesse o menu **🚀 Automação Gemini > Configurar API Key** e insira sua chave do Google AI Studio.
3. Preencha os textos na Coluna A e clique em **🚀 Automação Gemini > Processar Classificação e Extração**.
