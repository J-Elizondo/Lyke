<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use App\Services\OtpService;
use App\Enums\ApiResponseStatus;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use AWS, App;

class OtpController extends Controller
{
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Sends a one-time password (OTP) to the user's phone number via SMS.
     *
     * @param SendOtpRequest $request The request object containing the validated data, including country code and phone number.
     * @return JsonResponse A JSON response indicating the success or failure of the OTP transmission.
     */
    public function send(SendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $fullPhoneNumber = $validated['country_code'] . $validated['phone'];

        // Generate the code using the service
        $code = $this->otpService->generate($fullPhoneNumber);

        // Send via AWS SNS if application is on staging or production.
        try {
            $this->otpService->send($fullPhoneNumber, $code);

            return response()->json([
                'status' => ApiResponseStatus::Success,
                'message' => 'OTP sent successfully'
            ], Response::HTTP_OK);

        } catch(\Exception $e) {
            return response()->json([
                'status' => ApiResponseStatus::Error,
                'message' => 'Failed to send SMS'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $fullPhoneNumber = $validated['country_code'] . $validated['phone'];

        // Verify the code using the OTP Service
        if ($this->otpService->verify($fullPhoneNumber, $validated['code']) === false) {
            return response()->json([
                'status' => ApiResponseStatus::Error,
                'message' => 'Invalid or expired verification code.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Find or Create the user
        $user = User::firstOrCreate(
            ['phone_number' => $fullPhoneNumber],
            ['phone_country_code' => $validated['country_code']]
        );

        // Issue the Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => ApiResponseStatus::Success,
            'data' => [
                'user' => $user,
                'token' => $token,
                'is_new_user' => $user->wasRecentlyCreated,
            ]
        ], Response::HTTP_ACCEPTED);
    }
}
