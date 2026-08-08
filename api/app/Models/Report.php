<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Report extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id', 'barangay_id', 'category_id', 'title', 'description', 'address', 'latitude', 'longitude', 'priority', 'status'];
    public function user() { return $this->belongsTo(User::class); }
    public function barangay() { return $this->belongsTo(Barangay::class); }
    public function category() { return $this->belongsTo(ReportCategory::class); }
    public function statusHistories() { return $this->hasMany(ReportStatusHistory::class); }
    public function assignments() { return $this->hasMany(ReportAssignment::class); }
    public function attachments() { return $this->morphMany(Attachment::class, 'attachable'); }
}