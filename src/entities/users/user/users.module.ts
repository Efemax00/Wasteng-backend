import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../../entities/users/user/users.service';
import { UsersController } from '../../../entities/users/user/users.controller';
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';
import { User } from '../../../entities/users/user/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User])],

  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService, CloudinaryService],
})
export class UsersModule {}
