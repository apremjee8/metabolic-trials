import type { SortKey, Trial, TrialFilters, TrialStatus } from "./types";

const STATUS_RANK: Record<TrialStatus, number> = {
  Recruiting: 0,
  "Active, not recruiting": 1,
  Completed: 2,
};

export const DEFAULT_FILTERS: TrialFilters = {
  status: "all",
  mechanism: "all",
  prevention: "all",
  sponsor: "all",
  sort: "status",
};

export function applyFilters(trials: Trial[], filters: TrialFilters): Trial[] {
  const rows = trials.filter((trial) => {
    if (filters.status !== "all" && trial.status !== filters.status) return false;
    if (filters.mechanism !== "all" && trial.mechanism !== filters.mechanism) {
      return false;
    }
    if (filters.prevention !== "all" && trial.prevention !== filters.prevention) {
      return false;
    }
    if (filters.sponsor !== "all" && trial.sponsor !== filters.sponsor) {
      return false;
    }
    return true;
  });

  return sortTrials(rows, filters.sort);
}

export function sortTrials(trials: Trial[], sort: SortKey): Trial[] {
  return [...trials].sort((a, b) => {
    if (sort === "status") {
      const byStatus = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      if (byStatus !== 0) return byStatus;
      return a.primaryCompletion.localeCompare(b.primaryCompletion);
    }
    const byDate = a.primaryCompletion.localeCompare(b.primaryCompletion);
    if (byDate !== 0) return byDate;
    return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  });
}
