"use client"

import React from "react"
import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import { createTw } from "react-pdf-tailwind"
import { InvoiceData, formatCurrency } from "@/lib/invoice-types"

const tw = createTw({
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem",
      },
    },
  },
})

export function InvoicePdfDocument({ data }: { data: InvoiceData }) {
  const inv = `${data.invoicePrefix || "INV"}-${String(data.serialNumber).padStart(4, "0")}`

  return (
    <Document
      title={inv}
      author={data.companyName}
      creator={data.companyName}
      producer="Invoicely"
    >
      <Page size="A4" style={{ ...tw("p-8 text-sm text-black bg-white"), fontFamily: "Helvetica" }}>
        {/* Header */}
        <View style={tw("flex flex-row justify-between items-start mb-6")}>
          <View style={tw("flex flex-row items-center gap-3")}>
            {data.companyLogoUrl && (
              <Image src={data.companyLogoUrl} style={{ width: 48, height: 48, objectFit: "contain" }} />
            )}
            <Text style={{ ...tw("text-xl font-bold"), color: data.accentColor }}>
              Invoice {inv}
            </Text>
          </View>
          {data.companySignatureUrl && (
            <Image src={data.companySignatureUrl} style={{ width: 60, height: 30, objectFit: "contain" }} />
          )}
        </View>

        {/* Meta */}
        <View style={tw("flex flex-col gap-1 mb-5")}>
          <View style={tw("flex flex-row items-center gap-1")}>
            <Text style={tw("text-2xs font-semibold w-24")}>Serial Number</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.serialNumber.toString().padStart(4, "0")}</Text>
          </View>
          <View style={tw("flex flex-row items-center gap-1")}>
            <Text style={tw("text-2xs font-semibold w-24")}>Date</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.date}</Text>
          </View>
          {data.dueDate && (
            <View style={tw("flex flex-row items-center gap-1")}>
              <Text style={tw("text-2xs font-semibold w-24")}>Due Date</Text>
              <Text style={tw("text-2xs text-neutral-500")}>{data.dueDate}</Text>
            </View>
          )}
          <View style={tw("flex flex-row items-center gap-1")}>
            <Text style={tw("text-2xs font-semibold w-24")}>Currency</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.currency}</Text>
          </View>
        </View>

        {/* Billed By / Billed To */}
        <View style={tw("flex flex-row gap-3 mb-6")}>
          <View style={tw("flex flex-col gap-1 p-3 w-1/2 rounded bg-neutral-100")}>
            <Text style={{ ...tw("font-semibold text-xs"), color: data.accentColor }}>Billed By</Text>
            <Text style={tw("text-2xs font-semibold")}>{data.companyName || "—"}</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.companyAddress || "—"}</Text>
            {data.companyFields.map((f, i) => (
              <View key={i} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-semibold")}>{f.label}</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{f.value}</Text>
              </View>
            ))}
          </View>
          <View style={tw("flex flex-col gap-1 p-3 w-1/2 rounded bg-neutral-100")}>
            <Text style={{ ...tw("font-semibold text-xs"), color: data.accentColor }}>Billed To</Text>
            <Text style={tw("text-2xs font-semibold")}>{data.clientName || "—"}</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.clientAddress || "—"}</Text>
            {data.clientFields.map((f, i) => (
              <View key={i} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-semibold")}>{f.label}</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{f.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items Table */}
        <View style={tw("mb-6")}>
          <View style={{ ...tw("flex flex-row px-3 py-2 rounded text-2xs font-bold text-white"), backgroundColor: data.accentColor }}>
            <Text style={tw("w-[50%]")}>Item</Text>
            <Text style={tw("w-[15%] text-center")}>Qty</Text>
            <Text style={tw("w-[17.5%] text-right")}>Price</Text>
            <Text style={tw("w-[17.5%] text-right")}>Total</Text>
          </View>
          {data.items.length === 0 ? (
            <View style={tw("px-3 py-4")}>
              <Text style={tw("text-2xs text-neutral-400 text-center")}>No items added</Text>
            </View>
          ) : (
            data.items.map((item, i) => (
              <View key={i} style={tw(`flex flex-row px-3 py-2 text-2xs ${i % 2 === 1 ? "bg-neutral-50" : ""}`)}>
                <View style={tw("w-[50%]")}><Text style={tw("font-semibold")}>{item.title || "—"}</Text>{item.description ? <Text style={tw("text-neutral-400")}>{item.description}</Text> : null}</View>
                <Text style={tw("w-[15%] text-center")}>{item.qty}</Text>
                <Text style={tw("w-[17.5%] text-right")}>{formatCurrency(item.price, data.currency)}</Text>
                <Text style={tw("w-[17.5%] text-right")}>{formatCurrency(item.qty * item.discountedPrice, data.currency)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Totals */}
        <View style={tw("flex flex-row justify-end mb-6")}>
          <View style={tw("w-[45%] flex flex-col gap-1")}>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={tw("text-2xs font-semibold")}>Subtotal</Text>
              <Text style={tw("text-2xs text-neutral-500")}>{formatCurrency(data.subtotal, data.currency)}</Text>
            </View>
            {data.discount > 0 && (
              <View style={tw("flex flex-row justify-between")}>
                <Text style={tw("text-2xs font-semibold")}>Discount</Text>
                <Text style={tw("text-2xs text-neutral-500")}>-{formatCurrency(data.discount, data.currency)}</Text>
              </View>
            )}
            {data.taxRate > 0 && (
              <View style={tw("flex flex-row justify-between")}>
                <Text style={tw("text-2xs font-semibold")}>Tax ({data.taxRate}%)</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{formatCurrency(data.taxAmount, data.currency)}</Text>
              </View>
            )}
            <View style={tw("border-t border-neutral-200 mt-1 pt-1")}>
              <View style={tw("flex flex-row justify-between")}>
                <Text style={tw("text-xs font-bold")}>Total</Text>
                <Text style={{ ...tw("text-lg font-bold"), color: data.accentColor }}>
                  {formatCurrency(data.total, data.currency)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Terms, Notes & Terms */}
        {data.paymentTerms && (
          <View style={tw("mb-3")}>
            <Text style={{ ...tw("text-xs font-semibold mb-1"), color: data.accentColor }}>Payment Terms</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.paymentTerms}</Text>
          </View>
        )}
        {data.notes && (
          <View style={tw("mb-3")}>
            <Text style={{ ...tw("text-xs font-semibold mb-1"), color: data.accentColor }}>Notes</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.notes}</Text>
          </View>
        )}
        {data.terms && (
          <View>
            <Text style={{ ...tw("text-xs font-semibold mb-1"), color: data.accentColor }}>Terms & Conditions</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.terms}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
