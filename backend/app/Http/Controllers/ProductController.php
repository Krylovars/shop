<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Country;
use App\Models\Product;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $products = Product::query()
            ->with('country')
            ->orderBy('id')
            ->get();

        return ProductResource::collection($products);
    }
    public function show(Product $product)
    {
        return new ProductResource($product->load('country'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'author' => 'required|string|max:255',
            'img' => 'nullable|image|max:4096',
            'country_id' => 'nullable|exists:countries,id',
        ]);
        $data = $request->only(['name', 'description', 'price', 'author', 'country_id', 'img']);

        if (!$request->hasFile('img')) {
            $data['img'] = '';
        }

        $product = Product::create($data);
        if ($request->hasFile('img')) {
            $filename = $this->storeUploadedImage($request->file('img'));
            $product->update(['img' => $filename]);
        }
        return new ProductResource($product->fresh()->load('country'));
    }

    private function storeUploadedImage(\Illuminate\Http\UploadedFile $file): string
    {
        $dir = public_path('img/products');
        File::ensureDirectoryExists($dir);
        $base = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $safe = Str::slug($base) ?: 'image';
        $filename = $safe . '-' . uniqid('', true) . '.' . $ext;
        $file->move($dir, $filename);
        return $filename;
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'author' => 'required|string|max:255',
            'img' => 'nullable|string',
            'country_id' => 'nullable|exists:countries,id',
        ]);

        $product->update($request->only([
            'name', 'description', 'price', 'author', 'img', 'country_id'
        ]));

        return new ProductResource($product->refresh());
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
    public function schema(): array
    {
        $schema = config('form')['products'];
        foreach ($schema['fields'] as $field => $config) {
            if($config['type'] === 'select' ) {
                $schema['fields'][$field]['options'] = Country::all()->pluck('name', 'id');
            }
        }

        return $schema;
    }
}
