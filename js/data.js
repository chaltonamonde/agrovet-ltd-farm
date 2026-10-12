/* ═══════════════════════════════════════════════════════════════════
   AGROVET LTD (agrovet.ltd) — Official Master Data Store
   Kenyan Farm Inputs E-Commerce Catalogue & Reference Database
   ═══════════════════════════════════════════════════════════════════ */

window.AGROVET_DATA = {
  // ─── Business Info (Synced with Central Config js/contact.js) ──
  business: {
    name: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.businessName : "Agrovet Ltd"),
    domain: "agrovet.ltd",
    phone1: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.phoneDisplay : "+254 110 677 149"),
    phone2: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.phoneDisplay : "+254 110 677 149"),
    whatsapp: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.phoneTel : "+254110677149"),
    whatsappNumber: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.whatsappNumber : "254110677149"),
    email: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.email : "chaltononyango5@gmail.com"),
    address: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.fullAddress : "Kirinyaga Road, Agricultural Center, Shop No. 12, Nairobi, Kenya"),
    pcpbLicense: "PCPB/AGR/2024/7890",
    kephisReg: "KEPHIS/SD/2024/4512",
    paybill: "Paybill coming soon",
    tillNumber: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.tillNumber : "Till number coming soon"),
    hours: (typeof AGROVET_CONTACT !== 'undefined' ? AGROVET_CONTACT.hours : "Mon – Sat: 7:00 AM – 6:00 PM | Sun & Holidays: 9:00 AM – 1:00 PM"),
    freeDeliveryThreshold: 10000
  },

  // ─── Bilingual Dictionary (English & Kiswahili) ────────────────
  i18n: {
    en: {
      topBar: "Nationwide delivery across Kenya • Order online or call",
      helpText: "Need agronomist help?",
      cart: "Cart",
      allCategories: "All Categories",
      searchPlaceholder: "Search crops, chemicals, seeds, sprayers, pests...",
      shopNow: "Shop Now",
      browseCategories: "Browse Categories",
      talkAgronomist: "Talk to Agronomist",
      addToCart: "Add to Cart",
      viewProduct: "View Details",
      orderWhatsapp: "Order via WhatsApp",
      inStock: "In Stock",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      subtotal: "Subtotal",
      checkout: "Proceed to Checkout",
      freeDeliveryMsg: "Add {amount} more for FREE delivery across Kenya!",
      freeDeliveryReached: "Congratulations! You qualify for FREE Delivery 🚚",
      filterBy: "Filter Products",
      sortBy: "Sort By",
      packSize: "Pack Size",
      dosage: "Dosage & Application",
      phi: "Pre-Harvest Interval (PHI)",
      safety: "Safety & PPE Advice"
    },
    sw: {
      topBar: "Usafirishaji kote nchini Kenya • Agiza mtandaoni au piga simu",
      helpText: "Unahitaji msaada wa mtaalamu?",
      cart: "Kikapu",
      allCategories: "Makundi Yote",
      searchPlaceholder: "Tafuta pembejeo, mbegu, dawa, mbolea au wadudu...",
      shopNow: "Nunua Sasa",
      browseCategories: "Tazama Makundi",
      talkAgronomist: "Ongea na Mtaalamu",
      addToCart: "Ongeza kwa Kikapu",
      viewProduct: "Tazama Zaidi",
      orderWhatsapp: "Agiza kwa WhatsApp",
      inStock: "Ipo Dukani",
      lowStock: "Imebaki Kidogo",
      outOfStock: "Imeisha",
      subtotal: "Jumla Ndogo",
      checkout: "Endelea Kulipa",
      freeDeliveryMsg: "Ongeza KSh {amount} upate Usafirishaji wa BURE!",
      freeDeliveryReached: "Hongera! Umepata Usafirishaji wa BURE kote nchini 🚚",
      filterBy: "Chuja Bidhaa",
      sortBy: "Panga Kwa",
      packSize: "Ukubwa wa Pakiti",
      dosage: "Kipimo na Matumizi",
      phi: "Muda Kabla ya Kuvuna (PHI)",
      safety: "Ushauri wa Usalama na Vifaa vya PPE"
    }
  },

  // ─── Hero Slides ───────────────────────────────────────────────
  heroSlides: [
    {
      id: "h1",
      tag: "Your Trusted Farm Partner",
      title: "Quality Farm Inputs Delivered Across Kenya",
      desc: "Herbicides, insecticides, certified seeds, fertilizers and equipment — sourced from genuine registered suppliers, delivered straight to your farm.",
      cta: "Shop Now",
      link: "shop.html",
      bgSvg: "plant"
    },
    {
      id: "h2",
      tag: "Premium Growing Media",
      title: "Peat Moss & Planting Media for Stronger Seedlings",
      desc: "Give your seedlings the best root development with certified sterile peat moss, coco peat and specialized propagation trays.",
      cta: "Explore Planting Media",
      link: "shop.html?cat=planting-media",
      bgSvg: "sprout"
    },
    {
      id: "h3",
      tag: "High-Germination Seeds",
      title: "Certified Vegetable Seeds — Season Ready",
      desc: "High-yield hybrid tomato, cabbage, onion, capsicum and spinach seeds. KEPHIS-certified with tested germination rates.",
      cta: "Browse Seeds",
      link: "shop.html?cat=seeds",
      bgSvg: "seed"
    },
    {
      id: "h4",
      tag: "Boost Your Harvest",
      title: "Granular & Foliar Fertilizers for Every Crop",
      desc: "Feed your soil right. Complete NPK formulations, top-dressing blends, and soluble foliar micronutrients that match every crop stage.",
      cta: "Shop Fertilizers",
      link: "shop.html?cat=fertilizers",
      bgSvg: "fertilizer"
    },
    {
      id: "h5",
      tag: "Maize & Hybrid Varieties",
      title: "High-Yield Hybrid Maize Seed — Plant with Confidence",
      desc: "KEPHIS-certified maize hybrids suited for Kenyan highlands, mid-altitude and dryland areas. Maximum drought and pest tolerance.",
      cta: "View Maize Seeds",
      link: "shop.html?cat=seeds",
      bgSvg: "maize"
    }
  ],

  // ─── Category Rail Items (01-07) ───────────────────────────────
  categoryRail: [
    { num: "01", name: "Crop Production", desc: "Herbicides, fungicides, insecticides & pest protection", link: "shop.html?cat=crop-production", icon: "shield" },
    { num: "02", name: "Farm Tools & Equipment", desc: "Chemical-safe PPE, knapsack sprayers & irrigation", link: "shop.html?cat=farm-tools", icon: "wrench" },
    { num: "03", name: "Seeds & Fertilizers", desc: "Certified planting seed and basal/foliar nutrition", link: "shop.html?cat=seeds-fertilizers", icon: "sprout" },
    { num: "04", name: "Seeds", desc: "Vegetable, cereal, legume and hybrid varieties", link: "shop.html?cat=seeds", icon: "sun" },
    { num: "05", name: "Insecticides", desc: "Systemic and contact pest protection formulas", link: "shop.html?cat=insecticides", icon: "bug" },
    { num: "06", name: "Fungicides", desc: "Blight, powdery mildew and rot prevention", link: "shop.html?cat=fungicides", icon: "droplet" },
    { num: "07", name: "Herbicides", desc: "Selective and non-selective broadleaf & grass control", link: "shop.html?cat=herbicides", icon: "scissors" }
  ],

  // ─── Categories & Subcategories Tree ───────────────────────────
  categories: [
    {
      slug: "crop-production",
      name: "Crop Production",
      icon: "🌿",
      subcategories: [
        { slug: "herbicides", name: "Herbicides" },
        { slug: "insecticides", name: "Insecticides" },
        { slug: "fungicides", name: "Fungicides" },
        { slug: "miticides", name: "Miticides / Acaricides" },
        { slug: "nematicides", name: "Nematicides" },
        { slug: "bio-insecticides", name: "Bio-Insecticides" },
        { slug: "adjuvants", name: "Adjuvants & Stickers" },
        { slug: "seed-dressing", name: "Seed Dressing" },
        { slug: "soil-fumigants", name: "Soil Fumigants" },
        { slug: "stimulants", name: "Plant Stimulants" },
        { slug: "termiticides", name: "Termiticides" }
      ]
    },
    {
      slug: "seeds-fertilizers",
      name: "Seeds & Fertilizers",
      icon: "🌱",
      subcategories: [
        { slug: "seeds", name: "Seeds" },
        { slug: "granular-fertilizers", name: "Granular Fertilizers" },
        { slug: "foliar-fertilizers", name: "Foliar Fertilizers" }
      ]
    },
    {
      slug: "farm-tools",
      name: "Farm Tools & Equipment",
      icon: "🔧",
      subcategories: [
        { slug: "farm-ppe", name: "Farm PPE" },
        { slug: "sprayers", name: "Sprayers" },
        { slug: "propagation-accessories", name: "Propagation Accessories" },
        { slug: "irrigation-accessories", name: "Irrigation Accessories" }
      ]
    },
    {
      slug: "planting-media",
      name: "Planting Media",
      icon: "🪴",
      subcategories: [
        { slug: "peat-moss", name: "Peat Moss" },
        { slug: "coco-peat", name: "Coco Peat" }
      ]
    }
  ],

  // ─── Complete Sample Products Catalogue ────────────────────────
  products: [
    {
      id: "p1",
      slug: "sample-herbicide-glyphosate",
      name: "SAMPLE Herbicide — Glyphosate 360 SL",
      category: "crop-production",
      subCategory: "herbicides",
      categoryName: "Crop Production",
      subCategoryName: "Herbicides",
      shortDescription: "Non-selective systemic herbicide for broad-spectrum weed eradication before planting and land clearing.",
      fullDescription: "Non-selective systemic herbicide absorbed through green foliage and translocated throughout the entire plant system down to root rhizomes. Recommended for clearing stubborn couch grass, sedges, and weeds before planting crops.",
      activeIngredient: "Glyphosate 360 g/L",
      targetPests: ["Couch grass", "Blackjack", "Thorn apple", "Wandering Jew", "Nut grass"],
      targetCrops: ["Pre-planting land preparation", "Tea and coffee inter-rows", "Orchards"],
      dosage: "Mix 150ml – 200ml per 20 Litres of clean water. Apply on actively growing green weeds.",
      phi: "Not applicable (Pre-planting herbicide only. Allow 7–10 days before cultivation).",
      safety: "Class III. Wear chemical-resistant rubber gloves, gumboots, and goggles. Do not inhale spray mist. Never allow drift to touch green parts of desirable crops.",
      pcpbReg: "PCPB(CR) 1245-A",
      image: "images/products/sample-herbicide-glyphosate-front.webp",
      isFeatured: true,
      isSale: false,
      isNew: false,
      variants: [
        { packSize: "100ml", price: 80, sku: "HRB-GLY-100", stockStatus: "in_stock", stockQty: 250 },
        { packSize: "500ml", price: 320, sku: "HRB-GLY-500", stockStatus: "in_stock", stockQty: 120 },
        { packSize: "1 Litre", price: 580, sku: "HRB-GLY-1L", stockStatus: "in_stock", stockQty: 85 },
        { packSize: "5 Litres", price: 2600, sku: "HRB-GLY-5L", stockStatus: "low_stock", stockQty: 8 },
        { packSize: "20 Litres", price: 9800, sku: "HRB-GLY-20L", stockStatus: "in_stock", stockQty: 15 }
      ]
    },
    {
      id: "p2",
      slug: "sample-insecticide-lambda",
      name: "SAMPLE Insecticide — Lambda-cyhalothrin 5% EC",
      category: "crop-production",
      subCategory: "insecticides",
      categoryName: "Crop Production",
      subCategoryName: "Insecticides",
      shortDescription: "Fast knockdown contact and stomach pyrethroid insecticide against sucking and chewing insects on vegetables and cereals.",
      fullDescription: "Fast-acting contact and stomach insecticide delivering immediate insect knockdown and residual leaf repellency. High performance against aphids, caterpillars, thrips, and beetles across horticulture.",
      activeIngredient: "Lambda-cyhalothrin 50 g/L EC",
      targetPests: ["Aphids", "Whiteflies", "Thrips", "Tuta absoluta", "Caterpillars", "Cutworms"],
      targetCrops: ["Tomatoes", "Kales (Sukuma)", "Cabbage", "French beans", "Maize"],
      dosage: "Mix 10ml – 15ml per 20L knapsack sprayer. Ensure complete foliage coverage, spraying undersides of leaves.",
      phi: "Tomatoes: 3 days | Vegetables & Kales: 7 days | Maize: 14 days.",
      safety: "Toxic to aquatic life and honeybees. Avoid spraying during midday bloom. Wear complete coverall, respirator mask, and rubber gloves.",
      pcpbReg: "PCPB(CR) 0892-B",
      image: "images/products/sample-insecticide-lambda-front.webp",
      isFeatured: true,
      isSale: false,
      isNew: false,
      variants: [
        { packSize: "100ml", price: 120, sku: "INS-LAM-100", stockStatus: "in_stock", stockQty: 180 },
        { packSize: "500ml", price: 520, sku: "INS-LAM-500", stockStatus: "in_stock", stockQty: 95 },
        { packSize: "1 Litre", price: 950, sku: "INS-LAM-1L", stockStatus: "low_stock", stockQty: 6 }
      ]
    },
    {
      id: "p3",
      slug: "sample-fungicide-mancozeb",
      name: "SAMPLE Fungicide — Mancozeb 80% WP",
      category: "crop-production",
      subCategory: "fungicides",
      categoryName: "Crop Production",
      subCategoryName: "Fungicides",
      shortDescription: "Broad-spectrum protective contact fungicide preventing early and late blight, rust, and downy mildew.",
      fullDescription: "Standard multi-site protective fungicide providing an impenetrable protective barrier on leaf surfaces against fungal spore germination. Essential preventative spray for potato and tomato growers during humid rainy periods.",
      activeIngredient: "Mancozeb 800 g/kg WP",
      targetPests: ["Early blight", "Late blight", "Downy mildew", "Anthracnose", "Leaf spot"],
      targetCrops: ["Potatoes", "Tomatoes", "Onions", "Capsicum", "Watermelon"],
      dosage: "Mix 40g – 50g per 20L sprayer (or 2.5kg per hectare). Spray every 7–10 days before disease symptoms appear.",
      phi: "Potatoes: 7 days | Tomatoes: 3 days | Onions: 7 days.",
      safety: "Wear dust mask when scooping and mixing powder. Avoid breathing dust or skin contact. Wash hands and face thoroughly after spraying.",
      pcpbReg: "PCPB(CR) 0341-C",
      image: "images/products/sample-fungicide-mancozeb-front.webp",
      isFeatured: true,
      isSale: true,
      isNew: false,
      variants: [
        { packSize: "200g", price: 220, sku: "FNG-MAN-200", stockStatus: "in_stock", stockQty: 110 },
        { packSize: "500g", price: 490, oldPrice: 550, sku: "FNG-MAN-500", stockStatus: "in_stock", stockQty: 75 },
        { packSize: "1 kg", price: 890, sku: "FNG-MAN-1KG", stockStatus: "in_stock", stockQty: 42 }
      ]
    },
    {
      id: "p4",
      slug: "sample-tomato-seed-f1",
      name: "SAMPLE Tomato Seed — F1 Hybrid High-Yield",
      category: "seeds-fertilizers",
      subCategory: "seeds",
      categoryName: "Seeds & Fertilizers",
      subCategoryName: "Seeds",
      shortDescription: "Determinate high-yielding hybrid tomato with excellent firmness, shelf life and bacterial wilt tolerance.",
      fullDescription: "Premium KEPHIS-certified determinate tomato hybrid suited for both open field and net houses. Produces firm, oval fruits weighing 110–130g with outstanding transport resilience and 21-day shelf life.",
      activeIngredient: "Certified Hybrid Seed (Germination Rate: 92%+)",
      targetPests: ["Resistant to Tomato Yellow Leaf Curl Virus (TYLCV), Fusarium Wilt, Verticillium Wilt"],
      targetCrops: ["Tomatoes (Open Field & Greenhouse)"],
      dosage: "Seed rate: 100g per acre. Raise in nursery trays with sterile peat moss for 21–28 days before transplanting.",
      phi: "First harvest at 75–80 days after transplanting.",
      safety: "Treated seed with thiram fungicide. Not for human or animal consumption. Store in cool, dry conditions.",
      pcpbReg: "KEPHIS/SD/VAR-412",
      image: "images/products/sample-tomato-seed-f1-front.webp",
      isFeatured: true,
      isSale: false,
      isNew: true,
      variants: [
        { packSize: "10g (approx 3,000 seeds)", price: 580, sku: "SD-TOM-10G", stockStatus: "in_stock", stockQty: 60 },
        { packSize: "50g (approx 15,000 seeds)", price: 2400, sku: "SD-TOM-50G", stockStatus: "in_stock", stockQty: 25 },
        { packSize: "100g (1 acre pack)", price: 4500, sku: "SD-TOM-100G", stockStatus: "low_stock", stockQty: 4 }
      ]
    },
    {
      id: "p5",
      slug: "sample-granular-fertilizer-npk",
      name: "SAMPLE Granular Fertilizer — NPK 17:17:17 Balanced",
      category: "seeds-fertilizers",
      subCategory: "granular-fertilizers",
      categoryName: "Seeds & Fertilizers",
      subCategoryName: "Granular Fertilizers",
      shortDescription: "Balanced compound fertilizer supplying equal Nitrogen, Phosphorus and Potassium for robust vegetative and root growth.",
      fullDescription: "Homogeneous granulated compound fertilizer providing nitrogen for vigorous vegetative growth, phosphorus for strong root branching, and potassium for disease resistance and fruit development.",
      activeIngredient: "17% Nitrogen (N), 17% Phosphorus (P2O5), 17% Potassium (K2O)",
      targetPests: ["Improves plant vigour and natural stress tolerance"],
      targetCrops: ["Maize", "Potatoes", "Horticultural vegetables", "Fruit trees", "Bananas"],
      dosage: "Basal dressing: 50–75kg per acre depending on soil fertility test. Place 5cm away from seed/stem.",
      phi: "Not applicable. Follow soil nutrient plan.",
      safety: "Store in well-ventilated dry shed on wooden pallets. Keep away from direct water and fertilizer bags out of reach of livestock.",
      pcpbReg: "KEBS/STD/FERT-109",
      image: "images/products/sample-npk-fertilizer-front.webp",
      isFeatured: true,
      isSale: true,
      isNew: false,
      variants: [
        { packSize: "1 kg", price: 180, sku: "FRT-NPK-1KG", stockStatus: "in_stock", stockQty: 300 },
        { packSize: "5 kg", price: 820, sku: "FRT-NPK-5KG", stockStatus: "in_stock", stockQty: 110 },
        { packSize: "25 kg", price: 3800, oldPrice: 4200, sku: "FRT-NPK-25KG", stockStatus: "in_stock", stockQty: 45 },
        { packSize: "50 kg bag", price: 7200, sku: "FRT-NPK-50KG", stockStatus: "low_stock", stockQty: 8 }
      ]
    },
    {
      id: "p6",
      slug: "sample-knapsack-sprayer-16l",
      name: "SAMPLE Knapsack Sprayer — 16L Heavy Duty Manual",
      category: "farm-tools",
      subCategory: "sprayers",
      categoryName: "Farm Tools & Equipment",
      subCategoryName: "Sprayers",
      shortDescription: "16-Litre ergonomic knapsack sprayer with solid brass lance, pressure relief valve, and multi-pattern spray nozzles.",
      fullDescription: "Rugged chemical-resistant polyethylene tank with reinforced back cushions, leak-proof piston pump, stainless steel filter mesh, and solid brass trigger valve. Includes fan nozzle for herbicides and cone nozzle for insecticides.",
      activeIngredient: "UV-Stabilized Polyethylene Tank & Brass Lance Assembly",
      targetPests: ["Precision pesticide and foliar fertilizer application"],
      targetCrops: ["All smallholder farm crops and greenhouses"],
      dosage: "Operating pressure: 0.2 – 0.4 MPa. Fill only through the mesh strainer.",
      phi: "Not applicable.",
      safety: "Triple rinse tank and lance with clean soapy water immediately after spraying. Never blow through clogged nozzles with your mouth.",
      pcpbReg: "KEBS Certified Hardware",
      image: "images/products/sample-knapsack-sprayer-front.webp",
      isFeatured: false,
      isSale: false,
      isNew: false,
      variants: [
        { packSize: "16L Complete Unit", price: 2200, sku: "TL-SPR-16L", stockStatus: "in_stock", stockQty: 35 }
      ]
    },
    {
      id: "p7",
      slug: "sample-peat-moss-growing-media",
      name: "SAMPLE Peat Moss — Seedling Growing Medium",
      category: "planting-media",
      subCategory: "peat-moss",
      categoryName: "Planting Media",
      subCategoryName: "Peat Moss",
      shortDescription: "Sterile Baltic sphagnum peat moss with balanced pH 5.5–6.0 and optimal aeration for seedling nursery trays.",
      fullDescription: "Premium imported white sphagnum peat moss enriched with micro-nutrients and starter wetting agent. Free from weed seeds, pathogens, and nematodes. Ensures 98% germination and zero root damage during field transplanting.",
      activeIngredient: "100% Baltic White Sphagnum Peat (pH 5.5 - 6.0, EC < 0.8)",
      targetPests: ["Sterile — zero nematodes, fungal spores, or weed seeds"],
      targetCrops: ["Seedling trays for tomatoes, onions, capsicum, cabbages, watermelon"],
      dosage: "Moisten thoroughly with clean water until damp like a squeezed sponge before filling seedling trays.",
      phi: "Not applicable.",
      safety: "Natural organic growing substrate. Wear light dust mask when flaking dry bales.",
      pcpbReg: "Certified Agricultural Substrate",
      image: "images/products/sample-peat-moss-front.webp",
      isFeatured: false,
      isSale: false,
      isNew: true,
      variants: [
        { packSize: "70 Litre Bale", price: 3500, sku: "PM-PEAT-70L", stockStatus: "in_stock", stockQty: 48 },
        { packSize: "225 Litre Compressed Bale", price: 9800, sku: "PM-PEAT-225L", stockStatus: "low_stock", stockQty: 5 }
      ]
    },
    {
      id: "p8",
      slug: "sample-foliar-fertilizer-micro",
      name: "SAMPLE Foliar Fertilizer — Chelated Micronutrients",
      category: "seeds-fertilizers",
      subCategory: "foliar-fertilizers",
      categoryName: "Seeds & Fertilizers",
      subCategoryName: "Foliar Fertilizers",
      shortDescription: "Rapidly absorbed liquid foliar blend with Zinc, Boron, Magnesium and Iron to cure yellowing and stimulate heavy flowering.",
      fullDescription: "Fully chelated EDTA micronutrient liquid fertilizer designed for rapid absorption through plant leaves within 4 hours of spraying. Corrects hidden mineral deficiencies, boosts chlorophyll production, and stops blossom end rot.",
      activeIngredient: "Zinc (Zn) 3%, Boron (B) 2%, Magnesium (MgO) 2%, Iron (Fe) 1.5%",
      targetPests: ["Nutrient deficiencies, poor flowering, flower drop, leaf yellowing (chlorosis)"],
      targetCrops: ["French beans, tomatoes, potatoes, onions, coffee, avocados"],
      dosage: "Mix 30ml – 40ml per 20 Litre knapsack sprayer. Spray early morning or late afternoon when stomata are open.",
      phi: "1 day before harvest.",
      safety: "Compatible with most non-alkaline insecticides and fungicides. Store in cool shade.",
      pcpbReg: "KEBS/STD/FOL-220",
      image: "images/products/sample-foliar-fertilizer-front.webp",
      isFeatured: false,
      isSale: true,
      isNew: false,
      variants: [
        { packSize: "250ml Bottle", price: 350, oldPrice: 420, sku: "FRT-FOL-250", stockStatus: "in_stock", stockQty: 80 },
        { packSize: "1 Litre Bottle", price: 1100, sku: "FRT-FOL-1L", stockStatus: "in_stock", stockQty: 45 }
      ]
    },
    {
      id: "p9",
      slug: "sample-bio-insecticide-neem",
      name: "SAMPLE Bio-Insecticide — Cold Pressed Neem Oil 10,000 PPM",
      category: "crop-production",
      subCategory: "bio-insecticides",
      categoryName: "Crop Production",
      subCategoryName: "Bio-Insecticides",
      shortDescription: "Certified organic biological insect repellent and anti-feedant for chemical-free vegetable and fruit production.",
      fullDescription: "Cold-pressed pure azadirachtin neem extract delivering insect anti-feedant, growth-regulator, and egg-laying deterrent action. Ideal for GlobalG.A.P. compliant export crops and organic home kitchens.",
      activeIngredient: "Azadirachtin 1% (10,000 PPM) & Organic Emulsifier",
      targetPests: ["Spider mites", "Whiteflies", "Leafminers", "Mealybugs", "Aphids"],
      targetCrops: ["Herbs, greenhouse vegetables, export French beans, avocados"],
      dosage: "Mix 40ml – 50ml per 20L water. Repeat every 7 days.",
      phi: "0 days (Can harvest same day of spray).",
      safety: "Safe for beneficial insects, earthworms, and pollinators when sprayed in late evening.",
      pcpbReg: "PCPB(CR) BIO-881",
      image: "images/products/sample-bio-insecticide-front.webp",
      isFeatured: false,
      isSale: false,
      isNew: true,
      variants: [
        { packSize: "500ml", price: 650, sku: "BIO-NEEM-500", stockStatus: "in_stock", stockQty: 40 },
        { packSize: "1 Litre", price: 1200, sku: "BIO-NEEM-1L", stockStatus: "in_stock", stockQty: 22 }
      ]
    },
    {
      id: "p10",
      slug: "sample-chemical-ppe-kit",
      name: "SAMPLE Farm Chemical PPE Complete Safety Kit",
      category: "farm-tools",
      subCategory: "farm-ppe",
      categoryName: "Farm Tools & Equipment",
      subCategoryName: "Farm PPE",
      shortDescription: "Complete farmer pesticide protective gear: heavy-duty hooded coverall, dual-cartridge chemical respirator, nitrile gloves, and goggles.",
      fullDescription: "Complies with PCPB and WHO safety standards for farm operators. Includes a splash-resistant breathable hooded jumpsuit, CE-certified dual cartridge organic vapor respirator mask, anti-fog chemical splash safety goggles, and heavy-duty elbow-length nitrile gauntlets.",
      activeIngredient: "Chemical Resistant Nitrile, Polycarbonate, and Breathable Micro-porous Fabric",
      targetPests: ["Guards farmer against acute organophosphate, pyrethroid and solvent poisoning"],
      targetCrops: ["Essential during all pesticide mixing, spraying, and knapsack washing"],
      dosage: "One size fits most (Adjustable straps and elasticated wrists/ankles).",
      phi: "Not applicable.",
      safety: "Rinse gloves before taking off suit. Store PPE separately from agrochemicals and home clothes.",
      pcpbReg: "PCPB Approved Operator Safety Kit",
      image: "images/products/sample-chemical-ppe-front.webp",
      isFeatured: false,
      isSale: false,
      isNew: false,
      variants: [
        { packSize: "Full 4-Piece Kit (Medium/Large)", price: 2800, sku: "PPE-KIT-ML", stockStatus: "in_stock", stockQty: 30 },
        { packSize: "Full 4-Piece Kit (Extra Large)", price: 2950, sku: "PPE-KIT-XL", stockStatus: "in_stock", stockQty: 20 }
      ]
    }
  ],

  // ─── Kenyan Counties Delivery Database (All 47 Counties) ──────
  counties: [
    { county: "Nairobi", towns: "CBD, Westlands, Eastleigh, Embakasi, Kasarani, Karen, Langata, Ruai", fee: 200, duration: "Same day / within 24 hours" },
    { county: "Kiambu", towns: "Thika, Ruiru, Juja, Kikuyu, Limuru, Githunguri, Kiambu Town", fee: 300, duration: "1 – 2 working days" },
    { county: "Machakos", towns: "Machakos Town, Athi River, Kitengela, Kangundo, Tala, Mwala", fee: 350, duration: "1 – 2 working days" },
    { county: "Kajiado", towns: "Kajiado Town, Ngong, Ongata Rongai, Kitengela, Isinya, Loitokitok", fee: 350, duration: "1 – 2 working days" },
    { county: "Muranga", towns: "Muranga Town, Kangema, Kenol, Kandara, Maragua, Kirwara", fee: 400, duration: "1 – 2 working days" },
    { county: "Nyeri", towns: "Nyeri Town, Karatina, Othaya, Mukurweini, Mweiga", fee: 450, duration: "1 – 2 working days" },
    { county: "Kirinyaga", towns: "Kerugoya, Kutus, Wang'uru (Mwea), Sagana, Baricho", fee: 450, duration: "1 – 2 working days" },
    { county: "Nakuru", towns: "Nakuru City, Naivasha, Gilgil, Njoro, Molo, Subukia, Rongai", fee: 500, duration: "1 – 2 working days" },
    { county: "Embu", towns: "Embu Town, Runyenjes, Siakago, Manyatta", fee: 500, duration: "1 – 2 working days" },
    { county: "Meru", towns: "Meru Town, Nkubu, Maua, Timau, Chuka", fee: 550, duration: "2 working days" },
    { county: "Nyandarua", towns: "Ol Kalou, Engineer, Nyahururu, Ndaragwa", fee: 500, duration: "1 – 2 working days" },
    { county: "Laikipia", towns: "Nanyuki, Nyahururu, Rumuruti, Doldol", fee: 550, duration: "2 working days" },
    { county: "Uasin Gishu", towns: "Eldoret Town, Burnt Forest, Turbo, Moiben", fee: 600, duration: "2 working days" },
    { county: "Trans Nzoia", towns: "Kitale, Kiminini, Endebess, Cherangany", fee: 650, duration: "2 working days" },
    { county: "Kisumu", towns: "Kisumu City, Maseno, Ahero, Muhoroni, Sondu", fee: 650, duration: "2 working days" },
    { county: "Kakamega", towns: "Kakamega Town, Mumias, Butere, Malava, Lugari", fee: 650, duration: "2 working days" },
    { county: "Bungoma", towns: "Bungoma Town, Webuye, Kimilili, Chwele, Sirisia", fee: 650, duration: "2 working days" },
    { county: "Kericho", towns: "Kericho Town, Litein, Kipkelion, Londiani", fee: 600, duration: "2 working days" },
    { county: "Bomet", towns: "Bomet Town, Sotik, Silibwet, Mulot", fee: 600, duration: "2 working days" },
    { county: "Nandi", towns: "Kapsabet, Nandi Hills, Mosoriot", fee: 600, duration: "2 working days" },
    { county: "Mombasa", towns: "Mombasa Island, Nyali, Changamwe, Mvita, Likoni", fee: 600, duration: "1 – 2 working days" },
    { county: "Kilifi", towns: "Kilifi Town, Malindi, Mtwapa, Mariakani, Kaloleni", fee: 650, duration: "2 working days" },
    { county: "Kisii", towns: "Kisii Town, Ogembo, Suneka, Nyacheki", fee: 650, duration: "2 working days" },
    { county: "Nyamira", towns: "Nyamira Town, Keroka, Nyansiongo", fee: 650, duration: "2 working days" },
    { county: "Homa Bay", towns: "Homa Bay Town, Mbita, Kendu Bay, Oyugis", fee: 700, duration: "2 – 3 working days" },
    { county: "Migori", towns: "Migori Town, Rongo, Isebania, Kehancha", fee: 700, duration: "2 – 3 working days" },
    { county: "Siaya", towns: "Siaya Town, Bondo, Ugunja, Yala", fee: 700, duration: "2 – 3 working days" },
    { county: "Busia", towns: "Busia Town, Malaba, Nambale, Port Victoria", fee: 700, duration: "2 – 3 working days" },
    { county: "Baringo", towns: "Kabarnet, Eldama Ravine, Marigat", fee: 650, duration: "2 – 3 working days" },
    { county: "Narok", towns: "Narok Town, Kilgoris, Nairagie Enkare", fee: 600, duration: "2 working days" },
    { county: "Makueni", towns: "Wote, Emali, Kibwezi, Mtito Andei, Makindu", fee: 500, duration: "2 working days" },
    { county: "Kitui", towns: "Kitui Town, Mwingi, Mutomo, Kabati", fee: 550, duration: "2 working days" },
    { county: "Kwale", towns: "Kwale Town, Ukunda, Diani, Msambweni, Lunga Lunga", fee: 650, duration: "2 working days" },
    { county: "Taita Taveta", towns: "Voi, Wundanyi, Taveta, Mwatate", fee: 600, duration: "2 working days" },
    { county: "Isiolo", towns: "Isiolo Town, Garbatulla, Merti", fee: 750, duration: "2 – 3 working days" },
    { county: "Marsabit", towns: "Marsabit Town, Moyale, Laisamis", fee: 950, duration: "3 – 4 working days" },
    { county: "Turkana", towns: "Lodwar, Kakuma, Lokichogio", fee: 1100, duration: "3 – 5 working days" },
    { county: "West Pokot", towns: "Kapenguria, Makutano, Chepareria", fee: 750, duration: "2 – 3 working days" },
    { county: "Elgeyo Marakwet", towns: "Iten, Kapsowar, Chebiemit", fee: 650, duration: "2 working days" },
    { county: "Vihiga", towns: "Mbale, Chavakali, Luanda, Hamisi", fee: 650, duration: "2 working days" },
    { county: "Tharaka Nithi", towns: "Chuka, Marimanti, Magutuni", fee: 550, duration: "2 working days" },
    { county: "Garissa", towns: "Garissa Town, Dadaab, Masalani", fee: 850, duration: "2 – 3 working days" },
    { county: "Wajir", towns: "Wajir Town, Habaswein, Eldas", fee: 1100, duration: "3 – 5 working days" },
    { county: "Mandera", towns: "Mandera Town, Rhamu, Elwak", fee: 1300, duration: "3 – 5 working days" },
    { county: "Tana River", towns: "Hola, Bura, Garsen", fee: 850, duration: "3 working days" },
    { county: "Lamu", towns: "Lamu Island, Mokowe, Mpeketoni", fee: 900, duration: "3 working days" },
    { county: "Samburu", towns: "Maralal, Baragoi, Wamba", fee: 850, duration: "3 working days" }
  ],

  // ─── Diagnostic Matrix (Shop by Problem & Crop) ────────────────
  cropSolver: {
    crops: ["Tomatoes", "Maize", "Potatoes", "Kales & Cabbages", "French Beans", "Onions"],
    problems: [
      {
        id: "prob-1",
        crop: "Tomatoes",
        pest: "Aphids, Whiteflies & Thrips",
        desc: "Curling leaves, sticky honeydew, yellow speckling and flower abortion.",
        pestImage: "images/pests/pest-aphids.webp",
        recommendedProductId: "p2",
        recommendedDose: "15ml per 20L water",
        safetyNote: "Do not spray during full bloom to protect pollinators. PHI is 3 days."
      },
      {
        id: "prob-2",
        crop: "Tomatoes",
        pest: "Early & Late Blight",
        desc: "Dark water-soaked brown spots on leaves, rotting green fruits, and stems turning black.",
        pestImage: "images/pests/pest-blight.webp",
        recommendedProductId: "p3",
        recommendedDose: "50g per 20L water",
        safetyNote: "Preventative spray required before heavy rains or every 7 days in cool wet conditions."
      },
      {
        id: "prob-3",
        crop: "Potatoes",
        pest: "Late Blight (Fungus)",
        desc: "Rapid brown foliage blight with white mould on leaf undersides in cold humid weather.",
        pestImage: "images/pests/pest-blight.webp",
        recommendedProductId: "p3",
        recommendedDose: "50g per 20L knapsack",
        safetyNote: "Begin spraying when potato plants reach 15cm height before symptoms appear."
      },
      {
        id: "prob-4",
        crop: "Maize",
        pest: "Fall Armyworm & Stalk Borer",
        desc: "Sawdust-like frass inside the maize funnel whorl with ragged holes on emerging leaves.",
        pestImage: "images/pests/pest-armyworm.webp",
        recommendedProductId: "p2",
        recommendedDose: "20ml per 20L directed into whorls",
        safetyNote: "Spray in late afternoon when armyworm larvae feed inside plant funnels."
      },
      {
        id: "prob-5",
        crop: "Tomatoes",
        pest: "Flower Drop & Yellowing Leaves",
        desc: "Blossom abortion, pale yellow veins, poor fruit set and stunted growth.",
        pestImage: "images/pests/pest-deficiency.webp",
        recommendedProductId: "p8",
        recommendedDose: "40ml per 20L knapsack",
        safetyNote: "Apply foliar micronutrient blend early in the morning when leaf stomata are open."
      },
      {
        id: "prob-6",
        crop: "Maize",
        pest: "Stubborn Pre-Planting Weeds",
        desc: "Overgrown couch grass and broadleaf weeds competing with newly planted crops.",
        pestImage: "images/pests/pest-weeds.webp",
        recommendedProductId: "p1",
        recommendedDose: "200ml per 20L clean water",
        safetyNote: "Allow 7–10 days after spraying before plowing or planting seeds."
      }
    ]
  },

  // ─── 30 FAQ Accordion Items (5 per page) ───────────────────────
  faqs: [
    { id: 1, q: "Do you deliver farm inputs across all counties in Kenya?", a: "Yes! Agrovet Ltd delivers nationwide across all 47 counties. We partner with vetted courier networks (Fargo Courier, G4S, Easy Coach, North Rift, Guardian) and local riders in Nairobi and Kiambu.", cat: "Delivery" },
    { id: 2, q: "How long does delivery take after ordering?", a: "Nairobi and Kiambu orders are delivered same day or within 24 hours. Upcountry county deliveries typically take 1 to 2 business days. Remote counties take 3–4 days.", cat: "Delivery" },
    { id: 3, q: "Can I pick up my order directly from your Nairobi shop?", a: "Yes. Select 'Pick up at shop' at checkout. Our shop is located at Kirinyaga Road, Agricultural Center, Shop No. 12, Nairobi. Pickup is 100% free with zero handling charges.", cat: "Delivery" },
    { id: 4, q: "How does the M-Pesa STK Push payment work?", a: "When you choose M-Pesa at checkout and enter your Safaricom mobile number, our Daraja API instantly sends a payment pop-up prompt to your phone. Enter your secret M-Pesa PIN, and the order confirms automatically in seconds.", cat: "Payments" },
    { id: 5, q: "Can I pay via Lipa na M-Pesa Paybill or Till Number manually?", a: "Yes! If you prefer manual payment or experience network delays with STK Push, contact us or pay to our Buy Goods Till Number (Till number coming soon), then share the confirmation code on WhatsApp.", cat: "Payments" },
    { id: 6, q: "Do you offer 'Pay on Delivery'?", a: "Pay on Delivery is available for all addresses within Nairobi and metropolitan Kiambu (Thika, Ruiru, Kikuyu). For upcountry deliveries, payment is confirmed prior to parcel dispatch.", cat: "Payments" },
    { id: 7, q: "Are all your agrochemicals genuine and registered with the PCPB?", a: "100% genuine. Agrovet Ltd is fully licensed by the Pest Control Products Board under Dealer Licence PCPB/AGR/2024/7890. We source exclusively from authorized manufacturers and official distributors.", cat: "Quality" },
    { id: 8, q: "Do you stock certified seeds with KEPHIS germination test seals?", a: "Yes. Every seed packet we stock carries official KEPHIS certification, lot numbers, and verified germination rates (minimum 90–95%). We store all seeds in climate-controlled conditions.", cat: "Quality" },
    { id: 9, q: "Do you provide bulk or wholesale prices for farmer cooperatives and large estates?", a: "Yes! We offer tiered wholesale pricing for farmer groups, youth cooperatives, self-help groups, and commercial farms ordering in bulk. Click 'Request Bulk Quote' or message us on WhatsApp.", cat: "Pricing" },
    { id: 10, q: "Can I consult an agronomist before buying a pesticide or fertilizer?", a: "Yes, our licensed agronomists are on standby Monday to Saturday from 7:00 AM to 6:00 PM. Send photos of your crop symptoms to WhatsApp (+254 110 677 149) for instant advice.", cat: "Agronomy" },
    { id: 11, q: "What should I do if a product is showing 'Out of Stock'?", a: "Click the 'Notify Me When Available' button on the product page. You will receive an instant SMS or WhatsApp notification as soon as our warehouse restocks.", cat: "Orders" },
    { id: 12, q: "What is your return and refund policy?", a: "Unopened products in their original factory seal can be returned within 7 days for a replacement or full refund. Opened chemical containers cannot be accepted back due to safety regulations.", cat: "Orders" },
    { id: 13, q: "How can I track my dispatched order?", a: "Once your package is booked with the courier, you receive an automated SMS and WhatsApp update containing your courier parcel waybill number and contact details of the destination depot.", cat: "Delivery" },
    { id: 14, q: "Is there a minimum order amount required to buy?", a: "No minimum order! You can purchase as little as a 10g vegetable seed pack (KSh 80) up to multiple 50kg fertilizer bags. Orders above KSh 10,000 enjoy Free Delivery.", cat: "Orders" },
    { id: 15, q: "What are your physical shop operating hours?", a: "We are open Monday to Saturday from 7:00 AM to 6:00 PM. On Sundays and public holidays, we operate limited hours from 9:00 AM to 1:00 PM.", cat: "General" },
    { id: 16, q: "What is the Pre-Harvest Interval (PHI) on chemical labels?", a: "The PHI is the minimum number of days that must pass between your last pesticide spray and harvest of your crop. Adhering to PHI guarantees safe food without chemical residue.", cat: "Safety" },
    { id: 17, q: "What personal protective equipment (PPE) is mandatory when spraying?", a: "At minimum, wear chemical-resistant nitrile gloves, a respirator mask (N95 or vapor cartridge), protective goggles, long overalls, and rubber gumboots. Never spray downwind.", cat: "Safety" },
    { id: 18, q: "How should farmers store chemicals safely at home?", a: "Always store pesticides in their original labeled containers in a cool, ventilated, locked cupboard out of reach of children, livestock, and stored food grains.", cat: "Safety" },
    { id: 19, q: "Can I mix different agrochemicals in one knapsack sprayer?", a: "Only mix products that are chemically compatible. As a rule, never mix alkaline compounds (such as copper fungicides) with acidic stimulants without doing a jar compatibility test first.", cat: "Safety" },
    { id: 20, q: "How do I calculate knapsack dosage if the label states per hectare?", a: "A standard field calibration rule for vegetable farming is 10 to 12 knapsacks of 20L per acre (approx 25 knapsacks per hectare). Our agronomists can calculate exact ratios for your crop.", cat: "Agronomy" },
    { id: 21, q: "Do you sell high quality seedling peat moss and coco peat?", a: "Yes, we import sterile European sphagnum peat moss (70L and 225L compressed bales) as well as washed low-EC coco peat blocks for nursery potting trays.", cat: "Products" },
    { id: 22, q: "Do you supply knapsack sprayer spare parts and brass nozzles?", a: "Yes. We stock complete spare parts for 16L and 20L sprayers including pump pistons, O-rings, brass trigger valves, telescopic lances, and fan/cone nozzles.", cat: "Products" },
    { id: 23, q: "Can I request an official ETR VAT tax receipt for my business?", a: "Yes, all orders processed through Agrovet Ltd generate valid KRA ETR receipts upon request. Simply enter your company PIN during checkout or request via email.", cat: "Payments" },
    { id: 24, q: "Do you ship across East Africa to Uganda, Tanzania, or Rwanda?", a: "Currently our automated checkout serves all 47 counties of Kenya. For cross-border orders to Uganda or Tanzania, please contact our export desk on WhatsApp.", cat: "Delivery" },
    { id: 25, q: "How do I choose the correct fertilizer between NPK and CAN?", a: "NPK (e.g. 17:17:17) is a balanced basal fertilizer applied during planting. CAN (Calcium Ammonium Nitrate) or Urea is a top-dressing fertilizer applied 3–4 weeks later.", cat: "Agronomy" },
    { id: 26, q: "What is the difference between contact and systemic fungicides?", a: "Contact fungicides (like Mancozeb) remain on the leaf surface to block spores before they penetrate. Systemic fungicides enter the sap stream to cure existing internal fungal infections.", cat: "Agronomy" },
    { id: 27, q: "How does your 'Shop by Problem & Crop' tool work?", a: "Simply select your crop (e.g. Tomatoes) and the pest symptom you see (e.g. Blight or Tuta Absoluta). Our system automatically identifies the approved chemical solution with dosage guidelines.", cat: "Agronomy" },
    { id: 28, q: "How is my personal information protected under Kenyan law?", a: "Agrovet Ltd adheres strictly to the Kenya Data Protection Act 2019. We never share customer phone numbers or order history with third parties without consent.", cat: "Privacy" },
    { id: 29, q: "Can I save my favourite products to a wishlist for next planting season?", a: "Yes! Click the heart icon on any product card to save it to your wishlist. Your saved items remain stored on your device for fast reordering next season.", cat: "Orders" },
    { id: 30, q: "How do I apply for agronomist advice or soil testing partnerships?", a: "Email us at chaltononyango5@gmail.com or visit our Kirinyaga Road shop. We collaborate with accredited soil testing laboratories in Nairobi to help farmers optimize input costs.", cat: "General" }
  ],

  // ─── Blog Posts ────────────────────────────────────────────────
  blog: [
    {
      id: "b1",
      slug: "tuta-absoluta-tomato-control-kenya",
      title: "How to Detect and Control Tuta Absoluta on Tomatoes",
      category: "Pest Management",
      date: "October 2024",
      readTime: "5 min read",
      summary: "Tuta absoluta (tomato pinworm) can destroy up to 100% of your tomato harvest in just 10 days if unmanaged. Learn how to combine pheromone traps, proper crop scouting, and alternating active chemical modes of action.",
      image: "tomato-leaf"
    },
    {
      id: "b2",
      slug: "choosing-right-fertilizer-vegetables",
      title: "Understanding NPK: Choosing the Right Fertilizer for Your Crops",
      category: "Soil Nutrition",
      date: "September 2024",
      readTime: "6 min read",
      summary: "Don't guess what your soil needs. Demystify nitrogen, phosphorus, and potassium ratios. When to apply basal granular fertilizer versus when to spray fast-acting foliar micronutrients during fruit set.",
      image: "fertilizer-field"
    },
    {
      id: "b3",
      slug: "seedling-nursery-peat-moss-guide",
      title: "Why Peat Moss Guarantees 98% Seedling Nursery Success",
      category: "Planting Media",
      date: "August 2024",
      readTime: "4 min read",
      summary: "Ordinary garden topsoil contains damping-off fungal spores and nematodes that choke delicate hybrid seeds. Discover why sterile peat moss and propagation trays pay for themselves in bumper yields.",
      image: "seedling-tray"
    },
    {
      id: "b4",
      slug: "knapsack-sprayer-maintenance-care",
      title: "5 Maintenance Rules to Extend Your Knapsack Sprayer's Life",
      category: "Farm Tools",
      date: "July 2024",
      readTime: "4 min read",
      summary: "A poorly maintained sprayer causes chemical leakage onto the operator's back and uneven spray drift. Learn triple-rinsing routines, nozzle cleaning, and piston lubrication best practices.",
      image: "sprayer-tool"
    },
    {
      id: "b5",
      slug: "pre-emergent-weed-control-guide",
      title: "Pre-Emergent vs Post-Emergent Herbicides in Kenya",
      category: "Weed Control",
      date: "June 2024",
      readTime: "5 min read",
      summary: "Stop spending thousands of shillings on manual weeding labor. Learn the science of pre-emergent weed barriers versus selective broadleaf post-emergence sprays for maize and bean farms.",
      image: "weed-control"
    }
  ]
};
