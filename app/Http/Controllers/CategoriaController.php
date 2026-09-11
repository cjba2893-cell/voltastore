<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index()
    {
        // Cargamos las categorías junto con el número de productos y la lista de productos
        $categorias = Categoria::withCount('productos')
            ->with('productos')
            ->get();

        return Inertia::render('categorias/index', [
            'categorias' => $categorias
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validar los datos de entrada
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        // 2. Crear el registro en la base de datos
        Categoria::create($validated);

        // 3. Redireccionar de vuelta
        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    public function edit(Categoria $categoria)
    {
        return Inertia::render('categorias/index', [
            'categorias' => Categoria::withCount('productos')
                ->with('productos')
                ->get(),
            'editingCategoria' => $categoria,
        ]);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $categoria->update($validated);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría eliminada exitosamente');
    }
}
