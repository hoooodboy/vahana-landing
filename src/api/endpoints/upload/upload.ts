/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * Vahana API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type { PostApiUploadBody } from "../../model";
import { customAxios } from "../../mutator/customAxios";

export const postApiUpload = (
  postApiUploadBody: PostApiUploadBody,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  if (postApiUploadBody.image !== undefined) {
    formData.append("image", postApiUploadBody.image);
  }

  return customAxios<void>({
    url: `/api/upload`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    signal,
  });
};

export const getPostApiUploadMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiUpload>>,
    TError,
    { data: PostApiUploadBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiUpload>>,
  TError,
  { data: PostApiUploadBody },
  TContext
> => {
  const mutationKey = ["postApiUpload"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiUpload>>,
    { data: PostApiUploadBody }
  > = (props) => {
    const { data } = props ?? {};

    return postApiUpload(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiUploadMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiUpload>>
>;
export type PostApiUploadMutationBody = PostApiUploadBody;
export type PostApiUploadMutationError = unknown;

export const usePostApiUpload = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiUpload>>,
    TError,
    { data: PostApiUploadBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiUpload>>,
  TError,
  { data: PostApiUploadBody },
  TContext
> => {
  const mutationOptions = getPostApiUploadMutationOptions(options);

  return useMutation(mutationOptions);
};
