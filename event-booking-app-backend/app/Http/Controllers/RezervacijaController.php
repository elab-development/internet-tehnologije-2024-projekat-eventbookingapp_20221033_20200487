<?php

namespace App\Http\Controllers;

use App\Models\Rezervacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RezervacijaResource;

class RezervacijaController extends Controller
{
    /**
     * Prikaz svih rezervacija korisnika (dostupno samo radnicima).
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu pregledati sve rezervacije.'], 403);
        }

        $rezervacije = Rezervacija::with('dogadjaj')->get();
        return RezervacijaResource::collection($rezervacije);
    }

    /**
     * Prikaz određene rezervacije korisnika (dostupno samo radnicima).
     */
    public function show($id)
    {
        $user = Auth::user();

        if (!$user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu pregledati određene rezervacije.'], 403);
        }

        $rezervacija = Rezervacija::with('dogadjaj')->findOrFail($id);
        return new RezervacijaResource($rezervacija);
    }
    /**
     * Prikaz svih rezervacija trenutnog korisnika (dostupno samo korisnicima).
     */
    public function myReservations()
    {
        $user = Auth::user();

        if ($user->app_employee) {
            return response()->json(['error' => 'Radnici ne mogu pregledati sopstvene rezervacije.'], 403);
        }

        $rezervacije = Rezervacija::where('korisnik_id', $user->id)->with('dogadjaj')->get();
        return RezervacijaResource::collection($rezervacije);
    }
    /**
     * Kreiranje nove rezervacije (dostupno samo običnim korisnicima).
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->app_employee) {
            return response()->json(['error' => 'Radnici ne mogu kreirati rezervacije.'], 403);
        }

        $validated = $request->validate([
            'datum' => 'required|date|after:today',
            'status' => 'required|in:neplaceno,placeno',
            'broj_karata' => 'required|integer|min:1',
            'tip_karti' => 'required|in:regularna,vip,gold',
            'recenzija' => 'nullable|string|max:500',
            'dogadjaj_id' => 'required|exists:dogadjaji,id',
        ]);

        $rezervacija = Rezervacija::create(array_merge($validated, [
            'korisnik_id' => $user->id,
        ]));


        return response()->json(['message' => 'Rezervacija uspešno kreirana.', 'rezervacija' => new RezervacijaResource($rezervacija)], 201);
    }

    /**
     * Brisanje rezervacije (dostupno samo običnim korisnicima).
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->app_employee) {
            return response()->json(['error' => 'Radnici ne mogu brisati rezervacije.'], 403);
        }
        $rezervacija = Rezervacija::where('korisnik_id', $user->id)->findOrFail($id);

        if ($rezervacija->korisnik_id !== $user->id) {
            return response()->json(['error' => 'Nemate pravo da obrišete ovu rezervaciju.'], 403);
        }    

        $rezervacija->delete();

        return response()->json(['message' => 'Rezervacija uspešno obrisana.']);
    }

    /**
     * Dodavanje recenzije na određenu rezervaciju (dostupno samo običnim korisnicima).
     */
    public function leaveReview(Request $request, $id)
    {
        $user = Auth::user();

        // Proverava da li je korisnik vlasnik rezervacije
        $rezervacija = Rezervacija::where('korisnik_id', $user->id)->findOrFail($id);

        if ($rezervacija->korisnik_id !== $user->id) {
            return response()->json(['error' => 'Nemate pravo da dodate recenziju na ovu rezervaciju.'], 403);
        }

        $validated = $request->validate([
            'recenzija' => 'required|string|max:500',
        ]);

        $rezervacija->update([
            'recenzija' => $validated['recenzija'],
        ]);

        return response()->json(['message' => 'Recenzija uspešno dodata.', 'rezervacija' => new RezervacijaResource($rezervacija)]);
    }
}
