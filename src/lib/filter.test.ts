import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyFilters, DEFAULT_FILTERS } from "./filter.ts";
import { TRIALS } from "./trials.ts";

describe("seed", () => {
  it("includes the six required NCT IDs", () => {
    const ids = new Set(TRIALS.map((t) => t.nctId));
    for (const nct of [
      "NCT04023552",
      "NCT05581303",
      "NCT07136012",
      "NCT06292013",
      "NCT07157774",
      "NCT06494501",
    ]) {
      assert.ok(ids.has(nct), nct);
    }
  });

  it("keeps HORIZON as the failed Completed reference", () => {
    const horizon = TRIALS.find((t) => t.id === "horizon");
    assert.equal(horizon?.status, "Completed");
    assert.equal(horizon?.failedReference, true);
    assert.equal(horizon?.nctId, "NCT04023552");
  });

  it("marks PRECAD as recruiting prevention with a personal badge", () => {
    const precad = TRIALS.find((t) => t.id === "precad");
    assert.equal(precad?.status, "Recruiting");
    assert.equal(precad?.prevention, "primary");
    assert.equal(precad?.personal, true);
    assert.equal(precad?.nctId, "NCT06494501");
  });

  it("stays at or under 20 trials", () => {
    assert.ok(TRIALS.length <= 20, String(TRIALS.length));
    assert.ok(TRIALS.length >= 6);
  });
});

describe("applyFilters", () => {
  it("filters by status and sorts recruiting first", () => {
    const rows = applyFilters(TRIALS, { ...DEFAULT_FILTERS, status: "Recruiting" });
    assert.ok(rows.length > 0);
    assert.ok(rows.every((t) => t.status === "Recruiting"));
    assert.ok(rows.some((t) => t.id === "precad"));
  });

  it("filters PRECAD by sponsor and mechanism", () => {
    const rows = applyFilters(TRIALS, {
      ...DEFAULT_FILTERS,
      sponsor: "Icahn School of Medicine at Mount Sinai",
      mechanism: "PCSK9 siRNA",
    });
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.id, "precad");
  });

  it("sorts by primary completion date", () => {
    const rows = applyFilters(TRIALS, { ...DEFAULT_FILTERS, sort: "completion" });
    const dates = rows.map((t) => t.primaryCompletion);
    assert.deepEqual(dates, [...dates].sort());
  });
});
