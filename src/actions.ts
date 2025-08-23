"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { imagekit } from "./utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export const followUser = async (targetUserId: string, username: string) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });
  }
  revalidatePath(`/${username}`);
  revalidatePath("/");
};

export const likePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }
};

export const rePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingRePost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  });

  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  } else {
    await prisma.post.create({
      data: { userId, rePostId: postId },
    });
  }
};

export const savePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId },
    });
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: true };

    const username = formData.get("username")?.toString();

    // Extract file inputs
    const coverFile = formData.get("cover") as File | null;
    const imgFile = formData.get("img") as File | null;

    let cover: string | undefined;
    let img: string | undefined;

    if (coverFile && coverFile.size > 0) {
      const result: UploadResponse = await uploadProfileFile(coverFile, true);
      cover = result.filePath;
    }

    if (imgFile && imgFile.size > 0) {
      const result: UploadResponse = await uploadProfileFile(imgFile, false);
      img = result.filePath;
    }

    // Build data object (conditionally add cover/img)
    const data = {
      displayName: formData.get("displayName")?.toString().trim() || undefined,
      bio: formData.get("bio")?.toString().trim() || undefined,
      location: formData.get("location")?.toString().trim() || undefined,
      job: formData.get("job")?.toString().trim() || undefined,
      website: formData.get("website")?.toString().trim() || undefined,
      ...(cover && { cover }),
      ...(img && { img }),
    };

    // ZOD schema
    const profileSchema = z.object({
      displayName: z.string().min(3).max(50).optional(),
      bio: z.string().max(300).optional(),
      location: z.string().max(100).optional(),
      job: z.string().max(100).optional(),
      website: z.string().url().optional().or(z.string().max(200).optional()),
      img: z.string().optional(),
      cover: z.string().optional(),
    });

    // Validate
    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation failed", parsed.error.flatten());
      return { success: false, error: true };
    }

    // Update prisma
    await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    // Revalidate paths
    revalidatePath("/");
    if (username) revalidatePath(`/${username}`);

    return { success: true, error: false };
  } catch (err) {
    console.error("Update profile error:", err);
    return { success: false, error: true };
  }
};


const uploadProfileFile = async (file: File, cover : boolean): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `${cover ? "w-600 h-300" : "w-200 h-200"}`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/general",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

export const addComment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  const postId = formData.get("postId");
  const username = formData.get("username");
  const desc = formData.get("desc");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().min(3).max(140),
  });

  const validatedFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc,
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
      },
    });
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  const Post = z.object({
    desc: z.string().max(140).min(1),
    isSensitive: z.boolean().optional(),
  });

  const validatedFields = Post.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    const result: UploadResponse = await uploadFile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }

  // console.log("Check : ")
  // console.log({
  //   ...validatedFields.data,
  //   userId,
  //   img,
  //   imgHeight,
  //   video,
  // });

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
  return { success: false, error: true };
};

export const shareAction = async (
  formData: FormData,
  settings: { type: "original" | "wide" | "square"; sensitive: boolean }
) => {
  const file = formData.get("file") as File;
  // const desc = formData.get("desc") as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation = `w-600, ${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-9"
      : ""
  }`;

  imagekit.upload(
    {
      file: buffer,
      fileName: file.name,
      folder: "/posts",
      ...(file.type.includes("image") && {
        transformation: {
          pre: transformation,
        },
      }),
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    function (error, result) {
      if (error) console.log(error);
      else console.log(result);
    }
  );
};
