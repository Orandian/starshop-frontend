import { useGetProductDetails } from "@/hooks/fc";
import { FCPlanProduct } from "@/types/fc/plan.type";
import ImageComponent from "../ImageComponent";
import LoadingIndicator from "../ui/LoadingIndicator";
import { getPublicUrl } from "@/utils";

const ProductDetail = ({
  product,
  onClose,
}: {
  product: FCPlanProduct;
  onClose: () => void;
}) => {
  const { data: productDetail, isLoading } = useGetProductDetails(
    product.product.productId.toString()
  );


  if (isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg max-w-xl w-full mx-4 shadow-xl overflow-auto">
        <button
          aria-label="閉じる"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl leading-none cursor-pointer hover:bg-gray-100 rounded-md p-2"
        >
          ×
        </button>

        <div className="flex justify-center flex-col px-8 py-8">
          <div className="w-64 h-64 mx-auto bg-disabled/10 flex items-center justify-center rounded-md">
            <ImageComponent
              imgURL={getPublicUrl(product.product.images?.[0]?.imageUrl)}
              imgName="p1"
              className=" object-contain"
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">{product.product.name}</h2>
          <div className="text-sm text-gray-600 mb-4">
            ブランド: {productDetail?.data?.brand?.name}
          </div>

          <div className="flex items-end gap-4 mb-4">
            <div className="text-xs text-gray-400 line-through">{`¥${productDetail?.data?.originalPrice.toLocaleString("ja-JP")}`}</div>
            <div className="text-2xl font-bold">
              {`¥${productDetail?.data?.discountSalePrice.toLocaleString("ja-JP")}`}{" "}
              <span className="text-base tet-dark">[税別]</span>{" "}
            </div>
          </div>

          <hr className="my-4" />

          <div className="prose text-sm text-gray-700">
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: productDetail?.data?.description || "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
