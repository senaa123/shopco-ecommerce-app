/**
 * Centralised application configuration.
 *
 * Loaded by `@nestjs/config` (see `AppModule`) and read elsewhere via
 * `ConfigService`, e.g. `configService.get('jwt.secret')`.
 */
export default () => ({
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  port: parseInt(process.env.PORT ?? '4000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
});
