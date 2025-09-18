import { CodeXml } from "lucide-react";

export function LandingPageAboutUs() {
  return (
    <div className="border-t-[1px] border-[#404040] w-full flex justify-center items-center">
      <div className="flex flex-col lg:flex-row justify-between items-center min-h-[426px] bg-[#0d0d0d] w-full px-4 py-12 md:p-[40px] xl:p-[90px] lg:gap-0 max-w-[1920px]">
        <div className="flex flex-col gap-7 mb-10 md:mb-0 max-w-none">
          <h1 className="font-nunito font-light text-3xl">Sobre Nós</h1>
          <h1 className="font-poppins font-semibold text-5xl bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent leading-tight">
            Conheça a equipe
          </h1>
          <div className="max-w-xl flex flex-col gap-5">
            <p className="text-white font-nunito">
              O Vetiver é um projeto criado por quatro estudantes de Ciência da
              Computação do Instituto Mauá de Tecnologia.
            </p>
            <p className="text-white font-nunito">
              Nós unimos nossos conhecimentos para desenvolver uma solução
              tecnológica que combate um desafio urbano real.
            </p>
            <p className="text-white font-nunito">
              Nossa missão é usar a tecnologia para construir cidades mais
              limpas e inteligentes, com a colaboração de todos.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-14 lg:mt-0">
          <div className="w-[306px] h-[176px] rounded-lg bg-[#262626] flex flex-col items-center justify-end">
            <div className="w-[304px] h-[122px] bg-[#0d0d0d] rounded-b-lg mb-[1px] flex flex-row justify-start items-center pl-4 gap-5">
              <div className="flex justify-center items-center rounded-full bg-[#262626] w-[74px] h-[74px]">
                <CodeXml className="text-[#008D80] w-8 h-8 " />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-poppins font-semibold text-white">
                  Diogo Carvalho
                </p>
                <p className="font-nunito text-[#008D80]">Desenvolvedor</p>
              </div>
            </div>
          </div>
          <div className="w-[306px] h-[176px] rounded-lg bg-[#262626] flex flex-col items-center justify-end">
            <div className="w-[304px] h-[122px] bg-[#0d0d0d] rounded-b-lg mb-[1px] flex flex-row justify-start items-center pl-4 gap-5">
              <div className="flex justify-center items-center rounded-full bg-[#262626] w-[74px] h-[74px]">
                <CodeXml className="text-[#23A66B] w-8 h-8 " />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-poppins font-semibold text-white">
                  Othavio Losovoi
                </p>
                <p className="font-nunito text-[#23A66B]">Desenvolvedor</p>
              </div>
            </div>
          </div>
          <div className="w-[306px] h-[176px] rounded-lg bg-[#262626] flex flex-col items-center justify-end">
            <div className="w-[304px] h-[122px] bg-[#0d0d0d] rounded-b-lg mb-[1px] flex flex-row justify-start items-center pl-4 gap-5">
              <div className="flex justify-center items-center rounded-full bg-[#262626] w-[74px] h-[74px]">
                <CodeXml className="text-[#34B360] w-8 h-8 " />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-poppins font-semibold text-white">
                  Gabriel Martins
                </p>
                <p className="font-nunito text-[#34B360]">Desenvolvedor</p>
              </div>
            </div>
          </div>
          <div className="w-[306px] h-[176px] rounded-lg bg-[#262626] flex flex-col items-center justify-end">
            <div className="w-[304px] h-[122px] bg-[#0d0d0d] rounded-b-lg mb-[1px] flex flex-row justify-start items-center pl-4 gap-5">
              <div className="flex justify-center items-center rounded-full bg-[#262626] w-[74px] h-[74px]">
                <CodeXml className="text-[#45BF55] w-8 h-8 " />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-poppins font-semibold text-white">
                  Bruno Teruya
                </p>
                <p className="font-nunito text-[#45BF55]">Desenvolvedor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
