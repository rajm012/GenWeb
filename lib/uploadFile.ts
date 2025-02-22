// lib/uploadFile.ts
import { supabaseAdmin } from './supabase';

export async function uploadFile(userId: string, fileName: string, content: string) {
  const filePath = `${userId}/${fileName}`;
  
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('genweb')
      .upload(filePath, content, {
        upsert: true,
        contentType: 'text/html'
      });

    if (error) {
      console.error("❌ Storage Upload Error:", error);
      throw error;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('genweb')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("❌ Upload function error:", error);
    throw error;
  }
}