<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->withCount(['reports', 'reports as resolved_reports_count' => function($q) {
            $q->where('status', 'resolvido');
        }])->orderBy('created_at', 'desc')->paginate(15);

        return view('admin.users.index', compact('users'));
    }

    public function show(User $user)
    {
        $user->load(['reports' => function($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return view('admin.users.show', compact('user'));
    }

    public function updateStatus(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'in:active,inactive,blocked'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $user->update(['status' => $request->status]);

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', 'Status do usuário atualizado com sucesso!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Usuário excluído com sucesso!');
    }
}
