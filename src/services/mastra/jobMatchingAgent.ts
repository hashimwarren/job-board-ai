import { generateText } from "ai"
import { z } from "zod"
import { createGoogleModel } from "./client"
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema"

const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  wage: z.number().nullable(),
  wageInterval: z.enum(wageIntervals).nullable(),
  stateAbbreviation: z.string().nullable(),
  city: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  type: z.enum(jobListingTypes),
  locationRequirement: z.enum(locationRequirements),
})

export async function getMatchingJobListings(
  userPrompt: string,
  jobListings: z.infer<typeof listingSchema>[],
  { maxNumberOfJobs }: { maxNumberOfJobs?: number } = {}
): Promise<string[]> {
  try {
    const NO_JOBS = "NO_JOBS"

    const systemPrompt = `You are an expert at matching people with jobs based on their specific experience and requirements. The provided user prompt will be a description that can include information about themselves as well what they are looking for in a job. ${
      maxNumberOfJobs
        ? `You are to return up to ${maxNumberOfJobs} jobs.`
        : `Return all jobs that match their requirements.`
    } Return the jobs as a comma separated list of jobIds. If you cannot find any jobs that match the user prompt, return the text "${NO_JOBS}".

Here is the JSON array of available job listings:
${JSON.stringify(
  jobListings.map(listing =>
    listingSchema
      .transform(listing => ({
        ...listing,
        wage: listing.wage ?? undefined,
        wageInterval: listing.wageInterval ?? undefined,
        city: listing.city ?? undefined,
        stateAbbreviation: listing.stateAbbreviation ?? undefined,
        locationRequirement: listing.locationRequirement ?? undefined,
      }))
      .parse(listing)
  ),
  null,
  2
)}`

    const result = await generateText({
      model: createGoogleModel("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    const responseText = result.text.trim()

    if (responseText === NO_JOBS) {
      return []
    }

    return responseText
      .split(",")
      .map(jobId => jobId.trim())
      .filter(Boolean)
  } catch (error) {
    console.error("Error matching job listings:", error)
    return []
  }
}