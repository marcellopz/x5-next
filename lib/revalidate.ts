import { revalidateTag } from "next/cache";
import { ALL_PUBLIC_DATA_TAG } from "./cache-tags";

export async function revalidateAllPublicData() {
  try {
    revalidateTag(ALL_PUBLIC_DATA_TAG);

    return {
      success: true,
      tags: [ALL_PUBLIC_DATA_TAG],
    };
  } catch (error) {
    console.error("Error revalidating public data:", error);
    throw error;
  }
}
