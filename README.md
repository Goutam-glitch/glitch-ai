# Glitch AI

Glitch AI is a responsive AI chat app with a cinematic command-center interface. It uses Cloudflare Workers AI for hosted answers, so chats do not run an AI model on your computer and visitors can use your deployed site from anywhere.

## Tech stack

- React + Vite for the interface
- Cloudflare Workers for the public website and chat API
- Cloudflare Workers AI with Meta Llama 3.1 8B for hosted inference
- Wrangler for building and deploying
- Lucide React and custom CSS

## Cost and limits

Workers AI currently includes **10,000 neurons per day** on the free allocation. The free Workers plan stops serving AI requests when the daily allowance is reached; it does not automatically turn that overage into a bill. The quota is shared by the Cloudflare account and resets daily. Cloudflare can change its pricing or limits, so check [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) before deploying. A per-IP request limit is included to discourage spam, but it is not a full abuse-prevention system.

## Deploy your own public copy

You need a free Cloudflare account and Node.js 20+ on the computer you use to publish the project. Your computer is only used to upload the code; after deployment, Cloudflare serves the site and runs the AI model.

1. Fork this repository on GitHub, then clone your fork and open the folder in VS Code.
2. In the VS Code terminal, install packages:

   ```bash
   npm install
   ```

3. Sign in to Cloudflare from the terminal:

   ```bash
   npx wrangler login
   ```

   A browser window will ask you to authorize Wrangler.

4. Deploy the website and AI endpoint:

   ```bash
   npm run deploy
   ```

5. Wrangler prints a public URL ending in `workers.dev`. Open that URL to use Glitch AI. The deployed app calls `/api/chat` on that same public domain; no local model, local API server, API key, or OpenAI account is required.

Cloudflare may ask you to enable Workers AI for your account during setup. Accept the Workers AI terms in its dashboard if prompted. The account owner is responsible for the shared daily free quota. If it is exhausted, the chat pauses until the next reset.

## Update the deployment after editing

Commit and push your changes to GitHub, then from the project folder run:

```bash
npm run deploy
```

## Push your project to GitHub

Create an empty GitHub repository, then run these commands in the project folder (replace the URL with your repository URL):

```bash
git init
git add .
git commit -m "Build Glitch AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/glitch-ai.git
git push -u origin main
```

## Build locally

```bash
npm run build
```

This checks the frontend bundle; it does not run a local AI model.

## License

Choose a license before accepting outside contributions. The selected Llama model is subject to Meta's license terms; review the model page before redistribution: [Llama 3.1 on Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/).
