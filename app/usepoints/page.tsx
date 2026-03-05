"use client";

const UsePointsPage = () => {
  return (
    <div className="my-10 md:my-20">
      <div className="flex flex-col container mx-auto px-4 md:px-6 lg:px-8 py-20 tracking-wider text-sm ">
        <h1 className="font-shippori text-xlarge text-center text-[#786464] mb-10">ポイントについて</h1>
        <div className="max-w-[800px] mx-auto border-2 border-[#dad1ce] md:px-10 px-6 md:py-10 py-4">
          <ul className="list-disc marker:text-[#dad1ce] marker:text-xl pl-6 space-y-2 text-[#5f4d4d] font-bold">
            <li>StarShopで商品を購入すると、購入金額に応じてポイントが貯まります。</li>
            <li>通常、100円 (税抜) ごとに1ポイントが付与されます。</li>
            <li>小数点以下の端数ポイントは切捨てとなります。</li>
            <li>ポイント・クーポン値引き前の商品代金に対して付与されます。</li>
            <li>送料、決済手数料はポイント付与の対象外です。</li>
            <li>1ポイント1円として、商品代金や送料の支払いに利用できます。</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UsePointsPage;
