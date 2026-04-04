import { IChatRepository } from '../domain/IChatRepository';
import { MensajeResponse } from '../domain/dto/ChatResponse';

export class GetMensajesUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(id_conversacion: number): Promise<MensajeResponse[]> {
    const mensajes = await this.chatRepository.getMensajesByConversacionId(id_conversacion);
    return mensajes.map(m => new MensajeResponse(m));
  }
}
