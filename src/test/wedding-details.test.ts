import { describe, expect, it } from "vitest";

import { weddingDetails } from "@/lib/wedding-details";

describe("wedding invitation details", () => {
  it("uses the confirmed wedding date", () => {
    expect(weddingDetails.dateISO).toBe("2027-11-22T15:00:00");
  });

  it("keeps the event schedule in the requested order", () => {
    expect(weddingDetails.events.map((event) => event.time)).toEqual([
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "18:00",
      "20:30",
      "23:00",
    ]);
  });
});