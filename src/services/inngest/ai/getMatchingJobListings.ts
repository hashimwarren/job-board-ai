import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema"
import { z } from "zod"
import { getMatchingJobListings as mastraGetMatchingJobListings } from "@/services/mastra/jobMatchingAgent"

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

export type ListingSchema = z.infer<typeof listingSchema>

export async function getMatchingJobListings(
  prompt: string,
  jobListings: ListingSchema[],
  { maxNumberOfJobs }: { maxNumberOfJobs?: number } = {}
) {
  return await mastraGetMatchingJobListings(prompt, jobListings, { maxNumberOfJobs })
}
