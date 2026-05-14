"use client"

import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

const features = [
  {
    title: "Real-Time Visual Editor",
    description: "Type directly into the invoice. What you see is exactly what your client gets. No abstract forms.",
    colSpan: "col-span-1 md:col-span-2",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  {
    title: "Granular Controls",
    description: "Per-item discounts, custom taxes, multi-line descriptions.",
    colSpan: "col-span-1",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    title: "Asset Manager",
    description: "Upload your company logo and digital signature once. Reuse them infinitely across all templates.",
    colSpan: "col-span-1",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )
  },
  {
    title: "One-Click PDF Export",
    description: "Generate pixel-perfect, high-resolution PDFs instantly. No watermarks, completely free.",
    colSpan: "col-span-1 md:col-span-2",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    )
  }
]

const TEMPLATES = [
  { id: "modern", name: "Modern", color: "from-blue-500 to-cyan-400" },
  { id: "playful", name: "Geometric", color: "from-purple-500 to-pink-500" },
  { id: "classic", name: "Classic", color: "from-emerald-500 to-teal-400" },
]

function LandingContent() {
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0])
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="min-h-svh bg-[#09090b] text-zinc-50 selection:bg-indigo-500/30 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.7)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M5.25 2.25a3 3 0 0 0-3 3v13.5a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V8.25l-6-6H5.25ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Inwise</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="relative rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[100px] translate-x-1/4" 
          />
        </div>

        <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md"
            >
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
              </span>
              Inwise 2.0 is now live
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Billing that looks <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                insanely good.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl"
            >
              Stop wrestling with Word docs and clunky PDF generators. 
              Experience the world's first real-time, high-fidelity invoice editor.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/sign-up"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
              >
                Start Creating Free
                <svg className="size-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </Link>
              <div className="text-xs text-zinc-500 font-medium">No credit card required.</div>
            </motion.div>
          </div>

          {/* Right: Interactive 3D Invoice Mockup */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, rotateX: 5, x: 50 }}
            animate={{ opacity: 1, rotateY: -5, rotateX: 5, x: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative lg:block hidden perspective-1000"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl backdrop-blur-xl transform-gpu transition-transform hover:rotate-y-0 hover:rotate-x-0 duration-500">
              
              <div className="rounded-xl bg-[#1c1c1f] p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <motion.div 
                    onHoverStart={() => setHoveredElement('header')}
                    onHoverEnd={() => setHoveredElement(null)}
                    className={`space-y-2 p-2 rounded-lg transition-colors ${hoveredElement === 'header' ? 'bg-white/5' : ''}`}
                  >
                    <div className="text-2xl font-bold tracking-tight text-white">INVOICE</div>
                    <div className="text-xs text-zinc-500">INV-2024-001</div>
                  </motion.div>
                  <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <div className="size-6 rounded-full border-2 border-white/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    onHoverStart={() => setHoveredElement('billed')}
                    onHoverEnd={() => setHoveredElement(null)}
                    className={`space-y-2 p-2 rounded-lg transition-colors ${hoveredElement === 'billed' ? 'bg-white/5' : ''}`}
                  >
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Billed To</div>
                    <div className="h-3 w-32 rounded bg-white/20" />
                    <div className="h-3 w-24 rounded bg-white/10" />
                  </motion.div>
                </div>

                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <div className="grid grid-cols-4 bg-white/5 px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span className="col-span-2">Description</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Total</span>
                  </div>
                  {[1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      onHoverStart={() => setHoveredElement(`item-${i}`)}
                      onHoverEnd={() => setHoveredElement(null)}
                      className={`grid grid-cols-4 px-4 py-3 border-t border-white/5 transition-colors ${hoveredElement === `item-${i}` ? 'bg-white/5' : ''}`}
                    >
                      <div className="col-span-2 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-white/20" />
                        <div className="h-2 w-1/2 rounded bg-white/10" />
                      </div>
                      <div className="text-right"><div className="h-3 w-4 ml-auto rounded bg-white/20" /></div>
                      <div className="text-right"><div className="h-3 w-12 ml-auto rounded bg-white/20" /></div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <motion.div 
                    onHoverStart={() => setHoveredElement('total')}
                    onHoverEnd={() => setHoveredElement(null)}
                    className={`w-48 space-y-3 p-3 rounded-xl transition-colors ${hoveredElement === 'total' ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-medium text-white">$4,500.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-indigo-400">
                      <span>Total</span>
                      <span>$4,500.00</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating Tooltips */}
              <AnimatePresence>
                {hoveredElement && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-bold shadow-xl whitespace-nowrap z-10"
                  >
                    Click to edit
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 size-2 rotate-45 bg-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Template Section */}
      <section className="py-32 px-6 relative border-t border-white/5 bg-[#09090b]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">One tool. Infinite styles.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Switch between structurally beautiful templates instantly without losing your data.</p>
          </div>

          <div className="flex flex-col items-center gap-12">
            {/* Tabs */}
            <div className="flex p-1 rounded-full bg-white/5 border border-white/10">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t)}
                  className={`relative px-6 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                    activeTemplate.id === t.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {activeTemplate.id === t.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{t.name}</span>
                </button>
              ))}
            </div>

            {/* Template Visualizer */}
            <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[21/9] rounded-2xl border border-white/10 bg-[#121214] overflow-hidden flex items-center justify-center shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTemplate.id}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 opacity-20 bg-gradient-to-br ${activeTemplate.color}`}
                />
              </AnimatePresence>
              
              {/* Abstract Representation of Template Layouts */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeTemplate.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-3/4 h-3/4 bg-[#1c1c1f] rounded-xl border border-white/10 p-6 flex flex-col shadow-2xl"
                >
                  {activeTemplate.id === "modern" && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div className="space-y-2">
                          <div className="h-6 w-32 rounded-md bg-white/20" />
                          <div className="h-3 w-24 rounded-sm bg-white/10" />
                        </div>
                        <div className="size-10 rounded-full bg-blue-500/50" />
                      </div>
                      <div className="flex-1 py-4 space-y-3">
                        <div className="h-4 w-full rounded-sm bg-white/5" />
                        <div className="h-4 w-full rounded-sm bg-white/5" />
                        <div className="h-4 w-3/4 rounded-sm bg-white/5" />
                      </div>
                    </div>
                  )}
                  {activeTemplate.id === "playful" && (
                    <div className="h-full flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="w-1/3 h-20 rounded-xl bg-purple-500/20 border border-purple-500/30" />
                        <div className="w-2/3 h-20 rounded-xl bg-pink-500/20 border border-pink-500/30" />
                      </div>
                      <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                         <div className="h-3 w-full rounded-full bg-white/10" />
                         <div className="h-3 w-full rounded-full bg-white/10" />
                      </div>
                    </div>
                  )}
                  {activeTemplate.id === "classic" && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="size-16 rounded-sm bg-emerald-500/20 mx-auto" />
                      <div className="space-y-2 w-full flex flex-col items-center">
                        <div className="h-6 w-48 rounded-sm bg-white/20" />
                        <div className="h-3 w-64 rounded-sm bg-white/10" />
                      </div>
                      <div className="w-full h-px bg-white/10" />
                      <div className="w-full flex justify-between px-8">
                        <div className="h-8 w-24 rounded-sm bg-white/10" />
                        <div className="h-8 w-32 rounded-sm bg-white/20" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need. <br className="sm:hidden"/>Nothing you don't.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative rounded-3xl border border-white/10 bg-[#121214] p-8 overflow-hidden hover:border-indigo-500/50 transition-colors ${feature.colSpan}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-screen pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl"
        >
          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 sm:p-20 text-center overflow-hidden">
            {/* Glow effect inside CTA */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-indigo-500/30 blur-[100px]" />
            
            <h2 className="relative z-10 text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Start billing better.
            </h2>
            <p className="relative z-10 text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join the new wave of freelancers and agencies who use Inwise to create stunning invoices in seconds.
            </p>
            
            <Link
              href="/sign-up"
              className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-base font-bold text-black transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Create Free Account
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M5.25 2.25a3 3 0 0 0-3 3v13.5a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V8.25l-6-6H5.25ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-white">Inwise</span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Inwise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/invoices")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || isSignedIn) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-[#09090b]">
        <div className="size-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  return <LandingContent />
}