const axios = require('axios');

async function fetchLeetCodeProblem(inputUrl) {
  // ────────────────────────────────────────────────
  // Step 1: Extract slug from various URL formats
  // ────────────────────────────────────────────────
  let slug;

  try {
    // Clean and normalize URL
    let cleanUrl = inputUrl.trim()
      .replace(/\/+$/, '')                    // remove trailing slashes
      .replace(/\/description\/?$/, '');      // remove /description or /description/

    // Extract slug after /problems/
    const parts = cleanUrl.split('/problems/');
    if (parts.length < 2) {
      throw new Error('Invalid LeetCode URL format. Expected: https://leetcode.com/problems/problem-slug/...');
    }

    slug = parts[1].split('/')[0];           // take the slug part (e.g., two-sum)

    if (!slug || slug.length < 3) {
      throw new Error('Could not extract valid problem slug from URL');
    }

    console.log(`Extracted LeetCode slug: ${slug}`);
  } catch (slugErr) {
    console.error('Slug extraction failed:', slugErr.message);
    throw new Error('Invalid LeetCode URL. Please use format like: https://leetcode.com/problems/two-sum/');
  }

  // ────────────────────────────────────────────────
  // Step 2: GraphQL query
  // ────────────────────────────────────────────────
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content               # contains description + constraints (HTML)
        difficulty
        exampleTestcases      # optional: can be useful later
      }
    }
  `;

  const variables = { titleSlug: slug };

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables },
      {
        timeout: 15000,  // 15 seconds timeout to avoid hanging
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://leetcode.com/',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );

    // ────────────────────────────────────────────────
    // Handle GraphQL errors
    // ────────────────────────────────────────────────
    if (response.data.errors) {
      const errMsg = response.data.errors[0]?.message || 'Unknown GraphQL error';
      console.error('LeetCode GraphQL error:', errMsg, response.data.errors);
      throw new Error(`LeetCode returned error: ${errMsg}`);
    }

    const question = response.data.data?.question;

    if (!question || !question.title || !question.content) {
      console.error('Incomplete problem data:', question);
      throw new Error('LeetCode did not return complete problem information');
    }

    return {
      title: question.title,
      content: question.content,          // full HTML description + constraints
      difficulty: question.difficulty,
      // You can add more fields later if needed (e.g. exampleTestcases)
    };

  } catch (err) {
    // ────────────────────────────────────────────────
    // Better error messages for frontend
    // ────────────────────────────────────────────────
    let userFriendlyError = 'Could not fetch problem from LeetCode.';

    if (err.code === 'ECONNABORTED') {
      userFriendlyError += ' Request timed out. LeetCode may be slow.';
    } else if (err.response) {
      if (err.response.status === 429) {
        userFriendlyError += ' Rate limited by LeetCode. Try again later or paste description manually.';
      } else if (err.response.status >= 500) {
        userFriendlyError += ' LeetCode server error. Try again later.';
      }
    } else if (err.message.includes('Network Error')) {
      userFriendlyError += ' Network issue. Check your internet.';
    }

    console.error('LeetCode fetch failed:', err.message, err.stack);
    throw new Error(userFriendlyError + ' Please paste the problem description manually instead.');
  }
}

module.exports = { fetchLeetCodeProblem };