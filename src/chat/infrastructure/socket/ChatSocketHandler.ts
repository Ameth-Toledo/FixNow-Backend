import { Server, Socket } from 'socket.io';
import { EnviarMensajeUseCase } from '../../application/EnviarMensajeUseCase';
import { MarcarLeidoUseCase } from '../../application/MarcarLeidoUseCase';

export class ChatSocketHandler {
  constructor(
    private io: Server,
    private enviarMensajeUseCase: EnviarMensajeUseCase,
    private marcarLeidoUseCase: MarcarLeidoUseCase
  ) {}

  init(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`💬 Socket conectado: ${socket.id}`);

      // El cliente se une a la sala de su conversación
      socket.on('join_conversation', (id_conversacion: number) => {
        socket.join(`conversation_${id_conversacion}`);
        console.log(`Socket ${socket.id} unido a conversation_${id_conversacion}`);
      });

      // El cliente abandona una sala
      socket.on('leave_conversation', (id_conversacion: number) => {
        socket.leave(`conversation_${id_conversacion}`);
      });

      // Enviar mensaje — se guarda en DB y se emite a todos en la sala
      socket.on('send_message', async (data: {
        id_conversacion: number;
        id_remitente: number;
        contenido: string;
      }) => {
        try {
          const mensaje = await this.enviarMensajeUseCase.execute(data);
          this.io.to(`conversation_${data.id_conversacion}`).emit('new_message', mensaje);
        } catch (error: any) {
          socket.emit('chat_error', { message: error.message });
        }
      });

      // Indicador de escritura
      socket.on('typing', (data: { id_conversacion: number; id_usuario: number; nombre: string }) => {
        socket.to(`conversation_${data.id_conversacion}`).emit('user_typing', {
          id_usuario: data.id_usuario,
          nombre: data.nombre,
        });
      });

      socket.on('stop_typing', (data: { id_conversacion: number; id_usuario: number }) => {
        socket.to(`conversation_${data.id_conversacion}`).emit('user_stop_typing', {
          id_usuario: data.id_usuario,
        });
      });

      // Marcar mensajes como leídos
      socket.on('mark_read', async (data: { id_conversacion: number; id_usuario: number }) => {
        try {
          await this.marcarLeidoUseCase.execute(data.id_conversacion, data.id_usuario);
          this.io.to(`conversation_${data.id_conversacion}`).emit('messages_read', {
            id_conversacion: data.id_conversacion,
            id_usuario: data.id_usuario,
          });
        } catch (error: any) {
          socket.emit('chat_error', { message: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`💬 Socket desconectado: ${socket.id}`);
      });
    });
  }
}
