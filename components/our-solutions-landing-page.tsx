import Image from "next/image";
export function LandingPageOurSolutions() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center min-h-[426px] bg-[#0d0d0d] w-full p-4 md:p-[40px] xl:p-[90px] gap-14 lg:gap-0 max-w-[1920px]">
      <div className="flex flex-col gap-6 mb-10 md:mb-0 max-w-none">
        <h1 className="font-nunito font-light text-3xl">Nossa Solução</h1>
        <h1 className="font-poppins font-semibold text-5xl bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent leading-tight">
          Como Funciona o Vetiver
        </h1>
        <p className="max-w-xl text-white font-nunito mt-4">
          O sistema Vetiver funciona por meio de duas aplicações complementares,
          que se conectam para criar um ecossistema completo de gestão de
          resíduos.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-9">
        <div className="flex flex-col w-[240px] h-[254px] justify-between">
          <div className="h-[54px] w-[240px] bg-gradient-to-r from-[#008D80] to-[#45BF55] rounded-t-sm">
            <div className="h-[52px] w-[236px] bg-[#0d0d0d] rounded-t-sm flex justify-center items-center mx-auto mt-[2px]"></div>
          </div>
          <div className="h-[110px] w-[240px] bg-[#0d0d0d] flex items-center justify-center">
            <Image
              src="/icone_reporte.svg"
              alt="Descrição da imagem"
              width={96}
              height={96}
              className="mt-[-16px]"
            />
          </div>
          <div className="h-[90px] w-[240px] bg-gradient-to-r from-[#008D80] to-[#45BF55] rounded-b-sm flex items-center justify-center px-5">
            <p className="text-white font-nunito my-auto text-center">
              <span className="font-bold">O cidadão reporta </span>o descarte
              irregular
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[240px] h-[254px] justify-between">
          <div className="h-[54px] w-[240px] bg-gradient-to-r from-[#008D80] to-[#45BF55] rounded-t-sm">
            <div className="h-[52px] w-[236px] bg-[#0d0d0d] rounded-t-sm flex justify-center items-center mx-auto mt-[2px]"></div>
          </div>
          <div className="h-[110px] w-[240px] bg-[#0d0d0d] flex items-center justify-center">
            <Image
              src="/caminhao-de-lixo.svg"
              alt="Descrição da imagem"
              width={104}
              height={104}
              className="mt-[-48px]"
            />
          </div>
          <div className="h-[90px] w-[240px] bg-gradient-to-r from-[#008D80] to-[#45BF55] rounded-b-sm flex items-center justify-center px-5">
            <p className="text-white font-nunito my-auto text-center">
              <span className="font-bold">O gestor acompanha e coleta </span>o
              lixo reportado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
