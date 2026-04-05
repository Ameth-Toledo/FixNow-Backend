import { Request, Response } from 'express';
import { SubirArchivoChatUseCase } from '../../application/SubirArchivoChatUseCase';
import { IChatRepository } from '../../domain/IChatRepository';
import { Server } from 'socket.io';

export class SubirArchivoController {
  constructor(
    private subirArchivoUseCase: SubirArchivoChatUseCase,
    private io: Server,
    private chatRepository: IChatRepository
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_conversacion = parseInt(String(req.params.id_conversacion));
      const id_remitente = parseInt(String(req.body.id_remitente));

      if (!req.file) {
        res.status(400).json({ error: 'No se recibió ningún archivo' });
        return;
      }

      const caption = req.body.caption?.trim() || undefined;
      const id_mensaje_reply = req.body.id_mensaje_reply ? parseInt(req.body.id_mensaje_reply) : null;

      const mensaje = await this.subirArchivoUseCase.execute(
        id_conversacion,
        id_remitente,
        req.file.buffer,
        req.file.mimetype,
        caption,
        id_mensaje_reply
      );

      this.io.to(`conversation_${id_conversacion}`).emit('new_message', mensaje);

      // Notificar a la empresa para actualizar el badge
      const conv = await this.chatRepository.getConversacionById(id_conversacion);
      if (conv?.id_empresa) {
        this.io.to(`empresa_${conv.id_empresa}`).emit('badge_update', {
          id_conversacion,
          ultimo_mensaje: mensaje.contenido,
          tipo_mensaje: mensaje.tipo_mensaje,
          ultimo_mensaje_fecha: mensaje.created_at
        });
      }

      res.status(201).json(mensaje);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
