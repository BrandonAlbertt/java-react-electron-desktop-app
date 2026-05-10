import axiosClient from "./axiosClient";

export async function obtenerAvatar() {
    const response = await axiosClient.get("/api/avatares");
    return response.data;
}