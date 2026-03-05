const Params = {
  active: 0,
};

interface RegisterIndicatorProps {
  active: number;
}

const RegisterIndicator = ({ active }: RegisterIndicatorProps) => {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-xs md:text-xl  font-semibold">
          STAR SHOP プロフェッショナルシステムへようこそ
        </h1>
        <p className="text-xs md:text-sm  mt-3">STAR SHOPは、</p>
        <p className="text-xs md:text-sm  mt-1.5">
          エステサロン限定の会員制プロフェッショナル流通システムです。
        </p>
        <p className="text-xs md:text-sm  mt-1.5">簡単な登録手続き完了後、</p>
        <p className="text-xs md:text-sm  mt-1.5">
          専用紹介URLをご利用いただけます。
        </p>
        <p className="text-xs md:text-sm mt-1.5">それでは、</p>
        <p className="text-xs md:text-sm mt-1.5">
          選ばれたプロフェッショナルのためのサービスをお始めください。
        </p>
      </header>
      {/* Mobile  Step indicator */}
      <div className="  mb-10 gap-y-2 sm:hidden flex flex-row items-center">
        {/* 1st step */}
        <div
          className={`relative text-sm w-5 h-5 p-4 rounded-full flex justify-center items-center  ${
            active === 1
              ? "bg-gray-100 border  border-black text-black"
              : active > 1
                ? "bg-black text-white"
                : "bg-gray-200 border border-black/20 text-black/20"
          }`}
        >
          1
        </div>
        <div
          className={`w-full h-0.5 bg-black ${active >= 2 ? "bg-black" : "bg-gray-100"}`}
        />

        {/* 2nd step */}
        <div
          className={`relative  w-5 h-5 p-4 rounded-full  text-sm flex justify-center items-center  ${
            active === 2
              ? "bg-gray-100 border  border-black text-black"
              : active > 2
                ? "bg-black text-white"
                : "bg-gray-200 border border-black/20 text-black/20"
          }`}
        >
          2
        </div>
        <div
          className={`w-full h-0.5 bg-black ${active >= 3 ? "bg-black" : "bg-gray-100"}`}
        />
        {/* 3rd step */}
        <div
          className={`relative  w-5 h-5 p-4  rounded-full text-sm flex justify-center items-center  ${
            active === 3
              ? "bg-gray-100 border  border-black text-black"
              : active > 3
                ? "bg-black text-white"
                : "bg-gray-200 border border-black/20 text-black/20"
          }`}
        >
          3
        </div>
        <div
          className={`w-full h-0.5 bg-black ${active >= 4 ? "bg-black" : "bg-gray-100"}`}
        />
        {/* 4th step */}
        <div
          className={`relative  w-5 h-5 p-4 rounded-full  text-sm flex justify-center items-center ${
            active === 4
              ? "bg-gray-100 border  border-black text-black"
              : active > 4
                ? "bg-black text-white"
                : "bg-gray-200 border border-black/20 text-black/20"
          }`}
        >
          4
        </div>
      </div>

      {/* Web  Step indicator */}
      <div className="md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-10 gap-y-2 hidden ">
        {/* 1st step */}
        <div
          className={`relative polygon-right text-sm h-24  flex justify-center items-center text-white ${
            active === 1 ? "bg-black" : "bg-product-card-btn"
          }`}
        >
          01 アカウント作成
        </div>
        {/* 2nd step */}
        <div
          className={`relative polygon-right text-sm h-24 flex justify-center items-center text-white ${
            active === 2 ? "bg-black" : "bg-product-card-btn"
          }`}
        >
          02 継続供給販売申込
        </div>
        {/* 3rd step */}
        <div
          className={`relative polygon-right text-sm h-24 flex justify-center items-center text-white ${
            active === 3 ? "bg-black" : "bg-product-card-btn"
          }`}
        >
          03 紹介制度
        </div>
        {/* 4th step */}
        <div
          className={`relative polygon-right text-sm h-24 flex justify-center items-center text-white ${
            active === 4 ? "bg-black" : "bg-product-card-btn"
          }`}
        >
          04 完了
        </div>
      </div>
    </div>
  );
};

RegisterIndicator.Params = Params;

export default RegisterIndicator;
