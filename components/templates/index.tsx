import { InvoiceData, TemplateId } from "@/lib/invoice-types"
import { ClassicTemplate } from "./classic"
import { ModernTemplate } from "./modern"
import { MinimalTemplate } from "./minimal"
import { CompactTemplate } from "./compact"
import { BoldTemplate } from "./bold"

interface TemplateProps {
  data: InvoiceData
}

const templateMap: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  compact: CompactTemplate,
  bold: BoldTemplate,
}

export function InvoicePreview({ data }: TemplateProps) {
  const Template = templateMap[data.templateId as TemplateId] || ClassicTemplate
  return <Template data={data} />
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate, CompactTemplate, BoldTemplate }
