import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const statusColorMap: Record<string, string> = {
  保留中: "bg-yellow-400",
  処理中: "bg-blue-400",
  発送済み: "bg-purple-400",
  配送済み: "bg-indigo-500",
  キャンセル済み: "bg-red-400",
  返品済み: "bg-orange-400",
  返金済み: "bg-pink-400",
  失敗: "bg-gray-400",
  完了: "bg-green-500",
  有効: "bg-green-500",
  無効: "bg-red-500",
};

const Params = [
  {
    name: "label",
    type: "string",
  },
  {
    name: "isLink",
    type: "boolean",
  },
  {
    name: "onClick",
    type: "() => void",
  },
];

interface StatusBadgeComponentProps {
  label: string;
  isLink: boolean;
  onClick?: () => void;
}

const StatusBadgeComponent = ({
  label,
  isLink,
  onClick,
}: StatusBadgeComponentProps) => {
  return (
    <div>
      <Badge
        variant="outline"
        className={`rounded-[30px] min-w-[100px] py-1.5 border-none ${
          statusColorMap[label] || "bg-gray-300"
        } ${isLink ? "cursor-pointer" : ""}`}
        onClick={isLink ? onClick : undefined}
      >
        <span className="text-small text-white">{label}</span>
        {isLink && <ChevronDown size={15} />}
      </Badge>
    </div>
  );
};

StatusBadgeComponent.Params = Params;

export default StatusBadgeComponent;
