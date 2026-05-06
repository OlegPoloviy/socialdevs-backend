import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  private readonly bucket =
    process.env.SUPABASE_STORAGE_BUCKET ?? 'socialImages';
  private readonly supabaseUrl = this.resolveSupabaseUrl();
  private readonly supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;
    const objectPath = this.createObjectPath(originalname);

    try {
      if (!this.supabaseKey) {
        throw new Error(
          'SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required for Supabase Storage uploads',
        );
      }

      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${this.encodePath(objectPath)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: this.supabaseKey,
            'Content-Type': mimetype,
            'Cache-Control': '3600',
            'x-upsert': 'false',
          },
          body: buffer,
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Supabase Storage upload failed: ${response.status} ${errorBody}`,
        );
      }

      return {
        path: objectPath,
        url: `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${this.encodePath(objectPath)}`,
      };
    } catch (err) {
      console.error('Error uploading file to Supabase Storage', err);
      throw err;
    }
  }

  private resolveSupabaseUrl() {
    if (process.env.SUPABASE_URL) {
      return process.env.SUPABASE_URL.replace(/\/$/, '');
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('SUPABASE_URL or DATABASE_URL is required');
    }

    const host = new URL(databaseUrl).hostname;
    const projectRef = host.split('.')[0];
    return `https://${projectRef}.supabase.co`;
  }

  private createObjectPath(originalname: string) {
    const safeName = originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    return `uploads/${Date.now()}-${randomUUID()}-${safeName}`;
  }

  private encodePath(path: string) {
    return path.split('/').map(encodeURIComponent).join('/');
  }
}
