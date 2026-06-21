import { NextResponse } from "next/server"

export async function GET() {
  try {
    try {
      const { db } = await import("@/lib/db")
      const { cotizaciones } = await import("@/lib/db/schema")
      const { desc } = await import("drizzle-orm")

      const resultado = await db
        .select()
        .from(cotizaciones)
        .orderBy(desc(cotizaciones.fechaCreacion))

      // Agrupar por cliente
      const agrupadas = resultado.reduce(
        (acc, cotizacion) => {
          const cliente = cotizacion.nombreCliente
          if (!acc[cliente]) {
            acc[cliente] = []
          }
          acc[cliente].push(cotizacion)
          return acc
        },
        {} as Record<string, unknown[]>
      )

      return NextResponse.json(agrupadas)
    } catch (dbError) {
      // Database not available, client should use localStorage
      console.warn("Database unavailable, returning empty list:", dbError)
      return NextResponse.json({})
    }
  } catch (error) {
    console.error("Error listing cotizaciones:", error)
    return NextResponse.json(
      { error: "Error al obtener cotizaciones" },
      { status: 500 }
    )
  }
}
