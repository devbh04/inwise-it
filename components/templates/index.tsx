import { InvoiceData } from "@/lib/invoice-types"
import { ClassicTemplate } from "./classic"
import { ModernTemplate } from "./modern"
import { MinimalTemplate } from "./minimal"
import { CompactTemplate } from "./compact"
import { BoldTemplate } from "./bold"
import { DynamicTemplate } from "./dynamic-template"

interface TemplateProps {
  data: InvoiceData
}

const originalTemplateMap: Record<string, React.ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  compact: CompactTemplate,
  bold: BoldTemplate,
}

export function InvoicePreview({ data }: TemplateProps) {
  const Original = originalTemplateMap[data.templateId]
  if (Original) return <Original data={data} />
  return <DynamicTemplate data={data} />
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate, CompactTemplate, BoldTemplate, DynamicTemplate }
