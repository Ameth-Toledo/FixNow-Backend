import { Request, Response } from 'express';
import { IUserRepository } from '../../domain/IUserRepository';

export class ChangePasswordController {
  constructor(private userRepository: IUserRepository) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      // Solo el propio usuario puede cambiar su contraseña
      if (req.userId !== id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'currentPassword y newPassword son obligatorios' });
        return;
      }

      await this.userRepository.changePassword(id, currentPassword, newPassword);
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}
