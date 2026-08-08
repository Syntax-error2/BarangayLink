<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_assignments', function (Blueprint $table) {

            $table->id();
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            $table->foreignId('responder_id')->constrained('users');
            $table->foreignId('assigned_by')->constrained('users');
            $table->text('remarks')->nullable();
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_assignments');
    }
};