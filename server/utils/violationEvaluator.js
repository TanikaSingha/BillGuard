const checkRestrictedZone = require("./checkRestrictedZone");

const evaluateHoardingViolations = async (hoardings) => {
  const results = [];

  for (const h of hoardings) {
    const hoardingResult = { violations: [] };
    const detectedObjects = [];

    // 1️⃣ Size & Angle Checks
    if (h.width <= 60 || h.height >= 20) {
      hoardingResult.violations.push("Size not approved");
      detectedObjects.push("oversized/undersized hoarding");
    }

    if (h.angle > 30) {
      hoardingResult.violations.push("Hoarding angle > 30°");
      detectedObjects.push("improper angle");
    }

    // 2️⃣ Content Violations (OCR keywords)
    const bannedKeywords = ["alcohol", "drugs", "nudity", "porn", "tobacco"];
    if (Array.isArray(h.ocrText)) {
      h.ocrText.forEach((ocrItem) => {
        const text = ocrItem.text.toLowerCase();
        bannedKeywords.forEach((word) => {
          if (text.includes(word)) {
            hoardingResult.violations.push(`Content violation: ${word}`);
            detectedObjects.push(word);
          }
        });
      });
    }

    // 3️⃣ Dynamic Restricted Zone Check
    if (h.gps) {
      const restrictedMsg = await checkRestrictedZone(h.gps.lat, h.gps.lon);
      if (restrictedMsg) {
        hoardingResult.violations.push(restrictedMsg);
        detectedObjects.push("restricted-zone");
      }
    }

    // 4️⃣ AI Verdict & Confidence
    let verdict = "authorized";
    let confidence = 0.9;

    if (hoardingResult.violations.length > 0) {
      verdict = "unauthorized";
      confidence = 0.95; // high confidence if rules broken
    } else if (detectedObjects.length === 0) {
      verdict = "unsure";
      confidence = 0.5;
    }

    results.push({
      violations: hoardingResult.violations,
      aiAnalysis: {
        verdict,
        confidence,
        detectedObjects,
      },
    });
  }

  return { status: "success", results };
};

module.exports = evaluateHoardingViolations;
