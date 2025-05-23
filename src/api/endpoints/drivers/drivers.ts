/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * Vahana API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  APIResponseBoolean,
  APIResponseDriverDetailResponseDto,
  APIResponseDriverResponseDto,
  APIResponseForbiddenDto,
  APIResponseUnauthorizedDto,
  CreateDriverDto,
  UpdateDriverDto,
} from "../../model";
import { customAxios } from "../../mutator/customAxios";

/**
 * [어드민] 운전자 등록
 * @summary [어드민] 운전자 등록
 */
export const postApiDrivers = (
  createDriverDto: CreateDriverDto,
  signal?: AbortSignal,
) => {
  return customAxios<APIResponseBoolean>({
    url: `/api/drivers`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createDriverDto,
    signal,
  });
};

export const getPostApiDriversMutationOptions = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiDrivers>>,
    TError,
    { data: CreateDriverDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiDrivers>>,
  TError,
  { data: CreateDriverDto },
  TContext
> => {
  const mutationKey = ["postApiDrivers"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiDrivers>>,
    { data: CreateDriverDto }
  > = (props) => {
    const { data } = props ?? {};

    return postApiDrivers(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiDriversMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiDrivers>>
>;
export type PostApiDriversMutationBody = CreateDriverDto;
export type PostApiDriversMutationError =
  | APIResponseUnauthorizedDto
  | APIResponseForbiddenDto;

/**
 * @summary [어드민] 운전자 등록
 */
export const usePostApiDrivers = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiDrivers>>,
    TError,
    { data: CreateDriverDto },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiDrivers>>,
  TError,
  { data: CreateDriverDto },
  TContext
> => {
  const mutationOptions = getPostApiDriversMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * [어드민] 운전자 목록 조회
 * @summary [어드민] 운전자 목록 조회
 */
export const getApiDrivers = (signal?: AbortSignal) => {
  return customAxios<APIResponseDriverResponseDto>({
    url: `/api/drivers`,
    method: "GET",
    signal,
  });
};

export const getGetApiDriversQueryKey = () => {
  return [`/api/drivers`] as const;
};

export const getGetApiDriversQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiDrivers>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getApiDrivers>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiDriversQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiDrivers>>> = ({
    signal,
  }) => getApiDrivers(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiDrivers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiDriversQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiDrivers>>
>;
export type GetApiDriversQueryError =
  | APIResponseUnauthorizedDto
  | APIResponseForbiddenDto;

export function useGetApiDrivers<
  TData = Awaited<ReturnType<typeof getApiDrivers>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getApiDrivers>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getApiDrivers>>,
        TError,
        Awaited<ReturnType<typeof getApiDrivers>>
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiDrivers<
  TData = Awaited<ReturnType<typeof getApiDrivers>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getApiDrivers>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getApiDrivers>>,
        TError,
        Awaited<ReturnType<typeof getApiDrivers>>
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiDrivers<
  TData = Awaited<ReturnType<typeof getApiDrivers>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getApiDrivers>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary [어드민] 운전자 목록 조회
 */

export function useGetApiDrivers<
  TData = Awaited<ReturnType<typeof getApiDrivers>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getApiDrivers>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetApiDriversQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * [어드민] 운전자 상세 조회
 * @summary [어드민] 운전자 상세 조회
 */
export const getApiDriversId = (id: string, signal?: AbortSignal) => {
  return customAxios<APIResponseDriverDetailResponseDto>({
    url: `/api/drivers/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetApiDriversIdQueryKey = (id: string) => {
  return [`/api/drivers/${id}`] as const;
};

export const getGetApiDriversIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiDriversId>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiDriversId>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiDriversIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiDriversId>>> = ({
    signal,
  }) => getApiDriversId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiDriversId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiDriversIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiDriversId>>
>;
export type GetApiDriversIdQueryError =
  | APIResponseUnauthorizedDto
  | APIResponseForbiddenDto;

export function useGetApiDriversId<
  TData = Awaited<ReturnType<typeof getApiDriversId>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiDriversId>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiDriversId>>,
          TError,
          Awaited<ReturnType<typeof getApiDriversId>>
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiDriversId<
  TData = Awaited<ReturnType<typeof getApiDriversId>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiDriversId>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiDriversId>>,
          TError,
          Awaited<ReturnType<typeof getApiDriversId>>
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiDriversId<
  TData = Awaited<ReturnType<typeof getApiDriversId>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiDriversId>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary [어드민] 운전자 상세 조회
 */

export function useGetApiDriversId<
  TData = Awaited<ReturnType<typeof getApiDriversId>>,
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiDriversId>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetApiDriversIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * [어드민] 운전자 수정
 * @summary [어드민] 운전자 수정
 */
export const patchApiDriversId = (
  id: string,
  updateDriverDto: UpdateDriverDto,
) => {
  return customAxios<APIResponseBoolean>({
    url: `/api/drivers/${id}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateDriverDto,
  });
};

export const getPatchApiDriversIdMutationOptions = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiDriversId>>,
    TError,
    { id: string; data: UpdateDriverDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchApiDriversId>>,
  TError,
  { id: string; data: UpdateDriverDto },
  TContext
> => {
  const mutationKey = ["patchApiDriversId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchApiDriversId>>,
    { id: string; data: UpdateDriverDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchApiDriversId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchApiDriversIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchApiDriversId>>
>;
export type PatchApiDriversIdMutationBody = UpdateDriverDto;
export type PatchApiDriversIdMutationError =
  | APIResponseUnauthorizedDto
  | APIResponseForbiddenDto;

/**
 * @summary [어드민] 운전자 수정
 */
export const usePatchApiDriversId = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiDriversId>>,
    TError,
    { id: string; data: UpdateDriverDto },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchApiDriversId>>,
  TError,
  { id: string; data: UpdateDriverDto },
  TContext
> => {
  const mutationOptions = getPatchApiDriversIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * [어드민] 운전자 삭제
 * @summary [어드민] 운전자 삭제
 */
export const deleteApiDriversId = (id: string) => {
  return customAxios<APIResponseBoolean>({
    url: `/api/drivers/${id}`,
    method: "DELETE",
  });
};

export const getDeleteApiDriversIdMutationOptions = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiDriversId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteApiDriversId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["deleteApiDriversId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteApiDriversId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteApiDriversId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteApiDriversIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteApiDriversId>>
>;

export type DeleteApiDriversIdMutationError =
  | APIResponseUnauthorizedDto
  | APIResponseForbiddenDto;

/**
 * @summary [어드민] 운전자 삭제
 */
export const useDeleteApiDriversId = <
  TError = APIResponseUnauthorizedDto | APIResponseForbiddenDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiDriversId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteApiDriversId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteApiDriversIdMutationOptions(options);

  return useMutation(mutationOptions);
};
