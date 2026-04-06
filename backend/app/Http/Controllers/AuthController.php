<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => 0,
        ]);

        $response = $this->issueTokenResponse($user);
        $response['message'] = 'Пользователь успешно зарегистрирован';

        return response()->json($response, 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Неверный email или пароль.'],
            ]);
        }

        $user = Auth::user();

        $response = $this->issueTokenResponse($user);
        $response['message'] = 'Успешный вход в систему';
        return response()->json($response);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $plain = $request->bearerToken();
        if ($plain) {
            $hash = hash('sha256', $plain);
            ApiToken::where('token_hash', $hash)->delete();
        }

        if ($user) {
            Cache::put(
                'auth:user:'.$user->id.':last_logout',
                now()->toIso8601String(),
                now()->addDays(90)
            );
        }

        return response()->noContent();
    }

    public function me(Request $request)
    {

        return response()->json($request->user());
    }

    private function issueTokenResponse(User $user): array
    {
        $plain = bin2hex(random_bytes(32));

        ApiToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plain),
            'name' => 'next',
            'expires_at' => null,
        ]);

        $this->rememberAuthInCache($user);

        return [
            'token' => $plain,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }

    /** Redis при CACHE_STORE=redis — обычно логическая DB 1. */
    private function rememberAuthInCache(User $user): void
    {
        $ttl = now()->addDays(90);
        $base = 'auth:user:'.$user->id;

        Cache::put($base.':last_auth', [
            'at' => now()->toIso8601String(),
            'ip' => request()->ip(),
        ], $ttl);

        $dayKey = $base.':logins:'.now()->format('Y-m-d');
        $n = (int) Cache::get($dayKey, 0);
        Cache::put($dayKey, $n + 1, now()->endOfDay());
    }
}
