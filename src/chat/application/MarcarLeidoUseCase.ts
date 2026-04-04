import { IChatRepository } from '../domain/IChatRepository';

export class MarcarLeidoUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(id_conversacion: number, id_usuario: number): Promise<void> {
    await this.chatRepository.marcarMensajesLeidos(id_conversacion, id_usuario);
  }
}
