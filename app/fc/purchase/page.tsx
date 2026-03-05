"use client";
import PaginationComponent from "@/components/app/PaginationComponent";
import { CartIcon } from "@/components/fc/purchase/CartIcon";
import MobileSelectDropdown from "@/components/fc/MobileSelectDropdown";
import { ProductCard } from "@/components/fc/purchase/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBrands, useGetAllProducts } from "@/hooks/fc";
import { Brand } from "@/types/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const FCPurchasePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const pageSize = 20;
  const [selectedBrand, setSelectedBrand] = useState<string | number>("all");
  const { data: products, isLoading: isProductsLoading } = useGetAllProducts(
    selectedBrand === "all" ? "" : selectedBrand.toString(),
    page,
    pageSize
  );
  const pagination = products?.data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const { data: brandsData, isLoading: brandDataLoading } = useGetAllBrands();


  const brands = useMemo(() => {
    const brandMap = new Map<string, { id: string; name: string }>();

    // Add "All" option
    brandMap.set("all", { id: "all", name: "ALL" });

    // Add brands from API
    if (products?.data && products?.data.data?.length > 0 && brandsData?.data) {
      brandsData.data.forEach((brand: Brand) => {
        if (brand.isActive) {
          // Only include active brands
          const brandId = brand.brandId.toString();
          brandMap.set(brandId, {
            id: brandId,
            name: brand.name,
          });
        }
      });
    }

    return Array.from(brandMap.values());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandsData]);

  /**
   * Handle page change for pagination
   * @param newPage new page number
   * @author Phway
   * @date 2025-11-27
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL without causing a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/fc/purchase?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="w-full">
      <div className="w-full px-3  md:px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto ">
       <div className="flex justify-between items-center">
         <h2 className="my-4 font-bold">商品購入</h2>
         <CartIcon className="flex md:hidden" />
       </div>
        <div className="">
          <div className="flex justify-between items-center mb-8">
            {/* Category tabs */}
            <div className=" gap-4 items-center overflow-x-auto pb-2 hidden md:flex">
              {brandDataLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-36 rounded-full bg-white-bg" />
                  <Skeleton className="h-10 w-36 rounded-full bg-white-bg" />
                </div>
              ) : (
                brands.map((brand) => (
                  <Button
                    key={brand.id}
                    className={`w-44 rounded-full text-sm ${
                      selectedBrand === brand.id
                        ? "bg-black text-white hover:bg-black"
                        : "bg-transparent border border-black text-black hover:bg-black/20"
                    }`}
                    onClick={() => {
                      setSelectedBrand(brand.id);
                      setPage(1);
                    }}
                  >
                    {brand.name}
                  </Button>
                ))
              )}
            </div>

            {/* Mobile dropdown */}
            <div className="md:hidden w-full">
              {brandDataLoading ? (
                <Skeleton className="h-10 w-full rounded-md bg-white-bg" />
              ) : (
                <MobileSelectDropdown
                  options={brands.map(brand => ({
                    value: brand.id,
                    label: brand.name
                  }))}
                  selectedValue={selectedBrand}
                  onSelect={(value) => {
                    setSelectedBrand(value);
                    setPage(1);
                  }}
                  placeholder=""
                  className="h-10"
                />
              )}
            </div>
            
            <CartIcon className="hidden md:flex"/>
          </div>
          {/* Product grid */}
          <div className="flex flex-wrap justify-start items-start gap-4 md:gap-6">
            {isProductsLoading ? (
              <div className="flex justify-start items-center w-full p-2 m-2 gap-6">
                <Skeleton className="h-40 w-80 bg-white-bg" />
                <Skeleton className="h-40 w-80 bg-white-bg" />
              </div>
            ) : products?.data?.data && products?.data?.data?.length > 0 ? (
              products?.data?.data?.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))
            ) : (
              <div className="text-center w-full py-8 text-gray-500">
                商品はまだありません。
              </div>
            )}
          </div>
          {!isProductsLoading &&
            ((products?.data?.data?.length ?? 0) > 0 && totalPages !== 1) && (
              <div className="flex justify-end">
                <div>
                  <PaginationComponent
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
        </div>

      </div>
    </section>
  );
};

export default FCPurchasePage;
