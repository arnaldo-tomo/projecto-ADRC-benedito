<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::orderBy('created_at', 'desc')->paginate(15);
        return view('admin.notifications.index', compact('notifications'));
    }

    public function create()
    {
        return view('admin.notifications.create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:1000'],
            'type' => ['required', 'in:info,warning,emergency,success'],
            'target_audience' => ['required', 'in:all,location,active'],
            'location' => ['required_if:target_audience,location', 'string', 'max:255'],
            'is_scheduled' => ['boolean'],
            'scheduled_at' => ['required_if:is_scheduled,true', 'date', 'after:now'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'target_audience' => $request->target_audience,
            'location' => $request->location,
            'is_scheduled' => $request->boolean('is_scheduled'),
            'scheduled_at' => $request->is_scheduled ? $request->scheduled_at : null,
        ]);

        if (!$request->boolean('is_scheduled')) {
            $this->sendNotification($notification);
        }

        return redirect()
            ->route('admin.notifications.index')
            ->with('success', 'Notificação ' . ($request->boolean('is_scheduled') ? 'agendada' : 'enviada') . ' com sucesso!');
    }

    public function show(Notification $notification)
    {
        $notification->load(['users' => function($query) {
            $query->withPivot('is_read', 'read_at');
        }]);

        return view('admin.notifications.show', compact('notification'));
    }

    public function sendNow(Notification $notification)
    {
        if ($notification->sent_at) {
            return back()->with('error', 'Esta notificação já foi enviada!');
        }

        $this->sendNotification($notification);

        return redirect()
            ->route('admin.notifications.show', $notification)
            ->with('success', 'Notificação enviada com sucesso!');
    }

    private function sendNotification(Notification $notification)
    {
        $users = $this->getTargetUsers($notification);

        $userNotifications = [];
        foreach ($users as $user) {
            $userNotifications[] = [
                'user_id' => $user->id,
                'notification_id' => $notification->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        UserNotification::insert($userNotifications);

        $notification->update([
            'recipients_count' => count($users),
            'sent_at' => now(),
        ]);
    }

    private function getTargetUsers(Notification $notification)
    {
        switch ($notification->target_audience) {
            case 'all':
                return User::where('role', 'user')->where('status', 'active')->get();

            case 'location':
                return User::where('role', 'user')
                    ->where('status', 'active')
                    ->where('address', 'like', '%' . $notification->location . '%')
                    ->get();

            case 'active':
                return User::where('role', 'user')
                    ->where('status', 'active')
                    ->where('last_active_at', '>=', now()->subDays(7))
                    ->get();

            default:
                return collect();
        }
    }
}
