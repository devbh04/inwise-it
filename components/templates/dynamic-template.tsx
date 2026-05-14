import { InvoiceData, TEMPLATES } from "@/lib/invoice-types"
import { MonochromeTheme, BauhausTheme, NewsprintTheme, LuxuryTheme, SwissMinimalistTheme, AcademiaTheme, SketchTheme, RetroTheme, BotanicalTheme, OrganicTheme } from "./themes-light-a"
import { SaasTheme, FlatDesignTheme, MaterialDesignTheme, NeoBrutalismTheme, PlayfulGeometricTheme, ClaymorphismTheme, ProfessionalTheme, EnterpriseTheme, IndustrialTheme, NeumorphismTheme, MaximalismTheme } from "./themes-light-b"
import { ModernDarkTheme, TerminalTheme, KineticTheme, ArtDecoTheme, BoldTypographyTheme, CyberpunkTheme, Web3Theme, MinimalDarkTheme, VaporwaveTheme } from "./themes-dark"

const themeMap: Record<string, React.ComponentType<{ data: InvoiceData }>> = {
  "monochrome": MonochromeTheme,
  "bauhaus": BauhausTheme,
  "modern-dark": ModernDarkTheme,
  "newsprint": NewsprintTheme,
  "saas": SaasTheme,
  "luxury": LuxuryTheme,
  "terminal": TerminalTheme,
  "swiss-minimalist": SwissMinimalistTheme,
  "kinetic": KineticTheme,
  "flat-design": FlatDesignTheme,
  "art-deco": ArtDecoTheme,
  "material-design": MaterialDesignTheme,
  "neo-brutalism": NeoBrutalismTheme,
  "bold-typography": BoldTypographyTheme,
  "academia": AcademiaTheme,
  "cyberpunk": CyberpunkTheme,
  "web3": Web3Theme,
  "playful-geometric": PlayfulGeometricTheme,
  "minimal-dark": MinimalDarkTheme,
  "claymorphism": ClaymorphismTheme,
  "professional": ProfessionalTheme,
  "botanical": BotanicalTheme,
  "vaporwave": VaporwaveTheme,
  "enterprise": EnterpriseTheme,
  "sketch": SketchTheme,
  "industrial": IndustrialTheme,
  "neumorphism": NeumorphismTheme,
  "organic": OrganicTheme,
  "maximalism": MaximalismTheme,
  "retro": RetroTheme,
}

export function DynamicTemplate({ data }: { data: InvoiceData }) {
  const Theme = themeMap[data.templateId]
  if (Theme) return <Theme data={data} />
  // Fallback
  const Fallback = themeMap["professional"]
  return <Fallback data={data} />
}
