import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CertificateResponseDto } from './dto/certificate.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all certificates ordered by issue date' })
  @ApiResponse({
    status: 200,
    description: 'List of all certificates',
    type: [CertificateResponseDto],
  })
  async findAll(): Promise<CertificateResponseDto[]> {
    return this.certificatesService.findAll();
  }
}
