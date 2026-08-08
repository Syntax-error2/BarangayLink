<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {

            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('barangay_id')->constrained('barangays');
            $table->foreignId('service_type_id')->constrained('service_types');
            $table->enum('status', ['SUBMITTED', 'UNDER REVIEW', 'PROCESSING', 'READY', 'COMPLETED', 'RELEASED', 'REJECTED'])->default('SUBMITTED');
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};