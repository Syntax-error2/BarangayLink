<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ResidentStatusUpdate extends Notification
{
    use Queueable;

    public $type;
    public $title;
    public $status;
    public $itemId;

    public function __construct($type, $title, $status, $itemId)
    {
        $this->type = $type;
        $this->title = $title;
        $this->status = $status;
        $this->itemId = $itemId;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'status' => $this->status,
            'item_id' => $this->itemId,
            'message' => "Your {$this->type} request for '{$this->title}' is now {$this->status}."
        ];
    }
}
