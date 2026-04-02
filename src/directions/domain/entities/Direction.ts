export interface Direction {
    id: number
    id_usuario: number
    alias: string | null
    direccion: string
    latitud: number | null
    longitud: number | null
    es_predeterminada: boolean
    created_at: Date
}