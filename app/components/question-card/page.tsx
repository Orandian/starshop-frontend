"use client";

import QuestionCardComponent from "@/components/app/public/QuestionCardComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";

const QuestionCardPage = () => {
  return (
    <ComponentLayout
      componentTitle="Question Card"
      componentPath="@/components/app/public/QuestionCardComponent.tsx"
      params={QuestionCardComponent.Params}
    >
     <div className="w-[800px]">
     <QuestionCardComponent
        question="サイズはどのように選べばいいですか？"
        answer="帽子のサイズは、頭の周囲（額の中央から後頭部まで）を測ってお選びください。サイズ調整可能なモデルもございますので、各商品の詳細ページをご確認ください。"
      />
     </div>
    </ComponentLayout>
  );
};

export default QuestionCardPage;
