import { db } from "@/drizzle/db"
import { inngest } from "../client"
import { eq } from "drizzle-orm"
import { UserResumeTable } from "@/drizzle/schema"
import { updateUserResume } from "@/features/users/db/userResumes"
import { summarizeResume } from "@/services/mastra/resumeAgent"

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      })
    })

    if (userResume == null) return

    const aiSummary = await step.run("create-ai-summary", async () => {
      return await summarizeResume(userResume.resumeFileUrl)
    })

    await step.run("save-ai-summary", async () => {
      await updateUserResume(userId, { aiSummary })
    })
  }
)
