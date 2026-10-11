import os
import io
import json
import urllib.request
import urllib.parse
from PIL import Image

BASE_DIR = r"c:\Users\user\OneDrive\agrovet.ltd farm"
IMG_DIRS = [
    os.path.join(BASE_DIR, "images"),
    os.path.join(BASE_DIR, "frontend", "public", "images")
]

SLOTS = [
    # ── 1. Hero ────────────────────────────────────────────────────────
    {
        "file": "hero/hero-vegetables.webp",
        "search": "vegetable garden tomatoes cabbage field",
        "fallback": "market garden vegetables fresh",
        "size": (1600, 700)
    },
    {
        "file": "hero/hero-fertilizer.webp",
        "search": "applying granular fertilizer farm soil",
        "fallback": "fertilizer agriculture soil field",
        "size": (1600, 700)
    },
    {
        "file": "hero/hero-maize.webp",
        "search": "healthy green maize field ears",
        "fallback": "corn field zea mays agriculture",
        "size": (1600, 700)
    },

    # ── 2. Categories ──────────────────────────────────────────────────
    {
        "file": "categories/crop-production.webp",
        "search": "spraying crops knapsack agriculture",
        "fallback": "tractor spraying farm field",
        "size": (600, 600)
    },
    {
        "file": "categories/farm-tools.webp",
        "search": "gardening tools knapsack sprayer equipment",
        "fallback": "farming equipment tools agriculture",
        "size": (600, 600)
    },
    {
        "file": "categories/seeds-fertilizers.webp",
        "search": "agricultural seeds grains fertilizer",
        "fallback": "seed planting farming agriculture",
        "size": (600, 600)
    },
    {
        "file": "categories/seeds.webp",
        "search": "vegetable seeds sowing seedling",
        "fallback": "cereal grain seeds agriculture",
        "size": (600, 600)
    },
    {
        "file": "categories/insecticides.webp",
        "search": "crop spraying pest control field",
        "fallback": "agricultural sprayer crop protection",
        "size": (600, 600)
    },
    {
        "file": "categories/fungicides.webp",
        "search": "healthy crop foliage greenhouse",
        "fallback": "green plant leaves vineyard healthy",
        "size": (600, 600)
    },
    {
        "file": "categories/herbicides.webp",
        "search": "weed free crop field furrow",
        "fallback": "cultivated field soil crops",
        "size": (600, 600)
    },
    {
        "file": "categories/planting-media.webp",
        "search": "peat moss potting soil seedling tray",
        "fallback": "rich soil substrate planting media",
        "size": (600, 600)
    },

    # ── 3. Pests ───────────────────────────────────────────────────────
    {
        "file": "pests/pest-aphids.webp",
        "search": "aphids on leaf plant pest",
        "fallback": "aphidoidea greenfly leaf",
        "size": (600, 600)
    },
    {
        "file": "pests/pest-blight.webp",
        "search": "phytophthora infestans potato tomato blight",
        "fallback": "plant leaf blight spots disease",
        "size": (600, 600)
    },
    {
        "file": "pests/pest-armyworm.webp",
        "search": "spodoptera frugiperda fall armyworm maize",
        "fallback": "armyworm caterpillar leaf corn",
        "size": (600, 600)
    },
    {
        "file": "pests/pest-deficiency.webp",
        "search": "chlorosis leaf nutrient deficiency plant",
        "fallback": "iron deficiency leaf veins chlorosis",
        "size": (600, 600)
    },
    {
        "file": "pests/pest-weeds.webp",
        "search": "couch grass weeds invasive field",
        "fallback": "cynodon dactylon weed grass field",
        "size": (600, 600)
    },

    # ── 4. Guides ──────────────────────────────────────────────────────
    {
        "file": "guides/tuta-absoluta-control.webp",
        "search": "tomato greenhouse farming crop protection",
        "fallback": "tomato plants leaves greenhouse",
        "size": (1200, 675)
    },
    {
        "file": "guides/npk-fertilizer-guide.webp",
        "search": "granular fertilizer soil application vegetable",
        "fallback": "soil testing fertilizer agriculture",
        "size": (1200, 675)
    },
    {
        "file": "guides/peat-moss-nursery.webp",
        "search": "seedling propagation greenhouse nursery trays",
        "fallback": "seedling trays nursery greenhouse",
        "size": (1200, 675)
    },
    {
        "file": "guides/knapsack-maintenance.webp",
        "search": "knapsack sprayer spraying farmer",
        "fallback": "backpack sprayer spraying nozzle",
        "size": (1200, 675)
    },
    {
        "file": "guides/herbicide-weed-control.webp",
        "search": "spraying herbicide field crops tractor",
        "fallback": "weed control crop field agriculture",
        "size": (1200, 675)
    },

    # ── 5. About Us ────────────────────────────────────────────────────
    {
        "file": "about/shop-kirinyaga-rd.webp",
        "search": "agricultural supply store warehouse retail",
        "fallback": "hardware store shop interior counter",
        "size": (800, 600)
    },
    {
        "file": "about/agronomist-team.webp",
        "search": "african farmers agriculture agronomist field",
        "fallback": "african agriculture farm inspection",
        "size": (800, 600)
    },
    {
        "file": "about/courier-dispatch.webp",
        "search": "delivery van logistics packages warehouse",
        "fallback": "freight delivery courier cargo warehouse",
        "size": (800, 600)
    }
]

def search_wikimedia(query):
    encoded = urllib.parse.quote(query)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={encoded}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "AgrovetApp/1.0 (info@agrovet.ltd)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                infos = page.get("imageinfo", [])
                if infos:
                    info = infos[0]
                    mime = info.get("mime", "")
                    img_url = info.get("url", "")
                    if ("jpeg" in mime or "png" in mime or "jpg" in mime) and not img_url.endswith(".svg"):
                        return img_url
    except Exception as e:
        print(f"Error searching {query}: {e}")
    return None

def download_image(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AgrovetApp/1.0 (info@agrovet.ltd)"})
    with urllib.request.urlopen(req, timeout=12) as response:
        return response.read()

def crop_and_resize(img, target_w, target_h):
    img = img.convert("RGB")
    src_w, src_h = img.size
    target_aspect = target_w / target_h
    src_aspect = src_w / src_h

    if src_aspect > target_aspect:
        # Source is wider: crop sides
        new_w = int(src_h * target_aspect)
        left = (src_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, src_h))
    else:
        # Source is taller: crop top/bottom
        new_h = int(src_w / target_aspect)
        top = (src_h - new_h) // 2
        img = img.crop((0, top, src_w, top + new_h))

    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def process_slot(slot):
    rel_path = slot["file"]
    target_size = slot["size"]
    print(f"\nProcessing {rel_path}...")

    img_url = search_wikimedia(slot["search"])
    if not img_url and "fallback" in slot:
        print(f"Trying fallback query: {slot['fallback']}")
        img_url = search_wikimedia(slot["fallback"])

    if not img_url:
        print(f"FAILED to find image URL for {rel_path}")
        return False

    print(f"Found URL: {img_url}")
    try:
        raw_bytes = download_image(img_url)
        img = Image.open(io.BytesIO(raw_bytes))
        processed = crop_and_resize(img, target_size[0], target_size[1])

        for base in IMG_DIRS:
            out_file = os.path.join(base, rel_path)
            os.makedirs(os.path.dirname(out_file), exist_ok=True)
            processed.save(out_file, "WEBP", quality=85)
            print(f"Saved: {out_file} ({os.path.getsize(out_file)} bytes)")
        return True
    except Exception as e:
        print(f"Error processing {rel_path}: {e}")
        return False

if __name__ == "__main__":
    success_count = 0
    for slot in SLOTS:
        if process_slot(slot):
            success_count += 1
    print(f"\nDone! Successfully processed {success_count}/{len(SLOTS)} images.")
