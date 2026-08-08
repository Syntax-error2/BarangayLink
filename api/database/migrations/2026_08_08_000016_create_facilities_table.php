<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {

            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays');
            $table->string('name');
            $table->string('type'); // Health center, Evacuation center, etc.
            $table->string('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('contact_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};