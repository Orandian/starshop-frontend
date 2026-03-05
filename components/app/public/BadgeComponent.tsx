import { Badge } from "@/components/ui/badge";

const Params = [
  {
    name: "label",
    type: "string",
  },
];

interface BadgeComponentProps {
  label: string;
}

const BadgeComponent = ({ label }: BadgeComponentProps) => {
  return (
    <div>
      <Badge variant="outline" className="rounded-none border-white-bg px-3 py-2 bg-white/50 text-black">{label}</Badge>
    </div>
  );
};

BadgeComponent.Params = Params;

export default BadgeComponent;
