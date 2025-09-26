import { generateText } from "ai"
import { createAnthropicModel } from "./client"

export async function summarizeResume(resumeUrl: string): Promise<string> {
  try {
    const result = await generateText({
      model: createAnthropicModel("claude-3-5-sonnet-latest"),
      messages: [
        {
          role: "user",
          content: `Please analyze the resume at this URL: ${resumeUrl}

Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.`,
        },
      ],
    })

    return result.text
  } catch (error) {
    console.error("Error summarizing resume:", error)
    return "N/A"
  }
}