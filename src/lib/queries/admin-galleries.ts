import { query } from "../db";

// ── Galleries ───────────────────────────────────────────────────────────────

export interface Gallery {
  Gallery_ID:          number;
  Name:                string;
  Text:                string | null;
  Priority:            number;
  Speed:               number;
  Gallery_Style:       number;  // 0=Gallery 1=Masonry 2=Slider 3=Our Team 4=Center Loop 5=Logo Rotator
  Masonry_Columns:     number;
  Transition:          number;  // 0=Slide 1=Fade
  Lg_Image_Width:      number;
  Lg_Image_Height:     number;
  Sm_Image_Width:      number;
  Sm_Image_Height:     number;
}

export const GALLERY_STYLES: Record<number, string> = {
  0: "Gallery",
  1: "Masonry",
  2: "Slider",
  3: "Our Team",
  4: "Center Loop",
  5: "Logo Rotator",
};

export async function getGalleries(): Promise<Gallery[]> {
  return query<Gallery>(
    `SELECT Gallery_ID, Name, Text, Priority, Speed, Gallery_Style,
            Masonry_Columns, Transition, Lg_Image_Width, Lg_Image_Height,
            Sm_Image_Width, Sm_Image_Height
     FROM Gallery ORDER BY Priority, Gallery_ID`,
    {}
  );
}

export async function getGallery(id: number): Promise<Gallery | null> {
  const rows = await query<Gallery>(
    `SELECT Gallery_ID, Name, Text, Priority, Speed, Gallery_Style,
            Masonry_Columns, Transition, Lg_Image_Width, Lg_Image_Height,
            Sm_Image_Width, Sm_Image_Height
     FROM Gallery WHERE Gallery_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export interface GalleryData {
  Name:            string;
  Text:            string;
  Speed:           number;
  Gallery_Style:   number;
  Masonry_Columns: number;
  Transition:      number;
  Lg_Image_Width:  number;
  Lg_Image_Height: number;
  Sm_Image_Width:  number;
  Sm_Image_Height: number;
}

export async function createGallery(data: GalleryData): Promise<number> {
  const result = await query<{ id: number }>(
    `INSERT INTO Gallery
       (Name, Text, Speed, Gallery_Style, Masonry_Columns, Transition,
        Lg_Image_Width, Lg_Image_Height, Sm_Image_Width, Sm_Image_Height, Priority)
     OUTPUT INSERTED.Gallery_ID AS id
     VALUES (@Name, @Text, @Speed, @Gallery_Style, @Masonry_Columns, @Transition,
             @Lg_Image_Width, @Lg_Image_Height, @Sm_Image_Width, @Sm_Image_Height, 9999)`,
    data as unknown as Record<string, string | number>
  );
  return result[0].id;
}

export async function updateGallery(id: number, data: GalleryData): Promise<void> {
  await query(
    `UPDATE Gallery SET
       Name            = @Name,
       Text            = @Text,
       Speed           = @Speed,
       Gallery_Style   = @Gallery_Style,
       Masonry_Columns = @Masonry_Columns,
       Transition      = @Transition,
       Lg_Image_Width  = @Lg_Image_Width,
       Lg_Image_Height = @Lg_Image_Height,
       Sm_Image_Width  = @Sm_Image_Width,
       Sm_Image_Height = @Sm_Image_Height
     WHERE Gallery_ID = @id`,
    { id, ...data } as unknown as Record<string, string | number>
  );
}

export async function deleteGallery(id: number): Promise<void> {
  await query(`DELETE FROM Gallery_Images WHERE Gallery_ID = @id`, { id });
  await query(`DELETE FROM Gallery WHERE Gallery_ID = @id`, { id });
}

// ── Gallery Images ───────────────────────────────────────────────────────────

export interface GalleryImage {
  Image_ID:       number;
  Gallery_ID:     number;
  Name:           string | null;
  Subtitle:       string | null;
  Phone:          string | null;
  Email:          string | null;
  LinkedIn:       string | null;
  Lg_Image:       string | null;
  Sm_Image:       string | null;
  Link:           string | null;
  Target:         boolean;
  Description:    string | null;
  Priority:       number;
  Category_ID:    number;
  Category_Name:  string | null;
  StartDate:      Date | null;
  EndDate:        Date | null;
}

export async function getGalleryImages(galleryId: number): Promise<GalleryImage[]> {
  return query<GalleryImage>(
    `SELECT GI.Image_ID, GI.Gallery_ID, GI.Name, GI.Subtitle, GI.Phone, GI.Email, GI.LinkedIn,
            GI.Lg_Image, GI.Sm_Image, GI.Link, GI.Target, GI.Description,
            GI.Priority, GI.Category_ID, GC.Name AS Category_Name,
            GI.StartDate, GI.EndDate
     FROM Gallery_Images GI
     LEFT JOIN Gallery_Category GC ON GC.Category_ID = GI.Category_ID
     WHERE GI.Gallery_ID = @galleryId
     ORDER BY GC.Priority, GI.Priority`,
    { galleryId }
  );
}

export async function getGalleryImage(imageId: number): Promise<GalleryImage | null> {
  const rows = await query<GalleryImage>(
    `SELECT GI.Image_ID, GI.Gallery_ID, GI.Name, GI.Subtitle, GI.Phone, GI.Email, GI.LinkedIn,
            GI.Lg_Image, GI.Sm_Image, GI.Link, GI.Target, GI.Description,
            GI.Priority, GI.Category_ID, GC.Name AS Category_Name,
            GI.StartDate, GI.EndDate
     FROM Gallery_Images GI
     LEFT JOIN Gallery_Category GC ON GC.Category_ID = GI.Category_ID
     WHERE GI.Image_ID = @imageId`,
    { imageId }
  );
  return rows[0] ?? null;
}

export interface ImageData {
  Name:        string;
  Subtitle:    string;
  Phone:       string;
  Email:       string;
  LinkedIn:    string;
  Lg_Image:    string;
  Sm_Image:    string;
  Link:        string;
  Target:      number;
  Description: string;
  Priority:    number;
  Category_ID: number;
  StartDate:   string | null;
  EndDate:     string | null;
}

export async function addGalleryImage(galleryId: number, data: ImageData): Promise<void> {
  await query(
    `INSERT INTO Gallery_Images
       (Gallery_ID, Name, Subtitle, Phone, Email, LinkedIn,
        Lg_Image, Sm_Image, Link, Target, Description, Priority, Category_ID,
        StartDate, EndDate,
        Video_External, Video_MP4, Video_WebM, Video_OGG, Video_Width, Video_Height,
        Original, Lg_Image_Width, Lg_Image_Height, Sm_Image_Width, Sm_Image_Height)
     VALUES
       (@galleryId, @Name, @Subtitle, @Phone, @Email, @LinkedIn,
        @Lg_Image, @Sm_Image, @Link, @Target, @Description, @Priority, @Category_ID,
        @StartDate, @EndDate,
        '', '', '', '', 0, 0,
        '', 0, 0, 0, 0)`,
    {
      galleryId,
      ...data,
      StartDate: data.StartDate || null,
      EndDate:   data.EndDate   || null,
    } as Record<string, string | number | null>
  );
}

export async function updateGalleryImage(imageId: number, data: ImageData): Promise<void> {
  await query(
    `UPDATE Gallery_Images SET
       Name        = @Name,
       Subtitle    = @Subtitle,
       Phone       = @Phone,
       Email       = @Email,
       LinkedIn    = @LinkedIn,
       Lg_Image    = @Lg_Image,
       Sm_Image    = @Sm_Image,
       Link        = @Link,
       Target      = @Target,
       Description = @Description,
       Priority    = @Priority,
       Category_ID = @Category_ID,
       StartDate   = @StartDate,
       EndDate     = @EndDate
     WHERE Image_ID = @imageId`,
    {
      imageId,
      ...data,
      StartDate: data.StartDate || null,
      EndDate:   data.EndDate   || null,
    } as Record<string, string | number | null>
  );
}

export async function deleteGalleryImage(imageId: number): Promise<void> {
  await query(`DELETE FROM Gallery_Images WHERE Image_ID = @imageId`, { imageId });
}

// ── Categories ───────────────────────────────────────────────────────────────

export interface GalleryCategory {
  Category_ID:  number;
  Name:         string;
  Description:  string | null;
  Priority:     number;
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return query<GalleryCategory>(
    `SELECT Category_ID, Name, Description, Priority FROM Gallery_Category ORDER BY Priority, Name`,
    {}
  );
}

export async function createGalleryCategory(name: string, description: string, priority: number): Promise<void> {
  await query(
    `INSERT INTO Gallery_Category (Name, Description, Priority) VALUES (@name, @description, @priority)`,
    { name, description, priority: priority || 9999 }
  );
}

export async function updateGalleryCategory(id: number, name: string, description: string, priority: number): Promise<void> {
  await query(
    `UPDATE Gallery_Category SET Name = @name, Description = @description, Priority = @priority
     WHERE Category_ID = @id`,
    { id, name, description, priority: priority || 9999 }
  );
}

export async function deleteGalleryCategory(id: number): Promise<void> {
  await query(`DELETE FROM Gallery_Category WHERE Category_ID = @id`, { id });
}
