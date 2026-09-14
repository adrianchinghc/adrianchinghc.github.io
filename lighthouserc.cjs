module.exports = {
  ci: {
    collect: {
      staticDistDir: "./_site",
      // Cover the homepage, proof, commercial and third-party form patterns.
      // The deterministic site check validates every generated page separately.
      url: ["/", "/client-stories/", "/work-with-me/", "/newsletter/"],
      numberOfRuns: 1,
      settings: process.env.LHCI_DEVICE === "desktop" ? { preset: "desktop" } : {}
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95, aggregationMethod: "median" }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }]
      }
    },
    upload: { target: "filesystem", outputDir: `./lighthouse-reports/${process.env.LHCI_DEVICE || "mobile"}` }
  }
};
