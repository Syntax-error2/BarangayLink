<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_status_histories', function (Blueprint $table) {

            $table->id();
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->comment('User who changed the status');
            $table->string('status');
            $table->text('remarks')->nullable();
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_status_histories');
    }
};