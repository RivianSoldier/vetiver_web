"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { useState, useEffect, useMemo } from "react";
import { MoveRight } from "lucide-react";

export function HistoryCard({
  foto,
  classes,
  lat,
  long,
  data,
  status,
  dataColetado,
}: {
  foto: string;
  classes: { nome: string; quantidade: number }[];
  lat: number;
  long: number;
  data: Date;
  status: string;
  dataColetado: Date | null;
}) {
  const [address, setAddress] = useState<string>("Carregando endereço...");

  const fetchAddress = useMemo(() => {
    return async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=pt-BR`
        );
        const data = await response.json();

        if (data && data.display_name) {
          const addressData = data.address;
          const street = addressData?.road || "";
          const houseNumber = addressData?.house_number || "";
          const suburb =
            addressData?.suburb || addressData?.neighbourhood || "";
          const city =
            addressData?.city ||
            addressData?.town ||
            addressData?.municipality ||
            "";

          let formattedAddress = "";
          if (street) {
            formattedAddress += street;
            if (houseNumber) {
              formattedAddress += `, ${houseNumber}`;
            }
          }
          if (suburb) {
            formattedAddress += formattedAddress ? ` - ${suburb}` : suburb;
          }
          if (city && city !== suburb) {
            formattedAddress += formattedAddress ? `, ${city}` : city;
          }

          return formattedAddress || data.display_name;
        } else {
          return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
      }
    };
  }, [lat, long]);

  useEffect(() => {
    let isMounted = true;

    const getAddress = async () => {
      const result = await fetchAddress();
      if (isMounted) {
        setAddress(result);
      }
    };

    getAddress();

    return () => {
      isMounted = false;
    };
  }, [fetchAddress]);
  return (
    <div
      className={`bg-gradient-to-b ${
        status === "Coletado"
          ? "from-[#45BF55] to-[#008D80]"
          : "from-[#FF576D] to-[#F22742]"
      } w-[306px] flex justify-center items-center p-[1px] rounded-sm`}
    >
      <div className="bg-[#262626] p-4 rounded-sm shadow-md flex flex-col gap-3">
        <div className="flex flex-row justify-around items-start w-full gap-5">
          <div>
            <h3 className="font-bold text-white text-sm font-nunito mb-2">
              Foto
            </h3>
            <Image
              className="h-[55px] w-[80px] object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              width={80}
              height={55}
              src={foto}
              alt="Foto Icon"
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
                        className={`text-sm font-nunito p-1 border-r text-white`}
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
          <p className="text-sm text-white font-nunito font-semibold">
            Endereço
          </p>
          <p className="text-sm text-[#a6a6a6] font-nunito">{address}</p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-sm text-white font-nunito font-semibold">Data</p>
          <p className="text-sm text-[#a6a6a6] font-nunito">
            {data.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            -{" "}
            {data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-sm text-white font-nunito font-semibold">Status</p>
          <p
            className={`text-sm ${
              status === "Coletado"
                ? "bg-gradient-to-r from-[#008D80] to-[#45BF55]"
                : "bg-gradient-to-r from-[#FF576D] to-[#F22742]"
            } bg-clip-text text-transparent font-nunito`}
          >
            {status === "Coletado"
              ? "Resíduos coletados"
              : "Resíduos não encontrados"}
          </p>
          <div className="flex items-center gap-1">
            {dataColetado ? (
              <>
                <MoveRight size={16} className="text-[#008D80]" />
                <span
                  className={`text-sm ${
                    status === "Coletado"
                      ? "bg-gradient-to-r from-[#008D80] to-[#45BF55]"
                      : "bg-gradient-to-r from-[#FF576D] to-[#F22742]"
                  } bg-clip-text text-transparent font-nunito`}
                >
                  {dataColetado.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {dataColetado.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </>
            ) : (
              <span
                className={`text-sm ${
                  status === "Coletado"
                    ? "bg-gradient-to-r from-[#008D80] to-[#45BF55]"
                    : "bg-gradient-to-r from-[#FF576D] to-[#F22742]"
                } bg-clip-text text-transparent font-nunito`}
              >
                Não coletado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
