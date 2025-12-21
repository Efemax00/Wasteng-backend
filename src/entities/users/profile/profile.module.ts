
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfileService } from '../../../entities/users/profile/user-profile.service';
import { User } from '../../../entities/users/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Make User repository available
  ],
  providers: [UsersProfileService],
  exports: [UsersProfileService],
})
export class ProfileModule {}

