<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {

            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays');
            $table->foreignId('author_id')->constrained('users');
            $table->string('title');
            $table->longText('content');
            $table->string('category');
            $table->string('featured_image_path')->nullable();
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('expiration_date')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();
    
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};