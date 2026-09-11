<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/productos/reporte-pdf', [ProductoController::class, 'generarPdf'])
    ->name('productos.pdf');
Route::resource('categorias', CategoriaController::class);
Route::resource('productos', ProductoController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
