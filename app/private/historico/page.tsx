import { redirect } from "next/navigation";
import { HistoryFiltersHeader } from "@/components/history-filters-header";
import { createClient } from "@/utils/supabase/server";
import { HistoryCard } from "@/components/history-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockData = [
  {
    id: 1,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 2 },
      { nome: "Plástico", quantidade: 1 },
    ],
    lat: -23.648441,
    long: -46.573043,
    date: new Date("2025-08-15T14:30:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-15T16:45:00"),
  },
  {
    id: 2,
    foto: "/foto_example.png",
    classes: [{ nome: "Papelão", quantidade: 3 }],
    lat: -23.647336,
    long: -46.575399,
    date: new Date("2025-08-20T09:15:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-20T11:30:00"),
  },
  {
    id: 3,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 1 },
      { nome: "Vidro", quantidade: 2 },
    ],
    lat: -23.649123,
    long: -46.572187,
    date: new Date("2025-08-25T13:20:00"),
    status: "NEncontrado",
    dataColetado: null,
  },
  {
    id: 4,
    foto: "/foto_example.png",
    classes: [{ nome: "Plástico", quantidade: 3 }],
    lat: -23.649123,
    long: -46.572187,
    date: new Date("2025-08-28T16:10:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-29T08:15:00"),
  },
  {
    id: 5,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 4 },
      { nome: "Plástico", quantidade: 1 },
    ],
    lat: -23.646892,
    long: -46.576543,
    date: new Date("2025-09-01T10:45:00"),
    status: "NEncontrado",
    dataColetado: null,
  },
  {
    id: 6,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 2 },
      { nome: "Plástico", quantidade: 1 },
    ],
    lat: -23.648441,
    long: -46.573043,
    date: new Date("2025-08-15T14:30:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-15T16:45:00"),
  },
  {
    id: 7,
    foto: "/foto_example.png",
    classes: [{ nome: "Papelão", quantidade: 3 }],
    lat: -23.647336,
    long: -46.575399,
    date: new Date("2025-08-20T09:15:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-20T11:30:00"),
  },
  {
    id: 8,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 1 },
      { nome: "Vidro", quantidade: 2 },
    ],
    lat: -23.649123,
    long: -46.572187,
    date: new Date("2025-08-25T13:20:00"),
    status: "NEncontrado",
    dataColetado: null,
  },
  {
    id: 9,
    foto: "/foto_example.png",
    classes: [{ nome: "Plástico", quantidade: 3 }],
    lat: -23.650789,
    long: -46.574256,
    date: new Date("2025-08-28T16:10:00"),
    status: "Coletado",
    dataColetado: new Date("2025-08-29T08:15:00"),
  },
  {
    id: 10,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 4 },
      { nome: "Plástico", quantidade: 1 },
      { nome: "Vidro", quantidade: 2 },
    ],
    lat: -23.646892,
    long: -46.576543,
    date: new Date("2025-09-01T10:45:00"),
    status: "NEncontrado",
    dataColetado: null,
  },
];

const ALL_CLASSES = [
  { value: "papelao", label: "Papelão" },
  { value: "plastico", label: "Plástico" },
  { value: "vidro", label: "Vidro" },
  { value: "metal", label: "Metal" },
  { value: "entulho", label: "Entulho" },
];

const ALL_STATUS = [
  { value: "coletado", label: "Coletado" },
  { value: "nencontrado", label: "Não encontrado" },
];

const ITEMS_PER_PAGE = 6;

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const currentPage = Math.max(1, parseInt(params.page as string) || 1);
  const totalItems = mockData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = mockData.slice(startIndex, endIndex);

  if (currentPage > totalPages && totalPages > 0) {
    redirect(`/private/historico?page=${totalPages}`);
  }

  return (
    <div className="h-screen flex flex-col">
      <HistoryFiltersHeader
        classes={ALL_CLASSES.map((c) => c.label)}
        status={ALL_STATUS.map((s) => s.label)}
      />
      <div className="bg-[#0d0d0d] flex flex-col flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-7xl mx-auto auto-rows-max justify-items-center sm:justify-items-stretch">
          {currentPageData.map((item) => (
            <HistoryCard
              key={item.id}
              foto={item.foto}
              classes={item.classes}
              lat={item.lat}
              long={item.long}
              data={item.date}
              status={item.status}
              dataColetado={item.dataColetado}
            />
          ))}
        </div>
        <div className="mt-16">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/private/historico?page=${currentPage - 1}`}
                  />
                </PaginationItem>
              )}

              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href="/private/historico?page=1"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href={`/private/historico?page=${currentPage - 1}`}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink
                  className="font-nunito"
                  href={`/private/historico?page=${currentPage}`}
                  isActive
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href={`/private/historico?page=${currentPage + 1}`}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href={`/private/historico?page=${totalPages}`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/private/historico?page=${currentPage + 1}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
