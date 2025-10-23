import { X } from "lucide-react";

interface SelectedStatusProps {
  selectedStatus: { value: string; label: string }[];
  onRemoveStatus: () => void;
  loading?: boolean;
}

export function SelectedStatus({
  selectedStatus,
  onRemoveStatus,
  loading = false,
}: SelectedStatusProps) {
  if (selectedStatus.length === 0) {
    return null;
  }

  const status = selectedStatus[0];
  return (
    <div
      key={status.value}
      className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default"
    >
      <span>{status.label}</span>
      <button
        onClick={onRemoveStatus}
        className="text-white"
        disabled={loading}
      >
        <X
          className={`text-white size-4 transition-colors duration-200 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:text-[#F22742]"
          }`}
        />
      </button>
    </div>
  );
}
