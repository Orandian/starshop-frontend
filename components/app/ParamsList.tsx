"use client";

const ParamsList = ({
  params,
}: {
  params: { name: string; type: string }[];
}) => {
  return (
    <div className="space-y-2">
      <h3>Params</h3>
      <div className="flex flex-col gap-2">
        {params.map((param) => (
          <p key={param.name} className="flex-row-center gap-2">
            <span className="font-bold">{param.name}</span> : <span>{param.type}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default ParamsList;
