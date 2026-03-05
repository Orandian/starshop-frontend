"use client";

import BannerComponent from "@/components/app/BannerComponent";
import BannerImage from "@/public/products/Banner.png";

const RulePage = () => {
  return (
    <div>
      <BannerComponent image={BannerImage} />

      <div className="flex flex-col container mx-auto px-4 md:px-6 lg:px-8 py-20 flex flex-col tracking-wider text-sm ">
        <h1 className="text-xlarge text-center mb-10">ご利用規約</h1>
        <div className="mb-10">
          <h2 className="text-large mb-2">第1条 (会員)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li className="pl-1 [text-indent:-0.25rem]">
              「会員」とは、当社が定める手続に従い本規約に同意の上、入会の申し込みを行う個人をいいます。
            </li>
            <li className="pl-1 [text-indent:-0.25rem]">
              「会員情報」とは、会員が当社に開示した会員の属性に関する情報および会員の取引に関する履歴等の情報をいいます。
            </li>
            <li className="pl-1 [text-indent:-0.25rem]">
              本規約は、全ての会員に適用され、登録手続時および登録後にお守りいただく規約です。
            </li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第2条 (登録)</h2>
          <h4 className="font-bold mb-2">会員資格</h4>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>本規約に同意の上、所定の入会申込みをされたお客様は、所定の登録手続完了後に会員としての資格を有します。</li>
            <li>会員登録手続は、会員となるご本人が行ってください。代理による登録は一切認められません。</li>
            <li>なお、過去に会員資格が取り消された方やその他当社が相応しくないと判断した方からの会員申込はお断りする場合があります。</li>
          </ol>
          <h4 className="font-bold mb-2">会員情報の入力</h4>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>会員登録手続の際には、入力上の注意をよく読み、所定の入力フォームに必要事項を正確に入力してください。</li>
            <li>会員情報の登録において、特殊記号・旧漢字・ローマ数字などはご使用になれません。これらの文字が登録された場合は当社にて変更致します。</li>
          </ol>
          <h4 className="font-bold mb-2">パスワードの管理</h4>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>パスワードは会員本人のみが利用できるものとし、第三者に譲渡・貸与できないものとします。</li>
            <li>パスワードは、他人に知られることがないよう定期的に変更する等、会員本人が責任をもって管理してください。</li>
            <li>パスワードを用いて当社に対して行われた意思表示は、会員本人の意思表示とみなし、そのために生じる支払等は全て会員の責任となります。</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第3条 (変更)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>会員は、氏名、住所など当社に届け出た事項に変更があった場合には、速やかに当社に連絡するものとします。</li>
            <li>変更登録がなされなかったことにより生じた損害について、当社は一切責任を負いません。また、変更登録がなされた場合でも、
              変更登録前にすでに手続がなされた取引は、変更登録前の情報に基づいて行われますのでご注意ください。</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第4条 (退会)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>会員が退会を希望する場合には、会員本人が退会手続きを行ってください。所定の退会手続の終了後に、退会となります。</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第5条 (会員資格の喪失及び賠償義務)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>会員が、会員資格取得申込の際に虚偽の申告をしたとき、通信販売による代金支払債務を怠ったとき、
              その他当社が会員として不適当と認める事由があるときは、当社は、会員資格を取り消すことができることとします。</li>
            <li>会員が、以下の各号に定める行為をしたときは、これにより当社が被った損害を賠償する責任を負います。
              <ul className="list-disc list-inside space-y-1 mb-2 mt-1">
                <li>会員番号、パスワードを不正に使用すること</li>
                <li>当ホームページにアクセスして情報を改ざんしたり、当ホームページに有害なコンピュータープログラムを送信するなどして、
                  当社の営業を妨害すること</li>
                <li>当社が扱う商品の知的所有権を侵害する行為をすること</li>
                <li>その他、この利用規約に反する行為をすること</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第6条 (会員情報の取扱い)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>当社は、原則として会員情報を会員の事前の同意なく第三者に対して開示することはありません。ただし、次の各号の場合には、
              会員の事前の同意なく、当社は会員情報その他のお客様情報を開示できるものとします。
              <ol className="list-disc list-inside space-y-1 mb-2 mt-1">
                <li>法令に基づき開示を求められた場合</li>
                <li>当社の権利、利益、名誉等を保護するために必要であると当社が判断した場合</li>
              </ol>
            </li>
            <li>会員情報につきましては、当社の「個人情報保護への取組み」に従い、当社が管理します。当社は、会員情報を、会員へのサービス提供、
              サービス内容の向上、サービスの利用促進、およびサービスの健全かつ円滑な運営の確保を図る目的のために、
              当社おいて利用することができるものとします。</li>
            <li>当社は、会員に対して、メールマガジンその他の方法による情報提供(広告を含みます)を行うことができるものとします。
              会員が情報提供を希望しない場合は、当社所定の方法に従い、その旨を通知していただければ、情報提供を停止します。
              ただし、本サービス運営に必要な情報提供につきましては、会員の希望により停止をすることはできません。</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第7条 (禁止事項)</h2>
          <span className="">本サービスの利用に際して、会員に対し次の各号の行為を行うことを禁止します。</span>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>法令または本規約、本サービスご利用上のご注意、本サービスでのお買い物上のご注意その他の本規約等に違反すること</li>
            <li>当社、およびその他の第三者の権利、利益、名誉等を損ねること</li>
            <li>青少年の心身に悪影響を及ぼす恐れがある行為、その他公序良俗に反する行為を行うこと</li>
            <li>他の利用者その他の第三者に迷惑となる行為や不快感を抱かせる行為を行うこと</li>
            <li>虚偽の情報を入力すること</li>
            <li>有害なコンピュータープログラム、メール等を送信または書き込むこと</li>
            <li>当社のサーバーその他のコンピューターに不正にアクセスすること</li>
            <li>パスワードを第三者に貸与・譲渡すること、または第三者と共用すること</li>
            <li>その他当社が不適切と判断すること</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第8条 (サービスの中断・停止等)</h2>
          <span className="">当社は、本サービスの稼動状態を良好に保つために、次の各号の一に該当する場合、予告なしに、本サービスの提供全てあるいは一部を停止することがあります。</span>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>システムの定期保守および緊急保守のために必要な場合</li>
            <li>システムに負荷が集中した場合</li>
            <li>火災、停電、第三者による妨害行為などによりシステムの運用が困難になった場合</li>
            <li>その他、止むを得ずシステムの停止が必要と当社が判断した場合</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第9条 (サービスの変更・廃止)</h2>
          <span className="">当社は、その判断によりサービスの全部または一部を事前の通知なく、適宜変更・廃止できるものとします。</span>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第10条 (免責)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>通信回線やコンピューターなどの障害によるシステムの中断・遅滞・中止・データの消失、データへの不正アクセスにより生じた損害、その他当社のサービスに関して会員に生じた損害について、当社は一切責任を負わないものとします。</li>
            <li>当社は、当社のウェブページ・サーバー・ドメインなどから送られるメール・コンテンツに、コンピューター・ウィルスなどの有害なものが含まれていないことを保証いたしません。</li>
            <li>会員が本規約等に違反したことによって生じた損害については、当社は一切責任を負いません。</li>
          </ol>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第11条 (本規約の改定)</h2>
          <span className="">当社は、本規約を任意に改定できるものとし、また、当社において本規約を補充する規約(以下「補充規約」といいます)を定めることができます。本規約の改定または補充は、改定後の本規約または補充規約を当社所定のサイトに掲示したときにその効力を生じるものとします。この場合、会員は、改定後の規約および補充規約に従うものと致します。</span>
        </div>

        <div className="mb-10">
          <h2 className="text-large mb-2">第12条 (準拠法)</h2>
          <span className="">本利用規約の成立、効力発生、解釈にあたっては弊社本社所在地法を準拠法とします。</span>
        </div>

        <div className="mb-10">
          <span className="">以上<br />
          2025年7月1日制定</span>
        </div>

      </div>
    </div>
  );
};

export default RulePage;
