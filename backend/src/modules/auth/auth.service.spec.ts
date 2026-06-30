import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateRefreshToken: jest.fn(),
      removeRefreshToken: jest.fn(),
    };
    const mockPasswordService = {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };
    const mockConfigService = {
      get: jest.fn().mockReturnValue('1h'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    passwordService = module.get(PasswordService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password if validation succeeds', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hash',
        role: 'Admin',
      };
      usersService.findByEmail.mockResolvedValue(user as any);
      passwordService.comparePassword.mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({
        id: '1',
        email: 'test@test.com',
        role: 'Admin',
      });
    });

    it('should return null if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      const user = { id: '1', email: 'test@test.com', passwordHash: 'hash' };
      usersService.findByEmail.mockResolvedValue(user as any);
      passwordService.comparePassword.mockResolvedValue(false);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: '1', email: 'test@test.com', role: 'Admin' };
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      passwordService.hashPassword.mockResolvedValue('hashed_refresh_token');

      const result = await service.login(user as any);

      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        '1',
        'hashed_refresh_token',
      );
    });
  });

  describe('logout', () => {
    it('should update refresh token to null', async () => {
      await service.logout('1');
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith('1', null);
    });
  });
});
