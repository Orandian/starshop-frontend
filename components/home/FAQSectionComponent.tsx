import SectionLayout from "@/components/layouts/SectionLayout";
import QuestionCardComponent from "@/components/app/public/QuestionCardComponent";
import { usePublicFaqs } from "@/hooks/user/useFaqs";
import { FAQ } from "@/types/faqs";

const FAQSectionComponent = () => {
  const { data: faqData } = usePublicFaqs();
  const faqList = (faqData?.data ?? []) as FAQ[];

  return (
    <>
      <SectionLayout className="pb-20 md:pb-40 h-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 gap-6">
          <div className="w-full">
            <h1 className="text-5xl font-cormorant text-[#786464] text-center my-4">Q&A</h1>
          </div>
          <div className="w-full space-y-6 px-0 md:px-16">
            {faqList.length > 0 && faqList?.map((faq: FAQ) =>
              faq.isActive ? (
                <QuestionCardComponent
                  key={faq.faqId}
                  question={faq.question}
                  answer={faq.answer}
                />
              ) : null
            )}
          </div>
          {
            faqList.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm md:text-base text-gray-400 font-semibold whitespace-nowrap">
                  現在、よくある質問はありません。
                </p>
              </div>
            )
          }
        </div>
      </SectionLayout>
    </>
  );
};

export default FAQSectionComponent;
