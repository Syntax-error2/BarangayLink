<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EmergencyCategory extends Model {
    protected $fillable = ['name', 'color_code', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}