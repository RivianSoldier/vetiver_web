"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { ArrowDownToLine, Filter } from "lucide-react";
import { SelectStatusHeader } from "./select-status-header";
import { SelectClassHeader } from "./select-class-header";
import { SelectMonthHeader } from "./select-month-header";
import { SelectYearHeader } from "./select-year-header";
import { SelectedClasses } from "./selected-classes";
import { SelectedMonth } from "./selected-month";
import { SelectedYear } from "./selected-year";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { CollectorActivity } from "@/services/collectorService";

interface HistoryFiltersHeaderProps {
  activityData: CollectorActivity[];
  filteredActivityData: CollectorActivity[];
}

export function HistoryFiltersHeader({
  activityData,
}: HistoryFiltersHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [isFilterPending, startFilterTransition] = useTransition();

  // Get available classes from activity data (same as map page)
  const mappedClasses = useMemo(() => {
    const classesSet = new Set<string>();
    activityData.forEach((activity) => {
      activity.classes.forEach((classItem) => {
        if (classItem.quantidade > 0) {
          classesSet.add(classItem.nome);
        }
      });
    });
    return Array.from(classesSet).map((className) => ({
      value: className,
      label: className.charAt(0).toUpperCase() + className.slice(1),
    }));
  }, [activityData]);

  const [selectKey, setSelectKey] = useState(Date.now());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const initialSelectedClasses = useMemo(() => {
    const classesParam = searchParams.get("classes");
    if (!classesParam) return [];
    const classValues = classesParam.split(",");
    return mappedClasses.filter((c) => classValues.includes(c.value));
  }, [searchParams, mappedClasses]);

  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >(initialSelectedClasses);

  const selectedStatus = searchParams.get("status") || undefined;

  // Extract available months and years from dataColetado
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    activityData.forEach((activity) => {
      if (activity.dataColetado) {
        const date = new Date(activity.dataColetado);
        const monthIndex = date.getMonth();
        const monthValue = String(monthIndex + 1).padStart(2, "0");
        monthsSet.add(monthValue);
      }
    });

    return Array.from(monthsSet)
      .sort()
      .map((monthValue) => ({
        value: monthValue,
        label: monthNames[parseInt(monthValue) - 1],
      }));
  }, [activityData]);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();

    activityData.forEach((activity) => {
      if (activity.dataColetado) {
        const date = new Date(activity.dataColetado);
        const year = date.getFullYear().toString();
        yearsSet.add(year);
      }
    });

    return Array.from(yearsSet)
      .sort()
      .map((year) => ({
        value: year,
        label: year,
      }));
  }, [activityData]);

  const [selectMonthKey, setSelectMonthKey] = useState(Date.now());
  const [selectYearKey, setSelectYearKey] = useState(Date.now());

  const initialSelectedMonth = useMemo(() => {
    const monthParam = searchParams.get("month");
    if (!monthParam) return [];
    return availableMonths.filter((m) => m.value === monthParam);
  }, [searchParams, availableMonths]);

  const [selectedMonth, setSelectedMonth] = useState<
    { value: string; label: string }[]
  >(initialSelectedMonth);

  const initialSelectedYear = useMemo(() => {
    const yearParam = searchParams.get("year");
    if (!yearParam) return [];
    return availableYears.filter((y) => y.value === yearParam);
  }, [searchParams, availableYears]);

  const [selectedYear, setSelectedYear] = useState<
    { value: string; label: string }[]
  >(initialSelectedYear);

  useEffect(() => {
    setSelectedClasses(initialSelectedClasses);
  }, [initialSelectedClasses]);

  useEffect(() => {
    setSelectedMonth(initialSelectedMonth);
  }, [initialSelectedMonth]);

  useEffect(() => {
    setSelectedYear(initialSelectedYear);
  }, [initialSelectedYear]);

  const handleStatusChange = useCallback(
    (status: string) => {
      startFilterTransition(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (status) {
          current.set("status", status);
        } else {
          current.delete("status");
        }
        current.delete("page"); // Reset to page 1 when filtering
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`/private/historico${query}`);
      });
    },
    [searchParams, router]
  );

  const handleAddMonth = useCallback(
    (monthValue: string) => {
      if (selectedMonth.length > 0) {
        return; // Only allow one month at a time
      }
      const monthToAdd = availableMonths.find((m) => m.value === monthValue);
      if (monthToAdd) {
        const newSelectedMonth = [monthToAdd];
        setSelectedMonth(newSelectedMonth);
        setSelectMonthKey(Date.now());

        startFilterTransition(() => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          );
          current.set("month", monthToAdd.value);
          current.delete("page"); // Reset to page 1 when filtering
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`/private/historico${query}`);
        });
      }
    },
    [selectedMonth, availableMonths, searchParams, router]
  );

  const handleRemoveMonth = useCallback(() => {
    setSelectedMonth([]);
    setSelectMonthKey(Date.now());

    startFilterTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("month");
      current.delete("page"); // Reset to page 1 when filtering
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`/private/historico${query}`);
    });
  }, [searchParams, router]);

  const handleAddYear = useCallback(
    (yearValue: string) => {
      if (selectedYear.length > 0) {
        return; // Only allow one year at a time
      }
      const yearToAdd = availableYears.find((y) => y.value === yearValue);
      if (yearToAdd) {
        const newSelectedYear = [yearToAdd];
        setSelectedYear(newSelectedYear);
        setSelectYearKey(Date.now());

        startFilterTransition(() => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          );
          current.set("year", yearToAdd.value);
          current.delete("page"); // Reset to page 1 when filtering
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`/private/historico${query}`);
        });
      }
    },
    [selectedYear, availableYears, searchParams, router]
  );

  const handleRemoveYear = useCallback(() => {
    setSelectedYear([]);
    setSelectYearKey(Date.now());

    startFilterTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("year");
      current.delete("page"); // Reset to page 1 when filtering
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`/private/historico${query}`);
    });
  }, [searchParams, router]);

  const handleAddClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.some((c) => c.value === classValue)) {
        return;
      }
      const classToAdd = mappedClasses.find((c) => c.value === classValue);
      if (classToAdd) {
        const newSelectedClasses = [...selectedClasses, classToAdd];
        setSelectedClasses(newSelectedClasses);
        setSelectKey(Date.now());

        startFilterTransition(() => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          );
          current.set(
            "classes",
            newSelectedClasses.map((c) => c.value).join(",")
          );
          current.delete("page"); // Reset to page 1 when filtering
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`/private/historico${query}`);
        });
      }
    },
    [selectedClasses, mappedClasses, searchParams, router]
  );

  const handleRemoveClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.length === 1) {
        setSelectKey(Date.now());
      }
      const newSelectedClasses = selectedClasses.filter(
        (c) => c.value !== classValue
      );
      setSelectedClasses(newSelectedClasses);

      startFilterTransition(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (newSelectedClasses.length > 0) {
          current.set(
            "classes",
            newSelectedClasses.map((c) => c.value).join(",")
          );
        } else {
          current.delete("classes");
        }
        current.delete("page"); // Reset to page 1 when filtering
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`/private/historico${query}`);
      });
    },
    [selectedClasses, searchParams, router]
  );

  const handleClearAllClasses = useCallback(() => {
    setSelectedClasses([]);
    setSelectKey(Date.now());

    startFilterTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("classes");
      current.delete("page"); // Reset to page 1 when filtering
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`/private/historico${query}`);
    });
  }, [searchParams, router]);

  // Mobile Filter Content Component
  const MobileFiltersContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 p-6 pt-0">
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Classes
          </h3>
          <SelectClassHeader
            classes={mappedClasses}
            key={selectKey}
            onClassSelect={handleAddClass}
            selectedClasses={selectedClasses}
            loading={isFilterPending}
          />
          {selectedClasses.length > 0 && (
            <div className="mt-4">
              <SelectedClasses
                selectedClasses={selectedClasses}
                onRemoveClass={handleRemoveClass}
                onClearAll={handleClearAllClasses}
                loading={isFilterPending}
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Status
          </h3>
          <SelectStatusHeader
            value={selectedStatus}
            onValueChange={handleStatusChange}
            loading={isFilterPending}
          />
        </div>
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Mês
          </h3>
          <SelectMonthHeader
            months={availableMonths}
            key={selectMonthKey}
            onMonthSelect={handleAddMonth}
            selectedMonth={selectedMonth}
            loading={isFilterPending}
          />
          {selectedMonth.length > 0 && (
            <div className="mt-4">
              <SelectedMonth
                month={selectedMonth[0]}
                onRemove={handleRemoveMonth}
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Ano
          </h3>
          <SelectYearHeader
            years={availableYears}
            key={selectYearKey}
            onYearSelect={handleAddYear}
            selectedYear={selectedYear}
            loading={isFilterPending}
          />
          {selectedYear.length > 0 && (
            <div className="mt-4">
              <SelectedYear
                year={selectedYear[0]}
                onRemove={handleRemoveYear}
              />
            </div>
          )}
        </div>
      </div>
    ),
    [
      mappedClasses,
      selectKey,
      handleAddClass,
      selectedClasses,
      handleRemoveClass,
      handleClearAllClasses,
      selectedStatus,
      handleStatusChange,
      availableMonths,
      selectMonthKey,
      handleAddMonth,
      selectedMonth,
      handleRemoveMonth,
      availableYears,
      selectYearKey,
      handleAddYear,
      selectedYear,
      handleRemoveYear,
      isFilterPending,
    ]
  );

  return (
    <div className="flex flex-row items-center justify-between min-h-24 px-2 sm:px-4 py-3 bg-[#0d0d0d]">
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger className="text-white w-5 h-5 sm:w-8 sm:h-8" />
        <div className="w-[2px] h-6 sm:h-10 bg-[#262626]" />

        {isMobile ? (
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 text-white font-nunito text-sm bg-[#262626] px-3 py-2 rounded-md hover:bg-[#333333] transition-colors">
                  <Filter size={16} />
                  Filtros
                  {selectedClasses.length > 0 && (
                    <span className="bg-[#008D80] text-white text-xs px-2 py-1 rounded-full">
                      {selectedClasses.length}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="bg-[#0d0d0d] border-t border-[#262626]"
              >
                <SheetHeader className="pl-6 pb-4">
                  <SheetTitle className="text-white font-poppins text-md">
                    Filtros
                  </SheetTitle>
                  <SheetDescription className="text-[#a6a6a6]">
                    Configure os filtros de busca
                  </SheetDescription>
                </SheetHeader>
                {MobileFiltersContent}
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 flex-1 mb-0 [&>*]:mb-0">
              <div className="flex flex-col md:items-start gap-3 flex-1">
                <SelectClassHeader
                  classes={mappedClasses}
                  key={selectKey}
                  onClassSelect={handleAddClass}
                  selectedClasses={selectedClasses}
                  loading={isFilterPending}
                />
                {selectedClasses.length > 0 && (
                  <div className="flex flex-row items-center flex-wrap">
                    <SelectedClasses
                      selectedClasses={selectedClasses}
                      onRemoveClass={handleRemoveClass}
                      onClearAll={handleClearAllClasses}
                      loading={isFilterPending}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col md:items-start gap-3">
                <SelectStatusHeader
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                  loading={isFilterPending}
                />
              </div>
              <div className="flex flex-col md:items-start gap-3">
                <SelectMonthHeader
                  months={availableMonths}
                  key={selectMonthKey}
                  onMonthSelect={handleAddMonth}
                  selectedMonth={selectedMonth}
                  loading={isFilterPending}
                />
                {selectedMonth.length > 0 && (
                  <div className="flex flex-row items-center flex-wrap">
                    <SelectedMonth
                      month={selectedMonth[0]}
                      onRemove={handleRemoveMonth}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col md:items-start gap-3">
                <SelectYearHeader
                  years={availableYears}
                  key={selectYearKey}
                  onYearSelect={handleAddYear}
                  selectedYear={selectedYear}
                  loading={isFilterPending}
                />
                {selectedYear.length > 0 && (
                  <div className="flex flex-row items-center flex-wrap">
                    <SelectedYear
                      year={selectedYear[0]}
                      onRemove={handleRemoveYear}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      <div className="flex flex-col justify-start items-end gap-2 mt-0 sm:gap-3">
        <div className="flex gap-2 max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <HeaderButton
              mode="outlined"
              buttonIcon={
                <ArrowDownToLine className="w-6 h-6 text-[#008D80] " />
              }
              text="Meu histórico"
              disabled={true}
            />
            <HeaderButton
              mode="outlined"
              buttonIcon={
                <ArrowDownToLine className="w-6 h-6 text-[#008D80]" />
              }
              text="Histórico completo"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
