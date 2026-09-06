export const STATUSES = [
  "Recruiting",
  "Active, not recruiting",
  "Completed",
] as const;

export type TrialStatus = (typeof STATUSES)[number];

export const PREVENTION_TYPES = ["primary", "secondary", "mixed"] as const;

export type PreventionType = (typeof PREVENTION_TYPES)[number];

export const MECHANISMS = [
  "LPA ASO",
  "LPA siRNA",
  "Lp(a) assembly inhibitor",
  "PCSK9 siRNA",
  "PCSK9 mAb",
  "GLP-1 RA",
  "Dual GIP/GLP-1 RA",
  "SGLT2 inhibitor",
  "ACL inhibitor",
] as const;

export type MechanismClass = (typeof MECHANISMS)[number];

export const SORTS = ["status", "completion"] as const;

export type SortKey = (typeof SORTS)[number];

export type Trial = {
  id: string;
  nctId: string;
  name: string;
  agent: string;
  sponsor: string;
  company: string;
  mechanism: MechanismClass;
  dose: string;
  population: string;
  biomarkerThreshold: string | null;
  enrollment: number;
  enrollmentType: "actual" | "estimated";
  primaryEndpoint: string;
  startDate: string;
  primaryCompletion: string;
  status: TrialStatus;
  prevention: PreventionType;
  keyDifference: string;
  failedReference?: boolean;
  personal?: boolean;
  lpLoweringPct?: number;
};

export type TrialFilters = {
  status: TrialStatus | "all";
  mechanism: MechanismClass | "all";
  prevention: PreventionType | "all";
  sponsor: string | "all";
  sort: SortKey;
};
