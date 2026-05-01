/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                          useUsuario.js (HOOK)                                 ║
║                                                                                ║
║  ¿QUÉ ES UN HOOK?                                                              ║
║  Un hook es una función especial de React que guarda datos y comportamientos   ║
║  que los componentes pueden reutilizar. Es como una "caja de herramientas"     ║
║  que contiene todo lo que necesita un componente para trabajar con usuarios.   ║
║                                                                                ║
║  ¿QUÉ HACE ESTE HOOK?                                                          ║
║  Proporciona funciones y datos para:
║  • Obtener lista de usuarios
║  • Obtener un usuario específico
║  • Crear nuevo usuario
║  • Modificar usuario existente
║  • Eliminar usuario
║  • Controlar si está cargando, si hay error, etc.
║                                                                                ║
║  ¿CÓMO SE RELACIONA CON usuarioApi.js?                                        ║
║  usuarioApi.js = las funciones básicas (GET, POST, PUT, DELETE)              ║
║  useUsuario.js = empaqueta esas funciones con datos (loading, error)         ║
║                = lo hace más fácil de usar en componentes                     ║
║                                                                                ║
║  FLUJO COMPLETO:                                                               ║
║  Componente usa useUsuario()                                                  ║
║           ↓
║  Hook usa funciones de usuarioApi.js                                         ║
║           ↓
║  usuarioApi.js habla con el servidor                                         ║
║           ↓
║  Servidor responde con datos                                                 ║
║           ↓
║  Datos vuelven al componente                                                 ║
║                                                                                ║
║  EJEMPLO DE USO EN UN COMPONENTE:                                             ║
║  ────────────────────────────────────────────────────────────────────────── ║
║  import { useUsuario } from "../hooks/useUsuario";                           ║
║                                                                                ║
║  export default function MiComponente() {                                     ║
║      // Llamar el hook para obtener usuarios y funciones                      ║
║      const { usuarios, loading, error } = useUsuario();                       ║
║                                                                                ║
║      if (loading) return <p>Cargando...</p>;                                 ║
║      if (error) return <p>Error: {error}</p>;                                ║
║                                                                                ║
║      return (                                                                 ║
║          <ul>                                                                 ║
║              {usuarios.map(usuario => (                                      ║
║                  <li key={usuario.id}>{usuario.nombre}</li>                  ║
║              ))}                                                              ║
║          </ul>                                                                ║
║      );                                                                       ║
║  }                                                                            ║
║  ────────────────────────────────────────────────────────────────────────── ║
║                                                                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

import { useEffect, useState } from "react";
import {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
} from "../api/usuarioApi";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTAR LA FUNCIÓN HOOK (para que otros archivos la usen)
// ═══════════════════════════════════════════════════════════════════════════════
// usuarioId = parámetro opcional para cargar un usuario específico
//             si pasas usuarioId={1}, carga el usuario con ID 1
//             si no pasas nada, carga la lista de todos
//
export function useUsuario(usuarioId = null) {

    // ───────────────────────────────────────────────────────────────────────────
    // ESTADO: Variables que guardan datos importantes
    // ───────────────────────────────────────────────────────────────────────────
    
    // usuarios = lista de TODOS los usuarios del servidor
    // setUsuarios = función para cambiar la lista
    // useState([]) = empieza como lista vacía
    const [usuarios, setUsuarios] = useState([]);
    
    // usuario = UN usuario específico (cuando buscas uno en particular)
    // setUsuario = función para cambiar este usuario
    const [usuario, setUsuario] = useState(null);
    
    // loading = true mientras el servidor está procesando
    //           false cuando termina
    //           Se usa para mostrar "Cargando..." en la pantalla
    const [loading, setLoading] = useState(false);
    
    // error = guarda mensajes de error si algo sale mal
    //         null si todo va bien
    const [error, setError] = useState(null);


    // ───────────────────────────────────────────────────────────────────────────
    // FUNCIÓN 1: cargarUsuarios()
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Obtiene TODOS los usuarios del servidor y los guarda en memoria
    //
    // PASO A PASO:
    // 1. setLoading(true) = le dice a la pantalla "estoy cargando"
    // 2. setError(null) = borra errores anteriores
    // 3. listarUsuarios() = llama a la función de usuarioApi.js
    // 4. setUsuarios(data) = guarda los usuarios que volvieron
    // 5. catch = si hay error, lo captura
    // 6. finally = al final SIEMPRE hace setLoading(false) para dejar de cargar
    //
    // ¿DÓNDE SE USA?
    // Se retorna en la salida del hook para que los componentes la llamen
    // Ejemplo: const { cargarUsuarios } = useUsuario();
    //          cargarUsuarios(); // lo llama cuando necesita actualizar
    //
    async function cargarUsuarios() {
        try {
            // "Estoy haciendo algo" = le dice a React que muestre loading
            setLoading(true);
            // Borrar error anterior para empezar limpio
            setError(null);

            // LLAMAR LA FUNCIÓN DE LA API
            // listarUsuarios() trae todos los usuarios del servidor
            const data = await listarUsuarios();
            
            // GUARDAR LOS DATOS
            // Ahora la variable "usuarios" contiene la lista
            setUsuarios(data);
        } catch (error) {
            // SI ALGO SALE MAL
            console.error(error);
            // Guardar el mensaje de error para mostrarlo en la pantalla
            setError("No se pudieron cargar los usuarios");
        } finally {
            // SIEMPRE hacer esto al final
            // Le dice a React que ya terminó de cargar
            setLoading(false);
        }
    }


    // ───────────────────────────────────────────────────────────────────────────
    // FUNCIÓN 2: cargarUsuarioPorId(id)
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Busca UN usuario específico por su ID y lo guarda en memoria
    //
    // PARÁMETRO:
    // id = el número identificador del usuario que quieres
    //      ejemplo: cargarUsuarioPorId(5) busca al usuario número 5
    //
    // ¿DÓNDE SE USA?
    // Se retorna para que los componentes la usen
    // Ejemplo: const { cargarUsuarioPorId } = useUsuario();
    //          cargarUsuarioPorId(1); // obtiene el usuario con ID 1
    //
    async function cargarUsuarioPorId(id) {
        try {
            setLoading(true);
            setError(null);

            // Llamar a la función de la API con el ID
            // obtenerUsuarioPorId(id) obtiene UN usuario del servidor
            const data = await obtenerUsuarioPorId(id);
            
            // Guardar ese usuario (no la lista, solo uno)
            setUsuario(data);
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar el usuario");
        } finally {
            setLoading(false);
        }
    }


    // ───────────────────────────────────────────────────────────────────────────
    // FUNCIÓN 3: registrarUsuario(data)
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Crea un nuevo usuario en el servidor
    //
    // PARÁMETRO:
    // data = objeto con info del nuevo usuario
    //        ejemplo: { nombre: "Maria", email: "maria@mail.com" }
    //
    // PASO A PASO:
    // 1. crearUsuario(data) = crea el nuevo usuario en el servidor
    // 2. cargarUsuarios() = vuelve a traer la lista para mostrar el nuevo
    // 3. return = devuelve el usuario creado
    //
    // ¿DÓNDE SE USA?
    // const { registrarUsuario } = useUsuario();
    // registrarUsuario({ nombre: "Juan", email: "juan@mail.com" });
    //
    async function registrarUsuario(data) {
        // Llamar función de API para crear
        const nuevoUsuario = await crearUsuario(data);
        
        // Recargar la lista para que aparezca el nuevo
        await cargarUsuarios();
        
        // Devolver el nuevo usuario creado
        return nuevoUsuario;
    }


    // ───────────────────────────────────────────────────────────────────────────
    // FUNCIÓN 4: actualizarUsuario(id, data)
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Modifica los datos de un usuario existente
    //
    // PARÁMETROS:
    // id = el ID del usuario a modificar
    // data = los nuevos datos
    //        ejemplo: { nombre: "Juan Nuevo" }
    //
    // ¿DÓNDE SE USA?
    // const { actualizarUsuario } = useUsuario();
    // actualizarUsuario(1, { nombre: "Nuevo nombre" });
    //
    async function actualizarUsuario(id, data) {
        // Llamar función de API para editar
        const usuarioActualizado = await editarUsuario(id, data);
        
        // Recargar la lista para que muestre los cambios
        await cargarUsuarios();
        
        // Devolver el usuario modificado
        return usuarioActualizado;
    }


    // ───────────────────────────────────────────────────────────────────────────
    // FUNCIÓN 5: borrarUsuario(id)
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Elimina un usuario del servidor
    //
    // PARÁMETRO:
    // id = el ID del usuario a borrar
    //
    // ¿DÓNDE SE USA?
    // const { borrarUsuario } = useUsuario();
    // borrarUsuario(1); // elimina el usuario con ID 1
    //
    async function borrarUsuario(id) {
        // Llamar función de API para borrar
        const resultado = await eliminarUsuario(id);
        
        // Recargar la lista sin el usuario borrado
        await cargarUsuarios();
        
        // Devolver confirmación
        return resultado;
    }


    // ───────────────────────────────────────────────────────────────────────────
    // useEffect: "Cuando el componente carga, haz esto"
    // ───────────────────────────────────────────────────────────────────────────
    // ¿QUÉ HACE?
    // Automáticamente cuando el componente se monta o cuando usuarioId cambia,
    // carga los datos del servidor
    //
    // LÓGICA:
    // Si hay usuarioId = cargar ese usuario específico
    // Si NO hay usuarioId = cargar la lista de todos
    //
    // CUÁNDO SE EJECUTA:
    // • Cuando el componente se monta por primera vez
    // • Cuando usuarioId cambia (por eso está en el array [usuarioId])
    //
    useEffect(() => {
        // ¿Hay un ID específico?
        if (usuarioId) {
            // Sí: cargar ese usuario
            cargarUsuarioPorId(usuarioId);
        } else {
            // No: cargar todos los usuarios
            cargarUsuarios();
        }
    }, [usuarioId]); // Este array dice: "ejecutar cuando usuarioId cambie"


    // ───────────────────────────────────────────────────────────────────────────
    // RETORNAR: Lo que los componentes pueden usar
    // ───────────────────────────────────────────────────────────────────────────
    // Esto es lo que cualquier componente obtiene cuando usa este hook
    //
    // EJEMPLO DE USO EN UN COMPONENTE:
    // const { usuarios, usuario, loading, error, cargarUsuarios } = useUsuario(1);
    //
    return {
        // DATOS
        usuarios,           // Lista de TODOS los usuarios
        usuario,            // UN usuario específico
        loading,            // true mientras carga, false cuando termina
        error,              // Mensaje de error si algo falla
        
        // FUNCIONES (el componente puede llamarlas cuando necesite)
        cargarUsuarios,           // Obtener todos los usuarios
        cargarUsuarioPorId,       // Obtener un usuario específico
        registrarUsuario,         // Crear nuevo usuario
        actualizarUsuario,        // Modificar usuario existente
        borrarUsuario,            // Eliminar usuario
    };
}