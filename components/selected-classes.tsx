import { X } from "lucide-react";

type SelectedClass = {
  value: string;
  label: string;
};

interface SelectedClassesProps {
  selectedClasses: SelectedClass[];
  onRemoveClass: (value: string) => void;
  onClearAll: () => void;
}

export function SelectedClasses({
  selectedClasses,
  onRemoveClass,
  onClearAll,
}: SelectedClassesProps) {
  const count = selectedClasses.length;

  if (count === 0) {
    return null;
  }

  if (count > 1) {
    return (
      <div className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default">
        <span>{`Classes (${count})`}</span>
        <button
          onClick={onClearAll}
          className="text-white"
        >
          <X className="text-white size-4 cursor-pointer hover:text-[#F22742] transition-colors duration-200" />
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
      >
        <X className="text-white size-4 cursor-pointer hover:text-[#F22742] transition-colors duration-200" />
      </button>
    </div>
  );
}


// import { X } from "lucide-react";

// type SelectedClass = {
//   value: string;
//   label: string;
// };

// interface SelectedClassesProps {
//   selectedClasses: SelectedClass[];
//   onRemoveClass: (value: string) => void;
//   onClearAll: () => void;
// }

// export function SelectedClasses({
//   selectedClasses,
//   onRemoveClass,
//   onClearAll,
// }: SelectedClassesProps) {
//   return (
//     <>
//       {selectedClasses.map((classe) => (
//         <div
//           key={classe.value}
//           className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default"
//         >
//           <span>{classe.label}</span>
//           <button
//             onClick={() => onRemoveClass(classe.value)}
//             className="text-white"
//           >
//             <X className="text-white size-4 cursor-pointer hover:text-[#F22742] transition-colors duration-200" />
//           </button>
//         </div>
//       ))}

//       {selectedClasses.length > 0 && (
//         <button
//           onClick={onClearAll}
//           className="text-sm font-nunito text-white font-bold hover:text-white cursor-pointer hover:underline "
//         >
//           Limpar tudo
//         </button>
//       )}
//     </>
//   );
// }
