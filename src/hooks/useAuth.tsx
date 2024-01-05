import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACCESS_TOKEN_KEY,
  PHONE_NUMBER,
  REFRESH_TOKEN_KEY,
} from "../lib/constants";
import { useToast } from "./useToast";
import client from "@/lib/axiosClient";
import { getNewAccessToken } from "@/api/auth/auth";

const removeOnLogoutKeys = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY];

export interface ILoginData {
  accessToken: string;
  refreshToken: string;
}

const AuthContext = createContext<{
  userPhoneNumber: number | undefined;
  authStateLoaded: boolean;
  isLoggedIn: boolean;
  accessToken?: string | undefined;
  clearStateOnLogout: () => void;
  onLoginSuccess: (data: ILoginData) => void;
}>({
  userPhoneNumber: undefined,
  authStateLoaded: false,
  isLoggedIn: false,
  clearStateOnLogout: () => {},
  onLoginSuccess: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authStateLoaded, setAuthStateLoaded] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState<number>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const accessTokenRef = useRef<string | null>();
  const refreshTokenCountRef = useRef<number>(0);
  const logoutCountRef = useRef<number>(0);
  const { toastSuccess, toastError, toastWarning } = useToast();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      await reloadPersistedAuthToken();
      setAuthStateLoaded(true);
      accessTokenRef.current && setIsLoggedIn(true);
    })();
    attachResponseInterceptor();
  }, []);

  useEffect(() => {
    if (!accessTokenRef.current && authStateLoaded) {
      router.push("/login");
    }
  }, [authStateLoaded]);

  const onLoginSuccess = async ({ accessToken, refreshToken }: ILoginData) => {
    await setPersistedAuthToken(accessToken, refreshToken);
    setIsLoggedIn(true);
    toastSuccess("Welcome Back");
    router.push(`/home`);
  };

  const reloadPersistedAuthToken = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const phoneNumber = localStorage.getItem(PHONE_NUMBER);
      accessTokenRef.current = accessToken;
      setRefreshToken(refreshToken || "");
      setAccessToken(accessToken || "");
      phoneNumber && setUserPhoneNumber(parseInt(phoneNumber));
    } catch (error) {
      console.log("reloadPersistedAuthToken------", error);
    }
  };

  const clearStateOnLogout = async () => {
    accessTokenRef.current = null;
    setAccessToken(undefined);
    setRefreshToken(undefined);
    removeOnLogoutKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionStorage.clear();
    accessTokenRef.current && localStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const setPersistedAuthToken = async (
    accessToken: string,
    refreshToken?: string,
  ) => {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      refreshToken && localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      accessTokenRef.current = accessToken;
      refreshTokenCountRef.current = 0;
    } catch (error) {
      clearStateOnLogout();
    }
  };

  const attachResponseInterceptor = () => {
    client.interceptors.request.use((config: any) => {
      config.headers.Authorization = accessTokenRef.current;
      return config;
    });

    let requestArray: any = [];
    client.interceptors.response.use(
      (response) => {
        if (response?.status === 403) {
          toastError("You have been logged out");
          setTimeout(() => {
            clearStateOnLogout();
          }, 1000);
        }
        if (response.data) {
          const { success, data, errorMessage } = response.data;

          requestArray = requestArray.filter(Boolean);
          if (requestArray.length != 0) {
            requestArray.forEach(function (x: any, i: any) {
              if (response.config?.url == x?.url) {
                requestArray.splice(i, 1);
              }
            });
          }

          if (success === false) {
            response.status = 500;
            return Promise.reject(new Error(errorMessage));
          }
        }

        requestArray = requestArray.filter(Boolean);
        if (requestArray.length != 0) {
          requestArray.forEach(function (x: any, i: any) {
            if (x && response?.config?.url == x?.url) {
              requestArray.splice(i, 1);
            }
          });
        }
        return response;
      },
      async (error) => {
        if (
          error.data === "Invalid refresh token." ||
          error.response.data === "Invalid refresh token."
        ) {
          clearStateOnLogout();
          toastWarning("Logging out");
        }
        const originalRequest = error.config; // save original request to be retried later
        error?.response?.status !== 403 &&
          error?.response?.status !== 401 &&
          requestArray.push(originalRequest);
        if (error?.response?.status === 403) {
          if (logoutCountRef.current < 5) {
            logoutCountRef.current = logoutCountRef.current + 1;
          } else {
            clearStateOnLogout();
          }
        } else if (error?.response?.status === 401 && !originalRequest._retry) {
          try {
            if (refreshTokenCountRef.current < 1) {
              refreshTokenCountRef.current = refreshTokenCountRef.current + 1;
              const res = await getNewAccessToken();
              if (res.status === 403) {
                await clearStateOnLogout();
              } else if (res) {
                const { accessToken } = res.data;
                await setPersistedAuthToken(accessToken);
              } else {
                await clearStateOnLogout();
              }
            }
          } catch (error: any) {
            if (error.response.data.errorCode === 403) {
              if (logoutCountRef.current < 1) {
                logoutCountRef.current = logoutCountRef.current + 1;
              } else {
              }
              clearStateOnLogout();
            }
          }
        } else {
          const errorMessage = "Something went wrong";
          clearStateOnLogout();
        }
        return Promise.reject(error);
      },
    );
  };

  const authContextValue = {
    userPhoneNumber,
    authStateLoaded,
    isLoggedIn,
    accessToken,
    refreshToken,
    clearStateOnLogout,
    onLoginSuccess,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
