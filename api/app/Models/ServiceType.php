<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ServiceType extends Model {
    protected $fillable = ['name', 'description', 'requirements', 'processing_time', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}