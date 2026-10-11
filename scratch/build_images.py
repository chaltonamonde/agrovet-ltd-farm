 import os
import math
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"c:\Users\user\OneDrive\agrovet.ltd farm"
IMG_DIR = os.path.join(BASE_DIR, "images")

subdirs = ["hero", "categories", "products", "guides", "pests", "about", "icons"]
for sub in subdirs:
    os.makedirs(os.path.join(IMG_DIR, sub), exist_ok=True)

# Also create in frontend/public/images if frontend exists
FRONT_IMG = os.path.join(BASE_DIR, "frontend", "public", "images")
for sub in subdirs:
    os.makedirs(os.path.join(FRONT_IMG, sub), exist_ok=True)

# Colors matching cream & brand palette
C_CREAM = (230, 223, 205)
C_CARD = (242, 237, 223)
C_FOREST = (34, 63, 33)
C_FOREST_2 = (38, 86, 38)
C_LEAF = (95, 163, 14)
C_GOLD = (244, 185, 67)
C_BORDER = (201, 191, 166)
C_TEXT = (42, 42, 30)
C_MUTED = (94, 90, 72)

def get_font(size):
    try:
        # Try system Arial or Segoe UI
        return ImageFont.truetype("arial.ttf", size)
    except:
        return ImageFont.load_default()

def draw_gradient(draw, width, height, color1, color2):
    for y in range(height):
        factor = y / height
        r = int(color1[0] * (1 - factor) + color2[0] * factor)
        g = int(color1[1] * (1 - factor) + color2[1] * factor)
        b = int(color1[2] * (1 - factor) + color2[2] * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

# ── 1. Hero Slides (1600x700, WebP < 250KB) ──────────────────────────
hero_specs = [
    {
        "file": "hero/hero-cropprotection.webp",
        "title": "CROP PROTECTION & SPRAYING",
        "subtitle": "Certified Agrochemicals • Operator PPE • Knapsack Application",
        "badge": "PCPB LICENSED SUPPLIES",
        "theme": [(34, 63, 33), (25, 52, 26)],
        "accent": (95, 163, 14),
        "detail": "Spraying Operator with Respirator, Goggles & Knapsack • Kenya Farm Field"
    },
    {
        "file": "hero/hero-media.webp",
        "title": "PEAT MOSS & GROWING MEDIA",
        "subtitle": "Sterile Baltic Sphagnum & Coco Peat Seedling Trays",
        "badge": "98% GERMINATION RATE",
        "theme": [(45, 60, 35), (30, 48, 28)],
        "accent": (244, 185, 67),
        "detail": "Seedling Nursery Trays • Vigorous White Root Branching"
    },
    {
        "file": "hero/hero-vegetables.webp",
        "title": "CERTIFIED VEGETABLE SEEDS",
        "subtitle": "High-Yield F1 Tomato, Sukuma Wiki, Cabbage & Onions",
        "badge": "KEPHIS CERTIFIED LOTS",
        "theme": [(38, 70, 32), (28, 55, 25)],
        "accent": (95, 163, 14),
        "detail": "Healthy Sukuma Wiki & Fresh Tomato Plantation in Kenya"
    },
    {
        "file": "hero/hero-fertilizer.webp",
        "title": "BALANCED SOIL & FOLIAR NUTRITION",
        "subtitle": "NPK 17:17:17 Basal Dressing & Chelated Micronutrient Sprays",
        "badge": "SOIL TEST COMPLIANT",
        "theme": [(34, 63, 33), (48, 78, 38)],
        "accent": (244, 185, 67),
        "detail": "Kenyan Smallholder Farmer Applying Granular Fertilizer to Crop Rows"
    },
    {
        "file": "hero/hero-maize.webp",
        "title": "HIGH-YIELD HYBRID MAIZE SEED",
        "subtitle": "KEPHIS-Certified Varieties for Kenyan Highlands & Lowlands",
        "badge": "DROUGHT & BLIGHT RESISTANT",
        "theme": [(30, 58, 28), (22, 45, 20)],
        "accent": (244, 185, 67),
        "detail": "Vigorous Green Maize Field with Filled Cobs • Rift Valley Kenya"
    }
]

for h in hero_specs:
    img = Image.new("RGB", (1600, 700), h["theme"][0])
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, 1600, 700, h["theme"][0], h["theme"][1])
    
    # Decorative subtle grid/lines
    for x in range(0, 1600, 80):
        draw.line([(x, 0), (x, 700)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, 700, 80):
        draw.line([(0, y), (1600, y)], fill=(255, 255, 255, 10), width=1)

    # Sunburst/farm landscape curves
    draw.arc([-200, 250, 1800, 1100], 0, 180, fill=h["accent"], width=3)
    draw.arc([-100, 350, 1700, 1100], 0, 180, fill=(201, 191, 166), width=2)
    
    # Badge Pill
    f_badge = get_font(26)
    draw.rounded_rectangle([120, 110, 480, 160], radius=25, fill=h["accent"])
    draw.text((145, 122), h["badge"], fill=(34, 63, 33) if h["accent"] == C_GOLD else (255, 255, 255), font=f_badge)
    
    # Title
    f_title = get_font(64)
    draw.text((120, 190), h["title"], fill=(255, 255, 255), font=f_title)
    
    # Subtitle
    f_sub = get_font(32)
    draw.text((120, 280), h["subtitle"], fill=(230, 223, 205), font=f_sub)

    # Content Visual Marker
    f_det = get_font(22)
    draw.rounded_rectangle([120, 360, 950, 430], radius=12, fill=(20, 40, 20), outline=h["accent"], width=2)
    draw.text((140, 385), f"FIELD SUBJECT: {h['detail']}", fill=(244, 185, 67), font=f_det)
    
    # Watermark
    f_wm = get_font(18)
    draw.text((120, 640), "AGROVET LTD • KENYA FARM INPUTS VERIFIED PHOTO REFERENCE", fill=(180, 180, 160), font=f_wm)

    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, h["file"])
        img.save(out_path, "WEBP", quality=82)

print("Hero images generated.")

# ── 2. Category Cards (600x600, WebP < 100KB) ────────────────────────
cat_specs = [
    ("categories/crop-production.webp", "CROP PRODUCTION", "Herbicides, Insecticides & Fungicides", C_FORES_ACC := (95, 163, 14)),
    ("categories/farm-tools.webp", "FARM TOOLS & PPE", "Knapsack Sprayers, Nozzles & Safety Kits", (34, 63, 33)),
    ("categories/seeds-fertilizers.webp", "SEEDS & FERTILIZERS", "KEPHIS Certified Seeds & Granular Blends", (244, 185, 67)),
    ("categories/seeds.webp", "CERTIFIED SEEDS", "High-Yield Tomato, Cabbage & Maize Seeds", (95, 163, 14)),
    ("categories/insecticides.webp", "INSECTICIDES", "Pyrethroid & Bio-Insecticide Formulations", (34, 63, 33)),
    ("categories/fungicides.webp", "FUNGICIDES", "Protective & Systemic Blight Formulations", (244, 185, 67)),
    ("categories/herbicides.webp", "HERBICIDES", "Selective & Non-Selective Weed Control", (95, 163, 14)),
    ("categories/planting-media.webp", "PLANTING MEDIA", "Sterile Baltic Peat Moss & Coco Peat", (34, 63, 33)),
]

for filename, cat_name, desc, color in cat_specs:
    img = Image.new("RGB", (600, 600), C_CARD)
    draw = ImageDraw.Draw(img)
    
    # Border
    draw.rounded_rectangle([15, 15, 585, 585], radius=24, fill=C_CARD, outline=C_BORDER, width=2)
    
    # Upper visual container
    draw.rounded_rectangle([30, 30, 570, 380], radius=18, fill=C_CREAM, outline=C_BORDER, width=1)
    
    # Symbol badge
    draw.ellipse([230, 130, 370, 270], fill=C_FOREST, outline=color, width=4)
    f_sym = get_font(54)
    draw.text((270, 165), "AG", fill=C_GOLD, font=f_sym)
    
    f_name = get_font(34)
    f_desc = get_font(20)
    draw.text((40, 420), cat_name, fill=C_FOREST, font=f_name)
    draw.text((40, 475), desc, fill=C_MUTED, font=f_desc)
    
    f_badge = get_font(16)
    draw.rounded_rectangle([40, 525, 280, 560], radius=15, fill=C_FOREST)
    draw.text((58, 533), "OFFICIAL CATEGORY", fill=(255, 255, 255), font=f_badge)
    
    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, filename)
        img.save(out_path, "WEBP", quality=82)

print("Category images generated.")

# ── 3. Product Images (600x600, WebP < 100KB) ────────────────────────
prod_specs = [
    ("products/sample-herbicide-glyphosate-front.webp", "GLYPHOSATE 360 SL", "Non-Selective Systemic Herbicide", "1 Litre Bottle • PCPB(CR) 1245-A", "HERBICIDE"),
    ("products/sample-insecticide-lambda-front.webp", "LAMBDA-CYHALOTHRIN 5% EC", "Broad-Spectrum Pyrethroid", "500ml Bottle • PCPB(CR) 0892-B", "INSECTICIDE"),
    ("products/sample-fungicide-mancozeb-front.webp", "MANCOZEB 80% WP", "Protective Multi-Site Fungicide", "1 kg Foil Pack • PCPB(CR) 0341-C", "FUNGICIDE"),
    ("products/sample-tomato-seed-f1-front.webp", "TOMATO SEED F1 HYBRID", "Determinate High-Yield Variety", "50g Sealed Pack • KEPHIS Certified", "CERTIFIED SEED"),
    ("products/sample-npk-fertilizer-front.webp", "NPK 17:17:17 BALANCED", "Homogeneous Granular Compound", "25 kg Bag • KEBS Standard", "FERTILIZER"),
    ("products/sample-knapsack-sprayer-front.webp", "KNAPSACK SPRAYER 16L", "Heavy Duty Manual Brass Lance", "16L Tank • Complete Unit", "EQUIPMENT"),
    ("products/sample-peat-moss-front.webp", "BALTIC SPHAGNUM PEAT MOSS", "Sterile Seedling Growing Medium", "70L Bale • pH 5.5 - 6.0", "GROWING MEDIA"),
    ("products/sample-foliar-fertilizer-front.webp", "CHELATED MICRONUTRIENTS", "Foliar Liquid Spray Zn/B/Mg/Fe", "1 Litre Bottle • High Absorption", "FOLIAR NUTRITION"),
    ("products/sample-bio-insecticide-front.webp", "COLD PRESSED NEEM OIL", "Organic Bio-Insecticide 10,000 PPM", "500ml Bottle • PCPB(CR) BIO-881", "BIO-PROTECTION"),
    ("products/sample-chemical-ppe-front.webp", "FARM OPERATOR PPE SUIT", "Chemical Resistant 4-Piece Kit", "Suit, Goggles, Respirator, Gloves", "SAFETY GEAR"),
]

for filename, name, line1, line2, tag in prod_specs:
    img = Image.new("RGB", (600, 600), C_CARD)
    draw = ImageDraw.Draw(img)
    
    # Outer card
    draw.rounded_rectangle([15, 15, 585, 585], radius=24, fill=C_CARD, outline=C_BORDER, width=2)
    
    # Illustration container
    draw.rounded_rectangle([40, 40, 560, 420], radius=16, fill=C_CREAM, outline=C_BORDER, width=1)
    
    # Simulated Product Pack Visual
    draw.rounded_rectangle([190, 70, 410, 390], radius=20, fill=(248, 245, 238), outline=C_FOREST, width=3)
    
    # Label on bottle/pack
    draw.rectangle([200, 160, 400, 320], fill=C_FOREST)
    draw.rectangle([200, 175, 400, 185], fill=C_GOLD)
    
    f_lbl_brand = get_font(18)
    f_lbl_name = get_font(20)
    f_lbl_sub = get_font(13)
    
    draw.text((235, 195), "AGROVET LTD", fill=C_GOLD, font=f_lbl_brand)
    draw.text((215, 230), name[:16], fill=(255, 255, 255), font=f_lbl_name)
    draw.text((215, 260), tag, fill=C_LEAF, font=f_lbl_sub)
    draw.text((215, 280), "KENYA OFFICIAL LABEL", fill=(200, 200, 200), font=f_lbl_sub)
    
    # Bottom description
    f_name = get_font(28)
    f_sub = get_font(18)
    draw.text((40, 450), name, fill=C_FOREST, font=f_name)
    draw.text((40, 495), f"{line1} • {line2}", fill=C_MUTED, font=f_sub)
    
    # Watermark
    f_wm = get_font(14)
    draw.text((40, 545), "Image for illustration • Official packaging may vary by batch", fill=(140, 135, 120), font=f_wm)

    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, filename)
        img.save(out_path, "WEBP", quality=82)

print("Product images generated.")

# ── 4. Guides & Blog Images (1200x675, WebP < 120KB) ─────────────────
guide_specs = [
    ("guides/tuta-absoluta-control.webp", "TUTA ABSOLUTA MANAGEMENT", "Tomato Scouting, Traps & Active Ingredient Rotation", "Pest Management"),
    ("guides/npk-fertilizer-guide.webp", "UNDERSTANDING NPK FOR CROPS", "Timing Basal Granular vs Foliar Micronutrient Sprays", "Soil Nutrition"),
    ("guides/peat-moss-nursery.webp", "SEEDLING NURSERY PROPAGATION", "Sterile Sphagnum Media for 98% Germination in Kenya", "Planting Media"),
    ("guides/knapsack-maintenance.webp", "KNAPSACK SPRAYER CARE", "Triple-Rinsing, Nozzle Calibration & Safety Checks", "Farm Tools"),
    ("guides/herbicide-weed-control.webp", "PRE-EMERGENT WEED BARRIERS", "Selective vs Non-Selective Field Spray Timelines", "Weed Management"),
]

for filename, title, sub, cat in guide_specs:
    img = Image.new("RGB", (1200, 675), C_CARD)
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, 1200, 675, (40, 65, 38), (28, 48, 26))
    
    # Grid lines
    for x in range(0, 1200, 60):
        draw.line([(x, 0), (x, 675)], fill=(255, 255, 255, 8), width=1)
    
    f_cat = get_font(22)
    draw.rounded_rectangle([80, 80, 360, 130], radius=15, fill=C_GOLD)
    draw.text((100, 93), cat.upper(), fill=C_FOREST, font=f_cat)
    
    f_title = get_font(52)
    f_sub = get_font(28)
    draw.text((80, 180), title, fill=(255, 255, 255), font=f_title)
    draw.text((80, 260), sub, fill=C_CREAM, font=f_sub)
    
    # Guide banner detail
    draw.rounded_rectangle([80, 350, 1120, 550], radius=20, fill=(25, 45, 24), outline=C_LEAF, width=2)
    f_body = get_font(24)
    draw.text((120, 410), "KENYAN AGRONOMY TECHNICAL FIELD GUIDE", fill=C_GOLD, font=f_body)
    draw.text((120, 460), "Approved protocols for smallholder farmers across all 47 counties.", fill=(220, 215, 200), font=get_font(20))
    
    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, filename)
        img.save(out_path, "WEBP", quality=82)

print("Guide images generated.")

# ── 5. Pest & Diagnostic Close-ups (600x600, WebP < 90KB) ────────────
pest_specs = [
    ("pests/pest-aphids.webp", "APHIDS & WHITEFLIES", "Curling Leaves & Sooty Mould Honeydew", "Prescription: Lambda-cyhalothrin 5% EC"),
    ("pests/pest-blight.webp", "EARLY & LATE BLIGHT", "Dark Water-Soaked Spots on Foliage", "Prescription: Mancozeb 80% WP"),
    ("pests/pest-armyworm.webp", "FALL ARMYWORM ON MAIZE", "Ragged Whorl Damage & Sawdust Frass", "Prescription: Target Whorl Spray"),
    ("pests/pest-deficiency.webp", "NUTRIENT DEFICIENCY", "Interveinal Chlorosis & Blossom Drop", "Prescription: Chelated Foliar Zinc/Boron"),
    ("pests/pest-weeds.webp", "STUBBORN COUCH GRASS", "Invasive Weeds Competing with Crops", "Prescription: Glyphosate 360 SL Pre-Plant"),
]

for filename, pest, symptom, rx in pest_specs:
    img = Image.new("RGB", (600, 600), C_CARD)
    draw = ImageDraw.Draw(img)
    
    draw.rounded_rectangle([15, 15, 585, 585], radius=24, fill=C_CARD, outline=C_BORDER, width=2)
    draw.rounded_rectangle([35, 35, 565, 380], radius=18, fill=C_CREAM, outline=C_BORDER, width=1)
    
    # Pest diagnostic graphic
    draw.ellipse([210, 110, 390, 290], fill=(50, 40, 30), outline=(217, 56, 30), width=4)
    f_warn = get_font(48)
    draw.text((275, 165), "!", fill=C_GOLD, font=f_warn)
    
    f_pest = get_font(30)
    f_sym = get_font(18)
    f_rx = get_font(18)
    
    draw.text((40, 415), pest, fill=C_FOREST, font=f_pest)
    draw.text((40, 465), f"Symptom: {symptom}", fill=C_MUTED, font=f_sym)
    draw.text((40, 505), rx, fill=(63, 122, 8), font=f_rx)
    
    f_wm = get_font(14)
    draw.text((40, 550), "FIELD SCOUTING REFERENCE • AGROVET LTD NAIROBI", fill=(140, 135, 120), font=f_wm)

    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, filename)
        img.save(out_path, "WEBP", quality=82)

print("Pest images generated.")

# ── 6. About Us Photos (800x600, WebP < 100KB) ────────────────────────
about_specs = [
    ("about/shop-kirinyaga-rd.webp", "NAIROBI PHYSICAL SHOP", "Kirinyaga Road, Agricultural Center, Shop No. 12", "Walk-in consultations & zero-fee collection center."),
    ("about/agronomist-team.webp", "LICENSED FIELD AGRONOMISTS", "PCPB Dealer Licence Compliant Advisory Team", "Guiding farmers on proper dosage and PPE protection."),
    ("about/courier-dispatch.webp", "47-COUNTY COURIER DISPATCH", "Secure Leak-Proof Agrochemical Parcel Packaging", "Same-day Nairobi riders & vetted upcountry couriers."),
]

for filename, title, sub, desc in about_specs:
    img = Image.new("RGB", (800, 600), C_CARD)
    draw = ImageDraw.Draw(img)
    draw_gradient(draw, 800, 600, (45, 68, 42), (30, 52, 28))
    
    f_title = get_font(36)
    f_sub = get_font(22)
    f_desc = get_font(18)
    
    draw.rounded_rectangle([50, 50, 750, 550], radius=20, fill=(22, 42, 22), outline=C_GOLD, width=2)
    draw.text((80, 120), title, fill=(255, 255, 255), font=f_title)
    draw.text((80, 185), sub, fill=C_GOLD, font=f_sub)
    draw.text((80, 240), desc, fill=C_CREAM, font=f_desc)
    
    # Store verification stamp
    draw.rounded_rectangle([80, 420, 520, 480], radius=15, fill=C_FOREST, outline=C_LEAF, width=1)
    draw.text((100, 442), "VERIFIED NAIROBI FACILITY & LOGISTICS", fill=(255, 255, 255), font=get_font(18))

    for base in [IMG_DIR, FRONT_IMG]:
        out_path = os.path.join(base, filename)
        img.save(out_path, "WEBP", quality=82)

print("About images generated successfully!")
