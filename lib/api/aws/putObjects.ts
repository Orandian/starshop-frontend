
import { useUserStore } from "@/store/useAuthStore";
import axios from "axios";

export type Photo = {
  id: string | number;
  file?: File;
  imgUrl: string;
};

type PutObjectsReq = Array<PutObject>;

type PutObject = {
  key: string;
  url: string;
};

export type PresignResponse = {
  status: string;
  preasign_urls: Array<PutObject>;
};

export const putObjects = async (
    folderName: string,
    files: Array<Photo>
  ): Promise<Array<Photo>> => {

  const putObjectsReq: PutObjectsReq = files.map((file) => {
    const ext = file.file?.name?.split(".").pop(); // e.g. "png", "jpg", "pdf"
    let key = "";
    if (folderName === "user") {
      key = `${folderName}/profile_${new Date().getTime()}.${ext}`;
    } else {
      key = `${folderName}/${new Date().toISOString()}-${file.file?.name}`;
    }
    file.imgUrl = `/${key}`;

    return { key, url: "" };
  });

  try {
    // ① 署名付きURLをAPIから取得
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aws-presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
          'Authorization': `Bearer ${useUserStore.getState().token}`,
      },
      body: JSON.stringify(putObjectsReq),
    });

    const presignResponse: PresignResponse = await res.json();

    // ② 各ファイルをS3にPUT
    for (let i = 0; i < presignResponse.preasign_urls.length; i++) {
      await axios.put(presignResponse.preasign_urls[i].url, files[i].file, {
      headers: {
          "Content-Type": files[i].file?.type || "application/octet-stream",
      },
      });
    }

    return files;
  } catch (error) {
    throw error;
  }
};
