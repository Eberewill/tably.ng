import type { MenuCategory, MenuItem } from "./types";

export const categories: MenuCategory[] = [
  "Main",
  "Starters",
  "Grill",
  "Sides",
  "Drinks",
];

const images = {
  jollof:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBb9LRFQXl1oxTTz1PeIrjECAjksdT3DXDvNdGVXro7gI2Wn5WChITdQgWWbPrM46VyDyE7FgGpnTr02ngNbx4zTJcM9NC-gX1NABI-80zpN16U2NbVnra8o61SpBCpC97qV3DJm221nC8dfm7Mj7UfiN4ty7TPRbHgDX6kDBBk-XIBTJTnWKw0lHDSx3bxo1l0ZmnBTI9qkzNwSHes-eGcAhehhxn10Rws5K-0c7qoStDTx9HxpP4y",
  ribeye:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBuNcwv6McsnfxZqwnFeuvWlorAYi4vyDMAwwp2T2XR4aFJ-GgpRQVXiwSCBHvwvjyBG6fXR4uKU5X1joSIM2_In5XpxLQElWuxWTUB4lEk5OQvmrc1GYnEDQVCcYyWNx21tQ0NAPO3b2EJkr8mCKdWjJOcSHVTLQ3eMOG3-UqUL2nf6KZNIoBjEa7L-1be-OLrU6JZmxpTnmH0lYld1w2ooZ-CRZMYjU1p5z4iQMbAxG94tS0zkoUc",
  okra: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPJ4s6ipPmxRJmrbyxbDuWxJe6U8LVqNC5kENzghWCMtHx1i2Wj08OQD2zIRvDJPQl9QCoSbrRUn1TpiVYiWT3qkuc1LRncdS6PNiRN3tyfafVZCCzQFg5zBwHKScjX_e3HVIyVTiQNbcUH5hMu0jLF0QNEkdX1PBJY0n5uqPvuPvetvY28LxmbIWRY2kAGCzmUdZ8NPhYUi9bXBUma3C9yJCGDvtxA2ydaA7Y1ulPzAi5aZVDIUb0",
  snails:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUQRNeenCUr8ELjv83KZLeRvmgVdF5yNBKD9CKHFokrfheP19rCD3XnlvlI-QF9cxkN1PvwDg6uj3OJjU1zz41eLJlfnIIIMsEjJN6xJ9xAVjb2rdjFQU7YtGd9XAs6A2tp1KCg594f8Iy_X_7mjOnDHhZ2U_EQmnittnOGvqzaIcaETE_ZJ30li4TbCLeXQilw5JueAzfHtOpE8nzFAt0neWR6rcX0gcrv-EDEwhWK8Cy6jy6OGmX",
};

export const menu: MenuItem[] = [
  {
    id: "suya-ribeye",
    category: "Main",
    name: "Suya Spiced Ribeye",
    price: 18500,
    description:
      "Prime cut ribeye crusted with our house-blended Yaji spice, flame-grilled and served with charred onions and tomatoes.",
    image: images.ribeye,
    tag: "GF",
    customizations: [
      {
        name: "Doneness",
        required: true,
        options: ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
      },
      {
        name: "Choice of Side",
        required: true,
        options: [
          "Jollof Rice",
          "French Fries",
          "Yam Fries",
          "Seasonal Vegetables",
        ],
      },
    ],
  },
  {
    id: "seafood-okra",
    category: "Main",
    name: "Seafood Okra",
    price: 14200,
    description:
      "Freshly chopped okra cooked in a rich seafood broth with tiger prawns, croaker fish, and calamari rings.",
    image: images.okra,
  },
  {
    id: "peppered-snails",
    category: "Main",
    name: "Peppered Snails",
    price: 12000,
    description:
      "Jumbo forest snails sautéed in a fiery, aromatic habanero and bell pepper reduction.",
    image: images.snails,
  },
  {
    id: "jollof-bites",
    category: "Starters",
    name: "Crisp Jollof Bites",
    price: 6800,
    description:
      "Golden jollof rice croquettes with a bright pepper sauce and fresh herbs.",
    image: images.jollof,
  },
  {
    id: "grilled-prawns",
    category: "Grill",
    name: "Charred Tiger Prawns",
    price: 16500,
    description:
      "Charcoal-grilled prawns with citrus, smoked pepper and garden greens.",
    image: images.okra,
  },
  {
    id: "plantain",
    category: "Sides",
    name: "Sweet Fried Plantain",
    price: 3200,
    description:
      "Ripe plantain, gently caramelised and finished with sea salt.",
    image: images.jollof,
  },
  {
    id: "hibiscus",
    category: "Drinks",
    name: "House Zobo",
    price: 2800,
    description: "Cold-brewed hibiscus, ginger and citrus over ice.",
    image: images.snails,
  },
];

export const restaurant = {
  name: "Zuma Grill",
  location: "Maitama, Abuja",
  signature: {
    name: "Smoky Party Jollof",
    description:
      "Our award-winning slow-cooked rice in a rich tomato and pepper reduction, served with tender grilled chicken and fried plantain.",
    image: images.jollof,
  },
};

export const orderReceivedImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4QB1Kzfu-8BNvW3uP3uHaN33FHOCg8LOE9o8AvK6SkQPo814fMGeZ0B9jKG8x5RloV6XK1J7ditWBWfFZv1hP2uATbsVeSqqO-GPVX-LHNjyj0iQAIZnUgZUKECr_4btnsEC3OPphVd-a8bX_97vTIHk8ubchHBqV62jnK7IggxT7haPAB6pVBuZsixN9xo1WQmhxV6LcT8AcazQmpwAA-HX7b_NBerFaQyCmSZEW0HMJV_jjgOdl";
