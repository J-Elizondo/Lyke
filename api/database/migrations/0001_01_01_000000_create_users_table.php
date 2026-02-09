<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Identity
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();

            // Auth
            $table->string('phone_number')->unique();
            $table->string('phone_country_code')->default('+1');
            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();

            // Profile Details
            $table->date('birth_date')->nullable();
            $table->integer('height_cm')->nullable(); // Store in CM for global standard, convert to ft/in on frontend

            // Gender & Preferences
            $table->enum('gender', array_column(\App\Enums\Gender::cases(), 'value'))->nullable();
            $table->json('interested_in')->nullable();
            $table->string('pronouns')->nullable();

            // Location Data
            $table->string('neighborhood')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();

            // Setup for API Tokens (Sanctum)
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('sessions');
    }
};
