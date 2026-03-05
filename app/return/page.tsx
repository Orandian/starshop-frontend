import ReturnClient from "./ReturnClient";
import { Suspense } from "react";

export default function ReturnPage() {
  return (
    <Suspense fallback={<div>読み込み中。。。</div>}>
      <ReturnClient />
    </Suspense>
  );
}
