import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { dashboard } from '@/routes';
import productos from '@/routes/productos';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    title: string;
    precio: number;
    categoria_id: number;
    categoria?: Categoria;
}

interface Props {
    productos: Producto[];
    categorias: Categoria[];
}

export default function Index({
    productos: lista,
    categorias,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        precio: '',
        categoria_id: '',
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(productos.store.url(), {
            onSuccess: () => reset(),
        });
    }

    function eliminar(producto: Producto) {
        router.delete(
            productos.destroy.url({
                producto: producto.id,
            }),
        );
    }

    return (
        <>
            <Head title="Productos" />

            <div className="container py-4">

                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        Productos
                    </h1>

                    <a
                        href="/productos/reporte-pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success"
                    >
                        Generar PDF Productos
                    </a>
                </div>

                {/* Formulario */}
                <div className="card mb-4">

                    <div className="card-header">
                        Nuevo producto
                    </div>

                    <div className="card-body">

                        <form
                            onSubmit={submit}
                            className="row g-3"
                        >

                            {/* Título */}
                            <div className="col-md-4">

                                <label
                                    htmlFor="title"
                                    className="form-label"
                                >
                                    Título
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    className={
                                        errors.title
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                    value={data.title}
                                    onChange={(e) =>
                                        setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                />

                                {errors.title && (
                                    <div className="invalid-feedback">
                                        {errors.title}
                                    </div>
                                )}

                            </div>

                            {/* Precio */}
                            <div className="col-md-3">

                                <label
                                    htmlFor="precio"
                                    className="form-label"
                                >
                                    Precio
                                </label>

                                <input
                                    id="precio"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={
                                        errors.precio
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                    value={data.precio}
                                    onChange={(e) =>
                                        setData(
                                            'precio',
                                            e.target.value,
                                        )
                                    }
                                />

                                {errors.precio && (
                                    <div className="invalid-feedback">
                                        {errors.precio}
                                    </div>
                                )}

                            </div>

                            {/* Categoría */}
                            <div className="col-md-4">

                                <label
                                    htmlFor="categoria_id"
                                    className="form-label"
                                >
                                    Categoría
                                </label>

                                <select
                                    id="categoria_id"
                                    className={
                                        errors.categoria_id
                                            ? 'form-select is-invalid'
                                            : 'form-select'
                                    }
                                    value={data.categoria_id}
                                    onChange={(e) =>
                                        setData(
                                            'categoria_id',
                                            e.target.value,
                                        )
                                    }
                                >

                                    <option value="">
                                        Selecciona una categoría
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nombre}
                                        </option>
                                    ))}

                                </select>

                                {errors.categoria_id && (
                                    <div className="invalid-feedback">
                                        {errors.categoria_id}
                                    </div>
                                )}

                            </div>

                            {/* Guardar */}
                            <div className="col-md-1 d-flex align-items-end">

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={processing}
                                >
                                    Guardar
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {/* Tabla */}
                <div className="table-responsive">

                    <table className="table table-striped table-hover align-middle">

                        <thead>

                            <tr>

                                <th scope="col">
                                    #
                                </th>

                                <th scope="col">
                                    Título
                                </th>

                                <th scope="col">
                                    Precio
                                </th>

                                <th scope="col">
                                    Categoría
                                </th>

                                <th
                                    scope="col"
                                    className="text-end"
                                >
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {lista.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="text-center py-4"
                                    >
                                        No hay productos registrados.
                                    </td>

                                </tr>

                            ) : (

                                lista.map((producto) => (

                                    <tr key={producto.id}>

                                        <td>
                                            {producto.id}
                                        </td>

                                        <td>
                                            {producto.title}
                                        </td>

                                        <td>
                                            $
                                            {Number(
                                                producto.precio,
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {producto.categoria?.nombre ?? '—'}
                                        </td>

                                        <td className="text-end">

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    eliminar(producto)
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Productos',
            href: '/productos',
        },
    ],
};

