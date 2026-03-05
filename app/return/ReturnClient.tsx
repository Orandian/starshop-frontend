"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useCreateOrder } from "@/hooks/user/useOrder"
import { toast } from "sonner"
import ShopMailInfo from "@/components/app/MailContact"

export default function ReturnClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "complete" | "error">("loading")
  const [email, setEmail] = useState<string | null>(null)
    //company address ( Beautech)

  const { mutateAsync: createOrder } = useCreateOrder()

  useEffect(() => {
    const checkSession = async () => {
      if (!sessionId) {
        setStatus("error")
        return
      }

      try {
        await createOrder({ sessionId }, {
          onSuccess: (response) => {
            setStatus("complete")
            setEmail(response.data.customerEmail ?? null)
            toast.success("支払いが正常に処理されました！")
          },
          onError: () => {
            setStatus("error")
          }
        })
      } catch (e : unknown) {
        toast.error(e instanceof Error ? e.message || "支払いの確認中にエラーが発生しました。" : "支払いの確認中にエラーが発生しました。" )
        setStatus("error")  
      }
    }

    checkSession()
  }, [sessionId, createOrder])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border border-white-bg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">お支払いの処理</h2>
                <p className="text-gray-600">取引を確認していますので、しばらくお待ちください...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "complete") {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white border border-white-bg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">支払い完了</CardTitle>
            <CardDescription className="text-lg">ご購入ありがとうございます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                確認メールを送信いたしました。 <span className="font-semibold">{email}</span>
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-gray-600">ご注文の最新情報はメールでお知らせいたします。</p>

              <div className="space-y-3">
                <Button asChild className="w-full text-white">
                  <Link href="/">買い物を続ける</Link>
                </Button>

                <Button variant="outline" asChild className="w-full bg-transparent border border-white-bg">
                  <Link href="/profile">注文履歴を見る</Link>
                </Button>
              </div>

              <div className="pt-4 border-t border-white-bg mt-10">
                <p className="text-sm text-gray-500">
                  お困りのことはありませんか？サポートチームまでお気軽にお問い合わせください。{" "}
                </p>
                <ShopMailInfo />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white border border-white-bg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">支払い失敗</CardTitle>
          <CardDescription className="text-lg">お支払いの処理が完了できませんでした。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              支払いが完了していません。問題が解決しない場合は、サポートに連絡してください。
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-3">
              <Button asChild className="w-full text-white">
                <Link href="/cart">もう一度試す</Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent border border-white-bg">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Homeに戻る
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t text-center border-white-bg mt-10">
              <p className="text-sm text-dark-500">
                お困りのことはありませんか？サポートチームまでお気軽にお問い合わせください。
                {" "}
              </p>
              <ShopMailInfo />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
