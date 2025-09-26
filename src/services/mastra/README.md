# Mastra AI Services

This directory contains the AI-powered services using the AI SDK (as a foundation for eventual Mastra integration).

## Overview

The AI functionality has been refactored from Inngest's `@inngest/agent-kit` to use `@ai-sdk/anthropic` and `@ai-sdk/google` directly, providing a cleaner foundation for eventual Mastra integration.

## Services

### Resume Agent (`resumeAgent.ts`)
- **Purpose**: Summarizes uploaded resumes using Anthropic's Claude
- **Model**: claude-3-5-sonnet-latest
- **Input**: Resume file URL
- **Output**: Markdown-formatted summary or "N/A" if not a valid resume

### Applicant Ranking Agent (`applicantRankingAgent.ts`)
- **Purpose**: Ranks job applicants based on their resume and cover letter
- **Model**: gemini-2.0-flash
- **Input**: User ID, job listing ID, resume summary, cover letter (optional), job listing details
- **Output**: Rating (1-5) saved directly to database
- **Features**: Structured output with reasoning, automatic database persistence

### Job Matching Agent (`jobMatchingAgent.ts`)
- **Purpose**: Matches job seekers with relevant job listings
- **Model**: gemini-2.0-flash
- **Input**: User prompt (describing experience/requirements), array of job listings, optional max results
- **Output**: Array of matching job listing IDs

## Configuration

AI models are configured in `client.ts` using environment variables:
- `ANTHROPIC_API_KEY` - For Claude models
- `GEMINI_API_KEY` - For Gemini models

## Integration with Inngest

The AI services are integrated with Inngest workflows:
- `src/services/inngest/functions/resume.ts` - Resume summarization workflow
- `src/services/inngest/functions/jobListingApplication.ts` - Applicant ranking workflow
- `src/services/inngest/ai/getMatchingJobListings.ts` - Job matching wrapper

## Migration from Inngest Agent Kit

The following changes were made:
1. Replaced `@inngest/agent-kit` with `@ai-sdk/*` packages
2. Removed `step.ai.infer` usage in favor of `generateText`/`generateObject`
3. Replaced `createAgent`/`createTool` with direct AI SDK calls
4. Maintained all existing functionality while improving type safety
5. Removed dependency on `getLastOutputMessage` helper

## Future Mastra Integration

This foundation is ready for future Mastra integration by:
1. Using the AI SDK as the underlying provider system
2. Maintaining clean service interfaces
3. Following the existing project patterns for feature organization
4. Providing proper TypeScript typing for all services