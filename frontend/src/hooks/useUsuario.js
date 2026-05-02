import { useState } from "react";

import {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    loginUsuario as apiLoginUsuario,
} from "../api/usuarioApi";

/*
    useUsuario.js

    Hook para trabajar con usuarios.

    IMPORTANTE:
    Este hook NO carga usuarios automáticamente.
    Así evitamos llamar rutas protegidas antes de tener token.

    Se usa así:
    const { iniciarSesion } = useUsuario();
*/

export function useUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function cargarUsuarios() {
        try {
            setLoading(true);
            setError(null);

            const data = await listarUsuarios();
            setUsuarios(data);

            return data;
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar los usuarios");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function cargarUsuarioPorId(id) {
        try {
            setLoading(true);
            setError(null);

            const data = await obtenerUsuarioPorId(id);
            setUsuario(data);

            return data;
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function registrarUsuario(data) {
        try {
            setLoading(true);
            setError(null);

            const response = await crearUsuario(data);

            if (response?.token) {
                localStorage.setItem("token", response.token);
            }

            if (response?.usuario) {
                localStorage.setItem("usuario", JSON.stringify(response.usuario));
                setUsuario(response.usuario);
            }

            return response;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.mensaje || "No se pudo registrar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function actualizarUsuario(id, data) {
        try {
            setLoading(true);
            setError(null);

            const response = await editarUsuario(id, data);

            if (response?.usuario) {
                setUsuario(response.usuario);
                localStorage.setItem("usuario", JSON.stringify(response.usuario));
            }

            return response;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.mensaje || "No se pudo actualizar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function borrarUsuario(id) {
        try {
            setLoading(true);
            setError(null);

            const response = await eliminarUsuario(id);

            return response;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.mensaje || "No se pudo eliminar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function iniciarSesion(data) {
        try {
            setLoading(true);
            setError(null);

            const response = await apiLoginUsuario(data);

            if (response?.usuario) {
                setUsuario(response.usuario);
            }

            return response;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.mensaje || "No se pudo iniciar sesión");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);
        setUsuarios([]);
        setError(null);
        setLoading(false);
    }

    function cargarSesionGuardada() {
        const token = localStorage.getItem("token");
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!token || !usuarioGuardado) {
            return null;
        }

        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);

        return {
            token,
            usuario: usuarioParseado,
        };
    }

    return {
        usuarios,
        usuario,
        loading,
        error,

        cargarUsuarios,
        cargarUsuarioPorId,
        registrarUsuario,
        actualizarUsuario,
        borrarUsuario,
        iniciarSesion,
        cerrarSesion,
        cargarSesionGuardada,
    };
}