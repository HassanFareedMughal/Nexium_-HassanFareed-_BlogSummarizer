# Blog Summariser

This is a full-stack web app that allows users to input a blog URL, scrape the content, generate a simulated English summary, translate that summary into Urdu using LibreTranslate API, and save both versions to databases.

## Features

- Scrape blog content from a given URL
- Generate an English summary (mock AI behavior)
- Translate the summary to Urdu using LibreTranslate API
- Store full blog text in MongoDB
- Store Urdu summary in Supabase
- Modern UI with Tailwind and ShadCN components
- Deployed on Vercel

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Next.js API routes
- **Database**:
  - MongoDB (full text)
  - Supabase (summary in Urdu)
- **Translation API**: LibreTranslate
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with:

