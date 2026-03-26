import { query } from "../db";

// ─── Images ───────────────────────────────────────────────────────────────────

export interface ProductImage {
  Image_ID: number;
  Product_ID: number;
  filename: string | null;
  Original: string | null;
  sm_image: string | null;
  md_image: string | null;
  lg_image: string | null;
  priority: number;
  caption: string | null;
  Gallery: boolean;
}

export async function getProductImages(id: number): Promise<ProductImage[]> {
  return query<ProductImage>(
    `SELECT Image_ID, Product_ID, filename, Original, sm_image, md_image, lg_image, priority, caption, Gallery
     FROM   Product_Images WHERE Product_ID = @id
     ORDER  BY priority ASC, Image_ID ASC`,
    { id }
  );
}

export async function updateProductImage(imageId: number, caption: string | null, priority: number, gallery: boolean): Promise<void> {
  await query(
    `UPDATE Product_Images SET caption=@caption, priority=@priority, Gallery=@gallery WHERE Image_ID=@imageId`,
    { imageId, caption, priority, gallery: gallery ? 1 : 0 } as Record<string, string | number | null>
  );
}

export async function addProductImage(productId: number, filename: string, priority: number, caption: string | null, gallery: boolean): Promise<void> {
  await query(
    `INSERT INTO Product_Images (Product_ID, filename, Original, sm_image, md_image, lg_image, priority, caption, Gallery)
     VALUES (@productId, @filename, @filename, @filename, @filename, @filename, @priority, @caption, @gallery)`,
    { productId, filename, priority, caption, gallery: gallery ? 1 : 0 } as Record<string, string | number | null>
  );
}

export async function deleteProductImage(imageId: number): Promise<void> {
  await query(`DELETE FROM Product_Images WHERE Image_ID = @imageId`, { imageId });
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export interface ProductVideo {
  Video_Id: number;
  Product_ID: number;
  Name: string | null;
  video_external: string | null;
  video_mp4: string | null;
  Priority: number;
  Description: string | null;
}

export async function getProductVideos(id: number): Promise<ProductVideo[]> {
  return query<ProductVideo>(
    `SELECT Video_Id, Product_ID, Name, video_external, video_mp4, Priority, Description
     FROM   Product_Videos WHERE Product_ID = @id ORDER BY Priority ASC`,
    { id }
  );
}

export async function addProductVideo(productId: number, data: {
  name: string; external: string; mp4: string; priority: number; description: string;
}): Promise<void> {
  await query(
    `INSERT INTO Product_Videos (Product_ID, Name, video_external, video_mp4, Priority, Description)
     VALUES (@productId, @name, @external, @mp4, @priority, @description)`,
    { productId, ...data } as Record<string, string | number | null>
  );
}

export async function deleteProductVideo(videoId: number): Promise<void> {
  await query(`DELETE FROM Product_Videos WHERE Video_Id = @videoId`, { videoId });
}

// ─── Files ────────────────────────────────────────────────────────────────────

export const FILE_CATEGORIES: Record<number, string> = {
  1: "Download",
  2: "Manual",
  3: "Design Drawings",
  4: "Spec Image",
  5: "Price List",
};

export interface ProductFile {
  file_id: number;
  Product_ID: number;
  filename: string | null;
  filepath: string | null;
  category_id: number;
  description: string | null;
  priority: number;
}

export async function getProductFiles(id: number): Promise<ProductFile[]> {
  return query<ProductFile>(
    `SELECT file_id, Product_ID, filename, filepath, category_id, description, priority
     FROM   Product_Files WHERE Product_ID = @id
     ORDER  BY priority ASC, file_id ASC`,
    { id }
  );
}

export async function addProductFile(productId: number, filename: string, categoryId: number, description: string | null, priority: number): Promise<void> {
  await query(
    `INSERT INTO Product_Files (Product_ID, filename, filepath, category_id, description, priority)
     VALUES (@productId, @filename, @filename, @categoryId, @description, @priority)`,
    { productId, filename, categoryId, description, priority } as Record<string, string | number | null>
  );
}

export async function updateProductFile(fileId: number, categoryId: number, description: string | null, priority: number): Promise<void> {
  await query(
    `UPDATE Product_Files SET category_id=@categoryId, description=@description, priority=@priority WHERE file_id=@fileId`,
    { fileId, categoryId, description, priority } as Record<string, string | number | null>
  );
}

export async function deleteProductFile(fileId: number): Promise<void> {
  await query(`DELETE FROM Product_Files WHERE file_id = @fileId`, { fileId });
}
