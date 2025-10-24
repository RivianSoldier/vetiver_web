import Image from "next/image";
export function LandingPageProducts() {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col md:flex-row justify-center items-center min-h-48 bg-[#0d0d0d] w-full border-y-[1px] border-[#404040]">
        <h1 className="font-poppins font-semibold text-5xl text-white">
          Para Cidadãos
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center min-h-48 bg-[#0d0d0d] w-full gap-10 max-w-[1920px]">
        <div className="flex flex-col justify-center items-center min-h-[630px] py-10 px-7">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#008D80] rounded-sm font-poppins font-bold">
              1
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Relate o Descarte
            </h1>
            <p className="font-nunito max-w-[300px]">
              Tire uma foto ou selecione da galeria, e envie a denúncia.
            </p>
          </div>
          <Image
            src="/card1.png"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>

        <div className="flex justify-center items-center my-auto w-full md:w-fit flex-col min-h-[630px] py-10 px-10 border-y-[1px] md:border-x-[1px] md:border-y-0 border-[#404040]">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#23A66A] rounded-sm font-poppins font-bold">
              2
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Acompanhe o Status
            </h1>
            <p className="font-nunito max-w-[300px]">
              Na tela de histórico, acompanhe o status da sua denúncia.
            </p>
          </div>
          <Image
            src="/card2.png"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>

        <div className="flex flex-col justify-center items-center min-h-[630px] py-10 px-7">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#45BF55] rounded-sm font-poppins font-bold">
              3
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Acumule Recompensas
            </h1>
            <p className="font-nunito max-w-[300px]">
              A cada denúncia, ganhe e acumule LixoCoins.
            </p>
          </div>
          <Image
            src="/card3.png"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center min-h-48 bg-[#0d0d0d] w-full border-y-[1px] border-[#404040]">
        <h1 className="font-poppins font-semibold text-5xl text-white">
          Para Gestores
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center min-h-48 bg-[#0d0d0d] w-full gap-10 max-w-[1920px]">
        <div className="flex flex-col justify-center items-center min-h-[630px] py-10 px-7">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#008D80] rounded-sm font-poppins font-bold">
              1
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Localize os Descartes
            </h1>
            <p className="font-nunito max-w-[300px]">
              Visualize descartes denunciados em um mapa em tempo real.
            </p>
          </div>
          <Image
            src="/card4.jpg"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>

        <div className="flex justify-center items-center my-auto w-full md:w-fit flex-col min-h-[630px] py-10 px-10 border-y-[1px] md:border-x-[1px] md:border-y-0 border-[#404040]">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#23A66A] rounded-sm font-poppins font-bold">
              2
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Calcule a Rota de Coleta
            </h1>
            <p className="font-nunito max-w-[300px]">
              Use a ferramenta para otimizar as rotas de diversos focos de
              descarte.
            </p>
          </div>
          <Image
            src="/card5.jpg"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>

        <div className="flex flex-col justify-center items-center min-h-[630px] py-10 px-7">
          <div className="flex flex-col items-start gap-5">
            <div className="flex justify-center items-center w-9 h-9 bg-[#45BF55] rounded-sm font-poppins font-bold">
              3
            </div>
            <h1 className="font-poppins font-semibold text-xl text-white">
              Visualize e Extraia Dados
            </h1>
            <p className="font-nunito max-w-[300px]">
              Consulte o histórico de coletas e extraia os dados dos descartes.
            </p>
          </div>
          <Image
            src="/card6.jpg"
            alt="Descrição da imagem"
            width={360}
            height={336}
            className="rounded-md mt-12"
          />
        </div>
      </div>
    </div>
  );
}
