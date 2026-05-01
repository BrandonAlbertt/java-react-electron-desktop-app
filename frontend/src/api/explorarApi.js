import axiosClient from "./axiosClient";

export async function obtenerExplorar() {
    const response = await axiosClient.get("/api/explorar");
    return response.data;
}