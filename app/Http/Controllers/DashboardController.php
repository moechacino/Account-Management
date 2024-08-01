<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\ExtendsType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use function Laravel\Prompts\password;
use function PHPUnit\Framework\isNull;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $filterType = $request->query('type');

        if ($filterType) {
            $accounts = Account::query()
                ->where('user_id', $user->id)
                ->where('type', $filterType)
                ->get();
        } else {
            $accounts = $user->accounts()->orderBy('updated_at', 'desc')->get();
        }

        $types = [
            'email',
            'game',
        ];

        $extendsTypes = ExtendsType::where('user_id', $user->id)
            ->pluck('type')
            ->toArray();

        $mergedTypes = array_unique(array_merge($types, $extendsTypes));
        $mergedTypes = array_values($mergedTypes);

        return Inertia::render('Dashboard', [
            "data" => [
                "accounts" => $accounts,
                "types" => $mergedTypes,
            ]
        ]);
    }

    private function encryption(string $data, string $key): string
    {
        $hashedKey = hash('sha256', $key, true);
        // Generate IV (Initialization Vector)
        $iv = random_bytes(16);

        $encryptedData = openssl_encrypt($data, 'aes-256-cbc', $hashedKey, OPENSSL_RAW_DATA, $iv);

        $encryptedDataWithIv = base64_encode($iv . $encryptedData);

        return $encryptedDataWithIv;
    }

    private function decryption(string $encryptedDataWithIv, string $key): string
    {
        $hashedKey = hash('sha256', $key, true);

        $encryptedDataWithIv = base64_decode($encryptedDataWithIv);

        $iv = substr($encryptedDataWithIv, 0, 16);
        $encryptedData = substr($encryptedDataWithIv, 16);

        $decryptedData = openssl_decrypt($encryptedData, 'aes-256-cbc', $hashedKey, OPENSSL_RAW_DATA, $iv);

        return $decryptedData;
    }


    public function storeAccount(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'credential' => 'required|max:255',
            'password' => 'nullable|string',
            'note' => 'nullable|string|max:1000',
            'type' => 'nullable|string|max:20',
            'keyPassword' => 'required|string',
        ]);

        $account = new Account();
        $account->title = $validatedData['title'];
        $account->credential = $validatedData['credential'];
        $hashedPassword = $this->encryption($validatedData['password'], $validatedData['keyPassword']);
        $account->password = $hashedPassword;
        if ($validatedData['type'] === null) {
            $account->type = 'others';
        } else {
            $account->type = $validatedData['type'];
        }
        $account->note = $validatedData['note'];
        $account->user_id = $user->id;
        $account->save();
        return redirect()->back()->with('message', 'Account saved successfully');
    }

    public function unlockPassword(Request $request)
    {
        $validatedData = $request->validate([
            'encryptedPassword' => 'nullable|string',
            'keyPassword' => 'required|string',
        ]);
        $password = $this->decryption($validatedData['encryptedPassword'], $validatedData['keyPassword']);
        if ($password == "") {
            $password = $validatedData['encryptedPassword'];
        }
        return redirect()->back()->with('showedPassword', $password);
    }

    public function updateAccount(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:100',
            'note' => 'nullable|string|max:1000',
            'type' => 'nullable|string|max:20',
            'keyPassword' => 'required|string'
        ]);

        $account = Account::findOrFail($id);

        $filteredData = array_filter($validatedData, function ($value) {
            return !is_null($value);
        });

        if (isset($filteredData['password']) && !is_null($filteredData['password'])) {
            $filteredData['password'] = $this->encryption($filteredData['password'], $validatedData['keyPassword']);
        }
        $account->update($filteredData);

        return redirect()->back()->with('success', 'Account updated successfully.');
    }

    public function deleteAccount($id)
    {
        $account = Account::findOrFail($id);
        $account->delete();
        return redirect()->back()->with('success', 'Account updated successfully.');
    }

    public function passwordCheck(Request $request)
    {
        $user = Auth::user();
        $validatedData = $request->validate([
            'password' => 'required|string',
        ]);
        $message = "";
        if (Hash::check($validatedData['password'], $user->getAuthPassword())) {
            $message = "password match";
        } else {
            $message = "password not match";
        }
        return redirect()->back()->with('message', $message);
    }

    public function storeNewType(Request $request)
    {
        $user = Auth::user();
        $validatedData = $request->validate([
            'type' => 'required|string|max:20',
        ]);
        $existsTypeCount = ExtendsType::query()->where('user_id', $user->id)->count();
        if ($existsTypeCount >= 20) {
            return redirect()->back()->with('message', 'Limit');
        }
        $extendsType = new ExtendsType();
        $extendsType->type = $validatedData['type'];
        $extendsType->user_id = $user->id;
        $extendsType->save();
        return redirect()->back()->with('message', 'New Type added successfully');
    }


}
