export interface Color {
  name: string;
  hex: string;
}

export interface Variant {
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface EnhancedProduct {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  rating: {
    rate: number;
    count: number;
  };
  brand: string;
  colors: Color[];
  sizes: string[];
  variants: Variant[];
  isOnSale: boolean;
}

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  "men's clothing": ["Ascent Wear", "Nordic Thread", "Avenue Denim", "Vogue Men"],
  "women's clothing": ["Aura & Co", "Urban Thread", "Silk & Cotton", "Vogue Women"],
  "jewelery": ["Aurelia", "Bijoux Luxe", "Glimmer & Carat", "Sovereign"],
  "electronics": ["Apex Tech", "Quantum", "VoltPro", "Nomad Gear"],
  "default": ["Essential Co", "Universal Goods", "Apex Life"]
};

const COLORS_BY_CATEGORY: Record<string, Color[]> = {
  clothing: [
    { name: "Crimson Red", hex: "#e11d48" },
    { name: "Royal Blue", hex: "#2563eb" },
    { name: "Forest Green", hex: "#16a34a" },
    { name: "Onyx Black", hex: "#18181b" },
    { name: "Heather Gray", hex: "#71717a" },
    { name: "Ivory White", hex: "#fafafa" }
  ],
  electronics: [
    { name: "Space Gray", hex: "#4b5563" },
    { name: "Matte Black", hex: "#09090b" },
    { name: "Platinum Silver", hex: "#e5e7eb" }
  ],
  jewelery: [
    { name: "18K Gold", hex: "#d97706" },
    { name: "Sterling Silver", hex: "#9ca3af" },
    { name: "Rose Gold", hex: "#fda4af" }
  ],
  default: [
    { name: "Slate Black", hex: "#1e293b" },
    { name: "Chalk White", hex: "#f8fafc" }
  ]
};

const SIZES_BY_CATEGORY: Record<string, string[]> = {
  clothing: ["S", "M", "L", "XL"],
  electronics: ["128GB", "256GB", "512GB"],
  jewelery: ["One Size"],
  default: ["One Size"]
};

export interface RawProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const enhanceProduct = (product: RawProduct): EnhancedProduct => {
  const id = product.id;
  const category = product.category.toLowerCase();
  
  const brands = BRANDS_BY_CATEGORY[category] || BRANDS_BY_CATEGORY["default"];
  const brand = brands[id % brands.length];

  let colors = COLORS_BY_CATEGORY["default"];
  if (category.includes("clothing")) {
    colors = COLORS_BY_CATEGORY["clothing"];
  } else if (category.includes("electronics")) {
    colors = COLORS_BY_CATEGORY["electronics"];
  } else if (category.includes("jewelery") || category.includes("jewelry")) {
    colors = COLORS_BY_CATEGORY["jewelery"];
  }
  const numColors = 2 + (id % 2);
  const selectedColors = colors.slice(0, numColors);

  let sizes = SIZES_BY_CATEGORY["default"];
  if (category.includes("clothing")) {
    sizes = SIZES_BY_CATEGORY["clothing"];
  } else if (category.includes("electronics")) {
    sizes = SIZES_BY_CATEGORY["electronics"];
  }
  if (category.includes("electronics") && id % 2 === 0) {
    sizes = ["128GB", "256GB"];
  }

  const variants: Variant[] = [];
  selectedColors.forEach((color, cIdx) => {
    sizes.forEach((size, sIdx) => {
      const stockSeed = (id * (cIdx + 1) + sIdx * 5) % 10;
      let stock = stockSeed;
      if (stockSeed === 9) stock = 0;
      
      variants.push({
        color: color.name,
        size,
        stock,
        sku: `${brand.toUpperCase().replace(/\s+/g, '')}-${id}-${color.name.substring(0,2).toUpperCase()}-${size}`
      });
    });
  });

  const isOnSale = id % 2 === 0;
  const originalPrice = isOnSale 
    ? Math.round((product.price * 1.3) * 100) / 100 
    : product.price;

  const images = [
    product.image,
    product.image + "#zoom",
    product.image + "#tilt",
    product.image + "#detail"
  ];

  return {
    ...product,
    price: product.price,
    originalPrice,
    brand,
    colors: selectedColors,
    sizes,
    variants,
    isOnSale,
    images
  };
};
