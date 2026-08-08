<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {

            $table->id();
            $table->string('name');
            $table->string('city');
            $table->string('province');
            $table->string('region');
            $table->string('logo_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};