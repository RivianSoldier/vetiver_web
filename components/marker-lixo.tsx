import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { HeaderButton } from "./header-button";

export function MarkerLixo({
  position,
  quantidade,
  foto,
  classes,
  planejar = false,
  isCheckbox = false,
}: {
  position: google.maps.LatLngLiteral;
  quantidade: number;
  foto: string;
  classes: Array<{ nome: string; quantidade: number }>;
  planejar?: boolean;
  isCheckbox?: boolean;
}) {
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <AdvancedMarker position={position}>
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowHoverCard(true)}
          onMouseLeave={() => setShowHoverCard(false)}
        >
          <div className="absolute top-[-12px] right-[-4px]">
            <div className="w-6 h-6 bg-[#0d0d0d] rounded-full flex justify-center items-center">
              <span className="bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent font-nunito font-bold text-sm">
                {quantidade}
              </span>
            </div>
          </div>
          <Image width={40} height={40} src="/marker.svg" alt="Marker Icon" />
          {isCheckbox && (
            <div className="absolute w-5 h-5 bottom-[-8px] rounded-md right-[-4px] bg-[#0d0d0d] ">
              <Checkbox className="w-5 h-5 cursor-pointer" />
            </div>
          )}
        </div>
      </AdvancedMarker>

      {showHoverCard && (
        <AdvancedMarker position={position}>
          <div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-in fade-in-50 zoom-in-50 duration-350"
            onMouseEnter={() => setShowHoverCard(true)}
            onMouseLeave={() => setShowHoverCard(false)}
          >
            <div className="flex flex-col justify-around gap-3 items-center min-w-[340px] bg-[#262626] rounded-md p-4 shadow-md relative cursor-default transition-all duration-200">
              <div className="flex flex-row justify-around items-start w-full gap-5">
                <div>
                  <h3 className="font-bold text-white text-sm font-nunito mb-2">
                    Foto
                  </h3>
                  <Image
                    className="h-[110px] w-[80px] object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    width={80}
                    height={110}
                    src={foto}
                    alt="Foto Icon"
                    onClick={handleImageClick}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-nunito mb-2">
                    Classes
                  </h3>
                  <div className="rounded-md border border-[#404040]">
                    <Table className="w-[182px]">
                      <TableBody>
                        {classes.map((classe, index) => (
                          <TableRow key={index}>
                            <TableCell
                              className={`text-sm font-nunito p-1 border-r ${
                                classe.quantidade === 0
                                  ? "text-[#404040]"
                                  : "text-white"
                              }`}
                            >
                              {classe.nome}
                            </TableCell>
                            <TableCell
                              className={`text-sm text-center font-nunito p-1 ${
                                classe.quantidade === 0
                                  ? "text-[#404040]"
                                  : "text-white"
                              }`}
                            >
                              {classe.quantidade}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <p className="text-sm text-white font-nunito">Endereço</p>
                <p className="text-sm text-[#a6a6a6] font-nunito">
                  Rua Pereira Estéfano, 2400 - Jabaquara
                </p>
              </div>
              <div className="flex flex-col w-full">
                <p className="text-sm text-white font-nunito">Data</p>
                <p className="text-sm text-[#a6a6a6] font-nunito">
                  10/03/25 - 14:30
                </p>
              </div>
              {planejar && (
                <>
                  <div className="flex flex-col w-full gap-2">
                    <HeaderButton mode="filled" text="Confirmar coleta" />
                    <HeaderButton mode="outlined-red" text="Não encontrado" />
                  </div>
                </>
              )}
            </div>
          </div>
        </AdvancedMarker>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] cursor-pointer"
          onClick={closeImageModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <Image
              className="max-w-full max-h-full object-contain rounded-md"
              width={800}
              height={600}
              src={foto}
              alt="Foto em tamanho completo"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
