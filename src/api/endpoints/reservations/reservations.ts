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
  APIResponseAvailableCarResponseDto,
  APIResponseBoolean,
  APIResponseForbiddenDto,
  APIResponseReservationDetailResponseDto,
  APIResponseReservationResponseForAdminDto,
  APIResponseUnauthorizedDto,
  GetApiReservationsAvailableParams,
  GetApiReservationsParams,
  UpdateReservationDetailDto,
  UpdateReservationDto,
} from "../../model";
import { customAxios } from "../../mutator/customAxios";
import type { ErrorType } from "../../mutator/customAxios";

/**
 * [어드민] 예약 목록 조회
 * @summary [어드민] 예약 목록 조회
 */
export const getApiReservations = (
  params: GetApiReservationsParams,
  signal?: AbortSignal,
) => {
  return customAxios<APIResponseReservationResponseForAdminDto>({
    url: `/api/reservations`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetApiReservationsQueryKey = (
  params: GetApiReservationsParams,
) => {
  return [`/api/reservations`, ...(params ? [params] : [])] as const;
};

export const getGetApiReservationsQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiReservations>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  params: GetApiReservationsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservations>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetApiReservationsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiReservations>>
  > = ({ signal }) => getApiReservations(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiReservations>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiReservationsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiReservations>>
>;
export type GetApiReservationsQueryError = ErrorType<
  APIResponseUnauthorizedDto | APIResponseForbiddenDto
>;

export function useGetApiReservations<
  TData = Awaited<ReturnType<typeof getApiReservations>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  params: GetApiReservationsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservations>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservations>>,
          TError,
          Awaited<ReturnType<typeof getApiReservations>>
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservations<
  TData = Awaited<ReturnType<typeof getApiReservations>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  params: GetApiReservationsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservations>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservations>>,
          TError,
          Awaited<ReturnType<typeof getApiReservations>>
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservations<
  TData = Awaited<ReturnType<typeof getApiReservations>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  params: GetApiReservationsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservations>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary [어드민] 예약 목록 조회
 */

export function useGetApiReservations<
  TData = Awaited<ReturnType<typeof getApiReservations>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  params: GetApiReservationsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservations>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetApiReservationsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * 예약 가능한 차량 목록 조회
 * @summary 예약 가능한 차량 목록 조회
 */
export const getApiReservationsAvailable = (
  params: GetApiReservationsAvailableParams,
  signal?: AbortSignal,
) => {
  return customAxios<APIResponseAvailableCarResponseDto>({
    url: `/api/reservations/available`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetApiReservationsAvailableQueryKey = (
  params: GetApiReservationsAvailableParams,
) => {
  return [`/api/reservations/available`, ...(params ? [params] : [])] as const;
};

export const getGetApiReservationsAvailableQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiReservationsAvailable>>,
  TError = ErrorType<unknown>,
>(
  params: GetApiReservationsAvailableParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsAvailable>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetApiReservationsAvailableQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiReservationsAvailable>>
  > = ({ signal }) => getApiReservationsAvailable(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiReservationsAvailable>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiReservationsAvailableQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiReservationsAvailable>>
>;
export type GetApiReservationsAvailableQueryError = ErrorType<unknown>;

export function useGetApiReservationsAvailable<
  TData = Awaited<ReturnType<typeof getApiReservationsAvailable>>,
  TError = ErrorType<unknown>,
>(
  params: GetApiReservationsAvailableParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsAvailable>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservationsAvailable>>,
          TError,
          Awaited<ReturnType<typeof getApiReservationsAvailable>>
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservationsAvailable<
  TData = Awaited<ReturnType<typeof getApiReservationsAvailable>>,
  TError = ErrorType<unknown>,
>(
  params: GetApiReservationsAvailableParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsAvailable>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservationsAvailable>>,
          TError,
          Awaited<ReturnType<typeof getApiReservationsAvailable>>
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservationsAvailable<
  TData = Awaited<ReturnType<typeof getApiReservationsAvailable>>,
  TError = ErrorType<unknown>,
>(
  params: GetApiReservationsAvailableParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsAvailable>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary 예약 가능한 차량 목록 조회
 */

export function useGetApiReservationsAvailable<
  TData = Awaited<ReturnType<typeof getApiReservationsAvailable>>,
  TError = ErrorType<unknown>,
>(
  params: GetApiReservationsAvailableParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsAvailable>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetApiReservationsAvailableQueryOptions(
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * [어드민] 예약 상세 정보 조회
 * @summary [어드민] 예약 상세 정보 조회
 */
export const getApiReservationsId = (id: string, signal?: AbortSignal) => {
  return customAxios<APIResponseReservationDetailResponseDto>({
    url: `/api/reservations/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetApiReservationsIdQueryKey = (id: string) => {
  return [`/api/reservations/${id}`] as const;
};

export const getGetApiReservationsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiReservationsId>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsId>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetApiReservationsIdQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiReservationsId>>
  > = ({ signal }) => getApiReservationsId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiReservationsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetApiReservationsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiReservationsId>>
>;
export type GetApiReservationsIdQueryError = ErrorType<
  APIResponseUnauthorizedDto | APIResponseForbiddenDto
>;

export function useGetApiReservationsId<
  TData = Awaited<ReturnType<typeof getApiReservationsId>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsId>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservationsId>>,
          TError,
          Awaited<ReturnType<typeof getApiReservationsId>>
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservationsId<
  TData = Awaited<ReturnType<typeof getApiReservationsId>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsId>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReservationsId>>,
          TError,
          Awaited<ReturnType<typeof getApiReservationsId>>
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetApiReservationsId<
  TData = Awaited<ReturnType<typeof getApiReservationsId>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsId>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary [어드민] 예약 상세 정보 조회
 */

export function useGetApiReservationsId<
  TData = Awaited<ReturnType<typeof getApiReservationsId>>,
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiReservationsId>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetApiReservationsIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * [어드민] 예약 상태 수정
 * @summary [어드민] 예약 상태 수정
 */
export const patchApiReservationsId = (
  id: string,
  updateReservationDto: UpdateReservationDto,
) => {
  return customAxios<APIResponseBoolean>({
    url: `/api/reservations/${id}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateReservationDto,
  });
};

export const getPatchApiReservationsIdMutationOptions = <
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiReservationsId>>,
    TError,
    { id: string; data: UpdateReservationDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchApiReservationsId>>,
  TError,
  { id: string; data: UpdateReservationDto },
  TContext
> => {
  const mutationKey = ["patchApiReservationsId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchApiReservationsId>>,
    { id: string; data: UpdateReservationDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchApiReservationsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchApiReservationsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchApiReservationsId>>
>;
export type PatchApiReservationsIdMutationBody = UpdateReservationDto;
export type PatchApiReservationsIdMutationError = ErrorType<
  APIResponseUnauthorizedDto | APIResponseForbiddenDto
>;

/**
 * @summary [어드민] 예약 상태 수정
 */
export const usePatchApiReservationsId = <
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiReservationsId>>,
    TError,
    { id: string; data: UpdateReservationDto },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchApiReservationsId>>,
  TError,
  { id: string; data: UpdateReservationDto },
  TContext
> => {
  const mutationOptions = getPatchApiReservationsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * [어드민] 예약 상세 정보 수정
 * @summary [어드민] 예약 상세 정보 수정
 */
export const patchApiReservationsIdDetail = (
  id: string,
  updateReservationDetailDto: UpdateReservationDetailDto,
) => {
  return customAxios<APIResponseBoolean>({
    url: `/api/reservations/${id}/detail`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateReservationDetailDto,
  });
};

export const getPatchApiReservationsIdDetailMutationOptions = <
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiReservationsIdDetail>>,
    TError,
    { id: string; data: UpdateReservationDetailDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchApiReservationsIdDetail>>,
  TError,
  { id: string; data: UpdateReservationDetailDto },
  TContext
> => {
  const mutationKey = ["patchApiReservationsIdDetail"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchApiReservationsIdDetail>>,
    { id: string; data: UpdateReservationDetailDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchApiReservationsIdDetail(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchApiReservationsIdDetailMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchApiReservationsIdDetail>>
>;
export type PatchApiReservationsIdDetailMutationBody =
  UpdateReservationDetailDto;
export type PatchApiReservationsIdDetailMutationError = ErrorType<
  APIResponseUnauthorizedDto | APIResponseForbiddenDto
>;

/**
 * @summary [어드민] 예약 상세 정보 수정
 */
export const usePatchApiReservationsIdDetail = <
  TError = ErrorType<APIResponseUnauthorizedDto | APIResponseForbiddenDto>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchApiReservationsIdDetail>>,
    TError,
    { id: string; data: UpdateReservationDetailDto },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchApiReservationsIdDetail>>,
  TError,
  { id: string; data: UpdateReservationDetailDto },
  TContext
> => {
  const mutationOptions =
    getPatchApiReservationsIdDetailMutationOptions(options);

  return useMutation(mutationOptions);
};
