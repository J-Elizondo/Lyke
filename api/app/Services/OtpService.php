<?php

namespace App\Services;

use App\Models\VerificationCode;
use Carbon\Carbon;
use Hash, App, AWS, Log;

class OtpService
{
    /**
     * Generates a verification code for the specified phone number and stores it securely in the database.
     *
     * @param string $phoneNumber The recipient's phone number for which the verification code is generated.
     * @return string The plain-text verification code.
     */
    public function generate(string $phoneNumber): string
    {
        // Use real random numbers only in staging/prod
        $plainCode = App::environment(['staging', 'production'])
            ? (string) rand(100000, 999999)
            : '000000';

        VerificationCode::updateOrCreate(
            ['phone_number' => $phoneNumber],
            [
                'code' => Hash::make($plainCode),
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        return $plainCode;
    }

    /**
     * Verifies the provided verification code for the specified phone number.
     *
     * @param string $phoneNumber The phone number to verify against.
     * @param string $userInputCode The verification code to validate.
     * @return bool Returns true if the code is valid and successfully verified, otherwise false.
     */
    public function verify(string $phoneNumber, string $userInputCode): bool
    {
        $record = VerificationCode::where('phone_number', $phoneNumber)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$record || Hash::check($userInputCode, $record->code) === false) {
            return false;
        }

        $record->delete();
        return true;
    }

    /**
     * Sends a verification code via SMS to the specified phone number using AWS SNS.
     *
     * @param string $phoneNumber The recipient's phone number.
     * @param string $code The verification code to be sent.
     * @return void
     *
     * @throws \Exception If an error occurs while sending the message.
     */
    public function send(string $phoneNumber, string $code): void
    {
        // Skip AWS call in local/testing environments
        if (App::environment(['staging', 'production']) === false) {
            Log::info("Local OTP generated for {$phoneNumber}: {$code}");
            return;
        }

        try {
            $sns = AWS::createClient('sns');
            $sns->publish([
                'Message' => 'Your ' . config('app.name') . ' verification code is: ' . $code,
                'PhoneNumber' => $phoneNumber,
                'MessageAttributes' => [
                    'AWS.SNS.SMS.SMSType' => [
                        'DataType' => 'String',
                        'StringValue' => 'Transactional', // High priority delivery
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send OTP: ' . $e->getMessage());
            throw $e;
        }
    }
}
