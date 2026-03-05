"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFcPaymentSuccess } from "@/hooks/fc/useFcPayment";
import { useUserStore } from "@/store/useAuthStore";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingIndicator from "../ui/LoadingIndicator";

type FCReturnClientProps = {
  sessionId: string;
  sub: string;
  isLoading?: boolean;
  successClick: () => void;
  successBtnText?: string;
  failureClick: () => void;
  failureBtnText?: string;
};

export const FCReturnClient = ({
  sessionId,
  sub,
  isLoading = false,
  successClick,
  successBtnText = "買い物を続ける",
  failureClick,
  failureBtnText = "もう一度試す",
}: FCReturnClientProps) => {
  const [status, setStatus] = useState<"loading" | "complete" | "error">(
    "loading",
  );

  const { user } = useUserStore();

  const { mutateAsync: paymentSuccess } = useFcPaymentSuccess();

  useEffect(() => {
    const checkSession = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        let res;
        if (sessionId) {
          res = await paymentSuccess({ sessionId });
        }

        // if (sessionId && sub) {
        //   res = await subscriptionPaymentSuccess({ sessionId });
        // }

        if (res && !res.success) {
          setStatus("error");
          return;
        }

        // const data = await res.json();
        setStatus("complete");
        // setEmail(data.customerEmail ?? null);
      } catch (e) {
        console.error("Error verifying session:", e);
        setStatus("error");
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, sub]);

  if (status === "loading") {
    return (
      <div className=" bg-indigo-100/20 flex items-center justify-center p-5 md:p-20 rounded-md border border-indigo-100 mt-16">
        <Card className="w-full max-w-md bg-white border border-white-bg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  お支払いの処理
                </h2>
                <p className="text-gray-600">
                  取引を確認していますので、しばらくお待ちください...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className=" bg-emerald-100/20 flex items-center justify-center p-5 md:p-20 rounded-md border border-emerald-100 mt-16">
        <Card className="w-full max-w-lg bg-white border border-white-bg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              支払いが完了しました
            </CardTitle>
            <CardDescription className="text-lg">
              ご購入ありがとうございます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                確認メールを送信しました{" "}
                <span className="font-semibold">{user?.email}</span>
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-gray-600">ご注文内容の詳細は、</p>
              <p className="text-gray-600">
                ご登録のメールアドレスへお知らせいたします。
              </p>

              <div className="space-y-3">
                <Button
                  className="w-full text-white"
                  onClick={successClick}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingIndicator size="sm" /> : successBtnText}
                </Button>
              </div>

              <div className="pt-4 border-t text-center space-y-1">
                <p className="text-xs text-gray-500">サポートが必要な場合 </p>
                <p className="text-xs text-gray-500">
                  サポートチームまでご連絡いただければ対応いたします。
                </p>
                <p className="text-xs text-gray-500">STAR SHOP（スターショップ）</p>
                <p className="text-xs text-gray-500">
                  URL:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    https://www.starshop.co
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  メール:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    starshop@beau-tech.jp
                  </a>
                </p>
                <p className="text-xs text-gray-500">営業時間: 平日09:00～18:00（土日祝除く）</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" bg-rose-100/20 flex items-center justify-center p-5 md:p-20 rounded-md border border-rose-100 mt-16">
      <Card className="w-full max-w-lg bg-white border border-white-bg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            支払い失敗
          </CardTitle>
          <CardDescription className="text-lg">
            お支払いの処理が完了しませんでした
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              クレジットカード決済を正常に完了できませんでした。
              <span className="text-red-800">恐れ入りますが、再度お試しください。問題が解決しない場合は、サポートまでお問い合わせください。</span>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full text-white" onClick={failureClick}>
                {isLoading ? <LoadingIndicator size="sm" /> : failureBtnText}
              </Button>
            </div>

                     <div className="pt-4 border-t text-center space-y-1">
                <p className="text-xs text-gray-500">サポートが必要な場合 </p>
                <p className="text-xs text-gray-500">
                  サポートチームまでご連絡いただければ対応いたします。
                </p>
                <p className="text-xs text-gray-500">STAR SHOP（スターショップ）</p>
                <p className="text-xs text-gray-500">
                  URL:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    https://www.starshop.co
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  メール:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    starshop@beau-tech.jp
                  </a>
                </p>
                <p className="text-xs text-gray-500">営業時間: 平日09:00～18:00（土日祝除く）</p>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
