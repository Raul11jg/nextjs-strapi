import { factories } from "@strapi/strapi";
import { aiService } from "../../../services/ai";
import { youtubeService } from "../../../services/youtube";

export default factories.createCoreController("api::video-summary.video-summary", ({ strapi }) => ({
  /**
   * Custom endpoint to process a YouTube video
   * POST /api/video-summaries/process
   */
  async processVideo(ctx) {
    try {
      const { youtubeUrl } = ctx.request.body;
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to process videos");
      }

      if (!youtubeUrl) {
        return ctx.badRequest("YouTube URL is required");
      }

      // Extract video ID
      const videoId = youtubeService.extractVideoId(youtubeUrl);
      if (!videoId) {
        return ctx.badRequest("Invalid YouTube URL");
      }

      // Check if video already processed by this user
      const existing = await strapi.entityService.findMany("api::video-summary.video-summary", {
        filters: {
          youtubeVideoId: videoId,
          user: user.id,
        },
      });

      if (existing && (existing as any).length > 0) {
        ctx.status = 200;
        ctx.body = {
          data: (existing as any)[0],
          message: "Video already processed",
        };
        return;
      }

      // Create initial record with processing status
      const videoSummary = await strapi.entityService.create("api::video-summary.video-summary", {
        data: {
          youtubeUrl,
          youtubeVideoId: videoId,
          status: "processing",
          user: user.id,
        },
      });

      // Process video asynchronously
      setImmediate(async () => {
        try {
          // Fetch video metadata
          const metadata = await youtubeService.getVideoMetadata(videoId);

          // Update with metadata
          await strapi.entityService.update("api::video-summary.video-summary", (videoSummary as any).id, {
            data: {
              title: metadata.title,
              thumbnail: metadata.thumbnail,
              duration: metadata.duration,
            },
          });

          // Download audio
          const audioBuffer = await youtubeService.downloadAudio(videoId);

          // Transcribe
          const transcript = await aiService.transcribeAudio(audioBuffer);

          // Summarize
          const summary = await aiService.summarizeTranscript(transcript);

          // Update with results
          await strapi.entityService.update("api::video-summary.video-summary", (videoSummary as any).id, {
            data: {
              transcript,
              summary,
              status: "completed",
            },
          });

          strapi.log.info(`Video ${videoId} processed successfully`);
        } catch (error: any) {
          strapi.log.error("Error processing video:", error);

          // Update with error
          await strapi.entityService.update("api::video-summary.video-summary", (videoSummary as any).id, {
            data: {
              status: "failed",
              errorMessage: error.message,
            },
          });
        }
      });

      // Return immediately with processing status
      ctx.status = 200;
      ctx.body = {
        data: videoSummary,
        message: "Video processing started",
      };
      return;
    } catch (error) {
      console.log("Error in processVideo:", error);
      strapi.log.error("Error in processVideo:", error);
      return ctx.internalServerError("Failed to process video");
    }
  },

  /**
   * Get user's video summaries
   * GET /api/video-summaries
   */
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const entities = await strapi.entityService.findMany("api::video-summary.video-summary", {
      filters: {
        user: user.id,
      },
      sort: { createdAt: "desc" },
      populate: ["videoQuestions"],
    });

    ctx.status = 200;
    ctx.body = { data: entities };
    return;
  },

  /**
   * Get single video summary
   * GET /api/video-summaries/:id
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const entity = await strapi.entityService.findOne("api::video-summary.video-summary", id, {
      populate: ["videoQuestions", "user"],
    });

    if (!entity) {
      return ctx.notFound("Video summary not found");
    }

    // Check ownership
    if ((entity as any).user?.id !== user.id) {
      return ctx.forbidden("You do not have access to this video summary");
    }

    ctx.status = 200;
    ctx.body = { data: entity };
    return;
  },
}));
