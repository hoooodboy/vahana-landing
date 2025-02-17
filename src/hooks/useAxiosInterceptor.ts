import { useEffect } from "react";

import tokens from "@/src/tokens";
import { Mutex } from "async-mutex";
import axios, { AxiosError } from "axios";
import { axiosInstance, CustomErrorType } from "../api/mutator/customAxios";

const envs = { apiHost: null };

const mutex = new Mutex();

type ErrorHandlerType = (err: CustomErrorType) => Promise<void>;

const useAxiosInterceptor = (
  onErrorWhileRenewToken: ErrorHandlerType,
  responseOnError: ErrorHandlerType
) => {
  const requestHandler = async (config: any) => {
    console.log("1234");
    if (!tokens.accessToken) {
      return config;
    }

    await lockUntilRenewToken(onErrorWhileRenewToken);
    if (!tokens.accessToken) {
      console.log("토큰업서영");
      /*
       *  Promise.reject() 를 하면 불필요한 요청을 막을 순 있지만
       *  useQuery 를 쓰는쪽에서 받는 에러가 불명확함.
       *  그리고 queryClient option의 retry 를 쓴다면 의미없어보임.
       *  어떻게 할지 고민이 필요함. */
      // return Promise.reject('access-token이 없습니다.');
    }
    console.log("토큰있어영");
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        ...config?.headers,
      },
    };
  };

  const requestInterceptor = axiosInstance.interceptors.request.use(
    requestHandler,
    (err) => Promise.reject(err)
  );

  const responseErrorHandler = async (err: CustomErrorType) => {
    await responseOnError(err);
    return Promise.reject(err);
  };

  const responseHandler = (response: any) => {
    return response;
  };

  const responseInterceptor = axiosInstance.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => responseErrorHandler(error)
  );

  useEffect(() => {
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [requestInterceptor, responseInterceptor]);
};

export default useAxiosInterceptor;

async function lockUntilRenewToken(
  onErrorWhileRenewToken: (err: CustomErrorType) => void
) {
  // mutex가 lock상태면 여기서 pending 후
  // lock이 풀리면 진행됨
  await mutex.waitForUnlock();

  const now = new Date().getTime();
  const expired = tokens.accessTokenExpired ?? 0;

  if (!mutex.isLocked()) {
    // 토큰이 있는데 만료시 재발급 시도
    if (now + 10000 > expired) {
      // mutex.acquire 실행시 mutex.isLocked() -> true
      const release = await mutex.acquire();
      try {
        const token = `Bearer ${tokens.refreshToken ?? ""}`;
        const res = await axios.get<any>(
          `${envs.apiHost}/api/users/access-token`,
          {
            headers: { Authorization: token },
          }
        );

        if (!res.data.result?.accessToken) {
          throw res;
        }
        await tokens.setAccessToken(res.data.result.accessToken);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          await onErrorWhileRenewToken(err);
        } else {
          // 아래 로그가 뜨는 케이스 발견되면 확인 후 핸들링이 필요함.
          console.error("error in axiosInterceptor :", err);
        }
      } finally {
        // 토큰 발급 완료 후 mutex lock을 풀어준다.
        release();
      }
    }
  } else {
    // mutex가 lock상태면 여기서 pending 후
    // lock이 풀리면 진행됨
    await mutex.waitForUnlock();
  }
}
