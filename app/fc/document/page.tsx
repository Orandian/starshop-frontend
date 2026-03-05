"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentList } from "@/hooks/fc/useDocument";
import { Document } from "@/types/fc/document.type";
import { getPublicUrl } from "@/utils";
import Link from "next/link";

const Limit = {
  page: 1,
  pageSize: 0,
};

const FCDocumentPage = () => {
  const { data: documents, isLoading } = useGetDocumentList(
    Limit.page,
    Limit.pageSize
  );

  // Group documents by type and brand
  const groupDocumentsByBrand = (documents: Document[]) => {
    const grouped: { [brandId: number]: Document[] } = {};

    documents.forEach((doc) => {
      const brandId = doc.brand?.brandId || 0;
      if (!grouped[brandId]) {
        grouped[brandId] = [];
      }
      grouped[brandId].push(doc);
    });

    return grouped;
  };

  // Filter and group by type
  const cosmeticDocumentsByBrand = groupDocumentsByBrand(
    documents?.data?.data?.filter((doc) => doc.docType === 1) || []
  );

  const otherDocumentsByBrand = groupDocumentsByBrand(
    documents?.data?.data?.filter((doc) => doc.docType === 2) || []
  );

  return (
    <section className="w-full">
      <div className="w-full px-3 md:px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        {/* 契約書 */}
        <h2 className="my-4 font-bold">契約書</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center mx-3 md:mx-6">
          <Link
            href="/fc/document/contracts/application"
            className="bg-foreground rounded-md h-32 px-2 flex items-center justify-center text-dark"
          >
            継続供給販売申込書
          </Link>
          <Link
            href="/fc/document/contracts/referral"
            className="bg-foreground rounded-md h-32 px-2 flex items-center justify-center text-dark"
          >
            紹介制度同意書
          </Link>
          <Link
            href="/fc/document/contracts/personalInfo"
            className="bg-foreground rounded-md h-32 px-2 flex items-center justify-center text-dark"
          >
            個人情報取扱い同意書
          </Link>
        </div>

        {documents?.data && (
          <>
            {/* 化粧品書類 */}
            {Object.entries(cosmeticDocumentsByBrand).length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-4">化粧品書類</h2>

                {Object.entries(cosmeticDocumentsByBrand).map(
                  ([brandId, brandDocs]) => {
                    const brand = brandDocs[0]?.brand; // Get brand info from first document
                    return (
                      <div key={brandId} className="mb-6 mx-6">
                        <h3 className="text-base font-medium mb-3">
                          {brand?.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                          {isLoading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton
                                  key={index}
                                  className="h-24 bg-white-bg"
                                />
                              ))
                            : brandDocs.map((doc) => (
                                <Link
                                  key={doc.docId}
                                  href={getPublicUrl(doc.docPath)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-foreground rounded-md h-32 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
                                >
                                  {doc.docName}
                                </Link>
                              ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </>
            )}

            {/* その他 */}
            {Object.entries(otherDocumentsByBrand).length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-4">その他</h2>

                {Object.entries(otherDocumentsByBrand).map(
                  ([brandId, brandDocs]) => {
                    const brand = brandDocs[0]?.brand; // Get brand info from first document
                    return (
                      <div key={brandId} className="mb-6 mx-6">
                        <h3 className="text-base font-medium mb-3">
                          {brand?.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                          {isLoading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton
                                  key={index}
                                  className="h-24 bg-white-bg"
                                />
                              ))
                            : brandDocs.map((doc) => (
                                <Link
                                  key={doc.docId}
                                  href={getPublicUrl(doc.docPath)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-foreground rounded-md h-32 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
                                >
                                  {doc.docName}
                                </Link>
                              ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FCDocumentPage;
