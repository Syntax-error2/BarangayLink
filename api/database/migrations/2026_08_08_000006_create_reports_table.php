<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {

            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('barangay_id')->constrained('barangays');
            $table->foreignId('category_id')->constrained('report_categories');
            $table->string('title');
            $table->text('description');
            $table->string('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->enum('status', ['SUBMITTED', 'RECEIVED', 'VERIFIED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'])->default('SUBMITTED');
            $table->timestamps();
            $table->softDeletes();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};