import ImageUploaderDragAndDrop, {
  ImageFormValue,
} from "@/components/admin/ImageUploaderDragAndDrop";
import { Upload } from "lucide-react";

export default function ImageUploaderPage({
  value,
  onChange,
}: {
  value: ImageFormValue[];
  onChange: (images: ImageFormValue[]) => void;
}) {
  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            画像アップロード
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            画像をドラッグアンドドロップして並び替え
          </p>
        </div>

        {/* Main Image Uploader */}
        <ImageUploaderDragAndDrop value={value} onChange={onChange} />
      </div>
    </div>
  );
}
