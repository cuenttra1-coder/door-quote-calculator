import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    try {
      const { db } = await import("@/lib/db")
      const { cotizaciones } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const resultado = await db
        .select()
        .from(cotizaciones)
        .where(eq(cotizaciones.id, id))
        .limit(1)

      if (!resultado.length) {
        return NextResponse.json(
          { error: "Cotización no encontrada" },
          { status: 404 }
        )
      }

      return NextResponse.json(resultado[0])
    } catch (dbError) {
      // If database fails, return not found
      console.warn("Database connection unavailable:", dbError)
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error getting cotización:", error)
    return NextResponse.json(
      { error: "Error al obtener la cotización" },
      { status: 500 }
    )
  }
}
