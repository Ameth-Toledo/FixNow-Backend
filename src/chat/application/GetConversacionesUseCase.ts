import { IChatRepository } from '../domain/IChatRepository';
import { ConversacionResponse } from '../domain/dto/ChatResponse';

export class GetConversacionesUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async executeByUsuario(id_usuario: number): Promise<ConversacionResponse[]> {
    const convs = await this.chatRepository.getConversacionesByUsuarioId(id_usuario);
    return convs.map(c => new ConversacionResponse(c));
  }

  async executeByEmpresa(id_empresa: number): Promise<ConversacionResponse[]> {
    const convs = await this.chatRepository.getConversacionesByEmpresaId(id_empresa);
    return convs.map(c => new ConversacionResponse(c));
  }

  async executeByRepartidor(id_repartidor: number): Promise<ConversacionResponse[]> {
    const convs = await this.chatRepository.getConversacionesByRepartidorId(id_repartidor);
    return convs.map(c => new ConversacionResponse(c));
  }
}
