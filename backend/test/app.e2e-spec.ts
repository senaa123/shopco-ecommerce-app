import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

// Placeholder e2e suite. Real end-to-end tests (which require a running
// PostgreSQL instance) are added alongside the feature modules in later prompts.
describe.skip('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('bootstraps the application module', () => {
    expect(app).toBeDefined();
  });
});
