// import SectionLayout from "@/components/layouts/SectionLayout";
// import TitleWithNavigationComponent from "@/components/app/public/TitleWithNavigationComponent";
// import ProductsListImage from "@/public/svgs/text/Products.svg";
// import ProductItemComponent from "@/components/app/public/ProductItemComponent";
// import { Product } from "@/types/products";
// import { getPublicUrl } from "@/utils";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { BrandList } from "@/types/brands";
// // import { useProductsByCategory } from "@/hooks/user/useProduct";
// // import { useBrands } from "@/hooks/useBrands";
// import { useCategory } from "@/hooks/useCategory";
// import { toast } from "sonner";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Category } from "@/types/categories";

// const ProductsListSectionComponent = () => {
//   const params = useSearchParams(); // Get the brand from the URL
//   const router = useRouter(); // Get the router

//   const [selectedOption, setSelectedOption] = useState("all"); // Set the selected option
//   const [selectedBrand, setSelectedBrand] = useState("all"); // Set the selected brand

  // const {
  //   data: products,
  //   isLoading,
  //   error,
  //   isError,
  // } = useProductsByCategory(selectedOption, selectedBrand); // Get the products by category

//   const { data: categories } = useCategory();
//   // const { data: brands } = useBrands();

//   // Handle to select brand
//   const handleToSelectBrand = (value: string, name: string) => {
//     setSelectedBrand(value); // Set the selected brand

//     const searchParams = new URLSearchParams(window.location.search);
//     searchParams.set("brand", name);

//     const newRelativePathQuery = `${
//       window.location.pathname
//     }?${searchParams.toString()}`;
//     window.history.pushState(null, "", newRelativePathQuery);
//   };

//   useEffect(() => {
//     if (isError) {
//       toast.error(error?.message);
//     }
//   }, [isError, error]); // Handle error

//   useEffect(() => {
//     const paramBrand = params.get("brand"); // Get the brand from the URL

//     if (brands?.data && paramBrand) {
//       const filteredBrandId = brands.data.find(
//         (brand: BrandList) => brand.name === paramBrand
//       );
//       setSelectedBrand(filteredBrandId?.brand_id.toString() || "all");

//       setTimeout(() => {
//         const section = document.getElementById("brand-section");
//         if (section) {
//           const yOffset = -150;
//           const y =
//             section.getBoundingClientRect().top + window.pageYOffset + yOffset;
//           window.scrollTo({ top: y, behavior: "smooth" });
//         }
//       }, 100);
//     }
//   }, [params, brands]); // Set the selected brand

//   return (
//     <SectionLayout className="h-auto">
//       <div
//         className="w-full container mx-auto px-4 md:px-6 lg:px-8"
//         id="brand-section"
//       >
//         <TitleWithNavigationComponent
//           title="Products"
//           titleImage={ProductsListImage}
//           handleToClick={() => router.push("/products")}
//           brands={brands?.data?.map((brand: BrandList) => ({
//             label: brand.name,
//             value: brand.brand_id.toString(),
//           }))}
//           selectedBrand={selectedBrand}
//           handleToSelectBrand={handleToSelectBrand}
//           options={categories?.data?.data?.map((category: Category) => ({
//             label: category.name,
//             value: category.category_id.toString(),
//           }))}
//           selectedOption={selectedOption}
//           handleToSelect={(value) => setSelectedOption(value)}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-5">
//           {products?.data?.data?.map((product: Product) => (
//             <ProductItemComponent
//               key={product.product_id}
//               product={{
//                 id: product.product_id ?? 0,
//                 name: product.name,
//                 price: product.tax
//                   ? product.sale_price +
//                     (product.sale_price * product.tax) / 100
//                   : product.sale_price,
//                 image: product.product_images?.[0]?.image_url
//                   ? getPublicUrl(product.product_images?.[0]?.image_url)
//                   : "https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//                 isTax: !!product.tax,
//                 imgBg: false,
//               }}
//             />
//           ))}
//           {isLoading &&
//             Array.from({ length: 10 }).map((_, index) => (
//               <Skeleton
//                 key={index}
//                 className="w-full h-64 bg-white-bg border border-black/10"
//               />
//             ))}
//           {products?.data?.data?.length === 0 && (
//             <p className="text-start text-lg">商品がありません</p>
//           )}
//         </div>
//       </div>
//     </SectionLayout>
//   );
// };

// export default ProductsListSectionComponent;
