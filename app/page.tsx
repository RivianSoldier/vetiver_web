import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LandingPageHeader } from "@/components/header-landing-page";
import { LandingPageObjectives } from "@/components/objective-landing-page";
import { LandingPageProblems } from "@/components/problems-landing-page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <LandingPageHeader />
      <LandingPageObjectives />
      <LandingPageProblems />
    </div>
  );
}
