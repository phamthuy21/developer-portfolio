import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

import { AdminCertificatesController } from './admin-certificates.controller';

@Module({
  controllers: [CertificatesController, AdminCertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
