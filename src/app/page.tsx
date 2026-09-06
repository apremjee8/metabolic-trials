import { TrialExplorer } from "@/components/TrialExplorer";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 max-w-3xl">
        <p className="text-[12px] font-medium tracking-[0.14em] text-[#6a675e] uppercase">
          Cardiometabolic comparison
        </p>
        <h1 className="mt-1 text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
          Metabolic trials
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#4e4b43]">
          Lp(a) outcomes programs next to PRECAD and a short list of completed
          metabolic CVOTs. Filter and sort. Click an NCT ID for the
          ClinicalTrials.gov record.
        </p>
      </header>
      <TrialExplorer />
    </main>
  );
}
