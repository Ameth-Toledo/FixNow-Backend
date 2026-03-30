import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/entities/User';
import { UserRequest } from '../domain/dto/UserRequest';
import { hashPassword } from '../../core/security/hash';
import { isValidEmail } from '../domain/utils/EmailValidator';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userRequest: UserRequest): Promise<User> {
    const name = userRequest.name?.trim();
    const lastname = userRequest.lastname?.trim();
    const email = userRequest.email?.trim().toLowerCase();
    const accountType = userRequest.account_type || 'person';
    const companyName = this.normalizeOptionalString(userRequest.company_name);
    const companyTaxId = this.normalizeOptionalString(userRequest.company_tax_id);
    const companyAddress = this.normalizeOptionalString(userRequest.company_address);

    if (!name) {
      throw new Error('El nombre es obligatorio');
    }

    if (!lastname) {
      throw new Error('El apellido es obligatorio');
    }

    if (!email) {
      throw new Error('El email es obligatorio');
    }

    if (!isValidEmail(email)) {
      throw new Error('El email no es valido');
    }

    if (!userRequest.password || userRequest.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (accountType === 'company') {
      if (!companyName) {
        throw new Error('El nombre de la empresa es obligatorio');
      }

      if (!companyAddress) {
        throw new Error('La direccion de la empresa es obligatoria');
      }
    }

    const existingUser = await this.userRepository.getByEmail(email);
    if (existingUser) {
      throw new Error('El email ya esta registrado');
    }

    const hashedPassword = await hashPassword(userRequest.password);

    const newUser: Omit<User, 'id' | 'created_at'> = {
      name,
      secondname: this.normalizeOptionalString(userRequest.secondname),
      lastname,
      secondlastname: this.normalizeOptionalString(userRequest.secondlastname),
      email,
      password: hashedPassword,
      phone: this.normalizeOptionalString(userRequest.phone),
      image_profile: this.normalizeOptionalString(userRequest.image_profile),
      role: accountType === 'company' ? 'admin' : userRequest.role || 'user',
      account_type: accountType,
      company_name: accountType === 'company' ? companyName : null,
      company_tax_id: accountType === 'company' ? companyTaxId : null,
      company_address: accountType === 'company' ? companyAddress : null,
      firebase_token: this.normalizeOptionalString(userRequest.firebase_token),
    };

    return await this.userRepository.save(newUser);
  }

  private normalizeOptionalString(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}