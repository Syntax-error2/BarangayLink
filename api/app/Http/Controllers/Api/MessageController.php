<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get all unique users we've chatted with
        $users = User::whereHas('role')
            ->where('id', '!=', $userId)
            ->where('barangay_id', $request->user()->barangay_id)
            ->get()
            ->map(function ($user) use ($userId) {
                $lastMessage = Message::where(function($q) use ($userId, $user) {
                        $q->where('sender_id', $userId)->where('receiver_id', $user->id);
                    })
                    ->orWhere(function($q) use ($userId, $user) {
                        $q->where('sender_id', $user->id)->where('receiver_id', $userId);
                    })
                    ->orderBy('created_at', 'desc')
                    ->first();

                $unreadCount = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'lastMessage' => $lastMessage ? $lastMessage->content : '',
                    'time' => $lastMessage ? $lastMessage->created_at->diffForHumans() : '',
                    'timestamp' => $lastMessage ? $lastMessage->created_at->timestamp : 0,
                    'unread' => $unreadCount,
                    'avatar' => strtoupper(substr($user->first_name, 0, 1)),
                    'online' => true // mock online status
                ];
            })
            ->filter(function($u) {
                return !empty($u['lastMessage']) || true; // Return all users for now so admin can start chat
            })
            ->sortByDesc('timestamp')
            ->values();

        return response()->json($users);
    }

    public function getMessages(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;

        // Mark as read
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->update(['is_read' => true]);

        $messages = Message::where(function($q) use ($userId, $otherUserId) {
                $q->where('sender_id', $userId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function($q) use ($userId, $otherUserId) {
                $q->where('sender_id', $otherUserId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) use ($userId) {
                return [
                    'id' => $msg->id,
                    'text' => $msg->content,
                    'time' => $msg->created_at->format('h:i A'),
                    'isMe' => $msg->sender_id === $userId,
                ];
            });

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        return response()->json([
            'id' => $message->id,
            'text' => $message->content,
            'time' => $message->created_at->format('h:i A'),
            'isMe' => true
        ], 201);
    }
}
