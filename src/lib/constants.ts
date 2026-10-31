export const APP_CONFIG = {
  name: "DigitalHub",
  tagline: "Digital Products & Services",
  description: "Your trusted partner for digital services, AI subscriptions, software licenses and courses in Bangladesh.",
  currency: "BDT",
  currencySymbol: "৳",
  contact: {
    email: "info@digitalhub.com",
    phone: "+880 1873-168818",
    address: "Chandanaish 4370, Chittagong, Bangladesh",
    supportHours: "Support: 24/7 Available",
  },
  social: {
    facebook: "https://www.facebook.com/khaledwali7ra",
    instagram: "https://www.instagram.com/adonlineghor/",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.link/xyj473",
    telegram: "https://t.me/digitalhub",
  },
};

export const PRODUCT_TYPES = {
  DIGITAL_SUBSCRIPTION: "Digital Subscription",
  DIGITAL_DOWNLOAD: "Digital Download",
  DIGITAL_SERVICE: "Digital Service",
  ONLINE_COURSE: "Online Course",
  LICENSE_SOFTWARE: "License-based Software",
  DIGITAL_PRODUCT: "Digital Product",
} as const;

export const ORDER_STATUSES = {
  PENDING: "PENDING",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PAYMENT_UNDER_REVIEW: "PAYMENT_UNDER_REVIEW",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const;

export const PAYMENT_METHODS = {
  BKASH: "bkash",
  NAGAD: "nagad",
  ROCKET: "rocket",
  COD: "cod",
} as const;

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
} as const;

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "All Products", href: "/products" },
      { name: "AI Subscriptions", href: "/categories/ai-subscriptions" },
      { name: "Premium Apps", href: "/categories/premium-apps" },
      { name: "Software", href: "/categories/software" },
      { name: "Digital Tools & Templates", href: "/categories/digital-products" },
    ],
  },
  {
    name: "Services",
    href: "/categories/digital-marketing",
    children: [
      { name: "Digital Marketing", href: "/categories/digital-marketing" },
      { name: "Web Development", href: "/categories/web-development" },
    ],
  },
  { name: "Courses", href: "/categories/online-courses" },
  { name: "About Us", href: "/about" },
  { name: "Support", href: "/support" },
  { name: "Contact", href: "/contact" },
];
