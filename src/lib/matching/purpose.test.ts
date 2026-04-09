import { describe, it, expect } from "vitest";
import { computePurposeVector, matchMissions, getQuestionOptions } from "./purpose";

describe("Purpose Matching", () => {
  it("computes a purpose vector from compass answers", () => {
    const answers = ["teaching", "education", "teach", "illiteracy", "mentor"];
    const vector = computePurposeVector(answers);

    expect(vector.knowledge).toBeGreaterThan(0);
    expect(vector.people).toBeGreaterThan(0);
    // Knowledge + people should dominate for a teaching-focused profile
    expect(vector.knowledge + vector.people).toBeGreaterThan(vector.craft + vector.nature);
  });

  it("matches missions by purpose vector similarity", () => {
    const answers = ["teaching", "education", "teach", "illiteracy", "mentor"];
    const vector = computePurposeVector(answers);
    const matched = matchMissions(vector);

    expect(matched.length).toBeGreaterThan(0);
    expect(matched.length).toBeLessThanOrEqual(5);
    // Top mission should be knowledge or people category
    expect(["knowledge", "people"]).toContain(matched[0].category);
  });

  it("returns different rankings for different profiles", () => {
    const teacherAnswers = ["teaching", "education", "teach", "illiteracy", "mentor"];
    const gardenAnswers = ["gardening", "greenery", "grow", "pollution", "grower"];

    const teacherMissions = matchMissions(computePurposeVector(teacherAnswers));
    const gardenMissions = matchMissions(computePurposeVector(gardenAnswers));

    // Different profiles should get different top missions
    expect(teacherMissions[0].id).not.toBe(gardenMissions[0].id);
  });

  it("provides question options for all 5 questions", () => {
    for (let i = 0; i < 5; i++) {
      const options = getQuestionOptions(i);
      expect(options.length).toBe(6);
      for (const opt of options) {
        expect(opt.value).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(opt.labelHi).toBeTruthy();
      }
    }
  });

  it("normalizes vector values to 0-1 range", () => {
    const answers = ["teaching", "education", "teach", "illiteracy", "mentor"];
    const vector = computePurposeVector(answers);

    for (const value of Object.values(vector)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});
