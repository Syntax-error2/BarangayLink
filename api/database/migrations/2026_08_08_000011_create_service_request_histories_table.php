<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_request_histories', function (Blueprint $table) {

            $table->id();
            $table->foreignId('service_request_id')->constrained('service_requests')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('status');
            $table->text('remarks')->nullable();
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_request_histories');
    }
};