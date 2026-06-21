import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = body

    if (!data.nombreCliente) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      )
    }

    const nuevaCotizacion = {
      ...data,
      id: data.id || randomUUID(),
      fechaCreacion: data.fechaCreacion || new Date().toISOString(),
    }

    // Try to use database if available
    try {
      const { db } = await import("@/lib/db")
      const { cotizaciones } = await import("@/lib/db/schema")
      
      const result = await db.insert(cotizaciones).values(nuevaCotizacion).returning()
      return NextResponse.json(result[0], { status: 201 })
    } catch (dbError) {
      // Database not available, client is handling with localStorage
      console.warn("Database unavailable, client will use localStorage:", dbError)
      return NextResponse.json(nuevaCotizacion, { status: 201 })
    }
  } catch (error) {
    console.error("Error saving cotización:", error)
    return NextResponse.json(
      { error: "Error al guardar la cotización" },
      { status: 500 }
    )
  }
}
