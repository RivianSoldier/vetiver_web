"use client";
import Waves from "./Waves";

export function LandingPageObjectives() {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start min-h-24 bg-[#0d0d0d] w-full max-w-[1920px]">
      <div className="flex flex-col items-start justify-start w-full md:w-[58%] px-5 sm:px-10 md:px-10 xl:px-20 py-5 sm:py-10 md:py-10 md:pb-0 xl:py-20 xl:pb-0 gap-5">
        <h1 className="font-nunito font-light text-3xl">Nosso Objetivo</h1>
        <div className="flex flex-col gap-8">
          <h1 className="font-poppins font-semibold text-5xl bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent max-w-[100%] md:max-w-[90%]  leading-tight">
            Transformar Desafios em Soluções Inteligentes
          </h1>

          <div>
            <p className="mt-4 text-white font-nunito">
              A gestão de resíduos urbanos é um problema global que afeta o meio
              ambiente, a saúde e as finanças das cidades. Onde a coleta
              tradicional e a fiscalização falham, a tecnologia e a participação
              cidadã podem abrir um novo caminho.
            </p>
            <p className="mt-4 text-white font-nunito">
              Nosso objetivo é combater o descarte irregular e otimizar a gestão
              de resíduos através do Vetiver, um sistema inteligente que une
              tecnologia de ponta e ação comunitária.
            </p>
          </div>
        </div>
      </div>
      <div className="relative min-h-[400px] sm:min-h-[600px] w-full md:w-[42%] bg-gray-800">
        <Waves
          lineColor="#074740"
          backgroundColor="#0d0d0d"
          waveSpeedX={0.01}
          waveSpeedY={0.01}
          waveAmpX={20}
          waveAmpY={20}
          friction={0.4}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
    </div>
  );
}
