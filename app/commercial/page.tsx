"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";

const CommercialPage = () => {
  return (
    <div>
      <BannerComponent image={BannerImage} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-10 flex flex-col items-center justify-center text-center tracking-wider">
        <h1>特定商取引</h1>
        <div className="overflow-x-auto w-full">
          <table className="w-full block md:table border-0 min-sm:border-[0.5px] border-gray-200 text-left text-sm">
            <colgroup>
              <col className="w-full md:w-[28%]" />
              <col className="w-full md:w-[72%]" />
            </colgroup>
            <tbody className="max-sm:block">
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">販売業者の名称</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">BEAUTECH 株式会社</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">会社URL</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">https://beau-tech.jp/</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">運営責任者</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">西村 茂夫</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">所在地</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  〒104-0045 <br />
                  東京都中央区築地6丁目1-9 門跡木村ビル2F
                </td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">電話番号</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">【コスメ事業】専用窓口：03-5801-5968（09:00〜18:00）</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">Eメールアドレス</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">contact.starshop@beau-tech.jp</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">販売金額</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">各商品ごとに税込金額を表示しております。</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">発送方法と送料</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  ■ 配送方法<br />
                  佐川急便または、ヤマト運輸にて発送いたします。<br />
                  なお、発送は国内に限らせていただきます。<br /><br />
                  
                  ■ 配達日時<br />
                  ご注文受付後すぐに発送準備を開始し、１週間以内にお届けします。<br />
                  配達事情によって前後する場合がございますので、ご了承ください。<br />
                  お届け時間の指定はできませんので、ご了承ください。<br /><br />
                  
                  ■ お届け時間<br />
                  お届け時間の指定はできませんので、ご了承ください。<br /><br />
                  
                  ※交通事情、台風・大雪など天候の影響等によっては、やむを得ず、<br />
                  １週間以内に宅配業者がお届けできない場合がございます。<br /><br />
                  
                  ※年末年始の変則対応については時期になりましたらご案内申し上げます。<br /><br />
                  
                  ◼️ 送料<br />
                  全商品、無料配送とさせていただきます。<br />
                  ただし、お客様都合の場合はお客様にご負担いただきます。<br />
                  返品手数料として商品代金の20％を申し受けます。<br />
                  返品の際、送料はお客様のご負担となります。<br />
                  また、ご返金のための振込手数料はお客様のご負担となります。<br />
                  予めご了承ください。
                </td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">お支払い方法</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">VISA、MASTER、JCB、AMEX、DINERS の各種クレジットカード払いをご利用いただけます。</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">お支払い期限</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">ご注文確定時にクレジットカード決済が即時処理されます</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  商品不良など、当店理由による<br />
                  キャンセル・返品・交換
                </td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  商品の品質については万全を期しておりますが、商品が破損・汚損していた場合、<br />
                  または注文と異なる商品が届いた場合は、交換・返品させていただきます。<br />
                  商品到着後速やかにご連絡ください。<br />
                  「マイページ / ご注文リスト / 注文履歴」により、返品の依頼を行うことができます。<br />
                  商品に欠陥がある場合を除き、返品には応じかねますのでご了承ください。<br /><br />
                  不良品の場合、送料は当店で負担させていただきます。<br />
                  大変お手数ではございますが、料金着払いにてご返送 ください。<br />
                  早急に返品・交換の対応をさせていただきます。<br /><br />
                  尚、商品が在庫切れ等の場合、交換ができずキャンセルをお願いする場合もございます。<br />
                  事前にご連絡させていただきますので、ご了承ください。
                </td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  返品・交換・キャンセルを<br />
                  お受けできない場合
                </td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  お客様が既に利用されている商品(ご使用後、不良品と分かったものは除きます)<br />
                  お客様が汚損・破損された商品<br />
                  お届けから9日以上が経過した商品
                </td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">返品期限</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">商品到着後8日以内とさせていただきます。</td>
              </tr>
              <tr className="max-sm:block max-sm:mb-5">
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">免責事項</td>
                <td className="max-sm:block max-sm:w-full border-[0.5px] border-gray-200 px-4 py-4">
                  当サイトでは、在庫がある商品を販売しておりますが、<br />
                  輸入して販売をしておりますため、僅かの差で「品切れ(完売)」となる場合がございます。<br />
                  「在庫切れ」の際には、その旨のご案内をさせていただき、<br />
                  お客さまのご意思を確認の上、可能な場合は商品をご用意し、<br />
                  それが不可能な場合は注文をキャンセルさせていただきますのでご了承ください。<br />
                  さらに、サーバーシステムの異常やプログラムエラーによる欠品、<br />
                  金額の誤表示の場合もご注文をキャンセルとさせていただく場合がございます。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;
