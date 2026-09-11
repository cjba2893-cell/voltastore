import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
}

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    productos_count?: number; // Generado por conWithCount('productos')
    productos?: Producto[];
}

export default function Index({
    categorias,
    editingCategoria,
}: {
    categorias: Categoria[];
    editingCategoria?: Categoria;
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);
    const [editingCategoriaLocal, setEditingCategoriaLocal] = useState<Categoria | null>(
        editingCategoria ?? null
    );

    const createForm = useForm({
        nombre: '',
        descripcion: '',
    });

    const editForm = useForm({
        nombre: '',
        descripcion: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createForm.post('/categorias', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateModalOpen(false);
            },
        });
    };

    const openEditModal = (categoria: Categoria) => {
        setEditingCategoriaLocal(categoria);

        editForm.setData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion ?? '',
        });

        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingCategoriaLocal) return;

        editForm.put(`/categorias/${editingCategoriaLocal.id}`, {
            onSuccess: () => {
                editForm.reset();
                setEditingCategoriaLocal(null);
                setIsEditModalOpen(false);
            },
        });
    };

    const openDeleteModal = (categoria: Categoria) => {
        setCategoriaToDelete(categoria);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!categoriaToDelete) return;

        router.delete(`/categorias/${categoriaToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setCategoriaToDelete(null);
            },
        });
    };

    // Auto-open edit modal when editingCategoria is passed
    if (editingCategoria && !isEditModalOpen && !editingCategoriaLocal) {
        editForm.setData({
            nombre: editingCategoria.nombre,
            descripcion: editingCategoria.descripcion ?? '',
        });

        setEditingCategoriaLocal(editingCategoria);
        setIsEditModalOpen(true);
    }

    return (
        <>
            <Head title="Categorias" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Gestión de Categorías</h1>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Añadir nuevo
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border dark:border-zinc-700">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Productos</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categorias.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-gray-400"
                                    >
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            ) : (
                                categorias.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        className="border-b dark:border-zinc-700"
                                    >
                                        <td className="p-4 text-sm">
                                            {cat.id}
                                        </td>

                                        <td className="p-4 text-sm font-medium">
                                            {cat.nombre}
                                        </td>

                                        <td className="p-4 text-sm">
                                            {cat.descripcion}
                                        </td>

                                        <td className="p-4 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                {cat.productos_count ?? 0} Productos
                                            </span>
                                        </td>

                                        <td className="flex justify-end gap-2 px-4 py-3">
                                            <button
                                                onClick={() => openEditModal(cat)}
                                                className="rounded bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => openDeleteModal(cat)}
                                                className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
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

                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                            <h2 className="mb-4 text-lg font-bold">
                                Nueva Categoría
                            </h2>

                            <form
                                onSubmit={handleCreateSubmit}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        value={createForm.data.nombre}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'nombre',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                        required
                                    />

                                    {createForm.errors.nombre && (
                                        <span className="text-xs text-red-500">
                                            {createForm.errors.nombre}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Descripción
                                    </label>

                                    <textarea
                                        value={createForm.data.descripcion}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'descripcion',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCreateModalOpen(false)
                                        }
                                        className="rounded border px-4 py-2"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="rounded bg-blue-600 px-4 py-2 text-white"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                            <h2 className="mb-4 text-lg font-bold">
                                Editar Categoría
                            </h2>

                            <form
                                onSubmit={handleEditSubmit}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        value={editForm.data.nombre}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'nombre',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                        required
                                    />

                                    {editForm.errors.nombre && (
                                        <span className="text-xs text-red-500">
                                            {editForm.errors.nombre}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Descripción
                                    </label>

                                    <textarea
                                        value={editForm.data.descripcion}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'descripcion',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingCategoriaLocal(null);
                                        }}
                                        className="rounded border px-4 py-2"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="rounded bg-blue-600 px-4 py-2 text-white"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                            <p className="mb-6 text-sm text-gray-500">
                                ¿Estás seguro de eliminar esta categoría?
                            </p>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setCategoriaToDelete(null);
                                    }}
                                    className="rounded border px-4 py-2"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}