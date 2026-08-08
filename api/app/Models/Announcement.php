<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Announcement extends Model {
    use SoftDeletes;
    protected $fillable = ['barangay_id', 'author_id', 'title', 'content', 'category', 'featured_image_path', 'publish_date', 'expiration_date', 'is_published'];
    protected $casts = ['publish_date' => 'datetime', 'expiration_date' => 'datetime', 'is_published' => 'boolean'];
    public function barangay() { return $this->belongsTo(Barangay::class); }
    public function author() { return $this->belongsTo(User::class, 'author_id'); }
}