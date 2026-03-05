import { Coupon } from "@/types/coupons";
// import Cimage1 from "@/public/home/coupon/image1.png";
// import Cimage2 from "@/public/home/coupon/image2.png";
import image1 from "@/public/products/exomere_pr1.png";
import image2 from "@/public/products/exomere_pr2.png";
import image3 from "@/public/products/dplcell_pr1.png";
import image4 from "@/public/products/dplcell_pr2.png";
import image5 from "@/public/products/dplcell_pr3.png";
import { RankingNewArrivalType } from "@/types/products";
export const coupons: Coupon[] = [];

export const rankingData: RankingNewArrivalType[] = [
  {
    id: 1,
    name: "インプラントソリューション",
    brand: { name: "EXOMERE" },
    image: image1,
    rank: 1,
  },
  {
    id: 2,
    name: "アロマヒーリング ミスト",
    brand: { name: "EXOMERE" },
    image: image2,
    rank: 2,
  },
  {
    id: 3,
    name: "クリームミスト",
    brand: { name: "D.PLCell" },
    image: image3,
    rank: 3,
  },
  {
    id: 4,
    name: "UV栄養クリーム",
    brand: { name: "D.PLCell" },
    image: image4,
    rank: 4,
  },
];

export const newArrivalData: RankingNewArrivalType[] = [
  {
    id: 1,
    name: "インプラントソリューション",
    brand: { name: "EXOMERE" },
    image: image1,
    rank: 0,
  },
  {
    id: 2,
    name: "アロマヒーリング ミスト",
    brand: { name: "EXOMERE" },
    image: image2,
    rank: 0,
  },
  {
    id: 3,
    name: "クリームミスト",
    brand: { name: "D.PLCell" },
    image: image3,
    rank: 0,
  },
  {
    id: 4,
    name: "UV栄養クリーム",
    brand: { name: "D.PLCell" },
    image: image4,
    rank: 0,
  },
];

export const brandExomereData: RankingNewArrivalType[] = [
  {
    id: 1,
    name: "インプラントソリューション",
    brand: { name: "EXOMERE" },
    image: image1,
    rank: 0,
  },
  {
    id: 2,
    name: "アロマヒーリング ミスト",
    brand: { name: "EXOMERE" },
    image: image2,
    rank: 0,
  },
  {
    id: 3,
    name: "クリームミスト",
    brand: { name: "EXOMERE" },
    image: image1,
    rank: 0,
  },
  {
    id: 4,
    name: "UV栄養クリーム",
    brand: { name: "EXOMERE" },
    image: image2,
    rank: 0,
  },
];

export const brandDplData: RankingNewArrivalType[] = [
  {
    id: 1,
    name: "クリームミスト",
    brand: { name: "D.PLCell" },
    image: image3,
    rank: 0,
  },
  {
    id: 2,
    name: "UV栄養クリーム",
    brand: { name: "D.PLCell" },
    image: image4,
    rank: 0,
  },
  {
    id: 3,
    name: "インフュージョン プログラムバイアルアンプル＆クリームミスト セット",
    brand: { name: "D.PLCell" },
    image: image5,
    rank: 0,
  },
  {
    id: 4,
    name: "クリームミスト",
    brand: { name: "D.PLCell" },
    image: image3,
    rank: 0,
  },
];
