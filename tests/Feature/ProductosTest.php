<?php

use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

test('productos index can be rendered', function () {
    $productos = Producto::factory()->count(3)->create();

    $response = $this->get(route('productos.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('productos/index')
        ->has('productos', 3)
    );
});

test('producto can be created', function () {
    $data = [
        'title' => 'Teclado mecánico',
        'description' => 'Teclado con switches rojos',
        'status' => 'active',
    ];

    $response = $this->post(route('productos.store'), $data);

    $response->assertRedirect(route('productos.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('productos', $data);
});

test('producto requires valid data', function () {
    $response = $this->post(route('productos.store'), [
        'status' => 'invalid-status',
    ]);

    $response->assertSessionHasErrors(['title', 'status']);
});

test('producto can be updated', function () {
    $producto = Producto::factory()->create();

    $response = $this->put(route('productos.update', $producto), [
        'title' => 'Título actualizado',
        'description' => null,
        'status' => 'inactive',
    ]);

    $response->assertRedirect(route('productos.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('productos', [
        'id' => $producto->id,
        'title' => 'Título actualizado',
        'status' => 'inactive',
    ]);
});

test('producto can be deleted', function () {
    $producto = Producto::factory()->create();

    $response = $this->delete(route('productos.destroy', $producto));

    $response->assertRedirect(route('productos.index'));
    $response->assertSessionHas('success');
    $this->assertModelMissing($producto);
});
