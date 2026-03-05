import React from "react";

const ShopMailInfo = () => {
    return (
        <div className="pt-4 border-t border-gray-200 text-center">
            <p className="font-bold text-dark text-sm">
                STAR SHOP（スターショップ）
            </p>

            <p className="text-sm text-dark-300">
                URL:{" "}
                <a
                    href="https://www.starshop.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline hover:text-blue-400"
                >
                    https://www.starshop.co
                </a>
            </p>

            <p className="text-sm text-dark-300">
                メール:{" "}
                <a
                    href="mailto:starshop@beau-tech.co.jp"
                    className="text-blue-300 underline hover:text-blue-400"
                >
                    starshop@beau-tech.co.jp
                </a>
            </p>

            <p className="text-sm text-dark-300">
                専用窓口：
                <a
                    href="tel:0358015968"
                    className="underline hover:text-blue-400 ml-1"
                >
                    03-5801-5968
                </a>
                【コスメ事業】
            </p>
        </div>
    );
};

export default ShopMailInfo;