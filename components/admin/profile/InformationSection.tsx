import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const InformationSection = ({
  title,
  items,
  handleEdit,
  readOnly,
}: {
  title: string;
  items: { label: string; value: string }[];
  handleEdit: () => void;
  readOnly?: boolean;
}) => (
  <Card className="bg-white rounded-lg shadow-lg relative border-none">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-3  gap-4">
            <div className="text-sm font-medium text-gray-500">
              {item.label}
            </div>
            <div className="text-sm text-gray-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </CardContent>

    {!readOnly && (
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 rounded-full p-0 absolute top-2 right-2 cursor-pointer"
        onClick={handleEdit}
      >
        <Pencil className="w-5 h-5" fill="black" stroke="white" />
      </Button>
    )}
  </Card>
);
