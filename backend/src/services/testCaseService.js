const { callLLM } = require('./llmService');
const { extractPrompt, generatePrompt } = require('../utils/prompts');

// Helper to format input for language (unchanged)
function formatInput(input, language) {
  // Simplified; expand based on needs
  if (language === 'python') return `nums = ${JSON.stringify(input)}`;
  if (language === 'java') return `int[] nums = ${JSON.stringify(input).replace('[', '{').replace(']', '}')};`;
  if (language === 'cpp') return `vector<int> nums${JSON.stringify(input).replace('[', '{').replace(']', '}')};`;
  return input;
}

async function extractConstraintsWithLLM(content) {
  const prompt = extractPrompt(content);
  
  // callLLM already returns parsed object → no need to JSON.parse
  const result = await callLLM(prompt);

  // Safety check
  if (!result || typeof result !== 'object') {
    console.error("Invalid constraints response from LLM:", result);
    throw new Error('LLM did not return a valid constraints object');
  }

  return result; // expected: { inputFormat, outputFormat, constraints, edgeCases, ... }
}

async function generateTestCasesWithLLM({ 
  problemContent, 
  constraints, 
  numCases, 
  difficulty, 
  language, 
  outputFormat 
}) {
  const prompt = generatePrompt(problemContent, constraints, numCases, difficulty, language);
  
  // callLLM already returns parsed array → no need to JSON.parse
  const testCases = await callLLM(prompt);

  // Safety check: make sure it's an array
  if (!Array.isArray(testCases)) {
    console.error("LLM did not return an array of test cases:", testCases);
    throw new Error('LLM response is not an array of test cases');
  }

  // Format output based on user choice
  if (outputFormat === 'json') {
    return testCases;
  } else {
    // plain text format
    return testCases.map(tc => `
Input: ${formatInput(tc.input, language)}
Output: ${tc.output}
Explanation: ${tc.explanation}
    `).join('\n---\n');
  }
}

module.exports = { 
  extractConstraintsWithLLM, 
  generateTestCasesWithLLM 
};