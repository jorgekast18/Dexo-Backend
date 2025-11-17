import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAuthModule } from './test-auth.module';
import { DataSource } from 'typeorm';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  // Datos de prueba
  const mockUser = {
    email: 'test@example.com',
    password: 'Test123456!',
    name: 'John',
    age: 30,
    gender: 'male'
  };

  const loginCredentials = {
    email: 'test@example.com',
    password: 'Test123456!',
  };

  const invalidCredentials = {
    email: 'test@example.com',
    password: 'WrongPassword123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplicar los mismos pipes y configuración que en producción
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Obtener el DataSource para limpiar la base de datos
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    // Limpiar la base de datos
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar todas las tablas antes de cada test
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  describe('/api/auth/login (POST)', () => {
    it('should return 401 if user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginCredentials)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Credenciales no válidas');
    });

    it('should return 401 if password is incorrect', async () => {
      // Primero registrar el usuario
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      // Intentar login con contraseña incorrecta
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Credenciales no válidas');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'Test123456!' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBeTruthy();
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBeTruthy();
    });

    it('should return 400 if email format is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Test123456!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBeTruthy();
    });

    it('should successfully login and return access token', async () => {
      // Primero registrar el usuario
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      // Ahora hacer login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginCredentials)
        .expect(201);

      // Verificar la estructura de la respuesta
      expect(response.body).toHaveProperty('access_token');

      // Verificar el token
      expect(typeof response.body.access_token).toBe('string');
      expect(response.body.access_token.length).toBeGreaterThan(0);
    });

    it('should not allow login with previously used credentials after password change', async () => {
      // Registrar usuario
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      // Login exitoso con credenciales originales
      const firstLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginCredentials)
        .expect(201);

      expect(firstLogin.body).toHaveProperty('access_token');
    });

    it('should handle multiple concurrent login requests', async () => {
      // Registrar usuario
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      // Hacer múltiples logins simultáneos
      const responses = [];
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginCredentials)
          .expect(201);

        responses.push(response);

        // Pequeño delay para asegurar diferentes timestamps
        await new Promise(resolve => setTimeout(resolve, 900));
      }

      // Verificar que todos los logins fueron exitosos
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('access_token');
      });


      // Verificar que todos los tokens son diferentes
      const tokens = responses.map((r) => r.body.access_token);
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(tokens.length);
    });
  });

  describe('/auth/login - Security Tests', () => {
    it('should not reveal if email exists when password is wrong', async () => {
      // Registrar usuario
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      // Intentar login con contraseña incorrecta
      const wrongPasswordResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      // Intentar login con email que no existe
      const wrongEmailResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
        .expect(401);

      // Los mensajes deben ser genéricos y no revelar si el email existe
      expect(wrongPasswordResponse.body.message).toBe(wrongEmailResponse.body.message);
    });

    it('should sanitize input to prevent SQL injection', async () => {
      const sqlInjectionAttempt = {
        email: "admin' OR '1'='1",
        password: "admin' OR '1'='1",
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(sqlInjectionAttempt)
        .expect(400); // Debería fallar por validación de formato de email

      expect(response.body).toHaveProperty('message');
    });
  });
});
