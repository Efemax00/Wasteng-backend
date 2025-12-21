// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../../entities/users/user/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService], // <-- important!
})
export class CloudinaryModule {}
