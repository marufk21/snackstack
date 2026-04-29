const { rest } = require("msw");

// Add/adjust handlers per integration test.
// Tip: keep URLs exact (including query + protocol) to avoid accidental mismatches.
const handlers = [
  rest.get("https://example.com/api/profile", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ name: "Ada Lovelace" }));
  }),
  rest.get("http://localhost/api/subscription/status", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hasSubscription: false,
        tier: "free",
        isActive: false,
        onFreeTrial: false,
        remainingTrialDays: 0,
        noteCount: 2,
        noteLimit: 5,
        remainingNotes: 3,
        limits: {
          maxNotes: 5,
          maxNotesPerMonth: 10,
          canUploadImages: false,
          canUseAI: false,
          maxImageSize: 0,
        },
      })
    );
  }),
];

module.exports = { handlers };

