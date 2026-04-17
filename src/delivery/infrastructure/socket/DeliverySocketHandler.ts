import { Server, Socket } from 'socket.io';

export class DeliverySocketHandler {
  constructor(private io: Server) {}

  init(): void {
    this.io.on('connection', (socket: Socket) => {

      // Repartidor o cliente se une a la sala de la orden
      socket.on('join_order', (orderId: number) => {
        socket.join(`order_${orderId}`);
        console.log(`🚚 Socket ${socket.id} unido a order_${orderId}`);
      });

      // Repartidor o cliente abandona la sala
      socket.on('leave_order', (orderId: number) => {
        socket.leave(`order_${orderId}`);
        console.log(`🚚 Socket ${socket.id} salió de order_${orderId}`);
      });

      // Repartidor envía su ubicación → se reenvía a todos en la sala (incluido el cliente)
      socket.on('update_location', (data: { orderId: number; lat: number; lng: number }) => {
        const { orderId, lat, lng } = data;
        console.log(`📍 Ubicación actualizada orden ${orderId}: lat=${lat}, lng=${lng}`);
        // Emitir a TODOS en la sala (el cliente también está en order_${orderId})
        this.io.to(`order_${orderId}`).emit('location_changed', { lat, lng });
      });

    });
  }
}
