<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Barangay extends Model {
    use SoftDeletes;
    protected $fillable = ['name', 'city', 'province', 'region', 'logo_path', 'email', 'contact_number', 'address'];
    public function users() { return $this->hasMany(User::class); }
    public function reports() { return $this->hasMany(Report::class); }
}