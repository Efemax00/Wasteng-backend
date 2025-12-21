import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'wasteng/avatars',
            resource_type: 'image',
            transformation: [
              { width: 500, height: 500, crop: 'fill' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) return reject(new Error('Image upload failed or secure_url missing'));
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `wasteng/avatars/${filename.split('.')[0]}`;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }
}