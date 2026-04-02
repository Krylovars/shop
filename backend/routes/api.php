<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

foreach (config('api_resources') as $uri => $controller) {
    Route::get("{$uri}/schema", [$controller, 'schema']);

    Route::apiResource($uri, $controller);
}


Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');
Route::middleware('auth.api_token')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
