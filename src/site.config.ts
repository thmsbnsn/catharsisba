export const siteConfig = {
  name: "Catharsis Body Art",
  tagline: "Upscale & modern tattoo and piercing studio in Brownsburg, IN",
  // Use VITE_SITE_URL so staging/prod .env files control the base URL
  url: import.meta.env.VITE_SITE_URL,
  logo: {
    svg: "/images/branding/colored_logo.svg",
    avif: "/images/branding/cba-logo-nobackground.avif",
  },
  favicon: {
    webp: "/images/branding/cba-favicon-512.webp",
    avif: "/images/branding/cba-favicon-512.avif",
  },
  address: "5801 N. Green St. Suite 106, Brownsburg, IN 46112",
  phone: "(317) 286-7092",
  email: "info@catharsisba.com",
};
