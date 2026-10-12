import os
import re

files_metadata = {
    "index.html": {
        "title": "Agrovet Ltd | Certified Farm Inputs & Agrochemicals in Nairobi, Kenya",
        "desc": "Agrovet Ltd (agrovet.ltd) — Kenya's trusted online agrovet store. Buy certified herbicides, insecticides, fungicides, seeds, fertilizers and farm tools with delivery across all 47 counties.",
        "url": "https://agrovet.ltd/"
    },
    "shop.html": {
        "title": "Shop Farm Inputs Catalogue | Agrovet Ltd Kenya",
        "desc": "Browse Kenya's full range of certified herbicides, insecticides, fungicides, vegetable seeds, fertilizers and sprayers. Filter by crop, pest, and pack size.",
        "url": "https://agrovet.ltd/shop.html"
    },
    "product.html": {
        "title": "Product Details & Dosage Guide | Agrovet Ltd Kenya",
        "desc": "Certified agricultural inputs and crop chemicals with dosage, pre-harvest interval (PHI) and safety directions. Agrovet Ltd Nairobi.",
        "url": "https://agrovet.ltd/product.html"
    },
    "cart.html": {
        "title": "Shopping Cart & Checkout | Agrovet Ltd Kenya",
        "desc": "Review your farm input order, calculate county delivery rates, and complete payment with M-Pesa Daraja STK Push or Pay on Delivery.",
        "url": "https://agrovet.ltd/cart.html"
    },
    "about.html": {
        "title": "About Us | Agrovet Ltd Kenya — Trusted Agricultural Partner",
        "desc": "Learn about Agrovet Ltd Kenya. Licensed PCPB agrochemical distributors and KEPHIS certified seed stockists on Kirinyaga Road, Nairobi.",
        "url": "https://agrovet.ltd/about.html"
    },
    "contact.html": {
        "title": "Contact Us & Agronomist Support | Agrovet Ltd Nairobi",
        "desc": "Reach Agrovet Ltd Nairobi via phone (+254 720 263 503), WhatsApp, email or visit our store on Kirinyaga Road. Free agronomist advice.",
        "url": "https://agrovet.ltd/contact.html"
    },
    "blog.html": {
        "title": "Farming Guides & Pest Management Blog | Agrovet Ltd Kenya",
        "desc": "Practical agronomy guides on pest scouting, fall armyworm control, tomato blight management, and soil fertilization in Kenya.",
        "url": "https://agrovet.ltd/blog.html"
    },
    "delivery-returns.html": {
        "title": "Delivery Rates & Return Policy Across 47 Counties | Agrovet Ltd Kenya",
        "desc": "Reliable courier and parcel delivery across all 47 Kenyan counties within 24-48 hours. Safe chemical packaging and return policy.",
        "url": "https://agrovet.ltd/delivery-returns.html"
    },
    "terms.html": {
        "title": "Terms of Service & Farmer Protection | Agrovet Ltd Kenya",
        "desc": "Official terms of service for Agrovet Ltd online store. Certified inputs, genuine crop protection, and transparent pricing.",
        "url": "https://agrovet.ltd/terms.html"
    },
    "privacy.html": {
        "title": "Privacy Policy | Agrovet Ltd Kenya",
        "desc": "How Agrovet Ltd collects, uses, and safeguards farmer data in accordance with Kenya Data Protection Act 2019.",
        "url": "https://agrovet.ltd/privacy.html"
    },
    "credits.html": {
        "title": "Attributions & Technical Credits | Agrovet Ltd Kenya",
        "desc": "Open-source software, standards, and image attributions for Agrovet Ltd web platform.",
        "url": "https://agrovet.ltd/credits.html"
    },
    "404.html": {
        "title": "Page Not Found (404) | Agrovet Ltd Kenya",
        "desc": "The page you requested could not be found. Return to Agrovet Ltd catalog to shop certified farm inputs.",
        "url": "https://agrovet.ltd/404.html"
    },
    "500.html": {
        "title": "System Notice (500) | Agrovet Ltd Kenya",
        "desc": "Internal server error notice. Agrovet Ltd technical team is actively investigating.",
        "url": "https://agrovet.ltd/500.html"
    }
}

admin_files = [
    "admin.html",
    "templates/admin-login.html",
    "templates/admin-dashboard.html"
]

def make_brand_block(meta):
    return f"""  <!-- Favicons & Mobile Web App Manifest -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1E3A2B">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{meta['url']}">
  <meta property="og:title" content="{meta['title']}">
  <meta property="og:description" content="{meta['desc']}">
  <meta property="og:image" content="https://agrovet.ltd/images/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Agrovet Ltd Kenya — Certified Seeds, Fertilizers & Agrochemicals">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{meta['url']}">
  <meta name="twitter:title" content="{meta['title']}">
  <meta name="twitter:description" content="{meta['desc']}">
  <meta name="twitter:image" content="https://agrovet.ltd/images/og-image.jpg">
"""

admin_block = """  <!-- Favicons & Mobile Web App Manifest -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1E3A2B">
"""

for filepath, meta in files_metadata.items():
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Remove existing partial OG tags if present to prevent duplicates
    html = re.sub(r'\s*<!-- Open Graph / Meta -->.*?(?=<link|<script|<style|\n\n)', '', html, flags=re.DOTALL)
    
    # Inject brand block right before the master stylesheet link or first <style> tag
    if 'rel="icon"' not in html:
        block = make_brand_block(meta)
        if '<link rel="stylesheet"' in html:
            html = html.replace('<link rel="stylesheet"', block + '  <link rel="stylesheet"', 1)
        elif '</head>' in html:
            html = html.replace('</head>', block + '</head>', 1)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[OK] Injected brand tags into {filepath}")

for admin_path in admin_files:
    if not os.path.exists(admin_path):
        continue
    with open(admin_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Remove any fallback SVG data favicon
    html = re.sub(r'<link rel="icon" type="image/svg\+xml" href="data:image/svg\+xml,[^>]+>', '', html)

    if 'rel="icon"' not in html:
        if '<link rel="stylesheet"' in html:
            html = html.replace('<link rel="stylesheet"', admin_block + '  <link rel="stylesheet"', 1)
        elif '<style>' in html:
            html = html.replace('<style>', admin_block + '  <style>', 1)
        elif '</head>' in html:
            html = html.replace('</head>', admin_block + '</head>', 1)

        with open(admin_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[OK] Injected admin brand tags into {admin_path}")

print("Brand tags injection complete!")
