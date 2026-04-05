import { Server, Socket } from 'socket.io';
import { EnviarMensajeUseCase } from '../../application/EnviarMensajeUseCase';
import { MarcarLeidoUseCase } from '../../application/MarcarLeidoUseCase';
import { IChatRepository } from '../../domain/IChatRepository';

export class ChatSocketHandler {
  constructor(
    private io: Server,
    private enviarMensajeUseCase: EnviarMensajeUseCase,
    private marcarLeidoUseCase: MarcarLeidoUseCase,
    private chatRepository: IChatRepository
  ) {}

  init(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`💬 Socket conectado: ${socket.id}`);

      // El cliente se une a la sala de su conversación
      socket.on('join_conversation', (id_conversacion: number) => {
        socket.join(`conversation_${id_conversacion}`);
        console.log(`Socket ${socket.id} unido a conversation_${id_conversacion}`);
      });

      // La empresa se une a su sala para recibir badges en tiempo real
      socket.on('join_empresa', (id_empresa: number) => {
        socket.join(`empresa_${id_empresa}`);
        console.log(`Socket ${socket.id} unido a empresa_${id_empresa}`);
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
        id_mensaje_reply?: number | null;
      }) => {
        try {
          const mensaje = await this.enviarMensajeUseCase.execute(data);
          this.io.to(`conversation_${data.id_conversacion}`).emit('new_message', mensaje);

          // Notificar a la empresa para actualizar el badge sin recargar
          const conv = await this.chatRepository.getConversacionById(data.id_conversacion);
          if (conv?.id_empresa) {
            this.io.to(`empresa_${conv.id_empresa}`).emit('badge_update', {
              id_conversacion: data.id_conversacion,
              ultimo_mensaje: mensaje.contenido,
              tipo_mensaje: mensaje.tipo_mensaje,
              ultimo_mensaje_fecha: mensaje.created_at
            });
          }
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
