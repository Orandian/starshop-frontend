"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import { params } from "@/data/products";

const ProductItemPage = () => {
  return (
    <ComponentLayout
      componentTitle="Product Item"
      componentPath="@/components/app/public/ProductItemComponent.tsx"
      params={params}
    >
        {/* {products.slice(0, 2).map((product, index) => (
          <ProductItemComponent key={product.id} product={{ ...product, imgBg: index === 1 }} />
        ))} */}
        <p>商品一覧</p>
    </ComponentLayout>
  );
};

export default ProductItemPage;
