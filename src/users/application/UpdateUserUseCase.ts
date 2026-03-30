import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/entities/User';
import { UpdateUserRequest } from '../domain/dto/UserRequest';
import { isValidEmail } from '../domain/utils/EmailValidator';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, updateRequest: UpdateUserRequest): Promise<User> {
    const existingUser = await this.userRepository.getByID(id);

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    if (!updateRequest.name || updateRequest.name.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }

    if (!updateRequest.lastname || updateRequest.lastname.trim() === '') {
      throw new Error('El apellido es obligatorio');
    }

    if (!updateRequest.email || updateRequest.email.trim() === '') {
      throw new Error('El email es obligatorio');
    }

    if (!isValidEmail(updateRequest.email)) {
      throw new Error('El email no es valido');
    }

    const normalizedEmail = updateRequest.email.trim().toLowerCase();
    const userWithSameEmail = await this.userRepository.getByEmail(normalizedEmail);

    if (userWithSameEmail && userWithSameEmail.id !== id) {
      throw new Error('El email ya esta registrado');
    }

    const updatedUser: User = {
      ...existingUser,
      name: updateRequest.name.trim(),
      secondname: updateRequest.secondname !== undefined
        ? this.normalizeOptionalString(updateRequest.secondname)
        : existingUser.secondname,
      lastname: updateRequest.lastname.trim(),
      secondlastname: updateRequest.secondlastname !== undefined
        ? this.normalizeOptionalString(updateRequest.secondlastname)
        : existingUser.secondlastname,
      email: normalizedEmail,
      phone: updateRequest.phone !== undefined
        ? this.normalizeOptionalString(updateRequest.phone)
        : existingUser.phone,
      image_profile: updateRequest.image_profile !== undefined
        ? this.normalizeOptionalString(updateRequest.image_profile)
        : existingUser.image_profile,
      company_name: updateRequest.company_name !== undefined
        ? this.normalizeOptionalString(updateRequest.company_name)
        : existingUser.company_name,
      company_tax_id: updateRequest.company_tax_id !== undefined
        ? this.normalizeOptionalString(updateRequest.company_tax_id)
        : existingUser.company_tax_id,
      company_address: updateRequest.company_address !== undefined
        ? this.normalizeOptionalString(updateRequest.company_address)
        : existingUser.company_address,
      firebase_token: updateRequest.firebase_token !== undefined
        ? this.normalizeOptionalString(updateRequest.firebase_token)
        : existingUser.firebase_token,
    };

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }

  private normalizeOptionalString(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}