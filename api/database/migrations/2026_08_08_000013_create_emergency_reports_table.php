<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_reports', function (Blueprint $table) {

            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('barangay_id')->constrained('barangays');
            $table->foreignId('category_id')->constrained('emergency_categories');
            $table->string('contact_name');
            $table->string('contact_phone');
            $table->string('address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('description')->nullable();
            $table->enum('priority', ['High', 'Critical'])->default('Critical');
            $table->enum('status', ['REPORTED', 'ACKNOWLEDGED', 'RESPONDER ASSIGNED', 'RESPONDING', 'ON SITE', 'RESOLVED', 'CLOSED', 'FALSE ALARM'])->default('REPORTED');
            $table->timestamps();
            $table->softDeletes();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_reports');
    }
};