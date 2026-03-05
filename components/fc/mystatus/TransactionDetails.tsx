"use client";

const TransactionDetails = () => {
  const tableData = [
    {
      contractAmount: "¥100,000",
      wholesaleRate: "80",
      referralIncentive: "¥10,000",
    },
    {
      contractAmount: "¥300,000",
      wholesaleRate: "60",
      referralIncentive: "¥20,000",
    },
  ];

  const descriptionPoints = [
    "契約購入額10万円の場合: 本体金額に80%を乗じた額で¥100,000 (税別) 分の商品を購入 (ex:本体金額¥10,000→仕入金額¥8,000)",
    "契約購入額30万円の場合: 本体金額に60%を乗じた額で¥300,000 (税別) 分の商品を購入 (ex:本体金額¥10,000→仕入金額¥6,000)",
    "ご紹介いただいた方が、上記いずれかの契約購入額でご契約になった場合は、金額毎の紹介インセンティブをキャッシュバック/但し、自身が10万円契約の場合、紹介者が30万円の契約をしても紹介インセンティブは1万円",
    "ランクアップ: 初回10万契約をしたが、もっと利益率を上げたい!そんな方のために・・・ 契約購入時から起算して、3か月以内に卸率80%で、30万円に到達残額の購入で、翌月から卸率60%で商品仕入可能",
  ];

  return (
    <div className="w-full mt-8 border border-dark rounded-md p-4">
      {/* Table */}
      <div className="overflow-x-auto mb-6 flex flex-col items-center  w-full  ">
        <div className="flex flex-col items-start">
          <div className="w-auto">
            <h3 className="text-lg font-bold">【お取引内容】</h3>
          </div>

          <table className="w-fit border-collapse ">
            <thead>
              <tr className=" bg-secondary">
                <th className="px-4 py-3 text-center text-sm font-bold text-white border border-black">
                  契約購入額
                  <br />
                  （仕入金額・税別）
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-white border border-black">
                  卸率
                  <br />
                  （%）
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-white border border-black">
                  紹介インセンティブ
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-3 text-sm text-gray-900 text-center  font-medium border border-black">
                    {row.contractAmount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border border-black">
                    {row.wholesaleRate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium border border-black">
                    {row.referralIncentive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 mt-5 bg-dark-bg p-4 w-full md:w-1/2 2xl:w-2/6 ">
          {descriptionPoints.map((point, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-900 mr-2">•</span>
              <p className="text-sm text-gray-700 leading-relaxed font-bold">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Description Points */}
    </div>
  );
};

export default TransactionDetails;
