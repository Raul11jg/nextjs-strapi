export default {
  routes: [
    {
      method: "POST",
      path: "/video-summaries/process",
      handler: "video-summary.processVideo",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/video-summaries",
      handler: "video-summary.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/video-summaries/:id",
      handler: "video-summary.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
