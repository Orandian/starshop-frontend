const Params = [
  {
    name: "question",
    type: "string",
  },
  {
    name: "answer",
    type: "string",
  },
];

interface QuestionCardComponentParams {
  question: string;
  answer: string;
}

const QuestionCardComponent = ({
  question,
  answer,
}: QuestionCardComponentParams) => {
  return (
    <div className="w-full border-2 border-[#cabdb4] p-4 md:p-6 space-y-4 bg-[#fcfbf9] text-[#786464]">
      <div className="flex-row-items-start md:flex-row-items-end gap-3 px-2">
        <span className="text-2xl font-bold font-cormorant">Q</span>
        <p className="text-[18px] md:text-lg font-noto font-medium pt-1 md:pt-0">{question}</p>
      </div>
      <div className="w-full border-t-[2px] border-dashed border-white-bg" />
      <div className="flex-row-items-start gap-3 px-2">
        <span className="text-2xl font-bold text-[#a99577] font-cormorant">A</span>
        <div
          className="text-sm font-noto leading-5 pt-2"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>  
  );
};

QuestionCardComponent.Params = Params;

export default QuestionCardComponent;
