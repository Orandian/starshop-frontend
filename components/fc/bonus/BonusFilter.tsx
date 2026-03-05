import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface BonusFilterProps {
  onFilter: (filters: { bonus_type: number }) => void;
  initialFilters?: {
    bonus_type: number;
  };
  fcRole: number;
}

const bonusTypeOptions = [
  //{ value: "0", label: "すべて" },
  { value: "1", label: "募集お祝金" },
  { value: "2", label: "管理金" },
  //{ value: "3", label: "販売コミッション" }, for next version
];
const bonusTypeOptionsForFcRole5 = [
  { value: "1", label: "募集お祝金" },
];

export const BonusFilter: React.FC<BonusFilterProps> = ({
  onFilter,
  fcRole,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(bonusTypeOptions.map((option) => option.value))
  );
  const filteredOptions = fcRole === 5 ? bonusTypeOptionsForFcRole5 : bonusTypeOptions;

  // Handle filter updates when selectedTypes changes
  useEffect(() => {
    let newBonusType = 0;
    if (selectedTypes.size === 1) {
      newBonusType = Number(Array.from(selectedTypes)[0]);
    }
    onFilter({ bonus_type: newBonusType });
  }, [selectedTypes, onFilter]);

  const handleTypeChange = (value: string) => {
    setSelectedTypes((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(value)) {
        newSelected.delete(value);
      } else {
        newSelected.add(value);
      }
      return newSelected;
    });
  };


  return (
    <div className="bg-white border border-black/10 rounded-md shadow-sm p-6 mb-5">
      <div>
        {" "}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ボーナス種類
        </label>
      </div>
      <div className="flex flex-row gap-4">
        {filteredOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`type-${option.value}`}
              checked={selectedTypes.has(option.value)}
              onCheckedChange={(checked) => {
                // Handle both boolean and "indeterminate" state
                if (checked === "indeterminate") return;
                handleTypeChange(option.value);
              }}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={`type-${option.value}`}
              className="text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
