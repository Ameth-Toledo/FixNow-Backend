import { ActualizarVencimientosUseCase } from '../../application/ActualizarVencimientosUseCase';

/**
 * Corre una vez al día a medianoche para mover suscripciones
 * vencidas a estado 'gracia' y las de gracia expirada a 'vencida'.
 */
export function iniciarCronSuscripciones(useCase: ActualizarVencimientosUseCase): void {
  const ejecutar = async () => {
    try {
      const resultado = await useCase.execute();
      if (resultado.pasadasAGracia > 0 || resultado.pasadasAVencida > 0) {
        console.log(`[Cron Suscripciones] Pasadas a gracia: ${resultado.pasadasAGracia} | Vencidas: ${resultado.pasadasAVencida}`);
      }
    } catch (err: any) {
      console.error('[Cron Suscripciones] Error:', err.message);
    }
  };

  // Calcular ms hasta la próxima medianoche
  const msMedianoche = (): number => {
    const ahora     = new Date();
    const manana    = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);
    return manana.getTime() - ahora.getTime();
  };

  // Primera ejecución al arrancar
  ejecutar();

  // Programar ejecución diaria
  const programarSiguiente = () => {
    setTimeout(() => {
      ejecutar();
      // Repetir cada 24 horas exactas a partir de la primera medianoche
      setInterval(ejecutar, 24 * 60 * 60 * 1000);
    }, msMedianoche());
  };

  programarSiguiente();
  console.log('[Cron Suscripciones] Programado para ejecutarse diariamente a medianoche');
}
