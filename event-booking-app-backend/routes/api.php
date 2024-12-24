<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\IzvodjacController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('dogadjaji')->group(function () {
        Route::get('/', [DogadjajController::class, 'index']); 
        Route::get('/{id}', [DogadjajController::class, 'show']);
        Route::post('/', [DogadjajController::class, 'store']); 
        Route::put('/{id}', [DogadjajController::class, 'update']); 
        Route::patch('/{id}', [DogadjajController::class, 'updateDate']);
    });

    Route::prefix('izvodjaci')->group(function () {
        Route::get('/izvodjaci', [IzvodjacController::class, 'index']); 
        Route::get('/izvodjaci/{id}', [IzvodjacController::class, 'show']);
        Route::post('/izvodjaci', [IzvodjacController::class, 'store']); 
        Route::put('/izvodjaci/{id}', [IzvodjacController::class, 'update']);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});