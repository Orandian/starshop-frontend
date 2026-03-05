"use client";

const Params = [
  {
    name: "title",
    type: "string",
  },
];

interface TitleWithUnderlineDecorationComponentParams {
  title: string;
}

const TitleWithUnderlineDecorationComponent = ({
  title,
}: TitleWithUnderlineDecorationComponentParams) => {
  return (
    <div className="border-b border-white-bg pb-[1px]">
      <div className="border-b-[5px] border-black py-1.5 px-3 inline-block">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

TitleWithUnderlineDecorationComponent.Params = Params;

export default TitleWithUnderlineDecorationComponent;
