import { factories } from "@strapi/strapi";
import { aiService } from "../../../services/ai";

export default factories.createCoreController("api::video-question.video-question", ({ strapi }) => ({
  /**
   * Ask a question about a video
   * POST /api/video-questions/ask
   */
  async askQuestion(ctx) {
    try {
      const { videoSummaryId, question } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      if (!videoSummaryId || !question) {
        return ctx.badRequest("Video summary ID and question are required");
      }

      // Validate question length
      if (question.length < 10 || question.length > 500) {
        return ctx.badRequest("Question must be between 10 and 500 characters");
      }

      // Fetch video summary
      const videoSummary = await strapi.entityService.findOne("api::video-summary.video-summary", videoSummaryId, {
        populate: ["user"],
      });

      if (!videoSummary) {
        return ctx.notFound("Video summary not found");
      }

      // Check ownership
      if ((videoSummary as any).user?.id !== user.id) {
        return ctx.forbidden("You do not have access to this video summary");
      }

      // Check if video processing is complete
      if ((videoSummary as any).status !== "completed") {
        return ctx.badRequest(`Video is still ${(videoSummary as any).status}. Please wait for processing to complete.`);
      }

      // Get conversation history (last 5 Q&A pairs)
      const previousQuestions = await strapi.entityService.findMany("api::video-question.video-question", {
        filters: {
          videoSummary: videoSummaryId,
          user: user.id,
        },
        sort: { createdAt: "desc" },
        limit: 5,
      });

      const conversationHistory = (previousQuestions as any[]).reverse().map((q: any) => ({
        question: q.question,
        answer: q.answer,
      }));

      // Get AI answer
      const answer = await aiService.answerQuestion((videoSummary as any).transcript, (videoSummary as any).summary, question, conversationHistory);

      // Save question and answer
      const questionEntity = await strapi.entityService.create("api::video-question.video-question", {
        data: {
          question,
          answer,
          videoSummary: videoSummaryId,
          user: user.id,
        },
      });

      return ctx.ok({
        data: questionEntity,
        message: "Question answered successfully",
      });
    } catch (error) {
      strapi.log.error("Error answering question:", error);
      return ctx.internalServerError("Failed to answer question");
    }
  },

  /**
   * Get questions for a video summary
   * GET /api/video-questions?videoSummaryId=X
   */
  async find(ctx) {
    const user = ctx.state.user;
    const { videoSummaryId } = ctx.query;

    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    if (!videoSummaryId) {
      return ctx.badRequest("Video summary ID is required");
    }

    // Verify user owns the video summary
    const videoSummary = await strapi.entityService.findOne("api::video-summary.video-summary", videoSummaryId as any, {
      populate: ["user"],
    });

    if (!videoSummary || (videoSummary as any).user?.id !== user.id) {
      return ctx.forbidden("You do not have access to this video summary");
    }

    const entities = await strapi.entityService.findMany("api::video-question.video-question", {
      filters: {
        videoSummary: videoSummaryId,
        user: user.id,
      },
      sort: { createdAt: "asc" },
    });

    return ctx.ok({ data: entities });
  },
}));
