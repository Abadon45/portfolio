import type { StoreProduct } from "./TwcStoreProvider";

export type PremiumHeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export const premiumMedia = {
  heroes: [
    {
      eyebrow: "THE EVERYDAY EDIT",
      title: "A softer way to shop well.",
      description: "Thoughtful essentials for beauty, comfort, and the rituals that make a day feel like yours.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=85",
    },
    {
      eyebrow: "A NEW TWC COLLECTION",
      title: "Small rituals. Beautifully chosen.",
      description: "Discover a considered mix of useful finds presented with room to pause, compare, and choose.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85",
    },
    {
      eyebrow: "FOR YOUR DAILY ROUTINE",
      title: "Make space for what works.",
      description: "From personal care to everyday upgrades, build a collection that belongs in your real life.",
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1800&q=85",
    },
  ] satisfies PremiumHeroSlide[],
  categories: [
    { label: "Beauty & care", query: "Sante Beauty Skin Care", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80" },
    { label: "Wellness", query: "Sante Nutraceutical", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=900&q=80" },
    { label: "Everyday essentials", query: "Sante Beverage", image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80" },
    { label: "Personal style", query: "Bags", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80" },
  ],
  editorial: {
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1300&q=80",
    campaign: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1300&q=80",
    lifestyle: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1300&q=80",
  },
};

export const selectPremiumProducts = (items: StoreProduct[]) => items.slice(0, 12);
