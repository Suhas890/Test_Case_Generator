const z = require('zod');
const TestCase = require('../models/TestCase');
const { fetchLeetCodeProblem } = require('../services/leetCodeService');
const { generateTestCasesWithLLM, extractConstraintsWithLLM } = require('../services/testCaseService');

// Schema validation
const generateSchema = z.object({
  inputType: z.enum(['url', 'description']),
  input: z.string().min(1),
  numCases: z.number().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['java', 'python', 'cpp']),
  outputFormat: z.enum(['text', 'json']),
});

async function generateTestCases(req, res) {
  try {
    const validated = generateSchema.parse(req.body);
    let problemContent = '';
    let title = '';
    let link = '';

    if (validated.inputType === 'url') {
      console.log(`Fetching LeetCode problem from URL: ${validated.input}`);

      let problemData;
      try {
        problemData = await fetchLeetCodeProblem(validated.input); // pass full URL
      } catch (fetchErr) {
        console.error('LeetCode fetch failed:', fetchErr.message);
        return res.status(400).json({ 
          error: fetchErr.message || 'Failed to fetch LeetCode problem. Please paste the full problem description manually instead.' 
        });
      }

      if (!problemData || !problemData.content) {
        return res.status(400).json({ 
          error: 'LeetCode returned incomplete data. Please paste the description manually.' 
        });
      }

      problemContent = problemData.content;
      title = problemData.title || 'Untitled Problem';
      link = validated.input;

      console.log(`Successfully fetched: ${title} (difficulty: ${problemData.difficulty || 'unknown'})`);
    } else {
      // description mode
      problemContent = validated.input.trim();
      title = 'Custom Problem';
      link = '';

      if (!problemContent) {
        return res.status(400).json({ error: 'Problem description cannot be empty.' });
      }
    }

    // Safety check (should never reach here if above logic is correct)
    if (!problemContent) {
      return res.status(400).json({ error: 'No problem content available. Check your input.' });
    }

    // Extract constraints using LLM
    let constraints;
    try {
      constraints = await extractConstraintsWithLLM(problemContent);
    } catch (llmErr) {
      console.error('Constraints extraction failed:', llmErr.message);
      return res.status(500).json({ error: 'Failed to extract constraints. Try a different problem or try again later.' });
    }

    // Generate test cases
    const testCases = await generateTestCasesWithLLM({
      problemContent,
      constraints,
      numCases: validated.numCases,
      difficulty: validated.difficulty,
      language: validated.language,
      outputFormat: validated.outputFormat,
    });

    // Save to database
    const saved = await new TestCase({
      problemTitle: title,
      problemLink: link,
      constraints,           // assuming schema now allows object/Mixed
      testCases,
      createdAt: new Date(),
    }).save();

    // Return success
    res.status(200).json({ 
      testCases, 
      id: saved._id,
      title,
      message: 'Test cases generated successfully!'
    });

  } catch (error) {
    console.error('Generate test cases error:', error.message, error.stack);
    
    const status = error.name === 'ZodError' ? 400 : 500;
    const message = error.name === 'ZodError' 
      ? 'Invalid input data. Please check your fields.'
      : error.message || 'An unexpected error occurred. Please try again.';

    res.status(status).json({ error: message });
  }
}

async function getHistory(req, res) {
  try {
    const history = await TestCase.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // faster, plain JS objects

    res.status(200).json(history);
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
}

module.exports = { generateTestCases, getHistory };