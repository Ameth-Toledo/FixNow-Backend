import axios from 'axios';

const WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_URL || 'http://localhost:3000';
const WEBSOCKET_TIMEOUT = 5000;

export class OrdenNotificationService {
  static async notificarNuevaOrden(orden: any): Promise<any> {
    try {
      console.log(`\n📤 Enviando nueva orden a MQTT...`);
      console.log(`   ID Orden: ${orden.id_orden}`);
      console.log(`   ID Usuario: ${orden.id_usuario}`);
      console.log(`   Monto: $${orden.monto_total}`);
      
      const response = await axios.post(
        `${WEBSOCKET_SERVER_URL}/ordenes/publicar`,
        {
          id_orden: orden.id_orden,
          id_usuario: orden.id_usuario,
          fecha_orden: orden.fecha_orden,
          estado_orden: orden.estado_orden,
          monto_total: orden.monto_total,
          descripcion: orden.descripcion
        },
        { timeout: WEBSOCKET_TIMEOUT }
      );

      console.log(`✅ Orden publicada a MQTT exitosamente`);
      console.log(`   Tópico: ordenes/nuevo`);
      
      return response.data;
    } catch (error: any) {
      console.warn(`⚠️  Error al publicar orden a MQTT`);
      console.warn(`   Detalles: ${error.message}`);
      return null;
    }
  }

  /**
   * Notificar actualización de orden a MQTT
   * @param orden - Datos de la orden actualizada
   */
  static async notificarActualizacionOrden(orden: any): Promise<any> {
    try {
      console.log(`\n📤 Actualizando orden en MQTT...`);
      console.log(`   ID Orden: ${orden.id_orden}`);
      console.log(`   Nuevo Estado: ${orden.estado_orden}`);
      
      const response = await axios.put(
        `${WEBSOCKET_SERVER_URL}/ordenes/actualizar`,
        {
          id_orden: orden.id_orden,
          id_usuario: orden.id_usuario,
          estado_orden: orden.estado_orden,
          monto_total: orden.monto_total,
          descripcion: orden.descripcion
        },
        { timeout: WEBSOCKET_TIMEOUT }
      );

      console.log(`✅ Orden actualizada en MQTT exitosamente`);
      console.log(`   Tópico: ordenes/actualizar`);
      
      return response.data;
    } catch (error: any) {
      console.warn(`⚠️  Error al actualizar orden en MQTT`);
      console.warn(`   Detalles: ${error.message}`);
      return null;
    }
  }


  static async verificarEstadoWebSocket(): Promise<any> {
    try {
      const response = await axios.get(`${WEBSOCKET_SERVER_URL}/`, {
        timeout: WEBSOCKET_TIMEOUT
      });
      
      console.log(`✅ WebSocket + MQTT conectado`);
      console.log(`   Clientes Socket.IO: ${response.data.clientesConectadosSocket}`);
      console.log(`   MQTT Broker: ${response.data.mqttConectado ? 'conectado' : 'desconectado'}`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ WebSocket NO disponible en ${WEBSOCKET_SERVER_URL}`);
      console.error(`   Error: ${error.message}`);
      return null;
    }
  }


  static async obtenerEstadisticas(): Promise<any> {
    try {
      const response = await axios.get(`${WEBSOCKET_SERVER_URL}/stats`, {
        timeout: WEBSOCKET_TIMEOUT
      });
      
      return response.data;
    } catch (error: any) {
      console.warn(`❌ No se pudo obtener estadísticas`);
      return null;
    }
  }
}
