import { wordleFeedback } from "./Feedback";

describe("wordleFeedback", () => {
  it("returns all green for exact match", () => {
    expect(wordleFeedback("APPLE", "APPLE")).toEqual(["G", "G", "G", "G", "G"]);
  });

  it("returns all black for no matches", () => {
    expect(wordleFeedback("AAAAA", "BBBBB")).toEqual(["B", "B", "B", "B", "B"]);
  });

  it("greens are marked left to right", () => {
    expect(wordleFeedback("APAPA", "APBBB")).toEqual(["G", "G", "B", "B", "B"]);
  });

  it("yellows are marked after greens", () => {
    expect(wordleFeedback("FOTON", "FYNBO")).toEqual(["G", "Y", "B", "B", "Y"]);
  });
});
