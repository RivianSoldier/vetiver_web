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

const ITEMS_PER_PAGE = 4;

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

  // Fetch all collector activity data
  const allActivityData = await collectorService.getCollectorActivity(
    data.user.id
  );

  // Apply class filter (same logic as map page)
  const selectedClasses =
    params.classes?.toString().split(",").filter(Boolean) || [];

  const filteredByClass =
    selectedClasses.length > 0
      ? allActivityData.filter((activity) =>
          activity.classes.some(
            (classItem) =>
              selectedClasses.includes(classItem.nome) &&
              classItem.quantidade > 0
          )
        )
      : allActivityData;

  // Apply status filter
  const selectedStatus = params.status?.toString() || "";

  const filteredByStatus = selectedStatus
    ? filteredByClass.filter((activity) => activity.status === selectedStatus)
    : filteredByClass;

  // Apply month filter
  const selectedMonth = params.month?.toString() || "";

  const filteredByMonth = selectedMonth
    ? filteredByStatus.filter((activity) => {
        if (!activity.dataColetado) return false;
        const date = new Date(activity.dataColetado);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return month === selectedMonth;
      })
    : filteredByStatus;

  // Apply year filter
  const selectedYear = params.year?.toString() || "";

  const filteredData = selectedYear
    ? filteredByMonth.filter((activity) => {
        if (!activity.dataColetado) return false;
        const date = new Date(activity.dataColetado);
        const year = date.getFullYear().toString();
        return year === selectedYear;
      })
    : filteredByMonth;

  const currentPage = Math.max(1, parseInt(params.page as string) || 1);
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  if (currentPage > totalPages && totalPages > 0) {
    redirect(`/private/historico?page=${totalPages}`);
  }

  // Build query string for pagination to preserve filters
  const buildQueryString = (page: number) => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    if (selectedClasses.length > 0) {
      queryParams.set("classes", selectedClasses.join(","));
    }
    if (selectedStatus) {
      queryParams.set("status", selectedStatus);
    }
    if (selectedMonth) {
      queryParams.set("month", selectedMonth);
    }
    if (selectedYear) {
      queryParams.set("year", selectedYear);
    }
    const query = queryParams.toString();
    return query ? `?${query}` : "";
  };

  return (
    <div className="h-screen flex flex-col">
      <HistoryFiltersHeader
        activityData={allActivityData}
        filteredActivityData={filteredData}
      />
      <div className="bg-[#0d0d0d] flex flex-col flex-1 justify-start md:justify-center items-center overflow-y-auto pt-6 md:pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {currentPageData.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <p className="text-white text-xl sm:text-2xl font-poppins text-center">
                {selectedClasses.length > 0 ||
                selectedStatus ||
                selectedMonth ||
                selectedYear
                  ? "Nenhum resultado encontrado"
                  : "Nenhum lixo foi coletado ainda"}
              </p>
              <p className="text-gray-400 text-sm sm:text-base font-nunito text-center mt-2">
                {selectedClasses.length > 0 ||
                selectedStatus ||
                selectedMonth ||
                selectedYear
                  ? "Tente ajustar os filtros para ver mais resultados"
                  : "Comece a coletar resíduos para ver seu histórico aqui"}
              </p>
            </div>
          ) : (
            currentPageData.slice(0, 4).map((item) => (
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
                detectionPoints={item.detection_points}
              />
            ))
          )}
        </div>
        {totalItems > 0 && (
          <div className="mt-16 mb-6">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/private/historico${buildQueryString(currentPage - 1)}`}
                  />
                </PaginationItem>
              )}

              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href={`/private/historico${buildQueryString(1)}`}
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
                    href={`/private/historico${buildQueryString(currentPage - 1)}`}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink
                  className="font-nunito"
                  href={`/private/historico${buildQueryString(currentPage)}`}
                  isActive
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    className="font-nunito"
                    href={`/private/historico${buildQueryString(currentPage + 1)}`}
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
                    href={`/private/historico${buildQueryString(totalPages)}`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/private/historico${buildQueryString(currentPage + 1)}`}
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
