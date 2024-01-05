import axios from "axios";
import { API_BASE_URL, REFRESH_TOKEN_KEY } from "@/lib/constants";
import client from "@/lib/axiosClient";

export async function requestOTP(phone_number : number) {
    const { data } = await axios.get<any>(`${API_BASE_URL}auth/request-otp?phone=${phone_number}`, {
    });
    return data.data;
}

export async function verifyOTP({phone_number, otp}: {phone_number: number, otp : string}) {
    const { data } = await axios.get<any>(`${API_BASE_URL}auth/verify-otp?phone=${phone_number}&otp=${otp}`);
    return data.data;
}

export async function getNewAccessToken() {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
    const res = await axios.post<any>(`${API_BASE_URL}auth/refresh`,
    {},
    {
        headers : { 'refreshToken': token },
    }
    );
    return res;
    } catch (error : any) {
        return error.response;
    }

  }
  