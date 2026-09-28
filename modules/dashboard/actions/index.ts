"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean
) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User Id is Required");
  }

  try {
    if (isChecked) {
      await db.starMark.create({
        data: {
          userId: userId!,
          playgroundId,
          isMarked: isChecked,
        },
      });
    } else {
        await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId,

          },
        },
      });
    }

     revalidatePath("/dashboard");
    return { success: true, isMarked: isChecked };
  } catch (error) {
       console.error("Error updating problem:", error);
    return { success: false, error: "Failed to update problem" };
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return [];
  }

  try {
    const playgrounds = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        Starmark: {
          where: {
            userId: user.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return playgrounds.map((playground) => ({
      ...playground,
      user: {
        id: user.id,
        name: user.name ?? "Unknown user",
        email: user.email ?? "",
        image: user.image ?? null,
        role: user.role ?? "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));
  } catch (error) {
    console.error("Error fetching playgrounds for user:", error);
    return [];
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User is not authenticated");
  }

  const { template, title, description } = data;

  try {
    const playground = await db.playground.create({
      data: {
        title,
        description: description ?? "",
        template,
        updatedAt: new Date(),
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return playground;
  } catch (error) {
    console.error("Error creating playground:", error);
    throw error;
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await db.playground.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};


export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
) => {
  try {
    await db.playground.update({
      where: {
        id,
      },
      data: data,
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo: add tempalte files
    });
    if (!originalPlayground) {
      throw("Original playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,
        updatedAt: new Date(),
        // todo: add template files
      },
    });

    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.error("Error duplicating project:", error);
  }
};
