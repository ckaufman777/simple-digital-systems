# Simple Digital Systems — Capture Page
## Netlify Setup Instructions

### Step 1 — Add your API key as an environment variable
1. Go to your Netlify site dashboard
2. Click: Site Configuration → Environment Variables → Add a variable
3. Key:   SYSTEME_API_KEY
4. Value: (paste your Systeme.io API key here)
5. Click Save

### Step 2 — Deploy the folder
1. Go to app.netlify.com
2. Drag and drop this entire folder onto the Netlify drop zone
   OR connect your GitHub repo if you're using one

### Step 3 — Test
1. Open your Netlify site URL
2. Fill in the form and submit
3. Check Systeme.io Contacts — the contact should appear with the blueprint-lead tag
4. Your automation rule fires the welcome email sequence automatically

### Folder Structure
sds-netlify/
├── index.html                     ← Your capture page
├── netlify.toml                   ← Tells Netlify where the function lives
├── README.md                      ← This file
└── netlify/
    └── functions/
        └── subscribe.js           ← Serverless function (calls Systeme.io securely)

### How it works
Visitor submits form → browser calls /.netlify/functions/subscribe →
Netlify function calls Systeme.io API using your secret key →
Contact created + blueprint-lead tag applied → your automation fires
