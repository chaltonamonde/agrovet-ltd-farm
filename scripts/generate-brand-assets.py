import os
from PIL import Image, ImageOps

banner_src = r"C:\Users\user\.gemini\antigravity-ide\brain\42cac44e-c02b-4995-97da-6d49cfb4fbda\agrovet_og_banner_1791813760519.jpg"
logo_src = r"images\logo.png"
icons_dir = r"images\icons"
os.makedirs(icons_dir, exist_ok=True)

# 1. Generate OpenGraph Image (1200x630)
if os.path.exists(banner_src):
    banner = Image.open(banner_src)
    og_img = banner.resize((1200, 630), Image.Resampling.LANCZOS)
    og_path = os.path.join("images", "og-image.jpg")
    og_img.save(og_path, quality=92, optimize=True)
    print(f"[OK] Generated {og_path} (1200x630)")

# 2. Extract and refine Shield Emblem from logo.png
logo = Image.open(logo_src).convert("RGBA")
# Shield is roughly in the (15, 15, 87, 106) region. Let's find exact bounds
shield_raw = logo.crop((12, 12, 90, 110))
bbox = shield_raw.split()[3].getbbox()
shield = shield_raw.crop(bbox) # tight crop around emblem
sw, sh = shield.size
print(f"Extracted emblem size: {sw}x{sh}")

# Helper to center emblem on a square background
def create_icon(size, bg_color=None, padding_ratio=0.18):
    if bg_color:
        icon = Image.new("RGBA", (size, size), bg_color)
    else:
        icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    avail_size = int(size * (1 - 2 * padding_ratio))
    # Scale emblem keeping aspect ratio
    scale = min(avail_size / sw, avail_size / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    scaled_shield = shield.resize((nw, nh), Image.Resampling.LANCZOS)
    
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    icon.paste(scaled_shield, (ox, oy), scaled_shield)
    return icon

# 3. Create Favicon PNGs (transparent background)
fav16 = create_icon(16, padding_ratio=0.1)
fav16.save(os.path.join(icons_dir, "favicon-16x16.png"))

fav32 = create_icon(32, padding_ratio=0.1)
fav32.save(os.path.join(icons_dir, "favicon-32x32.png"))

fav48 = create_icon(48, padding_ratio=0.1)
fav48.save(os.path.join(icons_dir, "favicon-48x48.png"))

# 4. Create root favicon.ico (containing 16, 32, 48 sizes)
fav_ico = create_icon(256, padding_ratio=0.12)
fav_ico.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("[OK] Generated root favicon.ico (multi-size ICO)")

# 5. Create Apple Touch Icon (180x180, warm cream #E6DFCD or dark green #1E3A2B rounded aesthetic)
# Apple touch icons typically look crisp with an opaque background
apple_icon = create_icon(180, bg_color=(230, 223, 205, 255), padding_ratio=0.18)
apple_icon.save(os.path.join(icons_dir, "apple-touch-icon.png"))
print("[OK] Generated images/icons/apple-touch-icon.png (180x180)")

# 6. Create PWA Manifest Icons (192x192 and 512x512)
pwa_192 = create_icon(192, bg_color=(30, 58, 43, 255), padding_ratio=0.20)
pwa_192.save(os.path.join(icons_dir, "icon-192.png"))
print("[OK] Generated images/icons/icon-192.png (192x192)")

pwa_512 = create_icon(512, bg_color=(30, 58, 43, 255), padding_ratio=0.20)
pwa_512.save(os.path.join(icons_dir, "icon-512.png"))
print("[OK] Generated images/icons/icon-512.png (512x512)")

print("All brand assets generated successfully!")
