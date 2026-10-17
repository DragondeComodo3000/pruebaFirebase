"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./backend-status.module.css";

type Estado = { tipo: "cargando" | "conectado" | "error"; mensaje: string };
type Aviso = { tipo: "ok" | "error"; mensaje: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const mensajeCantidad = (cantidad: number) =>
  `Backend conectado: ${cantidad} producto${cantidad === 1 ? "" : "s"}`;
const detalleError = (error: unknown) => error instanceof Error ? error.message : "Error desconocido";

async function obtenerCantidad(signal?: AbortSignal) {
  if (!apiUrl) throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
  const respuesta = await fetch(`${apiUrl}/api/productos`, { signal, cache: "no-store" });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const productos: unknown = await respuesta.json();
  if (!Array.isArray(productos)) throw new Error("Respuesta inesperada");
  return productos.length;
}

export default function BackendStatus() {
  const [estado, setEstado] = useState<Estado>({
    tipo: "cargando",
    mensaje: "Consultando productos...",
  });
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void obtenerCantidad(controller.signal)
      .then((cantidad) => setEstado({ tipo: "conectado", mensaje: mensajeCantidad(cantidad) }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setEstado({ tipo: "error", mensaje: `No se pudo consultar el backend (${detalleError(error)})` });
        }
      });
    return () => controller.abort();
  }, []);

  async function crearProducto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardando) return;

    const formulario = event.currentTarget;
    const campos = new FormData(formulario);
    const nombre = String(campos.get("nombre") ?? "").trim();
    const precio = Number(campos.get("precio"));
    const stock = Number(campos.get("stock"));

    if (!nombre || nombre.length > 100 || !Number.isFinite(precio) || precio < 0 ||
        !Number.isInteger(stock) || stock < 0) {
      setAviso({ tipo: "error", mensaje: "Revisa el nombre, el precio y el stock." });
      return;
    }
    if (!apiUrl) {
      setAviso({ tipo: "error", mensaje: "Falta configurar NEXT_PUBLIC_API_URL." });
      return;
    }

    setGuardando(true);
    setAviso(null);
    try {
      const respuesta = await fetch(`${apiUrl}/api/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, stock }),
      });
      if (!respuesta.ok) {
        const datos: unknown = await respuesta.json().catch(() => null);
        const mensaje = datos && typeof datos === "object" && "error" in datos &&
          typeof datos.error === "string" ? datos.error : `HTTP ${respuesta.status}`;
        throw new Error(mensaje);
      }

      formulario.reset();
      setAviso({ tipo: "ok", mensaje: `Producto “${nombre}” creado correctamente.` });
      try {
        const cantidad = await obtenerCantidad();
        setEstado({ tipo: "conectado", mensaje: mensajeCantidad(cantidad) });
      } catch (error) {
        setEstado({ tipo: "error", mensaje: `Producto creado; no se pudo actualizar el contador (${detalleError(error)})` });
      }
    } catch (error) {
      setAviso({ tipo: "error", mensaje: `No se pudo crear el producto: ${detalleError(error)}` });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className={styles.root} aria-labelledby="backend-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PRUEBA DE CONEXIÓN</p>
          <h2 id="backend-title" className={styles.title}>Frontend y backend</h2>
          <p className={styles.description}>Crea un producto y comprueba la conexión con Render.</p>
        </div>
        <p className={`${styles.status} ${styles[estado.tipo]}`} role="status">
          <span className={styles.dot} aria-hidden="true" />
          {estado.mensaje}
        </p>
      </div>

      <form className={styles.form} onSubmit={crearProducto}>
        <div className={`${styles.field} ${styles.nameField}`}>
          <label htmlFor="producto-nombre">Nombre</label>
          <input id="producto-nombre" name="nombre" type="text" required maxLength={100} placeholder="Ej. Cuaderno" />
        </div>
        <div className={styles.field}>
          <label htmlFor="producto-precio">Precio</label>
          <input id="producto-precio" name="precio" type="number" required min="0" step="0.01" defaultValue="0" />
        </div>
        <div className={styles.field}>
          <label htmlFor="producto-stock">Stock</label>
          <input id="producto-stock" name="stock" type="number" required min="0" step="1" defaultValue="0" />
        </div>
        <button className={styles.button} type="submit" disabled={guardando || !apiUrl}>
          {guardando ? "Guardando..." : "Crear producto"}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      {aviso && <p className={`${styles.notice} ${styles[aviso.tipo]}`} role="status">{aviso.mensaje}</p>}
    </section>
  );
}
