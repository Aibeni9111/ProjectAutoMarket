
import { supabase } from '@/lib/supabase'

export async function uploadImageToSupabase(file: File, uid: string | null) {
  if (!uid) throw new Error('Kein UID – bitte einloggen')


  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${uid}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`


  const { data, error } = await supabase
    .storage
    .from('cars')
    .upload(filePath, file /* без { upsert: true } */)

  if (error) throw error

  const { data: pub } = supabase.storage.from('cars').getPublicUrl(filePath)
  return { path: data.path, url: pub.publicUrl }
}
