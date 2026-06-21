"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CamposCotizador } from "@/components/campos-cotizador"
import { ResultadoPresupuesto } from "@/components/resultado-presupuesto"
import {
  calcular,
  VALORES_INICIALES,
  type Parametros,
} from "@/lib/cotizador"
import { Printer, RotateCcw, DoorClosed } from "lucide-react"

export default function Page() {
  const [valores, setValores] = useState<Parametros>(VALORES_INICIALES)
  const [cliente, setCliente] = useState("")

  const resultado = useMemo(() => {
    const seguro = Object.fromEntries(
      Object.entries(valores).map(([k, v]) => [k, Number.isNaN(v) ? 0 : v]),
    ) as Parametros
    return calcular(seguro)
  }, [valores])

  const fecha = useMemo(
    () =>
      new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  )

  function handleChange(key: keyof Parametros, value: number) {
    setValores((prev) => ({ ...prev, [key]: value }))
  }

  function reset() {
    setValores(VALORES_INICIALES)
    setCliente("")
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="no-print border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <DoorClosed className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">
              WALUM · Cotizador
            </h1>
            <p className="text-sm text-primary-foreground/70">
              Puertas de aluminio · Línea Herrero
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px]">
        <section className="no-print flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cliente">Cliente / Referencia</Label>
            <Input
              id="cliente"
              placeholder="Ej: Juan Pérez - Puerta exterior"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>

          <CamposCotizador valores={valores} onChange={handleChange} />

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.print()} className="gap-2">
              <Printer className="size-4" />
              Imprimir / Exportar PDF
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="size-4" />
              Restablecer
            </Button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start flex flex-col gap-6">
          <ResultadoPresupuesto
            resultado={resultado}
            parametros={valores}
            cliente={cliente}
            fecha={fecha}
            esCliente={false}
          />
          <div className="hidden print:block">
            <ResultadoPresupuesto
              resultado={resultado}
              parametros={valores}
              cliente={cliente}
              fecha={fecha}
              esCliente={true}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}
