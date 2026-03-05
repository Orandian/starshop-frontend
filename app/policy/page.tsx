"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";

const PolicyPage = () => {
  return (
    <div>
      <BannerComponent image={BannerImage} />

      <div className="flex flex-col container mx-auto px-4 md:px-6 lg:px-8 py-20 flex flex-col tracking-wider text-sm ">
        <h1 className="text-xlarge text-center mb-10">プライバシーポリシー</h1>
        <div className="mb-10">

          <ol className="list-decimal pl-6 space-y-10">
            <li className="pl-1">
              <strong>個人情報保護方針</strong><br />
              当社は、当社が取得した個人情報の取扱いに関し、個人情報の保護に関する法律、個人情報保護に関するガイドライン等の指針、
              その他個人情報保護に関する関係法令を遵守します。
            </li>

            <li className="pl-1">
              <strong>個人情報の安全管理</strong><br />
              当社は、個人情報の保護に関して、組織的、物理的、人的、技術的に適切な対策を実施し、当社の取り扱う個人情報の漏えい、
              滅失又はき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講ずるものとします。
            </li>

            <li className="pl-1">
              <strong>個人情報の取得等の遵守事項</strong><br />
              当社による個人情報の取得、利用、提供については、以下の事項を遵守します。
              <ol className="list-decimal pl-6 space-y-2">
                <li className="pl-1">
                  <strong>個人情報の取得</strong><br />
                  当社は、当社が管理するインターネットによる電子商取引（以下「本サイト」といいます。）の運営に必要な範囲で、
                  本サイトから、ユーザーに係る個人情報を取得することがあります。</li>
                <li className="pl-1">
                  <strong>個人情報の利用目的</strong><br />
                  当社は、当社が取得した個人情報について、法令に定める場合又は本人の同意を得た場合を除き、以下に定める利用目的の達成に必要な範囲を超え
                  て利用することはありません。<br />
                  <ul className="list-disc list-inside">
                    <li>本サイトならびに本事業の運営、維持、管理</li>
                    <li>本サイトならびに本事業を通じたサービスの提供及び紹介</li>
                    <li>本サイトならびに本事業の品質向上のためのアンケートやリサーチ</li>
                  </ul>
                  </li>
                <li className="pl-1">
                  <strong>個人情報の提供等</strong><br />
                  当社は、法令で定める場合を除き、本人の同意に基づき取得した個人情報を、本人の事前の同意なく提携事業者以外の第三者に提供することは
                  ありません。なお、 本人の求めによる個人情報の開示、訂正、追加若しくは削除又は利用目的の通知については、法令に従いこれを行うとともに、
                  ご意見、ご相談に関して適切に対応します。</li>
              </ol>
            </li>

            <li className="pl-1">
              <strong>個人情報の利用目的の変更</strong><br />
              当社は、前項で特定した利用目的は、予め本人の同意を得た場合を除くほかは、原則として変更しません。
              但し、変更前の利用目的と相当の関連性を有すると合理的に認められる範囲において、予め変更後の利用目的を公表の上で変更を行う場合はこの
              限りではありません。
            </li>

            <li className="pl-1">
              <strong>個人情報の第三者提供</strong><br />
              当社は、個人情報の取扱いの全部又は一部を第三者に委託する場合、その適格性を十分に審査し、その取扱いを委託された個人情報の安全管理が
              図られるよう、委託を受けた者に対する必要かつ適切な監督を行うこととします。
            </li>

            <li className="pl-1">
              <strong>個人情報の取扱いの改善・見直し</strong><br />
              当社は、個人情報の取扱い、管理体制及び取組みに関する点検を実施し、継続的に改善・見直しを行います。
            </li>

            <li className="pl-1">
              <strong>個人情報の廃棄</strong><br />
              当社は、個人情報の利用目的に照らしその必要性が失われたときは、個人情報を消去又は廃棄するものとし、当該消去及び廃棄は、
              外部流失等の危険を防止するために必要かつ適切な方法により、業務の遂行上必要な限りにおいて行います。
            </li>

            <li className="pl-1">
              <strong>苦情や相談の担当窓口</strong><br />
              当社は、個人情報の取扱いに関する担当窓口を設置し、その責任者を以下の通り設けます。
            </li>
          </ol>
        </div>


        <div className="mb-10">
          <strong>BEAUTECH 株式会社</strong><br />
          〒104-0045<br />
          東京都中央区築地6丁目1-9 <br />
          門跡木村ビル2F<br />
         【コスメ事業】  専用窓口： 03-5801-5968
        </div>

      </div>
    </div>
  );
};

export default PolicyPage;
