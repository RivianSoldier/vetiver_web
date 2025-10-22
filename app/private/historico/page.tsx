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
import { collectorService } from "@/services/collectorService";

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

  // Fetch collector activity data
  const activityData = await collectorService.getCollectorActivity(
    data.user.id
  );

  const currentPage = Math.max(1, parseInt(params.page as string) || 1);
  const totalItems = activityData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = activityData.slice(startIndex, endIndex);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-7xl mx-auto auto-rows-max justify-items-center">
          {currentPageData.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <p className="text-white text-xl sm:text-2xl font-poppins text-center">
                Nenhum lixo foi coletado ainda
              </p>
              <p className="text-gray-400 text-sm sm:text-base font-nunito text-center mt-2">
                Comece a coletar resíduos para ver seu histórico aqui
              </p>
            </div>
          ) : (
            currentPageData.map((item) => (
              <HistoryCard
                key={item.id}
                foto={item.foto}
                classes={item.classes}
                lat={item.lat}
                long={item.lng}
                data={new Date(item.date)}
                status={item.status}
                dataColetado={
                  item.dataColetado ? new Date(item.dataColetado) : null
                }
              />
            ))
          )}
        </div>
        {totalItems > 0 && (
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
        )}
      </div>
    </div>
  );
}
