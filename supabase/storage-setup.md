# Supabase Storage Setup for Product Images

## Steps to Set Up Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name: `product-images`
5. Make it **Public** (so images can be accessed without authentication)
6. Click **Create bucket**

## Storage Policies

After creating the bucket, you need to set up policies:

### Policy 1: Allow public read access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

### Policy 2: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Allow authenticated users to delete their own uploads
```sql
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

## Note

The admin panel will automatically upload images to the `product-images` bucket when you add or edit products.
