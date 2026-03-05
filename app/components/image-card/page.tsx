"use client";

import ImageCardComponent from "@/components/admin/ImageCardComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";
import ProductImage1 from "@/public/admin/product1.png";
import ProductImage2 from "@/public/admin/product2.png";
import ProductImage3 from "@/public/admin/product3.png";
import ProductImage4 from "@/public/admin/product4.png";

const ImageCardPage = () => {
    return (
        <ComponentLayout
            componentTitle="Image Card"
            componentPath="@/components/admin/ImageCardComponent.tsx"
            params={ImageCardComponent.Params}
        >
            <ImageCardComponent
                imgURL={ProductImage1.src}
                imgName="product1"/>
            <ImageCardComponent
                imgURL={ProductImage2.src}
                imgName="product2"/>
            <ImageCardComponent
                imgURL={ProductImage3.src}
                imgName="product3"/>
            <ImageCardComponent
                imgURL={ProductImage4.src}
                imgName="product4"/>
        </ComponentLayout>
    );
};

export default ImageCardPage;