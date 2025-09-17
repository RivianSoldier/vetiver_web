import Image from "next/image";
export function LandingPageProblems() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[356px] bg-gradient-to-r from-[#008D80]/15 to-[#45BF55]/15 w-full p-4 md:p-[40px] xl:p-[90px] gap-12 ">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-[1920px] w-full px-4">
        <div className="flex flex-col text-center md:text-left md:items-start">
          <h1 className="font-poppins font-semibold text-5xl text-white text-center md:text-start leading-tight max-w-[100%] md:max-w-[90%]">
            O Problema em Números
          </h1>
          {/* <h1 className="font-poppins font-semibold text-5xl text-white mt-5">
            em Números
          </h1> */}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex flex-col items-center gap-9">
            <div className="w-[100px] h-[100px] bg-[#008D80] rounded-sm flex items-center justify-center">
              <Image
                src="/problema1.svg"
                alt="Descrição da imagem"
                width={68}
                height={68}
                className="rounded-sm"
              />
            </div>

            <p className="max-w-xs text-white font-nunito mt-5 text-center text-md">
              <span className="font-bold text-md">80% do lixo marinho </span>
              tem origem terrestre, afetando ecossistemas e a vida selvagem.
            </p>
          </div>
          <div className="flex flex-col items-center gap-9">
            <div className="w-[100px] h-[100px] bg-[#23A66A] rounded-sm flex items-center justify-center">
              <Image
                src="/problema2.svg"
                alt="Descrição da imagem"
                width={68}
                height={68}
                className="rounded-sm"
              />
            </div>
            <p className="max-w-xs text-white font-nunito mt-5 text-center text-md">
              Municípios chegam a gastar
              <span className="font-bold text-md">
                {" "}
                20% de seus orçamentos{" "}
              </span>{" "}
              com sistemas de coleta ineficientes, baseados em rotas fixas.
            </p>
          </div>
          <div className="flex flex-col items-center gap-9">
            <div className="w-[100px] h-[100px] bg-[#45BF55] rounded-sm flex items-center justify-center">
              <Image
                src="/problema3.svg"
                alt="Descrição da imagem"
                width={68}
                height={68}
                className="rounded-sm"
              />
            </div>
            <p className="max-w-xs text-white font-nunito mt-5 text-center text-md">
              A falta de integração entre denúncias de cidadãos e operações de
              coleta resulta em{" "}
              <span className="font-bold text-md">respostas lentas </span>a
              problemas ambientais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
