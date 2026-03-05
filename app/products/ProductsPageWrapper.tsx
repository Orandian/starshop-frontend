'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { usePublicProductsList } from '@/hooks/user/useProduct';
import { usePublicCategory } from '@/hooks/useCategory';
import { usePublicBrands } from '@/hooks/useBrands';
import { CategoryPublic } from '@/types/categories';
import { Skeleton } from '@/components/ui/skeleton';
import BannerComponent from '@/components/app/BannerComponent';
import ProductItemComponent from '@/components/app/public/ProductItemComponent';
import TitleWithNavigationComponent from '@/components/app/public/TitleWithNavigationComponent';
import BannerImage from '@/public/products/Banner.png';
import ProductsImage from '@/public/svgs/text/Products.svg';
import { getPublicUrl } from '@/utils';
import { toast } from 'sonner';
import { BrandType } from '@/types/dashboard/brands';
import { Product, ProductListData } from '@/types/dashboard/products';

export default function ProductPageWrapper() {
  const params = useSearchParams();
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  /* ---------- Brands ---------- */
  const { data: brands } = usePublicBrands();
  const brandList = useMemo(
    () => (brands?.data?.data ?? []) as BrandType[],
    [brands]
  );

  /* ---------- Products ---------- */
  const {
    data: products,
    isError,
    error,
    isLoading,
  } = usePublicProductsList(selectedBrand, page, pageSize);
  const productList = (products?.data?.data ?? []) as Product[];
  const productData = (products?.data as ProductListData | undefined) ?? undefined;
  const totalPages = productData?.pagination?.totalPages ?? 0;
  // const currentPage = productData?.pagination?.currentPage ?? 1;
  // const response = products?.data; // ProductListResponse
  // const productList = response?.data.data ?? [];
  // const totalPages = response?.data.pagination?.totalPages ?? 1;

  /* ---------- Categories ---------- */
  const { data: categories } = usePublicCategory();
  const categoryList = useMemo(
    () => (categories?.data ?? []) as CategoryPublic[],
    [categories]
  );

  /* ---------- Error handling ---------- */
  useEffect(() => {
    if (isError) toast.error(error?.message);
  }, [isError, error]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    setPage(1);
  }, [selectedBrand, selectedOption]);

  /* ---------- URL → filter sync ---------- */
  useEffect(() => {
    const paramBrand = params.get("brand");
    if (!paramBrand) return;

    const brand = brandList.find(
      (b) => b.name.toLowerCase() === paramBrand.toLowerCase()
    );
    if (brand) {
      setSelectedBrand(brand.name.toString());
      return;
    }
    const category = categoryList.find(
      (c) => c.name?.toLowerCase() === paramBrand.toLowerCase()
    );
    if (category) {
      setSelectedBrand(category.categoryId.toString());
      return;
    }

    setSelectedBrand("All");
  }, [params, brandList, categoryList]);

  /* ---------- Brand click ---------- */
  const handleToSelectBrand = (_value: string, name: string) => {
    setSelectedBrand(name);
    router.push(`/products?brand=${name}`);
  };

  return (
    <>
      <BannerComponent image={BannerImage} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-10">
        <TitleWithNavigationComponent
          title="Products"
          titleImage={ProductsImage}
          options={categoryList.map((c) => ({
            label: c.name ?? "",
            value: c.categoryId.toString(),
          }))}
          selectedOption={selectedOption}
          handleToSelect={(value) => setSelectedOption(value)}
          selectedBrand={selectedBrand}
          handleToSelectBrand={handleToSelectBrand}
          brands={brandList.map((b) => ({
            label: b.name,
            value: b.brandId.toString(),
          }))}
        />

        {/* ---------- Product Grid ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!isLoading &&
            productList.map((product) => (
              <ProductItemComponent
                key={product.productId}
                product={{
                  id: product.productId || 0,
                  name: product.name,
                  price: product.tax
                    ? product.salePrice +
                    (product.salePrice * product.tax) / 100
                    : product.salePrice,
                  image: product.images?.filter(
                    (image) => image?.imageOrder === 1
                  )[0]?.imageUrl
                    ? getPublicUrl(product?.images?.filter(
                      (image) => image.imageOrder === 1)[0]?.imageUrl)
                    : '/home/placeholder.jpg',
                  isTax: !!product.tax,
                  imgBg: false,
                }}
              />
            ))}

          {!isLoading && productList.length === 0 && (
            <p className="text-lg">商品がありません</p>
          )}

          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
        </div>

        {/* ---------- Pagination ---------- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              前へ
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 border rounded ${
                    page === pageNumber
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </>
  );
}

