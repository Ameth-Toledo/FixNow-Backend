import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/entities/User';
import { UserRequest, LoginRequest } from '../domain/dto/UserRequest';
import { hashPassword, checkPassword } from '../../core/security/hash';
import { isValidEmail } from '../domain/utils/EmailValidator';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(loginRequest: LoginRequest): Promise<User> {
    const email = loginRequest.email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      throw new Error('Email invalido');
    }

    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error('Credenciales invalidas');
    }

    if (!user.password) {
      throw new Error('Usuario registrado con OAuth - usa login social');
    }

    const isPasswordValid = await checkPassword(user.password, loginRequest.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales invalidas');
    }

    if (loginRequest.firebase_token !== undefined) {
      const firebaseToken = this.normalizeOptionalString(loginRequest.firebase_token);
      await this.userRepository.updateFirebaseToken(user.id, firebaseToken);
      user.firebase_token = firebaseToken;
    }

    return user;
  }

  async register(userRequest: UserRequest): Promise<User> {
    const email = userRequest.email.trim().toLowerCase();
    const accountType = userRequest.account_type || 'person';
    const companyName = this.normalizeOptionalString(userRequest.company_name);
    const companyTaxId = this.normalizeOptionalString(userRequest.company_tax_id);
    const companyAddress = this.normalizeOptionalString(userRequest.company_address);

    if (!isValidEmail(email)) {
      throw new Error('Email invalido');
    }

    const existingUser = await this.userRepository.getByEmail(email);

    if (existingUser) {
      throw new Error('El email ya esta registrado');
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

    const hashedPassword = await hashPassword(userRequest.password);

    const newUser: Omit<User, 'id' | 'created_at'> = {
      name: userRequest.name.trim(),
      secondname: this.normalizeOptionalString(userRequest.secondname),
      lastname: userRequest.lastname.trim(),
      secondlastname: this.normalizeOptionalString(userRequest.secondlastname),
      email: email,
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

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async getUserByID(userId: number): Promise<User> {
    const user = await this.userRepository.getByID(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async updateFirebaseToken(userId: number, firebaseToken: string | null | undefined): Promise<User> {
    const user = await this.getUserByID(userId);
    const normalizedToken = this.normalizeOptionalString(firebaseToken);

    await this.userRepository.updateFirebaseToken(userId, normalizedToken);

    return {
      ...user,
      firebase_token: normalizedToken,
    };
  }

  private normalizeOptionalString(value?: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}