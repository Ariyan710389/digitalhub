import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting DigitalHub database seed...");

  // 1. Admin & Customer Users
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const customerPassword = await bcrypt.hash("Customer@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@digitalhub.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@digitalhub.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      phone: "+880 1712 345678",
    },
  });
  console.log("👤 Admin user seeded:", admin.email);

  const customer = await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {},
    create: {
      name: "Tanvir Ahmed",
      email: "customer@gmail.com",
      password: customerPassword,
      role: "CUSTOMER",
      status: "ACTIVE",
      phone: "+880 1812 987654",
    },
  });
  console.log("👤 Customer user seeded:", customer.email);

  // 2. Categories
  const categoriesData = [
    {
      name: "AI Subscription",
      slug: "ai-subscriptions",
      description: "AI tools & productivity",
      icon: "Bot",
      displayOrder: 1,
    },
    {
      name: "Premium Apps",
      slug: "premium-apps",
      description: "Software & apps",
      icon: "Layers",
      displayOrder: 2,
    },
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "Grow your business",
      icon: "Megaphone",
      displayOrder: 3,
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Websites & solutions",
      icon: "Code",
      displayOrder: 4,
    },
    {
      name: "Online Courses",
      slug: "online-courses",
      description: "Learn new skills",
      icon: "GraduationCap",
      displayOrder: 5,
    },
    {
      name: "Software",
      slug: "software",
      description: "Tools & utilities",
      icon: "Settings",
      displayOrder: 6,
    },
    {
      name: "Digital Products",
      slug: "digital-products",
      description: "Templates & resources",
      icon: "FileText",
      displayOrder: 7,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, isActive: true },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log("📁 Categories seeded (7 categories)");

  // 3. Attributes and Options
  const attributesData = [
    {
      name: "Plan",
      slug: "plan",
      options: ["Basic", "Standard", "Pro", "Premium"],
    },
    {
      name: "Duration",
      slug: "duration",
      options: ["1 Month", "3 Months", "6 Months", "1 Year", "Lifetime"],
    },
    {
      name: "Service Package",
      slug: "service-package",
      options: ["Starter", "Standard", "Premium (30 Days)", "Enterprise"],
    },
    {
      name: "Website Type",
      slug: "website-type",
      options: ["Landing Page", "Portfolio", "Business Website", "E-commerce (5 Pages)"],
    },
    {
      name: "Access Period",
      slug: "access-period",
      options: ["30 Days", "1 Year", "Lifetime Access"],
    },
    {
      name: "License Type",
      slug: "license-type",
      options: ["Personal", "Commercial", "Team License"],
    },
    {
      name: "Format",
      slug: "format",
      options: ["ZIP Bundle", "Figma File", "Source Code", "PDF Guide"],
    },
  ];

  const attributeMap = new Map<string, string>();
  const optionMap = new Map<string, string>();

  for (const attr of attributesData) {
    const attribute = await prisma.productAttribute.upsert({
      where: { slug: attr.slug },
      update: { name: attr.name },
      create: { name: attr.name, slug: attr.slug },
    });
    attributeMap.set(attr.slug, attribute.id);

    for (let i = 0; i < attr.options.length; i++) {
      const optVal = attr.options[i];
      let option = await prisma.attributeOption.findFirst({
        where: { attributeId: attribute.id, value: optVal },
      });
      if (!option) {
        option = await prisma.attributeOption.create({
          data: {
            attributeId: attribute.id,
            value: optVal,
            displayOrder: i,
          },
        });
      }
      optionMap.set(`${attr.slug}:${optVal}`, option.id);
    }
  }
  console.log("🏷️ Attributes and options seeded");

  // 4. Products with Variations (matching the mockup exactly)
  // All prices in Paisa (৳1 = 100 paisa)
  const products = [
    {
      name: "ChatGPT Plus",
      slug: "chatgpt-plus",
      categorySlug: "ai-subscriptions",
      productType: "DIGITAL_SUBSCRIPTION",
      badge: "Popular",
      shortDesc: "Get access to GPT-4, faster responses and more features.",
      fullDesc: "Unlock the full power of OpenAI ChatGPT Plus. Enjoy higher limits, priority access during peak hours, and early access to new AI features including image generation with DALL-E, browsing, code interpreter, and custom GPTs.",
      isFeatured: true,
      isPublished: true,
      regularPrice: 180000, // ৳1,800
      salePrice: 120000, // ৳1,200
      variations: [
        {
          sku: "GPT-1M",
          attrSlug: "duration",
          optVal: "1 Month",
          regularPrice: 180000,
          salePrice: 120000,
          deliveryInstructions: "Official account credentials or invite delivered via email/dashboard within 15 minutes.",
        },
        {
          sku: "GPT-3M",
          attrSlug: "duration",
          optVal: "3 Months",
          regularPrice: 500000,
          salePrice: 340000,
          deliveryInstructions: "Official account credentials or invite delivered via email/dashboard within 15 minutes.",
        },
        {
          sku: "GPT-1Y",
          attrSlug: "duration",
          optVal: "1 Year",
          regularPrice: 1800000,
          salePrice: 1200000,
          deliveryInstructions: "Official account credentials or invite delivered via email/dashboard within 15 minutes.",
        },
      ],
    },
    {
      name: "Adobe Photoshop",
      slug: "adobe-photoshop",
      categorySlug: "premium-apps",
      productType: "LICENSE_SOFTWARE",
      badge: "Best Seller",
      shortDesc: "Professional photo editing and design tools.",
      fullDesc: "Industry-standard image editing software for designers, photographers, and creative artists. Features cloud sync, neural filters, generative fill, and high-resolution layer processing.",
      isFeatured: true,
      isPublished: true,
      regularPrice: 200000, // ৳2,000
      salePrice: 125000, // ৳1,250
      variations: [
        {
          sku: "PS-1Y",
          attrSlug: "duration",
          optVal: "1 Year",
          regularPrice: 200000,
          salePrice: 125000,
          deliveryInstructions: "Adobe Creative Cloud subscription activated on your official email address.",
        },
      ],
    },
    {
      name: "Digital Marketing Package",
      slug: "digital-marketing-package",
      categorySlug: "digital-marketing",
      productType: "DIGITAL_SERVICE",
      badge: "Trending",
      shortDesc: "Social media, SEO, content & ad campaigns.",
      fullDesc: "Complete monthly digital marketing solution for brands and businesses. Includes Facebook & Google Ads management, high-converting copy, weekly graphics, SEO audit, and analytics performance reporting.",
      isFeatured: true,
      isPublished: true,
      regularPrice: 800000, // ৳8,000
      salePrice: 499900, // ৳4,999
      variations: [
        {
          sku: "DM-PREM-30D",
          attrSlug: "service-package",
          optVal: "Premium (30 Days)",
          regularPrice: 800000,
          salePrice: 499900,
          deliveryInstructions: "Our agency team will schedule an onboarding meeting and gather business asset access.",
        },
        {
          sku: "DM-STARTER",
          attrSlug: "service-package",
          optVal: "Starter",
          regularPrice: 500000,
          salePrice: 299900,
          deliveryInstructions: "Social media kickstart kit delivered with dedicated manager.",
        },
      ],
    },
    {
      name: "Web Development",
      slug: "web-development-service",
      categorySlug: "web-development",
      productType: "DIGITAL_SERVICE",
      badge: "Popular",
      shortDesc: "Modern, responsive & custom websites.",
      fullDesc: "Full-scale custom website development crafted with Next.js, React, Tailwind CSS, or WordPress. Includes responsive layouts, speed optimization, secure admin panel, and payment gateway integration.",
      isFeatured: true,
      isPublished: true,
      regularPrice: 1800000, // ৳18,000
      salePrice: 1299900, // ৳12,999
      variations: [
        {
          sku: "WEB-ECOM-5P",
          attrSlug: "website-type",
          optVal: "E-commerce (5 Pages)",
          regularPrice: 1800000,
          salePrice: 1299900,
          deliveryInstructions: "Project kick-off within 24h. Requirements review and wireframe delivery in 3 business days.",
        },
        {
          sku: "WEB-LANDING",
          attrSlug: "website-type",
          optVal: "Landing Page",
          regularPrice: 800000,
          salePrice: 499900,
          deliveryInstructions: "High-converting single-page website ready in 48 hours.",
        },
      ],
    },
    {
      name: "Online Course Bundle",
      slug: "online-course-bundle",
      categorySlug: "online-courses",
      productType: "ONLINE_COURSE",
      badge: "New",
      shortDesc: "Learn digital skills from industry experts.",
      fullDesc: "Comprehensive masterclass bundle covering Full-Stack Web Development, UI/UX Design, and AI Automation with real-world capstone projects and mentor feedback.",
      isFeatured: true,
      isPublished: true,
      regularPrice: 400000, // ৳4,000
      salePrice: 249900, // ৳2,499
      variations: [
        {
          sku: "COURSE-LIFE",
          attrSlug: "access-period",
          optVal: "Lifetime Access",
          regularPrice: 400000,
          salePrice: 249900,
          deliveryInstructions: "Student portal access link and login credentials provided instantly in order details.",
        },
      ],
    },
  ];

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        productType: p.productType,
        badge: p.badge,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        categoryId: categoryId || null,
        stockStatus: "IN_STOCK",
      },
      create: {
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        productType: p.productType,
        badge: p.badge,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        categoryId: categoryId || null,
        stockStatus: "IN_STOCK",
      },
    });

    for (const v of p.variations) {
      let variation = await prisma.productVariation.findFirst({
        where: { productId: product.id, sku: v.sku },
      });

      if (!variation) {
        variation = await prisma.productVariation.create({
          data: {
            productId: product.id,
            sku: v.sku,
            regularPrice: v.regularPrice,
            salePrice: v.salePrice,
            stockStatus: "IN_STOCK",
            isActive: true,
            deliveryInstructions: v.deliveryInstructions,
          },
        });
      }

      const attrId = attributeMap.get(v.attrSlug);
      const optId = optionMap.get(`${v.attrSlug}:${v.optVal}`);

      if (attrId && optId) {
        await prisma.variationOption.upsert({
          where: {
            variationId_attributeId: {
              variationId: variation.id,
              attributeId: attrId,
            },
          },
          update: { optionId: optId },
          create: {
            variationId: variation.id,
            attributeId: attrId,
            optionId: optId,
          },
        });
      }
    }
  }
  console.log("🛍️ Products and variations seeded (5 products matching mockup)");

  // 5. Payment Methods (bKash, Nagad, Rocket, COD)
  const paymentMethods = [
    {
      name: "bKash",
      slug: "bkash",
      displayName: "bKash",
      merchantNumber: "+880 1712 345678",
      accountType: "Personal",
      instructions: "Send Money to the bKash personal number above. After completing the payment, enter your Transaction ID and Sender Number below for immediate verification.",
      isActive: true,
      displayOrder: 1,
    },
    {
      name: "Nagad",
      slug: "nagad",
      displayName: "Nagad",
      merchantNumber: "+880 1712 345678",
      accountType: "Personal",
      instructions: "Send Money to the Nagad personal number above. Enter your Transaction ID and Sender Number below to confirm your payment.",
      isActive: true,
      displayOrder: 2,
    },
    {
      name: "Rocket",
      slug: "rocket",
      displayName: "Rocket",
      merchantNumber: "+880 1712 345678",
      accountType: "Personal",
      instructions: "Send Money to the Rocket number above. Enter the 12-digit transaction ID and sender number to finalize your order.",
      isActive: true,
      displayOrder: 3,
    },
    {
      name: "Cash on Delivery",
      slug: "cod",
      displayName: "Cash on Delivery",
      merchantNumber: null,
      accountType: null,
      instructions: "Available for eligible orders and localized physical deliveries/services. Pay when you receive confirmation.",
      isActive: true,
      displayOrder: 4,
    },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethodSetting.upsert({
      where: { slug: pm.slug },
      update: pm,
      create: pm,
    });
  }
  console.log("💳 Payment methods seeded (bKash, Nagad, Rocket, COD)");

  // 6. Hero Slides
  const slides = [
    {
      headline: "Premium Digital Products & Professional Services",
      description: "Get the best AI tools, premium apps, online courses, web development services and digital marketing solutions — all in one place.",
      ctaText: "Explore Products",
      ctaUrl: "/products",
      badge: "Your Digital Growth Partner",
      displayOrder: 1,
      isActive: true,
    },
    {
      headline: "Supercharge Your Workflow With Modern AI Subscriptions",
      description: "Instant access to ChatGPT Plus, Midjourney, Claude, and developer copilot tools with fast delivery and local payment options in BDT.",
      ctaText: "View AI Tools",
      ctaUrl: "/categories/ai-subscriptions",
      badge: "Instant Delivery",
      displayOrder: 2,
      isActive: true,
    },
  ];

  await prisma.heroSlide.deleteMany({});
  for (const slide of slides) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log("🎠 Hero slides seeded");

  // 7. Site Settings
  const settings = [
    { key: "site_name", value: "DigitalHub", type: "string" },
    { key: "site_tagline", value: "Digital Products & Services", type: "string" },
    { key: "contact_email", value: "info@digitalhub.com", type: "string" },
    { key: "contact_phone", value: "+880 1712 345678", type: "string" },
    { key: "business_address", value: "Dhaka, Bangladesh — 123 Digital Street, Mirpur, Dhaka-1216", type: "string" },
    { key: "support_hours", value: "Support: 24/7 Available", type: "string" },
    { key: "social_facebook", value: "https://facebook.com", type: "string" },
    { key: "social_instagram", value: "https://instagram.com", type: "string" },
    { key: "social_youtube", value: "https://youtube.com", type: "string" },
    { key: "social_whatsapp", value: "https://wa.me/8801712345678", type: "string" },
    { key: "social_telegram", value: "https://t.me/digitalhub", type: "string" },
    { key: "logo_url", value: "/images/logo.jpg", type: "image" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log("⚙️ Site settings seeded");

  // 8. Legal Pages
  const pages = [
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "At DigitalHub, we respect your privacy and protect your personal information. We never share customer data, payment credentials, or personal numbers with unauthorized third parties.",
    },
    {
      slug: "terms-conditions",
      title: "Terms and Conditions",
      content: "By using DigitalHub services and products, you agree to these terms. Digital licenses and subscriptions are issued for the stated period and must not be redistributed or shared beyond personal/team terms.",
    },
    {
      slug: "refund-policy",
      title: "Refund Policy",
      content: "If a digital product, subscription, or software key cannot be delivered or activated within our guaranteed timeframe, a full refund or replacement is provided within 24 hours.",
    },
    {
      slug: "delivery-policy",
      title: "Digital Delivery Policy",
      content: "All digital subscriptions, license keys, and course credentials are sent to your registered account dashboard and email address within 15 to 60 minutes after payment verification.",
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, isPublished: true },
    });
  }
  console.log("📄 Legal pages seeded");

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
