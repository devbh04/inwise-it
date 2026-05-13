"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const isDark = resolvedTheme === "dark"

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative cursor-pointer"
        >
            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <HugeiconsIcon icon={Moon02Icon} size={18} strokeWidth={2} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <HugeiconsIcon icon={Sun01Icon} size={18} strokeWidth={2} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    )
}
