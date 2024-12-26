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
        Route::delete('/{id}', [DogadjajController::class, 'destroy']);
        Route::post('/pretraga', [DogadjajController::class, 'search']);
    });

    Route::prefix('izvodjaci')->group(function () {
        Route::post('/', [IzvodjacController::class, 'store']); 
        Route::put('/{id}', [IzvodjacController::class, 'update']);
    });

    Route::resource('rezervacije', RezervacijaController::class)->only([
        'index', 'show', 'store', 'destroy'
    ]);    
    Route::get('rezervacije/moje', [RezervacijaController::class, 'myReservations'])->name('rezervacije.moje');

    Route::post('/logout', [AuthController::class, 'logout']);
});