import { IChatRepository } from '../domain/IChatRepository';
import { EnviarMensajeRequest } from '../domain/dto/ChatRequest';
import { MensajeResponse } from '../domain/dto/ChatResponse';
import { uploadImageToCloudinary } from '../../core/config/cloudinary_service';

export class SubirArchivoChatUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(
    id_conversacion: number,
    id_remitente: number,
    fileBuffer: Buffer,
    mimetype: string,
    caption?: string,
    id_mensaje_reply?: number | null
  ): Promise<MensajeResponse> {
    if (!id_conversacion || id_conversacion <= 0) {
      throw new Error('El ID de conversación es obligatorio');
    }
    if (!id_remitente || id_remitente <= 0) {
      throw new Error('El ID del remitente es obligatorio');
    }
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('El archivo no puede estar vacío');
    }

    // Determinar tipo
    let tipo_mensaje: 'imagen' | 'video' | 'archivo' = 'archivo';
    if (mimetype.startsWith('image/')) tipo_mensaje = 'imagen';
    else if (mimetype.startsWith('video/')) tipo_mensaje = 'video';

    // Subir a Cloudinary
    const archivo_url = await uploadImageToCloudinary(fileBuffer, 'chat/archivos');

    // Guardar mensaje en DB
    const data: EnviarMensajeRequest = {
      id_conversacion,
      id_remitente,
      contenido: caption?.trim() || null,
      tipo_mensaje,
      archivo_url,
      id_mensaje_reply: id_mensaje_reply ?? null,
    };

    const mensaje = await this.chatRepository.enviarMensaje(data);
    return new MensajeResponse(mensaje);
  }
}
