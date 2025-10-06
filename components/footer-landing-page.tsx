import Image from "next/image";
export function LandingPageFooter() {
  return (
    <div className="flex flex-row items-center justify-between min-h-20 bg-gradient-to-r from-[#008D80]/15 to-[#45BF55]/15 border-b-[1px] border-[#404040] w-full px-6">
      <div className="flex flex-row items-center gap-3">
        <div>
          <Image src="/email_lp.svg" alt="Logo" width={40} height={40} />
        </div>
        <h1 className="text-white font-nunito">Vetiver@gmail.com</h1>
      </div>
      <div>
        <p className="text-white font-nunito">© Vetiver 2025</p>
      </div>
    </div>
  );
}
