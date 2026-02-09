<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ApiResponseStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use AWS;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
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
