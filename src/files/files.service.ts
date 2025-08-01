import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly bucket = process.env.AWS_S3_BUCKET;

  constructor() {
    this.s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.USER_ACCESS_KEY,
        secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
      },
    });
  }
  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: originalname,
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      const response = await this.s3Client.send(command);
      return {
        url: `https://${this.bucket}.s3.eu-north-1.amazonaws.com/${originalname}`,
        ...response,
      };
    } catch (err) {
      console.error('Error uploading file to S3', err);
      throw err;
    }
  }
}
