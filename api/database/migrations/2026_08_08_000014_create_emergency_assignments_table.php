<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_assignments', function (Blueprint $table) {

            $table->id();
            $table->foreignId('emergency_report_id')->constrained('emergency_reports')->onDelete('cascade');
            $table->foreignId('responder_id')->constrained('users');
            $table->foreignId('assigned_by')->nullable()->constrained('users');
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamps();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_assignments');
    }
};