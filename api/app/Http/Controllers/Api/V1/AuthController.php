<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ApiResponseStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Performs a registration request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        // Validate the incoming JSON
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // expects password_confirmation field
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => ApiResponseStatus::Error,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create a secure token (This is the "Key" the phone will save)
        $token = $user->createToken('lyke-mobile-app')->plainTextToken;

        return response()->json([
            'status' => ApiResponseStatus::Success,
            'message' => 'User created successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], Response::HTTP_CREATED);
    }

    /**
     * Performs a login request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => ApiResponseStatus::Error, 'errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::where('email', $request->email)->first();

        // If user doesn't exist or password doesn't match, then return unauthorized
        if ($user === null || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => ApiResponseStatus::Error,
                'message' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Generate new token
        $token = $user->createToken('lyke-mobile-app')->plainTextToken;

        return response()->json([
            'status' => ApiResponseStatus::Success,
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], Response::HTTP_OK);
    }

    /**
     * Removes user's access token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Delete the token that was used to make this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => ApiResponseStatus::Success,
            'message' => 'Logged out successfully'
        ], Response::HTTP_OK);
    }
}
