<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('responder_profiles', function (Blueprint $table) {

            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('unit');
            $table->string('specialty')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('responder_profiles');
    }
};