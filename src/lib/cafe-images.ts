import photo0_0 from "@/assets/optimized/cafe-interior-160.webp.asset.json";
import photo0_1 from "@/assets/optimized/cafe-interior-480.webp.asset.json";
import photo0_2 from "@/assets/optimized/cafe-interior-1280.webp.asset.json";
import photo1_0 from "@/assets/optimized/chicken-rice-bowl-160.webp.asset.json";
import photo1_1 from "@/assets/optimized/chicken-rice-bowl-480.webp.asset.json";
import photo1_2 from "@/assets/optimized/chicken-rice-bowl-816.webp.asset.json";
import photo2_0 from "@/assets/optimized/croissants-160.webp.asset.json";
import photo2_1 from "@/assets/optimized/croissants-480.webp.asset.json";
import photo2_2 from "@/assets/optimized/croissants-816.webp.asset.json";
import photo3_0 from "@/assets/optimized/espresso-pour-160.webp.asset.json";
import photo3_1 from "@/assets/optimized/espresso-pour-480.webp.asset.json";
import photo3_2 from "@/assets/optimized/espresso-pour-816.webp.asset.json";
import photo4_0 from "@/assets/optimized/hero-latte-160.webp.asset.json";
import photo4_1 from "@/assets/optimized/hero-latte-480.webp.asset.json";
import photo4_2 from "@/assets/optimized/hero-latte-768.webp.asset.json";
import photo5_0 from "@/assets/optimized/iced-americano-160.webp.asset.json";
import photo5_1 from "@/assets/optimized/iced-americano-480.webp.asset.json";
import photo5_2 from "@/assets/optimized/iced-americano-816.webp.asset.json";
import photo6_0 from "@/assets/optimized/matcha-latte-160.webp.asset.json";
import photo6_1 from "@/assets/optimized/matcha-latte-480.webp.asset.json";
import photo6_2 from "@/assets/optimized/matcha-latte-816.webp.asset.json";
import photo7_0 from "@/assets/optimized/spanish-latte-160.webp.asset.json";
import photo7_1 from "@/assets/optimized/spanish-latte-480.webp.asset.json";
import photo7_2 from "@/assets/optimized/spanish-latte-816.webp.asset.json";

export const cafeImages = {
  "cafe-interior": { src: photo0_2.url, width: 1280, height: 960, srcSet: `${photo0_0.url} 160w, ${photo0_1.url} 480w, ${photo0_2.url} 1280w` },
  "chicken-rice-bowl": { src: photo1_2.url, width: 816, height: 816, srcSet: `${photo1_0.url} 160w, ${photo1_1.url} 480w, ${photo1_2.url} 816w` },
  "croissants": { src: photo2_2.url, width: 816, height: 816, srcSet: `${photo2_0.url} 160w, ${photo2_1.url} 480w, ${photo2_2.url} 816w` },
  "espresso-pour": { src: photo3_2.url, width: 816, height: 816, srcSet: `${photo3_0.url} 160w, ${photo3_1.url} 480w, ${photo3_2.url} 816w` },
  "hero-latte": { src: photo4_2.url, width: 768, height: 1024, srcSet: `${photo4_0.url} 160w, ${photo4_1.url} 480w, ${photo4_2.url} 768w` },
  "iced-americano": { src: photo5_2.url, width: 816, height: 816, srcSet: `${photo5_0.url} 160w, ${photo5_1.url} 480w, ${photo5_2.url} 816w` },
  "matcha-latte": { src: photo6_2.url, width: 816, height: 816, srcSet: `${photo6_0.url} 160w, ${photo6_1.url} 480w, ${photo6_2.url} 816w` },
  "spanish-latte": { src: photo7_2.url, width: 816, height: 816, srcSet: `${photo7_0.url} 160w, ${photo7_1.url} 480w, ${photo7_2.url} 816w` },
};

export function findCafeImage(src: string) {
  return Object.values(cafeImages).find((image) => image.src === src);
}
