<?php

use Illuminate\Support\Facades\Route;

foreach (config('api_resources') as $uri => $controller) {
    Route::get("{$uri}/schema", [$controller, 'schema']);

    Route::apiResource($uri, $controller);
}
