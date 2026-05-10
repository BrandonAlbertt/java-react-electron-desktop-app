import axiosClient from "./axiosClient";

// datosGrupo puede ser un FormData ya preparado o un objeto { nombre, imagen }
export async function agregarGrupos(datosGrupo) {
    const formData =
        datosGrupo instanceof FormData
            ? datosGrupo
            : (() => {
                  const fd = new FormData();
                  if (datosGrupo?.nombre) fd.append("nombre", datosGrupo.nombre);
                  if (datosGrupo?.imagen) fd.append("imagen", datosGrupo.imagen);
                  return fd;
              })();

    const response = await axiosClient.post(
        "/api/grupos-musicales/crear-con-imagen",
        formData,
        {
            headers: {
                // Dejar que axios configure el boundary automáticamente pero indicar multipart
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}