import { MenuItem } from "@/types/menu";

export const menuData: MenuItem[] = [
  // LITTLE THINGS
  {
    id: "A1",
    name: "A1 // GREEN FRESHNESS",
    description: "Fresh, crunchy cucumber salad with a fantastic garlic vinaigrette. Be...",
    price: 5.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/6e5f421a-b557-4056-946e-ee0cf5b6c710/6904f9f1877fe7.59820341.jpg",
    category: "LITTLE THINGS"
  },
  {
    id: "A2",
    name: "A2 // SWEET AND SPICY AUBERGINES",
    description: "Melting eggplant salad with a fantastic garlic vinaigrette. Be...",
    price: 6.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/ea80ce76-e2fd-4fd0-98e3-4833e85846d6/6904f9f1e25591.22385326.jpg",
    category: "LITTLE THINGS"
  },
  {
    id: "A11",
    name: "A11 // FRIED WONTONS (x4)",
    description: "Fried wontons containing a whole prawn, sweet chili sauce.",
    price: 7.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/48bad5e0-09a5-4aa3-94b2-6e96dececb11/6904f9f8b2a949.44440375.jpg",
    category: "LITTLE THINGS"
  },
  {
    id: "A15",
    name: "A15 // VEGGIE WONTONS CHILI OIL (x5)",
    description: "Wontons with tofu, black mushrooms, shiitake mushrooms,...",
    price: 8.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/b6560860-3218-4b6b-bec7-a58850a8a75d/6904f9f2e24439.65353235.jpg",
    category: "LITTLE THINGS"
  },
  {
    id: "A14",
    name: "A14 // WONTONS CHILI OIL (x5)",
    description: "Shrimp wontons in a lightly vinegared homemade chili oil.",
    price: 9.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/53aff23d-a3f4-4848-8203-17fc11df4390/6904f9f8bbf1c1.19092370.jpg",
    category: "LITTLE THINGS"
  },
  // BAO
  {
    id: "B3",
    name: "B3 // BAOZI SHANGHAI CLASSIC (x2)",
    description: "Steamed sourdough bun with pork,",
    price: 8.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/c0e7b7d0-5429-4ec2-91f0-e53a42b9d4d0/6904f9f923f2e6.72506344.jpg",
    category: "BAO 包"
  },
  {
    id: "B4",
    name: "B4 // CHARSIU BAO (x2)",
    description: "Steamed sourdough brioche, braised pork in its barbecue sauce.",
    price: 9.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/eb0ca9c0-8638-48b9-8cf7-e05d7e5cba74/6904f9f92b25f0.03675116.jpg",
    category: "BAO 包"
  },
  {
    id: "B6",
    name: "B6 // CHICKEN BAO (x2)",
    description: "Steamed sourdough bun, chicken, Chinese cabbage, shiitake...",
    price: 9.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/4a9e4d29-c5a2-4c0b-8b63-e6b4c0c72a55/6904f9f932b833.40692451.jpg",
    category: "BAO 包"
  },
  {
    id: "B26",
    name: "B26 // VEGGIE PUMPKIN BAO (X2)",
    description: "Steamed sourdough brioche,",
    price: 9.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/d5c2e5f0-c4e9-4d92-9e1a-f2c2c0b8d0e0/6904f9f940c2b5.12345678.jpg",
    category: "BAO 包"
  },
  // DISHES
  {
    id: "D1",
    name: "D1 // SPICY NOODLES",
    description: "Wheat noodles, minced pork, Sichuan sauce.",
    price: 12.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample1/image1.jpg",
    category: "DISHES 主菜"
  },
  {
    id: "D2",
    name: "D2 // FRIED RICE",
    description: "Fried rice with egg, vegetables and choice of protein.",
    price: 11.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample2/image2.jpg",
    category: "DISHES 主菜"
  },
  // SIDES
  {
    id: "S1",
    name: "S1 // STEAMED RICE",
    description: "Plain steamed white rice.",
    price: 3.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample3/image3.jpg",
    category: "SIDES 主食"
  },
  // DESSERTS
  {
    id: "DE1",
    name: "DE1 // MANGO STICKY RICE",
    description: "Sweet sticky rice with fresh mango.",
    price: 6.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample4/image4.jpg",
    category: "DESSERTS 甜点"
  },
  // SOFTS
  {
    id: "SO1",
    name: "SO1 // COCA COLA",
    description: "330ml can",
    price: 3.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample5/image5.jpg",
    category: "SOFTS"
  },
  // BEERS
  {
    id: "BE1",
    name: "BE1 // TSINGTAO",
    description: "Chinese lager beer 330ml",
    price: 5.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample6/image6.jpg",
    category: "BEERS 啤酒"
  },
  // COCKTAILS
  {
    id: "CO1",
    name: "CO1 // LYCHEE MARTINI",
    description: "Vodka, lychee liqueur, lychee juice",
    price: 9.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample7/image7.jpg",
    category: "COCKTAILS"
  },
  // WINES
  {
    id: "WI1",
    name: "WI1 // RED WINE",
    description: "Glass of house red wine",
    price: 6.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample8/image8.jpg",
    category: "WINES 红酒"
  },
  // TEAS
  {
    id: "TE1",
    name: "TE1 // GREEN TEA",
    description: "Traditional Chinese green tea",
    price: 3.50,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample9/image9.jpg",
    category: "TEAS"
  },
  // CAFES
  {
    id: "CA1",
    name: "CA1 // ESPRESSO",
    description: "Strong Italian coffee",
    price: 3.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample10/image10.jpg",
    category: "CAFES 咖啡"
  },
  // BAO MARKET
  {
    id: "BM1",
    name: "BM1 // CHILI OIL",
    description: "Homemade spicy chili oil 200ml",
    price: 8.00,
    image: "https://dood-media-prod.s3.eu-west-1.amazonaws.com/media/sample11/image11.jpg",
    category: "BAO MARKET"
  },
];

export const categories = [
  "LITTLE THINGS",
  "BAO 包",
  "DISHES 主菜",
  "SIDES 主食",
  "DESSERTS 甜点",
  "SOFTS",
  "BEERS 啤酒",
  "COCKTAILS",
  "WINES 红酒",
  "TEAS",
  "CAFES 咖啡",
  "BAO MARKET"
];
