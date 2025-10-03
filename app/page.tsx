import { LandingPageHeader } from "@/components/header-landing-page";
import { LandingPageObjectives } from "@/components/objective-landing-page";
import { LandingPageProblems } from "@/components/problems-landing-page";
import { LandingPageOurSolutions } from "@/components/our-solutions-landing-page";
import { LandingPageProducts } from "@/components/products-landing-page";
import { LandingPageAboutUs } from "@/components/about-us-landing-page";
import { LandingPageFooter } from "@/components/footer-landing-page";
import { redirect } from "next/navigation";

export default function Home({
  searchParams,
}: {
  searchParams: {
    error?: string;
    error_code?: string;
    error_description?: string;
  };
}) {
  // Handle auth errors from password reset links
  if (searchParams.error) {
    const errorMessage = searchParams.error_description || searchParams.error;

    if (searchParams.error_code === "otp_expired") {
      redirect(
        "/login?error=O link de recuperação expirou. Solicite um novo link."
      );
    } else {
      redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }
  }

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
