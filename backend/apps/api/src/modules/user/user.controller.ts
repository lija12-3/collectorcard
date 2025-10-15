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
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
} from './dto';
import { AccessTokenGuard } from '@libs/authentication';
import { Public, Roles, Cache } from '../../decorators';

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


  @Get('email/:email')
  @Public() // This endpoint is public
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Get('nickname/:nick_name')
  async findByNickName(@Param('nick_name') nick_name: string) {
    const user = await this.userService.findOne({ nick_name });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get user history
  @Get(':id/history')
  async getUserHistory(@Param('id', ParseUUIDPipe) id: string) {
    const history = await this.userService.getUserHistory(id);
    return {
      user_id: id,
      history,
      total_records: history.length,
    };
  }

  // Create user history entry
  @Post(':id/history')
  @HttpCode(HttpStatus.CREATED)
  async createUserHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() historyData: {
      field_name: string;
      field_value: string;
      old_value?: string;
      new_value?: string;
    },
  ) {
    const history = await this.userService.createUserHistory(
      id,
      historyData.field_name,
      historyData.field_value,
      historyData.old_value,
      historyData.new_value,
    );
    return {
      message: 'User history created successfully',
      history,
    };
  }
}
