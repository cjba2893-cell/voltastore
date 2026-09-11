<?php

use App\Models\Categoria;
use Inertia\Testing\AssertableInertia as Assert;

test('categorias index can be rendered', function () {
    $categorias = Categoria::factory()->count(3)->create();

    $response = $this->get(route('categorias.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('categorias/index')
        ->has('categorias', 3)
    );
});

test('categoria can be created', function () {
    $data = [
        'nombre' => 'Electrónica',
        'descripcion' => 'Dispositivos electrónicos',
    ];

    $response = $this->post(route('categorias.store'), $data);

    $response->assertRedirect(route('categorias.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('categorias', $data);
});

test('categoria requires valid data', function () {
    $response = $this->post(route('categorias.store'), []);

    $response->assertSessionHasErrors(['nombre']);
});

test('categoria can be updated', function () {
    $categoria = Categoria::factory()->create();

    $response = $this->put(route('categorias.update', $categoria), [
        'nombre' => 'Nombre actualizado',
        'descripcion' => null,
    ]);

    $response->assertRedirect(route('categorias.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('categorias', [
        'id' => $categoria->id,
        'nombre' => 'Nombre actualizado',
    ]);
});

test('categoria can be deleted', function () {
    $categoria = Categoria::factory()->create();

    $response = $this->delete(route('categorias.destroy', $categoria));

    $response->assertRedirect(route('categorias.index'));
    $response->assertSessionHas('success');
    $this->assertModelMissing($categoria);
});
