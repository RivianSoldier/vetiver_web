import { X } from "lucide-react";

type SelectedClass = {
  value: string;
  label: string;
};

interface SelectedClassesProps {
  selectedClasses: SelectedClass[];
  onRemoveClass: (value: string) => void;
  onClearAll: () => void;
  loading?: boolean;
}

export function SelectedClasses({
  selectedClasses,
  onRemoveClass,
  onClearAll,
  loading = false,
}: SelectedClassesProps) {
  const count = selectedClasses.length;

  if (count === 0) {
    return null;
  }

  if (count > 1) {
    return (
      <div className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default">
        <span>{`Classes (${count})`}</span>
        <button onClick={onClearAll} className="text-white" disabled={loading}>
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

  const singleClass = selectedClasses[0];
  return (
    <div
      key={singleClass.value}
      className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default"
    >
      <span>{singleClass.label}</span>
      <button
        onClick={() => onRemoveClass(singleClass.value)}
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
