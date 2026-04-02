import { Direction } from '../entities/Direction'

export class DirectionResponse {
    id: number
    id_usuario: number
    alias: string | null
    direccion: string
    latitud: number | null
    longitud: number | null
    es_predeterminada: boolean
    created_at: Date

    constructor(direction: Direction) {
        this.id = direction.id
        this.id_usuario = direction.id_usuario
        this.alias = direction.alias
        this.direccion = direction.direccion
        this.latitud = direction.latitud
        this.longitud = direction.longitud
        this.es_predeterminada = direction.es_predeterminada
        this.created_at = direction.created_at
    }
}