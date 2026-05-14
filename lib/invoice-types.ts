export interface InvoiceItem {
  description: string
  qty: number
  price: number
}

export interface CustomField {
  label: string
  value: string
}

export interface InvoiceData {
  serialNumber: number
  templateId: string
  accentColor: string

  companyName: string
  companyAddress: string
  companyLogoUrl?: string | null
  companySignatureUrl?: string | null
  companyFields: CustomField[]

  clientName: string
  clientAddress: string
  clientFields: CustomField[]

  date: string
  dueDate?: string | null
  currency: string
  notes?: string | null
  terms?: string | null

  items: InvoiceItem[]

  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number

  status: string
}

export const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
]

export function getCurrencySymbol(currency: string): string {
  return CURRENCIES.find((c) => c.value === currency)?.symbol || "$"
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toFixed(2)}`
}

export interface ColorPreset {
  name: string
  color: string
}

export interface TemplateInfo {
  id: string
  name: string
  description: string
  mode: "light" | "dark"
  presets: ColorPreset[]
  category: "professional" | "creative" | "dark" | "minimal" | "specialty"
}

const defaultLightPresets: ColorPreset[] = [
  { name: "Blue", color: "#2563eb" },
  { name: "Emerald", color: "#059669" },
  { name: "Violet", color: "#7c3aed" },
  { name: "Rose", color: "#e11d48" },
  { name: "Amber", color: "#d97706" },
]

const defaultDarkPresets: ColorPreset[] = [
  { name: "Neon Blue", color: "#60a5fa" },
  { name: "Neon Green", color: "#34d399" },
  { name: "Neon Purple", color: "#a78bfa" },
  { name: "Neon Pink", color: "#f472b6" },
  { name: "Neon Yellow", color: "#fbbf24" },
]

export const TEMPLATES: TemplateInfo[] = [
  // ─── Professional ───
  { id: "classic",         name: "Classic",          description: "Traditional professional layout",   mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "modern",          name: "Modern",           description: "Full-width accent header",          mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "compact",         name: "Compact",          description: "Dense layout for many items",       mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "professional",    name: "Professional",     description: "Standard corporate look",           mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "enterprise",      name: "Enterprise",       description: "High-density data layout",          mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "saas",            name: "SaaS",             description: "Modern software company style",     mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "swiss-minimalist",name: "Swiss Minimalist", description: "Strict grid, bold sans-serif",      mode: "light", category: "professional", presets: [{ name: "Red", color: "#ff0000" }, { name: "Black", color: "#000000" }, { name: "Blue", color: "#0000ff" }, { name: "Yellow", color: "#ffff00" }, { name: "Green", color: "#00ff00" }] },
  { id: "flat-design",     name: "Flat Design",      description: "Solid colors, no shadows",          mode: "light", category: "professional", presets: defaultLightPresets },
  { id: "material-design", name: "Material Design",  description: "Google's classic card interface",   mode: "light", category: "professional", presets: defaultLightPresets },

  // ─── Minimal ───
  { id: "minimal",         name: "Minimal",          description: "Clean with lots of whitespace",     mode: "light", category: "minimal", presets: defaultLightPresets },
  { id: "bold",            name: "Bold",             description: "Large accent title, thick headers", mode: "light", category: "minimal", presets: defaultLightPresets },
  { id: "monochrome",      name: "Monochrome",       description: "Clean black and white design",      mode: "light", category: "minimal", presets: [{ name: "Black", color: "#000000" }, { name: "Slate", color: "#334155" }, { name: "Zinc", color: "#3f3f46" }, { name: "Neutral", color: "#404040" }, { name: "Stone", color: "#44403c" }] },
  { id: "neumorphism",     name: "Neumorphism",      description: "Soft UI, inner shadows",            mode: "light", category: "minimal", presets: defaultLightPresets },
  { id: "claymorphism",    name: "Claymorphism",     description: "Soft, puffy UI elements",           mode: "light", category: "minimal", presets: defaultLightPresets },
  { id: "organic",         name: "Organic",          description: "Fluid shapes and calm colors",      mode: "light", category: "minimal", presets: [{ name: "Moss", color: "#8a9a5b" }, { name: "Sand", color: "#c2b280" }, { name: "Ocean", color: "#006994" }, { name: "Sky", color: "#87ceeb" }, { name: "Earth", color: "#8b4513" }] },

  // ─── Dark ───
  { id: "modern-dark",     name: "Modern Dark",      description: "Sleek dark interface",              mode: "dark",  category: "dark", presets: defaultDarkPresets },
  { id: "terminal",        name: "Terminal",         description: "Hacker terminal aesthetic",         mode: "dark",  category: "dark", presets: [{ name: "Matrix Green", color: "#00ff00" }, { name: "Amber", color: "#ffb000" }, { name: "Cyan", color: "#00ffff" }, { name: "Magenta", color: "#ff00ff" }, { name: "White", color: "#ffffff" }] },
  { id: "kinetic",         name: "Kinetic",          description: "Dynamic and energetic",             mode: "dark",  category: "dark", presets: defaultDarkPresets },
  { id: "bold-typography", name: "Bold Typography",  description: "Typeface-driven design",            mode: "dark",  category: "dark", presets: defaultDarkPresets },
  { id: "cyberpunk",       name: "Cyberpunk",        description: "Neon on dark backgrounds",          mode: "dark",  category: "dark", presets: [{ name: "Neon Pink", color: "#ff00ff" }, { name: "Neon Blue", color: "#00ffff" }, { name: "Neon Yellow", color: "#ffff00" }, { name: "Neon Green", color: "#00ff00" }, { name: "Neon Purple", color: "#8a2be2" }] },
  { id: "web3",            name: "Web3",             description: "Gradients and dark mode",           mode: "dark",  category: "dark", presets: defaultDarkPresets },
  { id: "minimal-dark",    name: "Minimal Dark",     description: "Clean lines, dark background",      mode: "dark",  category: "dark", presets: defaultDarkPresets },

  // ─── Creative ───
  { id: "bauhaus",         name: "Bauhaus",          description: "Geometric shapes, primary colors",  mode: "light", category: "creative", presets: [{ name: "Red", color: "#e63946" }, { name: "Blue", color: "#1d3557" }, { name: "Yellow", color: "#f4a261" }, { name: "Navy", color: "#457b9d" }, { name: "Teal", color: "#2a9d8f" }] },
  { id: "neo-brutalism",   name: "Neo Brutalism",    description: "Harsh borders, bold colors",        mode: "light", category: "creative", presets: [{ name: "Hot Pink", color: "#ff00ff" }, { name: "Cyan", color: "#00ffff" }, { name: "Yellow", color: "#ffff00" }, { name: "Lime", color: "#00ff00" }, { name: "Orange", color: "#ff8800" }] },
  { id: "playful-geometric",name:"Playful Geometric",description: "Fun shapes and friendly colors",    mode: "light", category: "creative", presets: [{ name: "Coral", color: "#ff7f50" }, { name: "Sky", color: "#87ceeb" }, { name: "Mint", color: "#98ff98" }, { name: "Lavender", color: "#e6e6fa" }, { name: "Peach", color: "#ffe5b4" }] },
  { id: "maximalism",      name: "Maximalism",       description: "Loud, colorful, busy",              mode: "light", category: "creative", presets: [{ name: "Magenta", color: "#ff00ff" }, { name: "Yellow", color: "#ffff00" }, { name: "Cyan", color: "#00ffff" }, { name: "Red", color: "#ff0000" }, { name: "Lime", color: "#00ff00" }] },
  { id: "sketch",          name: "Sketch",           description: "Hand-drawn aesthetic",              mode: "light", category: "creative", presets: [{ name: "Pencil", color: "#2d2d2d" }, { name: "Blue Pen", color: "#0000ff" }, { name: "Red Pen", color: "#ff0000" }, { name: "Green Pen", color: "#008000" }, { name: "Highlighter", color: "#ffff00" }] },
  { id: "vaporwave",       name: "Vaporwave",        description: "80s retro-futurism",                mode: "dark",  category: "creative", presets: [{ name: "Magenta", color: "#ff00ff" }, { name: "Cyan", color: "#00ffff" }, { name: "Purple", color: "#800080" }, { name: "Pink", color: "#ffc0cb" }, { name: "Teal", color: "#008080" }] },

  // ─── Specialty ───
  { id: "luxury",          name: "Luxury",           description: "Elegant serif, gold accents",       mode: "light", category: "specialty", presets: [{ name: "Gold", color: "#d4af37" }, { name: "Silver", color: "#c0c0c0" }, { name: "Bronze", color: "#cd7f32" }, { name: "Platinum", color: "#e5e4e2" }, { name: "Rose Gold", color: "#b76e79" }] },
  { id: "academia",        name: "Academia",         description: "Classic university layout",         mode: "light", category: "specialty", presets: [{ name: "Crimson", color: "#990000" }, { name: "Navy", color: "#000080" }, { name: "Forest", color: "#228b22" }, { name: "Gold", color: "#ffd700" }, { name: "Purple", color: "#800080" }] },
  { id: "art-deco",        name: "Art Deco",         description: "1920s glamour and geometry",        mode: "dark",  category: "specialty", presets: [{ name: "Gold", color: "#d4af37" }, { name: "Silver", color: "#c0c0c0" }, { name: "Emerald", color: "#50c878" }, { name: "Sapphire", color: "#0f52ba" }, { name: "Ruby", color: "#e0115f" }] },
  { id: "newsprint",       name: "Newsprint",        description: "Classic newspaper editorial look",  mode: "light", category: "specialty", presets: [{ name: "Ink", color: "#111111" }, { name: "Charcoal", color: "#36454F" }, { name: "Sepia", color: "#704214" }, { name: "Crimson", color: "#990000" }, { name: "Navy", color: "#000080" }] },
  { id: "botanical",       name: "Botanical",        description: "Earthy tones and organic feel",     mode: "light", category: "specialty", presets: [{ name: "Sage", color: "#8A9A5B" }, { name: "Terracotta", color: "#E2725B" }, { name: "Ochre", color: "#CC7722" }, { name: "Olive", color: "#808000" }, { name: "Forest", color: "#228B22" }] },
  { id: "industrial",      name: "Industrial",       description: "Utilitarian and rugged",            mode: "light", category: "specialty", presets: [{ name: "Steel", color: "#4682b4" }, { name: "Rust", color: "#b7410e" }, { name: "Concrete", color: "#808080" }, { name: "Caution", color: "#ffd700" }, { name: "Safety Orange", color: "#ff6600" }] },
  { id: "retro",           name: "Retro",            description: "70s style typography and colors",   mode: "light", category: "specialty", presets: [{ name: "Avocado", color: "#568203" }, { name: "Mustard", color: "#ffdb58" }, { name: "Burnt Orange", color: "#cc5500" }, { name: "Brown", color: "#964b00" }, { name: "Teal", color: "#008080" }] },
]

export const TEMPLATE_IDS = TEMPLATES.map(t => t.id)
export type TemplateId = string

