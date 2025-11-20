export default {
  routes: [
    {
      method: "POST",
      path: "/video-questions/ask",
      handler: "video-question.askQuestion",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/video-questions",
      handler: "video-question.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
