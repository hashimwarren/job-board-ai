import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { env } from "@/data/env/server"

// Create provider instances with API keys
const anthropicProvider = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})

const googleProvider = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
})

// Export model creation functions
export const createAnthropicModel = (model: string) => anthropicProvider(model)
export const createGoogleModel = (model: string) => googleProvider(model)