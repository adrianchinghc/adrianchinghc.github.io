module.exports = {
  ci: {
    collect: {
      staticDistDir: "./_site",
      url: process.env.LHCI_GROUP === "content"
        ? ["/", "/about/", "/blog/", "/client-stories/"]
        : process.env.LHCI_GROUP === "commercial"
          ? ["/work-with-me/", "/ai-profit-opportunity-audit/", "/advisory/", "/newsletter/"]
          : ["/", "/about/", "/blog/", "/work-with-me/", "/ai-profit-opportunity-audit/", "/advisory/", "/newsletter/", "/client-stories/"],
      numberOfRuns: 3,
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
    upload: { target: "filesystem", outputDir: "./lighthouse-reports" }
  }
};
