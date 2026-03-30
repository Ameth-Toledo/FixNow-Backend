import mqtt from 'mqtt';
import pool from '../../core/config/conn';
import { RowDataPacket } from 'mysql2';

const firebaseNotifications = require('../../core/config/firebase_admin') as {
  sendNotificationToTopic: (topic: string, payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }) => Promise<void>;
  sendNotificationToTokens: (tokens: string[], payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }) => Promise<void>;
};

const MQTT_BROKER_URL = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const ADMIN_ORDERS_TOPIC = process.env.FCM_ADMIN_ORDERS_TOPIC || 'admin_orders';

const MQTT_TOPICS = {
  ordenes_nuevo: 'ordenes/nuevo',
  ordenes_update: 'ordenes/actualizar',
};

// Cliente MQTT compartido (singleton)
let mqttClient: mqtt.MqttClient | null = null;

function getMqttClient(): mqtt.MqttClient {
  if (!mqttClient || !mqttClient.connected) {
    mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on('connect', () => {
      console.log(`✅ API conectada al broker MQTT: ${MQTT_BROKER_URL}`);
    });

    mqttClient.on('error', (err) => {
      console.error(`❌ Error en conexión MQTT:`, err.message);
    });
  }
  return mqttClient;
}

export class OrdenNotificationService {

  static async notificarNuevaOrden(orden: any): Promise<void> {
    try {
      const client = getMqttClient();
      const payload = JSON.stringify({
        id_orden: orden.id_orden,
        id_usuario: orden.id_usuario,
        fecha_orden: orden.fecha_orden,
        estado_orden: orden.estado_orden,
        monto_total: orden.monto_total,
        descripcion: orden.descripcion,
        direccion: orden.direccion,
        metodo_pago: orden.metodo_pago,
        timestamp: new Date().toISOString()
      });

      client.publish(MQTT_TOPICS.ordenes_nuevo, payload, { qos: 1 }, (err) => {
        if (err) {
          console.warn(`⚠️  Error publicando nueva orden a MQTT: ${err.message}`);
        } else {
          console.log(`✅ Nueva orden publicada al broker MQTT`);
          console.log(`   Tópico: ${MQTT_TOPICS.ordenes_nuevo}`);
          console.log(`   ID Orden: ${orden.id_orden}`);
        }
      });

      const notificationPayload = this.buildAdminNotificationPayload(orden, 'Nueva orden recibida');
      await firebaseNotifications.sendNotificationToTopic(ADMIN_ORDERS_TOPIC, notificationPayload);

      const adminTokens = await this.getAdminFirebaseTokens();
      await firebaseNotifications.sendNotificationToTokens(adminTokens, notificationPayload);
    } catch (error: any) {
      console.warn(`⚠️  Error al publicar orden a MQTT: ${error.message}`);
    }
  }

  static async notificarActualizacionOrden(orden: any): Promise<void> {
    try {
      const client = getMqttClient();
      const payload = JSON.stringify({
        id_orden: orden.id_orden,
        id_usuario: orden.id_usuario,
        estado_orden: orden.estado_orden,
        monto_total: orden.monto_total,
        descripcion: orden.descripcion,
        timestamp: new Date().toISOString()
      });

      client.publish(MQTT_TOPICS.ordenes_update, payload, { qos: 1 }, (err) => {
        if (err) {
          console.warn(`⚠️  Error publicando actualización de orden a MQTT: ${err.message}`);
        } else {
          console.log(`✅ Actualización de orden publicada al broker MQTT`);
          console.log(`   Tópico: ${MQTT_TOPICS.ordenes_update}`);
          console.log(`   ID Orden: ${orden.id_orden}`);
          console.log(`   Nuevo Estado: ${orden.estado_orden}`);
        }
      });

      const adminPayload = this.buildAdminNotificationPayload(orden, `Orden ${orden.id_orden} actualizada`);
      await firebaseNotifications.sendNotificationToTopic(ADMIN_ORDERS_TOPIC, adminPayload);

      const userToken = await this.getUserFirebaseToken(orden.id_usuario);
      await firebaseNotifications.sendNotificationToTokens(
        userToken ? [userToken] : [],
        this.buildUserNotificationPayload(orden)
      );
    } catch (error: any) {
      console.warn(`⚠️  Error al actualizar orden en MQTT: ${error.message}`);
    }
  }

  private static async getAdminFirebaseTokens(): Promise<string[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT firebase_token
       FROM users
       WHERE role = 'admin'
         AND firebase_token IS NOT NULL
         AND firebase_token <> ''`
    );

    return rows.map(row => row.firebase_token as string);
  }

  private static async getUserFirebaseToken(userId: number): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT firebase_token
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0].firebase_token ?? null;
  }

  private static buildAdminNotificationPayload(orden: any, title: string) {
    return {
      title,
      body: `Orden #${orden.id_orden} por $${orden.monto_total}`,
      data: {
        orderId: String(orden.id_orden),
        userId: String(orden.id_usuario),
        status: String(orden.estado_orden),
        total: String(orden.monto_total),
        channel: 'admin_orders',
      },
    };
  }

  private static buildUserNotificationPayload(orden: any) {
    return {
      title: 'Actualizacion de tu orden',
      body: `Tu orden #${orden.id_orden} ahora esta ${orden.estado_orden}`,
      data: {
        orderId: String(orden.id_orden),
        status: String(orden.estado_orden),
        total: String(orden.monto_total),
        userId: String(orden.id_usuario),
      },
    };
  }
}
