<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public attendance routes
Route::get('/absen', [AttendanceController::class, 'index'])->name('attendance.form');
Route::post('/absen', [AttendanceController::class, 'store'])->name('attendance.store');
Route::get('/absen/success', [AttendanceController::class, 'success'])->name('attendance.success');

// Admin routes (require authentication)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AttendanceController::class, 'dashboard'])->name('dashboard');
    Route::get('/attendance/filter', [AttendanceController::class, 'filter'])->name('attendance.filter');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AttendanceController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
