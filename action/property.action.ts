"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const uploadImages = async (images: File[]) => {
  const uploadedPaths: string[] = [];

  try {
    // Ensure the properties directory exists
    const propertiesDir = join(process.cwd(), "public", "properties");
    if (!existsSync(propertiesDir)) {
      await mkdir(propertiesDir, { recursive: true });
    }

    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${random}-${image.name}`;
      const filepath = join(propertiesDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Store the relative path for database
      uploadedPaths.push(`/properties/${filename}`);
    }

    return { success: true, paths: uploadedPaths };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, error: "Failed to upload images" };
  }
};

export const uploadVideos = async (videos: File[]) => {
  const uploadedPaths: string[] = [];

  try {
    // Ensure the properties directory exists
    const propertiesDir = join(process.cwd(), "public", "properties");
    if (!existsSync(propertiesDir)) {
      await mkdir(propertiesDir, { recursive: true });
    }

    for (const video of videos) {
      const bytes = await video.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${random}-${video.name}`;
      const filepath = join(propertiesDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Store the relative path for database
      uploadedPaths.push(`/properties/${filename}`);
    }

    return { success: true, paths: uploadedPaths };
  } catch (error) {
    console.error("Error uploading videos:", error);
    return { success: false, error: "Failed to upload videos" };
  }
};

export const createProperty = async (data: {
  name: string;
  address: string;
  location: string;
  price: number;
  size: number;
  bhk?: number;
  type?: string;
  description: string;
  images: File[];
  videos?: File[];
}) => {
  try {
    // Upload images first
    const uploadResult = await uploadImages(data.images);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    // Upload videos if provided
    let videoPaths: string[] = [];
    if (data.videos && data.videos.length > 0) {
      const videoResult = await uploadVideos(data.videos);
      if (!videoResult.success) {
        return { success: false, error: videoResult.error };
      }
      videoPaths = videoResult.paths || [];
    }

    const property = await prisma.property.create({
      data: {
        name: data.name,
        address: data.address,
        location: data.location,
        price: data.price,
        size: data.size,
        bhk: data.bhk,
        type: data.type as any,
        description: data.description,
        image: uploadResult.paths || [],
        video: videoPaths,
      },
    });
    return { success: true, property };
  } catch (error) {
    console.error("Error creating property:", error);
    return { success: false, error: "Failed to create property" };
  }
};

export const getProperties = async () => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, properties };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, error: "Failed to fetch properties" };
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });
    if (!property) {
      return { success: false, error: "Property not found" };
    }
    return { success: true, property };
  } catch (error) {
    console.error("Error fetching property:", error);
    return { success: false, error: "Failed to fetch property" };
  }
};

export const updateProperty = async (
  id: string,
  data: {
    name?: string;
    address?: string;
    location?: string;
    price?: number;
    size?: number;
    bhk?: number;
    type?: string;
    description?: string;
    images?: File[];
    existingImages?: string[];
    videos?: File[];
    existingVideos?: string[];
  }
) => {
  try {
    let imagePaths: string[] | undefined;
    let videoPaths: string[] | undefined;

    // Upload new images if provided
    if (data.images && data.images.length > 0) {
      const uploadResult = await uploadImages(data.images);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      imagePaths = uploadResult.paths;
    }

    // Upload new videos if provided
    if (data.videos && data.videos.length > 0) {
      const uploadResult = await uploadVideos(data.videos);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      videoPaths = uploadResult.paths;
    }

    // Combine existing images with new ones, or use existing if no new images
    let finalImages: string[] | undefined;
    if (imagePaths) {
      finalImages = [...(data.existingImages || []), ...imagePaths];
    } else if (data.existingImages && data.existingImages.length > 0) {
      finalImages = data.existingImages;
    }

    // Combine existing videos with new ones, or use existing if no new videos
    let finalVideos: string[] | undefined;
    if (videoPaths) {
      finalVideos = [...(data.existingVideos || []), ...videoPaths];
    } else if (data.existingVideos && data.existingVideos.length > 0) {
      finalVideos = data.existingVideos;
    }

    // Build update data object - only include fields that are provided
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.bhk !== undefined) updateData.bhk = data.bhk;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (finalImages !== undefined) updateData.image = finalImages;
    if (finalVideos !== undefined) updateData.video = finalVideos;

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No changes to update" };
    }

    const property = await prisma.property.update({
      where: {
        id,
      },
      data: updateData,
    });
    return { success: true, property };
  } catch (error: any) {
    console.error("Error updating property:", error);
    const errorMessage = error?.message || "Failed to update property";
    return { success: false, error: errorMessage };
  }
};

export const deleteProperty = async (id: string) => {
  try {
    await prisma.property.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: "Failed to delete property" };
  }
};
