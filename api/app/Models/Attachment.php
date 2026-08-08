<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Attachment extends Model {
    protected $fillable = ['attachable_id', 'attachable_type', 'file_path', 'file_name', 'file_type', 'file_size', 'uploaded_by'];
    public function attachable() { return $this->morphTo(); }
    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
}