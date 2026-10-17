"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./backend-status.module.css";

type Producto = { id: number; nombre: string; precio: number; stock: number };
type Estado = { tipo: "cargando" | "conectado" | "error"; mensaje: string };
type Aviso = { tipo: "ok" | "error"; mensaje: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const formatoPrecio = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const detalleError = (error: unknown) =>
  error instanceof Error ? error.message : "Error desconocido";

async function obtenerProductos(signal?: AbortSignal): Promise<Producto[]> {
  if (!apiUrl) throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
  const respuesta = await fetch(`${apiUrl}/api/productos`, { signal, cache: "no-store" });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos: unknown = await respuesta.json();
  if (
    !Array.isArray(datos) ||
    !datos.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.nombre === "string" &&
        typeof item.precio === "number" &&
        typeof item.stock === "number",
    )
  ) {
    throw new Error("Respuesta inesperada");
  }
  return datos as Producto[];
}

export default function BackendStatus() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [estado, setEstado] = useState<Estado>({
    tipo: "cargando",
    mensaje: "Consultando productos...",
  });
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void obtenerProductos(controller.signal)
      .then((datos) => {
        setProductos(datos);
        setEstado({ tipo: "conectado", mensaje: "Conectado con Render" });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setEstado({
            tipo: "error",
            mensaje: `No se pudo consultar el backend (${detalleError(error)})`,
          });
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

    if (
      !nombre ||
      nombre.length > 100 ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
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
        const mensaje =
          datos &&
          typeof datos === "object" &&
          "error" in datos &&
          typeof datos.error === "string"
            ? datos.error
            : `HTTP ${respuesta.status}`;
        throw new Error(mensaje);
      }

      formulario.reset();
      setAviso({ tipo: "ok", mensaje: `Producto “${nombre}” creado correctamente.` });
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
        setEstado({ tipo: "conectado", mensaje: "Conectado con Render" });
      } catch (error) {
        setEstado({
          tipo: "error",
          mensaje: `Producto creado; no se pudo actualizar la lista (${detalleError(error)})`,
        });
      }
    } catch (error) {
      setAviso({
        tipo: "error",
        mensaje: `No se pudo crear el producto: ${detalleError(error)}`,
      });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className={styles.root} id="productos" aria-labelledby="backend-title">
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            CONEXIÓN EN VIVO
          </p>
          <h2 id="backend-title" className={styles.title}>
            Ideas que toman <span>forma.</span>
          </h2>
          <p className={styles.description}>
            Un pequeño catálogo conectado con nuestro backend en Render.
            Crea un producto y míralo aparecer aquí.
          </p>
        </div>
        <div className={styles.counter} aria-label={`${productos.length} productos registrados`}>
          <span className={styles.counterLabel}>EN EL CATÁLOGO</span>
          <strong>{estado.tipo !== "conectado" && productos.length === 0 ? "—" : productos.length.toString().padStart(2, "0")}</strong>
          <span className={styles.counterFoot}>productos registrados <span aria-hidden="true">↗</span></span>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.catalog}>
          <div className={styles.catalogHeading}>
            <div>
              <p className={styles.overline}>EXPLORA</p>
              <h3>Productos</h3>
            </div>
            <p className={`${styles.status} ${styles[estado.tipo]}`} role="status">
              <span className={styles.dot} aria-hidden="true" />
              {estado.mensaje}
            </p>
          </div>

          {estado.tipo === "cargando" ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">✳</span>
              <p>Estamos cargando el catálogo...</p>
            </div>
          ) : estado.tipo === "error" && productos.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">✳</span>
              <h4>No pudimos cargar los productos.</h4>
              <p>Comprueba la conexión e inténtalo de nuevo más tarde.</p>
            </div>
          ) : productos.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">✳</span>
              <h4>Aquí empieza todo.</h4>
              <p>El catálogo está vacío. Crea el primer producto con el formulario.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {productos.map((producto) => (
                <article className={styles.productCard} key={producto.id}>
                  <div className={styles.productTop}>
                    <span className={styles.productIcon} aria-hidden="true">
                      <svg viewBox="0 0 48 48" fill="none">
                        <path d="m24 6 16 9v18l-16 9-16-9V15l16-9Z" />
                        <path d="m8 15 16 9 16-9M24 24v18" />
                      </svg>
                    </span>
                    <span className={styles.productNumber}>
                      N.º {String(producto.id).padStart(2, "0")}
                    </span>
                  </div>
                  <h4>{producto.nombre}</h4>
                  <div className={styles.productFooter}>
                    <div>
                      <span className={styles.metaLabel}>PRECIO</span>
                      <strong>{formatoPrecio.format(producto.precio)}</strong>
                    </div>
                    <span className={styles.stock}>
                      <span className={styles.stockDot} aria-hidden="true" />
                      {producto.stock} en stock
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={crearProducto}>
          <div className={styles.formHeading}>
            <span className={styles.formIcon} aria-hidden="true">+</span>
            <p className={styles.overline}>HAZ LA PRUEBA</p>
            <h3>Nuevo producto<span>.</span></h3>
            <p>Añade uno y comprueba la conexión al instante.</p>
          </div>
          <div className={styles.field}>
            <label htmlFor="producto-nombre">Nombre del producto</label>
            <input id="producto-nombre" name="nombre" type="text" required maxLength={100} placeholder="Ej. Cuaderno" />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="producto-precio">Precio</label>
              <input id="producto-precio" name="precio" type="number" required min="0" step="0.01" defaultValue="0" />
            </div>
            <div className={styles.field}>
              <label htmlFor="producto-stock">Stock</label>
              <input id="producto-stock" name="stock" type="number" required min="0" step="1" defaultValue="0" />
            </div>
          </div>
          <button className={styles.button} type="submit" disabled={guardando || !apiUrl}>
            {guardando ? "Guardando..." : "Crear producto"}
            <span aria-hidden="true">↗</span>
          </button>
          {aviso && <p className={`${styles.notice} ${styles[aviso.tipo]}`} role="status">{aviso.mensaje}</p>}
        </form>
      </div>
    </section>
  );
}
