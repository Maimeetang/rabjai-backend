import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';

@Module({
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
