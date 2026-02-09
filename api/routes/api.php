<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes (No Login Required)
Route::prefix('v1')->group(function () {
    // region OTP Controller
    Route::post('/send-otp', [\App\Http\Controllers\Api\V1\OtpController::class, 'send'])
        ->middleware('throttle:3,1');
    Route::post('/verify-otp', [\App\Http\Controllers\Api\V1\OtpController::class, 'verify'])
        ->middleware('throttle:5,1');

    // endregion
});

// Protected Routes (Must have Valid Token)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // region Auth Controller
    Route::post('/logout', [\App\Http\Controllers\Api\V1\AuthController::class, 'logout']);

    // endregion

    // Simple check to get current user details
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
