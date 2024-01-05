import client from "@/lib/axiosClient";
import { API_BASE_URL } from "@/lib/constants";

export async function getAllMeals() {
    const { data, status  } = await client.get<any>(`${API_BASE_URL}meals`, {
    });
    if(status === 200){
        return data.data;
    }
    else{
        return undefined;
    }
}
