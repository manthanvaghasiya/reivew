const fs = require('fs');

async function run() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const apiKeyLine = envContent.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
    const apiKey = apiKeyLine.split('=')[1].trim();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name));
  } catch (err) {
    console.error(err);
  }
}
run();
