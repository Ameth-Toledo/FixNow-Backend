export interface DirectionRequest {
    id_usuario: number
    alias?: string
    direccion: string
    latitud?: number
    longitud?: number
    es_predeterminada?: boolean
}

export interface DirectionUpdateRequest {
    alias?: string
    direccion?: string
    latitud?: number
    longitud?: number
    es_predeterminada?: boolean
}