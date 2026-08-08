<?php

$modelsDir = __DIR__ . '/app/Models';

$models = [
    'User' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    protected \$fillable = ['first_name', 'last_name', 'email', 'password', 'phone', 'role_id', 'barangay_id', 'is_active', 'profile_photo_path'];
    protected \$hidden = ['password', 'remember_token'];
    protected \$casts = ['email_verified_at' => 'datetime', 'password' => 'hashed', 'is_active' => 'boolean'];
    
    public function role() { return \$this->belongsTo(Role::class); }
    public function barangay() { return \$this->belongsTo(Barangay::class); }
    public function residentProfile() { return \$this->hasOne(ResidentProfile::class); }
    public function staffProfile() { return \$this->hasOne(StaffProfile::class); }
    public function responderProfile() { return \$this->hasOne(ResponderProfile::class); }
}
PHP,

    'Role' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Role extends Model {
    protected \$fillable = ['name', 'slug', 'description'];
    public function users() { return \$this->hasMany(User::class); }
}
PHP,

    'Barangay' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Barangay extends Model {
    use SoftDeletes;
    protected \$fillable = ['name', 'city', 'province', 'region', 'logo_path'];
    public function users() { return \$this->hasMany(User::class); }
    public function reports() { return \$this->hasMany(Report::class); }
}
PHP,

    'ResidentProfile' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ResidentProfile extends Model {
    protected \$fillable = ['user_id', 'address', 'emergency_contact_name', 'emergency_contact_phone'];
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,

    'StaffProfile' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class StaffProfile extends Model {
    protected \$fillable = ['user_id', 'position', 'department'];
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,

    'ResponderProfile' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ResponderProfile extends Model {
    protected \$fillable = ['user_id', 'unit', 'specialty', 'is_available'];
    protected \$casts = ['is_available' => 'boolean'];
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,

    'ReportCategory' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReportCategory extends Model {
    protected \$fillable = ['name', 'description', 'is_active'];
    protected \$casts = ['is_active' => 'boolean'];
}
PHP,

    'Report' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Report extends Model {
    use SoftDeletes;
    protected \$fillable = ['user_id', 'barangay_id', 'category_id', 'title', 'description', 'address', 'latitude', 'longitude', 'priority', 'status'];
    public function user() { return \$this->belongsTo(User::class); }
    public function barangay() { return \$this->belongsTo(Barangay::class); }
    public function category() { return \$this->belongsTo(ReportCategory::class); }
    public function statusHistories() { return \$this->hasMany(ReportStatusHistory::class); }
    public function assignments() { return \$this->hasMany(ReportAssignment::class); }
    public function attachments() { return \$this->morphMany(Attachment::class, 'attachable'); }
}
PHP,

    'ReportStatusHistory' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReportStatusHistory extends Model {
    protected \$fillable = ['report_id', 'user_id', 'status', 'remarks'];
    public function report() { return \$this->belongsTo(Report::class); }
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,

    'ReportAssignment' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReportAssignment extends Model {
    protected \$fillable = ['report_id', 'responder_id', 'assigned_by', 'remarks'];
    public function report() { return \$this->belongsTo(Report::class); }
    public function responder() { return \$this->belongsTo(User::class, 'responder_id'); }
    public function assigner() { return \$this->belongsTo(User::class, 'assigned_by'); }
}
PHP,

    'ServiceType' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ServiceType extends Model {
    protected \$fillable = ['name', 'description', 'requirements', 'processing_time', 'is_active'];
    protected \$casts = ['is_active' => 'boolean'];
}
PHP,

    'ServiceRequest' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ServiceRequest extends Model {
    use SoftDeletes;
    protected \$fillable = ['user_id', 'barangay_id', 'service_type_id', 'status', 'remarks'];
    public function user() { return \$this->belongsTo(User::class); }
    public function barangay() { return \$this->belongsTo(Barangay::class); }
    public function serviceType() { return \$this->belongsTo(ServiceType::class); }
    public function histories() { return \$this->hasMany(ServiceRequestHistory::class); }
    public function attachments() { return \$this->morphMany(Attachment::class, 'attachable'); }
}
PHP,

    'ServiceRequestHistory' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ServiceRequestHistory extends Model {
    protected \$fillable = ['service_request_id', 'user_id', 'status', 'remarks'];
    public function serviceRequest() { return \$this->belongsTo(ServiceRequest::class); }
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,

    'EmergencyCategory' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EmergencyCategory extends Model {
    protected \$fillable = ['name', 'color_code', 'is_active'];
    protected \$casts = ['is_active' => 'boolean'];
}
PHP,

    'EmergencyReport' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class EmergencyReport extends Model {
    use SoftDeletes;
    protected \$fillable = ['user_id', 'barangay_id', 'category_id', 'contact_name', 'contact_phone', 'address', 'latitude', 'longitude', 'description', 'priority', 'status'];
    public function user() { return \$this->belongsTo(User::class); }
    public function barangay() { return \$this->belongsTo(Barangay::class); }
    public function category() { return \$this->belongsTo(EmergencyCategory::class); }
    public function assignments() { return \$this->hasMany(EmergencyAssignment::class); }
    public function attachments() { return \$this->morphMany(Attachment::class, 'attachable'); }
}
PHP,

    'EmergencyAssignment' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EmergencyAssignment extends Model {
    protected \$fillable = ['emergency_report_id', 'responder_id', 'assigned_by', 'acknowledged_at', 'arrived_at'];
    protected \$casts = ['acknowledged_at' => 'datetime', 'arrived_at' => 'datetime'];
    public function emergencyReport() { return \$this->belongsTo(EmergencyReport::class); }
    public function responder() { return \$this->belongsTo(User::class, 'responder_id'); }
    public function assigner() { return \$this->belongsTo(User::class, 'assigned_by'); }
}
PHP,

    'Announcement' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Announcement extends Model {
    use SoftDeletes;
    protected \$fillable = ['barangay_id', 'author_id', 'title', 'content', 'category', 'featured_image_path', 'publish_date', 'expiration_date', 'is_published'];
    protected \$casts = ['publish_date' => 'datetime', 'expiration_date' => 'datetime', 'is_published' => 'boolean'];
    public function barangay() { return \$this->belongsTo(Barangay::class); }
    public function author() { return \$this->belongsTo(User::class, 'author_id'); }
}
PHP,

    'Facility' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Facility extends Model {
    protected \$fillable = ['barangay_id', 'name', 'type', 'address', 'latitude', 'longitude', 'contact_number', 'is_active'];
    protected \$casts = ['is_active' => 'boolean'];
    public function barangay() { return \$this->belongsTo(Barangay::class); }
}
PHP,

    'Location' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Location extends Model {
    protected \$fillable = ['name', 'type', 'latitude', 'longitude'];
}
PHP,

    'Attachment' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Attachment extends Model {
    protected \$fillable = ['attachable_id', 'attachable_type', 'file_path', 'file_name', 'file_type', 'file_size', 'uploaded_by'];
    public function attachable() { return \$this->morphTo(); }
    public function uploader() { return \$this->belongsTo(User::class, 'uploaded_by'); }
}
PHP,

    'AuditLog' => <<<PHP
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AuditLog extends Model {
    protected \$fillable = ['user_id', 'action', 'module', 'record_id', 'description', 'ip_address'];
    public function user() { return \$this->belongsTo(User::class); }
}
PHP,
];

foreach ($models as $name => $content) {
    file_put_contents($modelsDir . '/' . $name . '.php', $content);
}

echo "Models generated successfully.\n";
