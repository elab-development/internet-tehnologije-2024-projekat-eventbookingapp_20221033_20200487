<?php

namespace App\Http\Controllers;

use App\Models\Izvodjac;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\IzvodjacResource;

class IzvodjacController extends Controller
{
    /**
     * Prikaz svih izvođača.
     */
    public function index()
    {
        $izvodjaci = Izvodjac::all();

        return response()->json([
            'message' => 'Lista svih izvođača uspešno dohvaćena.',
            'data'    => IzvodjacResource::collection($izvodjaci),
        ], 200);
    }

    /**
     * Prikaz pojedinačnog izvođača po ID-ju.
     */
    public function show($id)
    {
        $izvodjac = Izvodjac::findOrFail($id);

        return new IzvodjacResource($izvodjac);
    }

    /**
     * Kreiranje novog izvođača (samo radnici).
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (! $user || ! $user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu dodavati nove izvođače.'], 403);
        }

        $validated = $request->validate([
            'ime'         => 'required|string|max:255',
            'zanr'        => 'required|in:pop,folk,rep,rok,klasika,tehno,narodna',
            'biografija'  => 'nullable|string|max:5000',
            'link_slike'  => 'nullable|string', // ili 'nullable|url' ako želite striktno URL
        ]);

        $izvodjac = Izvodjac::create($validated);

        return response()->json([
            'message'  => 'Izvođač uspešno kreiran.',
            'izvodjac' => new IzvodjacResource($izvodjac),
        ], 201);
    }

    /**
     * Ažuriranje izvođača (samo radnici).
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (! $user || ! $user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu ažurirati podatke izvođača.'], 403);
        }

        $izvodjac = Izvodjac::findOrFail($id);

        $validated = $request->validate([
            'ime'         => 'sometimes|string|max:255',
            'zanr'        => 'sometimes|in:pop,folk,rep,rok,klasika,tehno,narodna',
            'biografija'  => 'nullable|string|max:5000',
            'link_slike'  => 'nullable|string', // ili 'nullable|url'
        ]);

        $izvodjac->update($validated);

        return response()->json([
            'message'  => 'Podaci o izvođaču uspešno ažurirani.',
            'izvodjac' => new IzvodjacResource($izvodjac),
        ]);
    }
}
