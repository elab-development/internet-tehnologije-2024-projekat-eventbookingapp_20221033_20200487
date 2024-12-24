<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DogadjajController;

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



    Route::post('/logout', [AuthController::class, 'logout']);
});