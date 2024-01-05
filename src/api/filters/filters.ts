import client from "@/lib/axiosClient";
import { API_BASE_URL } from "@/lib/constants";

export async function getAllFilters() {
    const { data } = await client.get<any>(`${API_BASE_URL}filters`, {
    });
    
    return data.data;
}
