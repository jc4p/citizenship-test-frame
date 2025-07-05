# US Citizenship Test - Farcaster Frame

## Overview

A Farcaster mini-app that tests your knowledge of US civics with questions from the official US Citizenship Test. Take a 10-question quiz and see if you can pass!

- **Quiz Engine** - Randomly selects 10 questions from the official 100-question USCIS civics test
- **Google Gemini API** - AI-powered grading that understands context and accepts non-verbatim correct answers
- **Cloudflare R2** (optional) - Stores shareable result images

## Getting Started

### 1. Prerequisites

- Cursor or Visual Studio Code with Copilot enabled
- Ability to open up your Terminal (in Applications/Utilities folder) and run `npm --version` and have it spit out a number

If you do not have `npm` installed yet please Open the Terminal app and run:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm use stable
```

After that run `npm --version` and ensure it says something like 10.9.2 or any other numbers

### 2. Clone the Repository

Open the Terminal app and run:

```bash
cd ~/Documents/
git clone https://github.com/your-username/citizenship-test-frame
cd citizenship-test-frame
```

### 3. Set Up Environment Variables

Create your environment file by copying the sample:

```bash
# Copy the sample environment file
cp .env.sample .env.local
```

This creates a `.env.local` file with the following structure:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# So the app knows what it's URL is
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional - Cloudflare R2 for image sharing
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket-url.r2.dev
```

### 4. Get Your API Keys

Now you'll need to get the API keys and fill them into your `.env.local` file:

#### Google Gemini API Key (Required)
1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" on the top right of the page
4. Create a new API key
5. Copy the API key
6. Replace `your_gemini_api_key_here` in your `.env.local` file

#### Cloudflare R2 (Optional - for enhanced image sharing)
**Note**: Sharing works without R2, but R2 provides custom result images when sharing.

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to R2 Object Storage
3. Create a bucket if you don't have one
4. Go to Manage R2 API Tokens → Create API token
5. Set permissions to "Object Read & Write"
6. Create token and save the credentials
7. Set up a public bucket URL for serving images
8. Fill in all the R2 variables in your `.env.local` file

### 5. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: This app is designed to run inside a Farcaster Frame. To test locally, you'll need to use the Farcaster Frame Debugger (see below).

## How It Works

1. **Question Selection**: The app randomly selects 10 questions from the official 100-question USCIS civics test
2. **Answer Input**: Users type their answers in a text field (pressing Enter advances to the next question)
3. **AI Grading**: Google's Gemini AI evaluates answers - it understands context and accepts non-verbatim correct answers
4. **Pass/Fail**: You need 6 out of 10 correct to pass (same as the real test)
5. **Share Results**: Share your score on Farcaster with a custom message


## Loading in Farcaster debugger

To debug your frame on Farcaster the recommended method is to utilize ngrok to make your local server accessible to the internet.

### 1. Create a Free ngrok Account
1. Go to [ngrok.com](https://ngrok.com)
2. Sign up for a free account
3. Once logged in, ignore the installation instructions and find the "Your authtoken" section
4. Copy your authtoken

### 2. Install and Setup ngrok
```bash
# Install ngrok for OSX
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-arm64.zip && sudo unzip ~/Downloads/ngrok-v3-stable-darwin-arm64.zip -d /usr/local/bin

# Authenticate with your token (replace with your actual token)
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### 3. Run Your Development Server and ngrok
```bash
# Terminal 1: Start your Next.js development server
npm run dev

# Terminal 2: Start ngrok tunnel (in a new terminal window)
ngrok http 3000 --url your-project-name.ngrok.app
```

**Note**: Replace `your-project-name` with a unique name for your project.

### 4. Test Your Frame
1. Copy the ngrok URL (e.g., `https://your-project-name.ngrok.app`)
2. Update the `NEXT_PUBLIC_APP_URL` in your `.env.local` file to match your ngrok URL
3. Restart your development server
4. Paste the ngrok URL into https://farcaster.xyz/~/developers/mini-apps/preview and hit enter
5. Hit "Open URL as Mini App"

### Customization Ideas

#### Add More Questions
- The full test bank is in `/src/lib/testQuestions.js`
- Currently includes all 100 official USCIS civics questions
- Questions are automatically randomized for each quiz

#### Adjust Difficulty
- Change the number of questions (currently 10)
- Modify the passing score (currently 6/10)
- Add time limits or other constraints

#### Enhance the UI
- Modify styles in `/src/components/Quiz.module.css`
- Add animations or visual feedback
- Create custom themes

## File Structure

### Core Files

#### `/src/components/Quiz.jsx`
The main quiz component that:
- Manages quiz state and navigation
- Handles answer submission
- Displays results and sharing options
- Shows progress through the quiz

#### `/src/lib/testQuestions.js`
Contains all 100 official USCIS civics test questions:
- Each question has multiple acceptable answers
- Questions cover US history, government, and civics
- Updated with current political figures (as of 2025)

#### `/src/lib/gemini.js`
Gemini AI integration for intelligent grading:
- Evaluates answers using context understanding
- Accepts non-verbatim correct answers
- Returns detailed scoring with explanations

#### `/src/lib/frame.js`
Farcaster Frame SDK initialization:
- Sets up Frame context
- Enables sharing functionality
- Handles frame ready state

### API Routes

#### `/src/app/api/score/route.js`
Quiz scoring endpoint:
- Sends quiz answers to Gemini for evaluation
- Returns score and detailed results

#### `/src/app/api/create-share-link/route.js`
Share link generation:
- Creates shareable URLs that work with or without R2
- If R2 is configured: creates OG image, uploads to R2, includes custom image
- If R2 is not configured: returns basic shareable URL without custom image

#### `/src/app/api/og/route.js`
Open Graph image generator:
- Generates dynamic share images
- Uses Vercel OG library

### Configuration Files

#### `/src/app/page.js`
- Sets Frame metadata
- Configures preview and splash images

#### `/src/components/FrameInit.jsx`
- Client-side Frame initialization wrapper

## Features

- **Authentic Questions**: All 100 official USCIS civics test questions
- **Smart Grading**: AI understands context - "Washington" counts for "George Washington"
- **Current Information**: Updated with current political leaders (as of 2025)
- **User-Friendly**: Navigate with Previous/Next buttons or press Enter
- **Share Results**: Brag about your score (or commiserate) on Farcaster
- **Pass/Fail Feedback**: Get encouraging or motivating messages based on your performance

## Troubleshooting

- **"Loading questions..."**: Check that the questions file is properly loaded
- **Scoring errors**: Ensure your Gemini API key is valid and has available quota
- **Share button fails**: R2 configuration is optional; sharing works without R2 but won't include custom images
- **Frame not loading**: Make sure you're testing within the Farcaster Frame debugger

## License

MIT License - see [LICENSE](LICENSE) file for details.

Note: The US Citizenship test questions are from the official USCIS civics test and are in the public domain.