<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\Categoria;
use App\Models\Producto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(): Response
    {
        $productos = Producto::with('categoria')->get();
        $categorias = Categoria::all();

        return Inertia::render('productos/index', [
            'productos' => $productos,
            'categorias' => $categorias,
        ]);
    }

    public function create()
    {
        //
    }

    public function store(StoreProductoRequest $request): RedirectResponse
    {
        Producto::create($request->validated());

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function show(Producto $producto)
    {
        //
    }

    public function edit(Producto $producto)
    {
        //
    }

    public function update(
        UpdateProductoRequest $request,
        Producto $producto
    ): RedirectResponse {
        $producto->update($request->validated());

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        $producto->delete();

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto eliminado correctamente.');
    }

    public function generarPdf()
    {
        $productos = Producto::with('categoria')->get();

        $totalProductos = $productos->count();

        $precioPromedio = $productos->avg('precio');

        $pdf = Pdf::loadView(
            'pdf.productos',
            compact(
                'productos',
                'totalProductos',
                'precioPromedio'
            )
        );

        return $pdf->download(
            'reporte_productos_' . date('Y-m-d') . '.pdf'
        );
    }
}

