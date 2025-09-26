import { generateObject } from "ai"
import { z } from "zod"
import { createGoogleModel } from "./client"
import { updateJobListingApplication } from "@/features/jobListingApplications/db/jobListingsApplications"

const applicantRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reasoning: z.string(),
})

interface JobListing {
  id: string
  city: string | null
  description: string
  experienceLevel: string
  locationRequirement: string
  stateAbbreviation: string | null
  title: string
  wage: number | null
  wageInterval: string | null
  type: string
}

export async function rankApplicant({
  userId,
  jobListingId,
  resumeSummary,
  coverLetter = undefined,
  jobListing,
}: {
  userId: string
  jobListingId: string
  resumeSummary: string
  coverLetter?: string | null
  jobListing: JobListing
}): Promise<void> {
  try {
    const prompt = `You are an expert at ranking job applicants for specific jobs based on their resume and cover letter. 

Rate this applicant for the following job listing on a scale from 1-5, where:
- 5: Perfect or near perfect match
- 4: Strong match with most requirements met
- 3: Barely meets the requirements
- 2: Some relevant experience but missing key requirements
- 1: Does not meet the requirements at all

Job Listing:
${JSON.stringify(jobListing, null, 2)}

Applicant Resume Summary:
${resumeSummary}

${coverLetter ? `Cover Letter:\n${coverLetter}` : ""}

Provide your rating and reasoning.`

    const result = await generateObject({
      model: createGoogleModel("gemini-2.0-flash"),
      schema: applicantRatingSchema,
      prompt,
    })

    // Save the rating to the database
    await updateJobListingApplication(
      { jobListingId, userId },
      { rating: result.object.rating }
    )

    console.log(`Ranked applicant ${userId} for job ${jobListingId}: ${result.object.rating}/5 - ${result.object.reasoning}`)
  } catch (error) {
    console.error("Error ranking applicant:", error)
    // Don't throw error to avoid breaking the workflow
  }
}