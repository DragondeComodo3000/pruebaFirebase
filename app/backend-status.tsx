"use client";

import { useEffect, useState } from "react";
import styles from "./backend-status.module.css";

type Estado = { tipo: "cargando" | "conectado" | "error"; mensaje: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export default function BackendStatus() {
  const [estado, setEstado] = useState<Estado>({
    tipo: "cargando",
    mensaje: "Consultando productos...",
  });

  useEffect(() => {
    if (!apiUrl) {
      setEstado({ tipo: "error", mensaje: "Falta configurar NEXT_PUBLIC_API_URL" });
      return;
    }

    const controller = new AbortController();

    async function consultarProductos() {
      try {
        const respuesta = await fetch(`${apiUrl}/api/productos`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const productos: unknown = await respuesta.json();
        if (!Array.isArray(productos)) throw new Error("Respuesta inesperada");

        setEstado({
          tipo: "conectado",
          mensaje: `Backend conectado: ${productos.length} producto${productos.length === 1 ? "" : "s"}`,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        const detalle = error instanceof Error ? error.message : "Error desconocido";
        setEstado({ tipo: "error", mensaje: `No se pudo consultar el backend (${detalle})` });
      }
    }

    void consultarProductos();
    return () => controller.abort();
  }, []);

  return (
    <section className={styles.root} aria-labelledby="backend-title">
      <div>
        <p className={styles.eyebrow}>PRUEBA DE CONEXIÓN</p>
        <h2 id="backend-title" className={styles.title}>Frontend y backend</h2>
        <p className={styles.description}>Consulta en vivo al catálogo de productos.</p>
      </div>
      <p className={`${styles.status} ${styles[estado.tipo]}`} role="status">
        <span className={styles.dot} aria-hidden="true" />
        {estado.mensaje}
      </p>
    </section>
  );
}
