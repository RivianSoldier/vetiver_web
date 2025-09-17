import { LandingPageHeader } from "@/components/header-landing-page";
import { LandingPageObjectives } from "@/components/objective-landing-page";
import { LandingPageProblems } from "@/components/problems-landing-page";
import { LandingPageOurSolutions } from "@/components/our-solutions-landing-page";
import { LandingPageProducts } from "@/components/products-landing-page";
import { LandingPageAboutUs } from "@/components/about-us-landing-page";
import { LandingPageFooter } from "@/components/footer-landing-page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <LandingPageHeader />
      <LandingPageObjectives />
      <LandingPageProblems />
      <LandingPageOurSolutions />
      <LandingPageProducts />
      <LandingPageAboutUs />
      <LandingPageFooter />
    </div>
  );
}
