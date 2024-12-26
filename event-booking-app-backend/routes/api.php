<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\IzvodjacController;
use App\Http\Controllers\RezervacijaController;

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
        Route::get('/', [IzvodjacController::class, 'index']); 
        Route::get('/{id}', [IzvodjacController::class, 'show']);
        Route::post('/', [IzvodjacController::class, 'store']); 
        Route::put('/{id}', [IzvodjacController::class, 'update']);
    });

    Route::resource('rezervacije', RezervacijaController::class)->only([
        'index', 'show', 'store', 'destroy'
    ]);    

    Route::post('/logout', [AuthController::class, 'logout']);
});