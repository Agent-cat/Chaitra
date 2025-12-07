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

export const createProperty = async (data: {
  name: string;
  address: string;
  price: number;
  size: number;
  bhk?: number;
  description: string;
  images: File[];
}) => {
  try {
    // Upload images first
    const uploadResult = await uploadImages(data.images);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    const property = await prisma.property.create({
      data: {
        name: data.name,
        address: data.address,
        price: data.price,
        size: data.size,
        bhk: data.bhk,
        description: data.description,
        image: uploadResult.paths || [],
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
    price?: number;
    size?: number;
    bhk?: number;
    description?: string;
    images?: File[];
  }
) => {
  try {
    let imagePaths: string[] | undefined;

    // Upload new images if provided
    if (data.images && data.images.length > 0) {
      const uploadResult = await uploadImages(data.images);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      imagePaths = uploadResult.paths;
    }

    const property = await prisma.property.update({
      where: {
        id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.price && { price: data.price }),
        ...(data.size && { size: data.size }),
        ...(data.bhk !== undefined && { bhk: data.bhk }),
        ...(data.description && { description: data.description }),
        ...(imagePaths && { image: imagePaths }),
      },
    });
    return { success: true, property };
  } catch (error) {
    console.error("Error updating property:", error);
    return { success: false, error: "Failed to update property" };
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
