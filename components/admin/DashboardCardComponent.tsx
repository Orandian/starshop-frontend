const Params = [
  {
    name: "value",
    type: "number",
  },
  {
    name: "description",
    type: "string",
  },
  {
    name: "isCurrency",
    type: "boolean",
  }
];

interface DashboardCardComponentParams {
  value: number;
  description: string;
  isCurrency?: boolean;
}

const DashboardCardComponent = ({ value, description, isCurrency }: DashboardCardComponentParams) => {
  return (
    <div className="flex-0 md:flex-1 md:min-w-[200px] max-w-full px-4 py-8 md:px-10 md:py-5 space-y-6 border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] card-border first:col-span-2 md:first:col-span-full">
      <div className="flex-col text-center">
        <p className="text-xl text-secondary font-bold">
          {isCurrency ? `¥${Number(value).toLocaleString()}` : value}
        </p>
        <p className="text-normal mt-4 text-dark">{description}</p>
      </div>
    </div>
  );
};

DashboardCardComponent.Params = Params;

export default DashboardCardComponent;
