import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/CreateUserUseCase';
import { UserRequest } from '../../domain/dto/UserRequest';
import { toUserResponse } from '../../domain/dto/UserResponse';
import { uploadImageToCloudinary } from '../../../core/config/cloudinary_service';

export class RegisterCompanyController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const userRequest: UserRequest = req.body;

      if (!userRequest.name || !userRequest.lastname || !userRequest.email || !userRequest.password) {
        res.status(400).json({ error: 'Campos obligatorios: name, lastname, email, password' });
        return;
      }

      if (!userRequest.company_name || !userRequest.company_address) {
        res.status(400).json({ error: 'Campos obligatorios: company_name, company_address' });
        return;
      }

      userRequest.role = 'admin';
      userRequest.account_type = 'company';

      if (req.file) {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer, 'companies');
        userRequest.image_profile = imageUrl;
      }

      const companyUser = await this.createUserUseCase.execute(userRequest);

      res.status(201).json({
        message: 'Empresa creada exitosamente',
        user: toUserResponse(companyUser),
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}