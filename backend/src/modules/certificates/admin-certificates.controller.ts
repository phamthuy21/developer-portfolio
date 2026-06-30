import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CertificateResponseDto } from './dto/certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('admin-certificates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/certificates')
export class AdminCertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: Get all certificates (including deleted)' })
  @ApiResponse({ status: 200, type: [CertificateResponseDto] })
  async findAll(): Promise<CertificateResponseDto[]> {
    return this.certificatesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get certificate by ID' })
  @ApiResponse({ status: 200, type: CertificateResponseDto })
  async findOne(@Param('id') id: string): Promise<CertificateResponseDto> {
    return this.certificatesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create a certificate' })
  @ApiResponse({ status: 201, type: CertificateResponseDto })
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.certificatesService.create(createCertificateDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update a certificate' })
  @ApiResponse({ status: 200, type: CertificateResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.certificatesService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete a certificate' })
  @ApiResponse({ status: 200, description: 'Certificate deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.certificatesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted certificate' })
  @ApiResponse({ status: 200, description: 'Certificate restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.certificatesService.restore(id);
  }
}
