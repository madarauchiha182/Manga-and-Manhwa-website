// InkVerse - Manga & Manhwa Catalog Database
const INITIAL_CATALOG = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    originalTitle: "나 혼자만 레벨업 (Only I Level Up)",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    author: "Chugong",
    artist: "DUBU (REDICE Studio)",
    rating: 4.95,
    reviewsCount: 3840,
    status: "Completed",
    releaseYear: 2018,
    genres: ["Action", "Fantasy", "System", "Supernatural"],
    chapters: 200,
    buyPrice: 15.99,
    rentPricePerWeek: 2.99,
    description: "In a world where hunters with supernatural powers battle deadly monsters to protect humanity, Sung Jinwoo, known as the 'Weakest Hunter of All Mankind', finds himself in a fatal double dungeon. On the brink of death, a mysterious quest window appears before him, turning him into the only player who can level up endlessly.",
    stock: 45,
    isFeatured: true,
    isTrending: true,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "berserk",
    title: "Berserk: Deluxe Edition",
    originalTitle: "ベルセルク (Beruseruku)",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    author: "Kentaro Miura",
    artist: "Kentaro Miura / Studio Gaga",
    rating: 4.98,
    reviewsCount: 5120,
    status: "Ongoing",
    releaseYear: 1989,
    genres: ["Dark Fantasy", "Psychological", "Seinen", "Action"],
    chapters: 376,
    buyPrice: 39.99,
    rentPricePerWeek: 4.99,
    description: "Guts, a wandering mercenary known as the Black Swordsman, seeks sanctuary from the demonic forces that pursue him and his former lover Casca. Wielding his colossal Dragonslayer sword and harboring a burning thirst for vengeance, he hunts down his former commander and friend Griffith, who sacrificed his comrades for supreme power.",
    stock: 20,
    isFeatured: true,
    isTrending: true,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "orv",
    title: "Omniscient Reader's Viewpoint",
    originalTitle: "전지적 독자 시점",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    author: "sing N song",
    artist: "Sleepy-C (REDICE Studio)",
    rating: 4.92,
    reviewsCount: 2950,
    status: "Ongoing",
    releaseYear: 2020,
    genres: ["Fantasy", "Apocalypse", "Psychological", "Action"],
    chapters: 215,
    buyPrice: 16.50,
    rentPricePerWeek: 2.75,
    description: "Kim Dokja is an ordinary office worker whose only hobby was reading an obscure web novel titled 'Three Ways to Survive the Apocalypse'. When the novel suddenly becomes reality and monstrous Dokkaebis force humanity to participate in deadly scenarios, Dokja is the only person who knows how the story unfolds.",
    stock: 35,
    isFeatured: true,
    isTrending: true,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "one-piece",
    title: "One Piece: Wano Arc",
    originalTitle: "ワンピース",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    rating: 4.96,
    reviewsCount: 6800,
    status: "Ongoing",
    releaseYear: 1997,
    genres: ["Action", "Adventure", "Shonen", "Fantasy"],
    chapters: 1115,
    buyPrice: 12.99,
    rentPricePerWeek: 1.99,
    description: "Monkey D. Luffy embarks with his crew, the Straw Hat Pirates, across the Grand Line in search of the legendary treasure known as the 'One Piece' to become the next Pirate King. Packed with world-building, camaraderie, freedom, and epic clashes.",
    stock: 60,
    isFeatured: true,
    isTrending: true,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "tbate",
    title: "The Beginning After The End",
    originalTitle: "끝이 아닌 시작",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    author: "TurtleMe",
    artist: "Fuyuki23",
    rating: 4.88,
    reviewsCount: 2210,
    status: "Ongoing",
    releaseYear: 2018,
    genres: ["Isekai", "Magic", "Action", "Reincarnation"],
    chapters: 185,
    buyPrice: 15.00,
    rentPricePerWeek: 2.50,
    description: "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Reborn into a new world filled with magic and monsters, Arthur Leywin has a second chance to relive his life while defending the realm from unseen calamity.",
    stock: 30,
    isFeatured: false,
    isTrending: true,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    originalTitle: "呪術廻戦",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
    author: "Gege Akutami",
    artist: "Gege Akutami",
    rating: 4.89,
    reviewsCount: 4300,
    status: "Completed",
    releaseYear: 2018,
    genres: ["Supernatural", "Action", "Shonen", "Dark Fantasy"],
    chapters: 271,
    buyPrice: 11.99,
    rentPricePerWeek: 2.25,
    description: "Yuji Itadori, a high school student with remarkable physical speed and stamina, swallows a cursed talisman—the decaying finger of Sukuna, the King of Curses. Enrolling in Tokyo Jujutsu High under Satoru Gojo's mentorship, Yuji must exorcise demonic curses while fighting fate.",
    stock: 40,
    isFeatured: false,
    isTrending: true,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "tower-of-god",
    title: "Tower of God",
    originalTitle: "신의 탑",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    author: "SIU",
    artist: "SIU",
    rating: 4.87,
    reviewsCount: 3100,
    status: "Ongoing",
    releaseYear: 2010,
    genres: ["Fantasy", "Mystery", "Adventure", "Action"],
    chapters: 620,
    buyPrice: 17.50,
    rentPricePerWeek: 2.99,
    description: "What do you desire? Money and wealth? Honor and pride? Authority and power? Revenge? Or something that transcends them all? Whatever you desire is atop the Tower. Twenty-Fifth Bam enters the perilous Tower in search of Rachel, his only friend in a lonely world.",
    stock: 25,
    isFeatured: false,
    isTrending: false,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    originalTitle: "チェンソーマン",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1569701812356-9b8417935f8b?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    author: "Tatsuki Fujimoto",
    artist: "Tatsuki Fujimoto",
    rating: 4.91,
    reviewsCount: 3670,
    status: "Ongoing",
    releaseYear: 2018,
    genres: ["Action", "Horror", "Dark Fantasy", "Supernatural"],
    chapters: 175,
    buyPrice: 12.50,
    rentPricePerWeek: 2.10,
    description: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he was living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita. When betrayed and killed, Pochita merges with Denji, resurrecting him as the unstoppable Chainsaw Devil.",
    stock: 50,
    isFeatured: true,
    isTrending: true,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1569701812356-9b8417935f8b?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "nano-machine",
    title: "Nano Machine",
    originalTitle: "나노마신 (Nano Mashin)",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    author: "Hanjung Wolya",
    artist: "Jeolmu Hyeon",
    rating: 4.90,
    reviewsCount: 1980,
    status: "Ongoing",
    releaseYear: 2020,
    genres: ["Murim", "Martial Arts", "Sci-Fi", "Action"],
    chapters: 210,
    buyPrice: 14.99,
    rentPricePerWeek: 2.49,
    description: "Cheon Yeo-Woon, an illegitimate prince of the Demonic Cult whose life is constantly under threat from rival clans, is visited by a mysterious descendant from the future who injects futuristic nanomachine technology into his bloodstream. Yeo-Woon ascends into the greatest martial artist the Murim has ever seen.",
    stock: 28,
    isFeatured: false,
    isTrending: true,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "spy-family",
    title: "Spy x Family",
    originalTitle: "SPY×FAMILY",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    author: "Tatsuya Endo",
    artist: "Tatsuya Endo",
    rating: 4.93,
    reviewsCount: 3410,
    status: "Ongoing",
    releaseYear: 2019,
    genres: ["Comedy", "Action", "Slice of Life", "Shonen"],
    chapters: 105,
    buyPrice: 10.99,
    rentPricePerWeek: 1.80,
    description: "Master spy 'Twilight' is given Operation Strix: build a mock family to infiltrate an elite academy. Unbeknownst to him, his adoptive daughter Anya is a telepath, and his fake wife Yor is a deadly assassin. Together they navigate hilarious family life and international espionage.",
    stock: 35,
    isFeatured: false,
    isTrending: false,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "wind-breaker",
    title: "Wind Breaker (Cycling)",
    originalTitle: "윈드브레이커",
    type: "manhwa",
    cover: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    author: "Yongseok Jo",
    artist: "Yongseok Jo",
    rating: 4.94,
    reviewsCount: 2650,
    status: "Completed",
    releaseYear: 2013,
    genres: ["Sports", "Drama", "Action", "School"],
    chapters: 502,
    buyPrice: 16.99,
    rentPricePerWeek: 2.80,
    description: "Jay, the school's model student council president, secretly dominates high-speed fixed-gear street cycling. Drawn into the Hummingbird Crew, he enters the cutthroat street race tournament 'League of Street', confronting fierce rivals, camaraderie, and true passion.",
    stock: 22,
    isFeatured: false,
    isTrending: true,
    country: "South Korea",
    previewPanels: [
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    originalTitle: "進撃の巨人 (Shingeki no Kyojin)",
    type: "manga",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    author: "Hajime Isayama",
    artist: "Hajime Isayama",
    rating: 4.97,
    reviewsCount: 7420,
    status: "Completed",
    releaseYear: 2009,
    genres: ["Action", "Mystery", "Dark Fantasy", "Drama"],
    chapters: 139,
    buyPrice: 13.50,
    rentPricePerWeek: 2.30,
    description: "After human civilization is driven behind three concentric walls by man-eating giants called Titans, young Eren Yeager witnesses the fall of Wall Maria and the slaughter of his mother. Vowing to eradicate every Titan, he joins the Scout Regiment, unearthing shocking conspiracies that threaten the entire world.",
    stock: 44,
    isFeatured: true,
    isTrending: false,
    country: "Japan",
    previewPanels: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=80"
    ]
  }
];

// Sample Initial Orders and Rentals for instant demonstration
const INITIAL_ORDERS = [
  {
    id: "ORD-94812",
    orderType: "buy",
    date: "2026-10-21T10:30:00.000Z",
    items: [
      {
        id: "solo-leveling",
        title: "Solo Leveling",
        type: "manhwa",
        cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
        price: 15.99,
        quantity: 1,
        edition: "Deluxe Hardcover"
      },
      {
        id: "chainsaw-man",
        title: "Chainsaw Man",
        type: "manga",
        cover: "https://images.unsplash.com/photo-1569701812356-9b8417935f8b?w=600&auto=format&fit=crop&q=80",
        price: 12.50,
        quantity: 1,
        edition: "Paperback"
      }
    ],
    customer: {
      fullName: "Arnav Vaidya",
      email: "vaidyaarnav182@gmail.com",
      phone: "+91 98765 43210",
      address: "42 Otaku Boulevard, Neo Tokyo District",
      city: "Mumbai",
      postalCode: "400001",
      country: "India"
    },
    payment: {
      method: "card",
      last4: "4242",
      cardBrand: "Visa",
      status: "Paid",
      transactionId: "TXN-88410294"
    },
    subtotal: 28.49,
    discount: 5.00,
    couponCode: "WELCOME10",
    tax: 2.11,
    shipping: 0.00,
    total: 25.60,
    status: "Shipped",
    estimatedDelivery: "2026-10-25"
  },
  {
    id: "RNT-31084",
    orderType: "rent",
    date: "2026-10-22T14:15:00.000Z",
    items: [
      {
        id: "berserk",
        title: "Berserk: Deluxe Edition",
        type: "manga",
        cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
        price: 4.99,
        rentalDurationDays: 14,
        rentalStartDate: "2026-10-22T14:15:00.000Z",
        rentalEndDate: "2026-11-05T14:15:00.000Z",
        rentalStatus: "Active",
        edition: "Digital Rental"
      }
    ],
    customer: {
      fullName: "Arnav Vaidya",
      email: "vaidyaarnav182@gmail.com",
      phone: "+91 98765 43210",
      address: "Digital Library Access",
      city: "Mumbai",
      postalCode: "400001",
      country: "India"
    },
    payment: {
      method: "upi",
      upiId: "arnav@okhdfcbank",
      status: "Paid",
      transactionId: "UPI-49102847"
    },
    subtotal: 4.99,
    discount: 0.00,
    tax: 0.45,
    shipping: 0.00,
    total: 5.44,
    status: "Active Rental",
    daysRemaining: 13
  }
];

// Available coupon codes
const PROMO_CODES = {
  "OTAKU20": { discountPercent: 20, description: "20% Off Storewide" },
  "WELCOME10": { discountFixed: 5.00, description: "$5.00 Off on your first order" },
  "MANHWA50": { discountPercent: 15, description: "15% Off all Manhwa & Manga rentals" },
  "FREESHIP": { freeShipping: true, description: "Free Express Shipping" }
};
