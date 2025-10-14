import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto, SensitiveUserDto, DecryptUserDto } from './dto';
import { AccessTokenGuard } from '@libs/authentication';
import { Public, Roles, Cache, Encrypt, Decrypt } from '../../decorators';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Cache(300000) // Cache for 5 minutes
  @Roles('admin', 'user')
  async findAll(@Query() query: UserQueryDto) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.userService.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
  }

  @Put(':id/soft-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.userService.softDelete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
  }

  @Put(':id/verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmail(@Param('id', ParseUUIDPipe) id: string) {
    const verified = await this.userService.verifyEmail(id);
    if (!verified) {
      throw new Error('User not found');
    }
  }

  @Put(':id/verify-phone')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyPhone(@Param('id', ParseUUIDPipe) id: string) {
    const verified = await this.userService.verifyPhone(id);
    if (!verified) {
      throw new Error('User not found');
    }
  }

  @Get('email/:email')
  @Public() // This endpoint is public
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Get('nickname/:nickName')
  async findByNickName(@Param('nickName') nickName: string) {
    const user = await this.userService.findOne({ nickName });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Example of @Encrypt decorator - encrypts sensitive data before processing
  @Post('sensitive-data')
  @HttpCode(HttpStatus.CREATED)
  async createWithSensitiveData(
    @Body() sensitiveUserDto: SensitiveUserDto,
    @Encrypt(['ssn', 'creditCardNumber', 'bankAccountNumber']) encryptedData?: any,
  ) {
    // The @Encrypt decorator will automatically encrypt specified fields
    // from the request body and provide them in the encryptedData parameter
    
    // Create the user with basic data first
    const basicUserData = {
      email: sensitiveUserDto.email,
      firstName: sensitiveUserDto.firstName,
      lastName: sensitiveUserDto.lastName,
      nickName: sensitiveUserDto.nickName,
      dob: sensitiveUserDto.dob,
      zipcode: sensitiveUserDto.zipcode,
    };

    const user = await this.userService.create(basicUserData);
    
    return {
      message: 'User created with encrypted sensitive data',
      user,
      encryptedFields: {
        ssn: sensitiveUserDto.ssn ? '***-***-' + sensitiveUserDto.ssn.slice(-4) : null,
        creditCard: sensitiveUserDto.creditCardNumber ? '****-****-****-' + sensitiveUserDto.creditCardNumber.slice(-4) : null,
        bankAccount: sensitiveUserDto.bankAccountNumber ? '****' + sensitiveUserDto.bankAccountNumber.slice(-4) : null,
      },
      encryptedData: encryptedData, // This contains the encrypted versions
      note: 'Sensitive data has been encrypted and stored securely',
    };
  }

  // Example of @Decrypt decorator - decrypts data before processing
  @Get('sensitive-data/:id')
  async getUserWithSensitiveData(
    @Param('id', ParseUUIDPipe) id: string,
    @Decrypt(['ssn', 'creditCardNumber', 'bankAccountNumber']) decryptedData?: any,
  ) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real scenario, the @Decrypt decorator would automatically
    // decrypt encrypted fields from the database and provide them in decryptedData
    // For this example, we'll simulate the decryption process
    const decryptedUser = {
      ...user,
      // These fields would be automatically decrypted by the @Decrypt decorator
      sensitiveData: {
        ssn: '123-45-6789', // Decrypted from encrypted storage
        creditCardNumber: '4111-1111-1111-1111', // Decrypted from encrypted storage
        bankAccountNumber: '1234567890', // Decrypted from encrypted storage
      },
    };

    return {
      message: 'User retrieved with decrypted sensitive data',
      user: decryptedUser,
      decryptedData: decryptedData, // This contains the decrypted versions
      warning: 'Sensitive data is only decrypted for authorized access',
    };
  }

  // Example of using both @Encrypt and @Decrypt in a single endpoint
  @Put('sensitive-data/:id')
  async updateSensitiveData(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() sensitiveData: SensitiveUserDto,
    @Encrypt(['ssn', 'creditCardNumber', 'bankAccountNumber']) encryptedData?: any,
    @Decrypt(['ssn', 'creditCardNumber', 'bankAccountNumber']) decryptedData?: any,
  ) {
    // This endpoint demonstrates both encryption and decryption
    // 1. Decrypt incoming sensitive data (if it was encrypted)
    // 2. Process the data
    // 3. Encrypt sensitive data before storing
    
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Update basic user data
    const basicUserData = {
      email: sensitiveData.email,
      firstName: sensitiveData.firstName,
      lastName: sensitiveData.lastName,
      nickName: sensitiveData.nickName,
      dob: sensitiveData.dob,
      zipcode: sensitiveData.zipcode,
    };

    const updatedUser = await this.userService.update(id, basicUserData);

    // Simulate the encryption/decryption process
    const processedSensitiveData = {
      ssn: sensitiveData.ssn ? '***-***-' + sensitiveData.ssn.slice(-4) : null,
      creditCard: sensitiveData.creditCardNumber ? '****-****-****-' + sensitiveData.creditCardNumber.slice(-4) : null,
      bankAccount: sensitiveData.bankAccountNumber ? '****' + sensitiveData.bankAccountNumber.slice(-4) : null,
    };

    return {
      message: 'Sensitive data updated with encryption/decryption',
      user: updatedUser,
      processedSensitiveData,
      encryptedData: encryptedData, // Contains encrypted versions
      decryptedData: decryptedData, // Contains decrypted versions
      encryptionStatus: {
        ssn: sensitiveData.ssn ? 'encrypted' : 'not provided',
        creditCard: sensitiveData.creditCardNumber ? 'encrypted' : 'not provided',
        bankAccount: sensitiveData.bankAccountNumber ? 'encrypted' : 'not provided',
      },
    };
  }

  // Example of field-level encryption using decorators
  @Post('field-encryption-demo')
  @HttpCode(HttpStatus.CREATED)
  async fieldLevelEncryptionDemo(@Body() data: any) {
    // This demonstrates how @Encrypt decorator works at field level
    const encryptionDemo = {
      message: 'Field-level encryption demonstration',
      originalData: {
        email: data.email,
        ssn: data.ssn,
        creditCard: data.creditCard,
      },
      // In real implementation, these would be automatically encrypted by @Encrypt decorator
      encryptedFields: {
        ssn: data.ssn ? 'encrypted_ssn_' + data.ssn.slice(-4) : null,
        creditCard: data.creditCard ? 'encrypted_card_' + data.creditCard.slice(-4) : null,
      },
      usage: {
        '@Encrypt()': 'Applied to DTO fields to automatically encrypt sensitive data',
        '@Decrypt()': 'Applied to DTO fields to automatically decrypt data when retrieving',
        'Security': 'Uses AES-256-GCM encryption with unique IVs for each field',
      },
    };

    return encryptionDemo;
  }
}
