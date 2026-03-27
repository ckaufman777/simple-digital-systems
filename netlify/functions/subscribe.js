// Netlify Serverless Function — subscribe.js
// This runs on Netlify's servers, never in the visitor's browser.
// Your API key is stored as a Netlify environment variable — never exposed publicly.

exports.handler = async (event) => {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Parse incoming form data
  let firstName, email;
  try {
    ({ firstName, email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Basic server-side validation
  if (!firstName || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name and email are required' }) };
  }

  const API_KEY = process.env.SYSTEME_API_KEY;
  const TAG_NAME = 'blueprint-lead';

  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  };

  try {
    // Step 1 — Create contact in Systeme.io
    const contactRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, firstName })
    });

    if (!contactRes.ok) {
      const err = await contactRes.json();
      console.error('Contact creation failed:', err);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not create contact' }) };
    }

    const contact = await contactRes.json();
    const contactId = contact.id;
    console.log('Contact created with ID:', contactId);

    // Step 2 — Look up the tag ID by name
    const tagsListRes = await fetch('https://api.systeme.io/api/tags?limit=100', {
      method: 'GET',
      headers
    });

    let tagId = null;
    if (tagsListRes.ok) {
      const tagsList = await tagsListRes.json();
      console.log('Tags found:', JSON.stringify(tagsList));
      const matched = (tagsList.items || []).find(t => t.name === TAG_NAME);
      if (matched) tagId = matched.id;
    } else {
      console.error('Failed to fetch tags list, status:', tagsListRes.status);
    }

    if (!tagId) {
      console.error('Tag not found with name:', TAG_NAME);
    } else {
      // Step 3 — Assign tag to contact by ID
      const tagRes = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tagId })
      });

      if (!tagRes.ok) {
        const tagErr = await tagRes.json();
        console.error('Tag assignment failed:', JSON.stringify(tagErr));
      } else {
        console.log('Tag assigned successfully');
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Contact added and tagged' })
    };

  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error — please try again' })
    };
  }
};
