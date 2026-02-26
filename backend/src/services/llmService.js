const { callGemini } = require('./geminiService');

async function callLLM(prompt) {
  return await callGemini(prompt);
}

module.exports = { callLLM };