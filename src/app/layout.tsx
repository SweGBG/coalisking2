import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500.css";
import "./globals.css";
import { LangProvider } from "@/lib/LangContext";

const SITE = "https://coalisking.se";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Coal is King — Authentic Charcoal Grill Stockholm",
  description:
    "Äkta kolgrillat kött i hjärtat av Stockholm. Ribeye, T-bone, revbensspjäll — grillat över riktigt kol vid 800°C. Boka bord på Kungsgatan 14.",
  keywords: ["kolgrill Stockholm", "charcoal grill", "steakhouse Stockholm", "dry-aged", "BBQ Stockholm", "boka bord"],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    alternateLocale: "en_GB",
    url: SITE,
    siteName: "Coal is King",
    title: "Coal is King — Authentic Charcoal Grill Stockholm",
    description: "Äkta kolgrillat kött vid 800°C. Ribeye, T-bone, burnt ends — boka bord på Kungsgatan 14, Stockholm.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Coal is King" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coal is King — Authentic Charcoal Grill Stockholm",
    description: "Äkta kolgrillat kött vid 800°C i Stockholm.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0C0A09",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD — Restaurant + FAQPage (AEO: syns i Google AI Overview & LLM-svar)
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Coal is King",
  url: SITE,
  image: `${SITE}/logo.png`,
  servesCuisine: ["Barbecue", "Steakhouse", "Grill"],
  priceRange: "$$-$$$",
  telephone: "+46-8-123-456-78",
  email: "hej@coalisking.se",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kungsgatan 14",
    postalCode: "111 35",
    addressLocality: "Stockholm",
    addressCountry: "SE",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "12:00", closes: "23:00" },
  ],
  acceptsReservations: "True",
  foundingDate: "2019",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Behöver jag boka bord på Coal is King?",
      acceptedAnswer: { "@type": "Answer", text: "Vi rekommenderar bokning, särskilt fredag–lördag. Drop-in fungerar oftast vardagar före kl 18." },
    },
    {
      "@type": "Question",
      name: "Har Coal is King vegetariska alternativ?",
      acceptedAnswer: { "@type": "Answer", text: "Ja — grillad halloumi, kolgrillade grönsaker, rostad majs och tryffelfritar." },
    },
    {
      "@type": "Question",
      name: "Kan Coal is King hantera allergier?",
      acceptedAnswer: { "@type": "Answer", text: "Absolut. Ange allergier i bokningsförfrågan så förbereder köket. Gluten, laktos och nötter hanteras dagligen." },
    },
    {
      "@type": "Question",
      name: "Tar Coal is King emot stora sällskap?",
      acceptedAnswer: { "@type": "Answer", text: "Upp till 12 personer i ordinarie matsal. För större sällskap, maila hej@coalisking.se." },
    },
    {
      "@type": "Question",
      name: "Varför grillar Coal is King över kol och inte gas?",
      acceptedAnswer: { "@type": "Answer", text: "Kol når 800°C och ger en Maillard-reaktion och röksmak som gas inte kommer i närheten av." },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
