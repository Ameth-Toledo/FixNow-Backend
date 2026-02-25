import { Orden } from './entities/Orden';
import { OrdenRequest, OrdenUpdateRequest } from './dto/OrdenRequest';

export interface IOrdenRepository {
  createOrden(data: OrdenRequest): Promise<Orden>;
  getAllOrdenes(): Promise<Orden[]>;
  getOrdenById(id: number): Promise<Orden | null>;
  getOrdenesByUsuarioId(id_usuario: number): Promise<Orden[]>;
  updateOrden(id: number, data: OrdenUpdateRequest): Promise<Orden | null>;
  deleteOrden(id: number): Promise<boolean>;
}
