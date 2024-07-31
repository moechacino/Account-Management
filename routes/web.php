<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'index'])->name('auth.index');
Route::post('/register',[RegisteredUserController::class, 'store'])->name('register');
Route::get('/register', [RegisteredUserController::class, 'index']);

Route::post('/login', [ AuthenticatedSessionController::class, 'store' ]);
Route::get('/login', [AuthenticatedSessionController::class, 'index'])->name('login');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');
Route::post('/check-password', [DashboardController::class, 'passwordCheck'])->middleware(['auth'])->name('check-password');
Route::get('/check-password', function (){
    return to_route('dashboard');
})->middleware(['auth']);
Route::post('/dashboard/account', [DashboardController::class, 'storeAccount'])->middleware(['auth'])->name('store-account');
Route::patch('/dashboard/account/{id}', [DashboardController::class, 'updateAccount'])->middleware(['auth'])->name('update-account');
Route::delete('/dashboard/account/{id}', [DashboardController::class, 'deleteAccount'])->middleware(['auth'])->name('delete-account');
Route::post('/unlock-password', [DashboardController::class, 'unlockPassword'])->middleware(['auth'])->name('unlock-password');
Route::post('/dashboard/type' ,[DashboardController::class, 'storeNewType'])->middleware(['auth'])->name('store-type');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
