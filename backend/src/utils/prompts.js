function extractPrompt(content) {
  return `
Extract the following from the problem description:
- Input format (e.g., array of integers)
- Output format (e.g., integer)
- Constraints (numerical, e.g., 1 <= n <= 10^5, list all)
- Possible edge cases (empty, single, max, min, duplicates, negatives if allowed)

Description:
${content}

Output as JSON: {"inputFormat": "", "outputFormat": "", "constraints": "", "edgeCases": []}
Use chain-of-thought reasoning internally, but output only JSON.
Do not hallucinate; base on provided text.
`;
}

function generatePrompt(content, constraints, numCases, difficulty, language) {
  const caseTypes = {
    easy: 'basic and simple cases',
    medium: 'edge and boundary cases like empty, single, duplicates',
    hard: 'stress, maximum constraints, negatives if allowed, complex',
  };

  return `
Respond with **absolutely nothing** except a valid JSON array.

No explanation.
No markdown.
No code fences.
No thinking steps.
No introductory sentence.
Only this:

[
  {
    "input": "string",
    "output": "string",
    "explanation": "string"
  },
  ...
]

Generate ${numCases} test cases for the problem below.
Focus on ${caseTypes[difficulty]}.
Problem: ${content}
Constraints: ${constraints}
`;
}

module.exports = { extractPrompt, generatePrompt };