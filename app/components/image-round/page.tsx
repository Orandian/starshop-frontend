"use client";

import ImageRoundComponent from "@/components/admin/ImageRoundComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";
import ProductImage1 from "@/public/admin/product1.png";
import ProductImage2 from "@/public/admin/product2.png";
import ProductImage3 from "@/public/admin/product3.png";
import ProductImage4 from "@/public/admin/product4.png";

const ImageRoundPage = () => {
    return (
        <ComponentLayout
            componentTitle="Image Round"
            componentPath="@/components/admin/ImageRoundComponent.tsx"
            params={ImageRoundComponent.Params}
        >
            <ImageRoundComponent
                imgURL={ProductImage1.src}
                imgName="product1"/>
            <ImageRoundComponent
                imgURL={ProductImage2.src}
                imgName="product2"/>
            <ImageRoundComponent
                imgURL={ProductImage3.src}
                imgName="product3"/>
            <ImageRoundComponent
                imgURL={ProductImage4.src}
                imgName="product4"/>
        </ComponentLayout>
    );
};

export default ImageRoundPage;