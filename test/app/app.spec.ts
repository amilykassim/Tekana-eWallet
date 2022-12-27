import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { sampleUser1 } from  'test/app/test.data';
import { clearAll } from 'test/helpers'

describe('AppController (e2e)', () => {
  let app: INestApplication;
  afterAll(async () => {
    afterEach(() => app.close());
    clearAll()
  })
  

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should register a client', async () => {
    const { body } =  await request(app.getHttpServer())
      .post('/auth/register')
      .send(sampleUser1)
    expect(body.statusCode).toEqual(201);
    expect(body.data).toBeDefined();
  });

  it('should not register an already registered client', async () => {
    const { body } =  await request(app.getHttpServer())
      .post('/auth/register')
      .send(sampleUser1)
    expect(body.statusCode).toEqual(400);
  });

  it('should be able to sign in a user', async (done) => {
    const { body } =  await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: sampleUser1.email,
      password: sampleUser1.password
    })
    expect(body.statusCode).toEqual(200);
    expect(body.data).toBeDefined();
    done()
  })

  it('should not login if the credentials are wrong', async (done) => {
    const { body } =  await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: sampleUser1.email,
      password: 'wrong password'
    })
    expect(body.statusCode).toEqual(400);
    expect(body.data).toBeUndefined();
    done()
  })
});
