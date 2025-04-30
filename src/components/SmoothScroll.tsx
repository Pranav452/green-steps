'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Lenis from 'lenis'

const SmoothScrollContext = createContext<Lenis | null>(null)

export const useSmoothScroll = () => {
    return useContext(SmoothScrollContext)
}

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode
}) {
    const [lenisRef, setLenisRef] = useState<Lenis | null>(null)
    const [rafState, setRafState] = useState<number | null>(null)

    useEffect(() => {
        const scroller = new Lenis()
        let rf: number
        function raf(time: number) {
            scroller.raf(time)
            rf = requestAnimationFrame(raf)
        }
        rf = requestAnimationFrame(raf)
        setRafState(rf)
        setLenisRef(scroller)
        return () => {
            if (lenisRef) {
                cancelAnimationFrame(rf)
                lenisRef.destroy()
            }
        }
    }, [])
    return (
        <SmoothScrollContext.Provider value={lenisRef}>
            {children}
        </SmoothScrollContext.Provider>
    )
} 