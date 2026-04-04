import { IChatRepository } from '../domain/IChatRepository';
import { CrearConversacionRequest } from '../domain/dto/ChatRequest';
import { ConversacionResponse } from '../domain/dto/ChatResponse';

export class CrearConversacionUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(data: CrearConversacionRequest): Promise<ConversacionResponse> {
    if (!data.id_usuario || data.id_usuario <= 0) {
      throw new Error('El ID del usuario es obligatorio y debe ser válido');
    }
    if (data.tipo === 'usuario_empresa' && !data.id_empresa) {
      throw new Error('Se requiere id_empresa para conversaciones con empresa');
    }
    if (data.tipo === 'usuario_repartidor' && !data.id_repartidor) {
      throw new Error('Se requiere id_repartidor para conversaciones con repartidor');
    }

    const conv = await this.chatRepository.crearConversacion(data);
    return new ConversacionResponse(conv);
  }
}
