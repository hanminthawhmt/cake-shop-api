import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, AuthProvider } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserProfile) private profileRepo: Repository<UserProfile>,
  ) {}

  create(name: string, email: string, password: string) {
    const user = this.usersRepo.create({ name, email, password });
    return this.usersRepo.save(user);
  }

  createGoogleUser(name: string, email: string, authProvider: AuthProvider) {
    const userData: any = { name, email, password: null, authProvider };
    const user = this.usersRepo.create(userData);
    return this.usersRepo.save(user);
  }

  updateAuthProvider(id: number, authProvider: AuthProvider) {
    return this.usersRepo.update(id, { authProvider });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.usersRepo.findOneBy({ id });
  }

  find(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async updatePassword(id: number, attrs: Partial<User>) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }

  getInfo(id: number) {
    return this.usersRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
  }

  async updateInfo(id: number, attrs: Partial<UserProfile>) {
    let profile = await this.profileRepo.findOneBy({ userId: id });
    if (!profile) {
      profile = this.profileRepo.create({ userId: id, ...attrs });
    } else {
      Object.assign(profile, attrs);
    }
    return await this.profileRepo.save(profile);
  }
}
