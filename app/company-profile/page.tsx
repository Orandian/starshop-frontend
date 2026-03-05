"use client";

const CompanyProfilePage = () => {
  return (
    <div className="my-10 md:my-20">
      <div className="flex flex-col container mx-auto px-4 md:px-6 lg:px-8 py-20 tracking-wider text-sm ">
        <h1 className="font-shippori text-xlarge text-center text-[#786464] mb-10">会社概要</h1>
        <div className="max-w-[1100px] mx-auto border-2 border-[#dad1ce] md:px-10 px-6 md:py-10 py-4">
          <table className="min-w-full text-[#5f4d4d] font-bold">
            <colgroup>
              <col className="w-[30%] md:w-[30%]" />
              <col className="w-[70%] md:w-[70%]" />
            </colgroup>
            <tbody>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">商号</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">BEAUTECH 株式会社</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">フリガナ</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">ビューテック</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">設立</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">2018年08月15日</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">資本金</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">2,000万円</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">代表取締役</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">西村 茂夫</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">主要取引銀行</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">三井住友銀行<br />東京東信用金庫</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top break-keep">許認可・届出受理</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">労働者派遣事業許可番号 <br className="md:hidden" />派13-316918<br />有料職業紹介事業許可番号 <br className="md:hidden" />13-ユ-315806<br />プライバシーマーク <br className="md:hidden" />第22000-459（02）号</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">加入保険</td>
                <td className="px-2 md:px-4 py-3"><p className="leading-relaxed tracking-wider">損害保険 PL保険</p></td>
              </tr>
              <tr className="text-14px">
                <td className="px-0 md:px-4 py-3 align-top">
                  <div>電話番号</div>
                </td>
                <td className="px-2 md:px-4 py-3"><div><p className="leading-relaxed tracking-wider">【コスメ事業】専用窓口: 03-5801-5968</p></div><div className="h-[1.25rem]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePage;
