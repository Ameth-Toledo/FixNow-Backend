import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';

export class ActualizarVencimientosUseCase {
  constructor(private repo: ISuscripcionRepository) {}

  async execute(): Promise<{ pasadasAGracia: number; pasadasAVencida: number }> {
    // 1. Activas cuya fecha_vencimiento ya pasó → pasar a gracia
    const vencidas = await this.repo.getSuscripcionesVencidasSinGracia();
    for (const s of vencidas) {
      await this.repo.actualizarEstado(s.id_suscripcion, 'gracia');
    }

    // 2. En gracia cuya fecha_fin_gracia ya pasó → pasar a vencida (bloqueo)
    const graciaExpirada = await this.repo.getSuscripcionesGraciaExpirada();
    for (const s of graciaExpirada) {
      await this.repo.actualizarEstado(s.id_suscripcion, 'vencida');
    }

    return {
      pasadasAGracia: vencidas.length,
      pasadasAVencida: graciaExpirada.length,
    };
  }
}
