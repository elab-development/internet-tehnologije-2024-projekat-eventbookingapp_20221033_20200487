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

        $rezervacije = Rezervacija::with('dogadjaj','korisnik')->get();
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

        $rezervacija = Rezervacija::with('dogadjaj', 'korisnik')->findOrFail($id);
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

    /**
     * Prikaži sve recenzije na osnovu dogadjaj_id.
     */
    public function eventReviews($id)
    {
        // svi korisnici mogu gledati recenzije
        $reviews = Rezervacija::where('dogadjaj_id', $id)
            ->whereNotNull('recenzija')
            ->with('korisnik')
            ->get();

        return RezervacijaResource::collection($reviews);
    }

    /**
     * Statistika rezervacija (samo radnici).
     * Vraća zbirne brojke i pregled po događaju.
     */
    public function stats()
    {
        $user = Auth::user();
        if (! $user || ! $user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu pregledati statistiku rezervacija.'], 403);
        }

        // Učitavamo i događaj da izračunamo prihod (cena * broj_karata)
        $rezervacije = Rezervacija::with('dogadjaj')->get();

        $ukupnoRezervacija = $rezervacije->count();
        $placeno           = $rezervacije->where('status', 'placeno')->count();
        $neplaceno         = $rezervacije->where('status', 'neplaceno')->count();
        $ukupnoKarata      = $rezervacije->sum('broj_karata');

        // Prihodi (ukupno i samo plaćeno)
        $calcPrihod = fn ($r) => (($r->dogadjaj->cena ?? 0) * ($r->broj_karata ?? 0));
        $prihodUkupno  = $rezervacije->sum($calcPrihod);
        $prihodPlaceno = $rezervacije
            ->where('status', 'placeno')
            ->sum($calcPrihod);

        // Pregled po događaju
        $poDogadjaju = $rezervacije
            ->groupBy('dogadjaj_id')
            ->map(function ($group) use ($calcPrihod) {
                $first = $group->first();
                return [
                    'dogadjaj_id'       => $first->dogadjaj_id,
                    'naziv'             => optional($first->dogadjaj)->naziv,
                    'broj_rezervacija'  => $group->count(),
                    'ukupno_karata'     => $group->sum('broj_karata'),
                    'prihod_ukupno'     => $group->sum($calcPrihod),
                    'prihod_placeno'    => $group->where('status', 'placeno')->sum($calcPrihod),
                ];
            })
            ->values();

        return response()->json([
            'stats' => [
                'ukupno_rezervacija' => $ukupnoRezervacija,
                'placeno'            => $placeno,
                'neplaceno'          => $neplaceno,
                'ukupno_karata'      => $ukupnoKarata,
                'prihod_ukupno'      => $prihodUkupno,
                'prihod_placeno'     => $prihodPlaceno,
            ],
            'po_dogadjaju' => $poDogadjaju,
        ], 200);
    }

    /**
     * Ažuriranje statusa rezervacije (samo radnici).
     * Body: { "status": "placeno" | "neplaceno" }
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        if (! $user || ! $user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu ažurirati status rezervacije.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:placeno,neplaceno',
        ]);

        $rezervacija = Rezervacija::with('dogadjaj','korisnik')->findOrFail($id);
        $rezervacija->update(['status' => $validated['status']]);

        return response()->json([
            'message'     => 'Status rezervacije uspešno ažuriran.',
            'rezervacija' => new RezervacijaResource($rezervacija),
        ], 200);
    }


    /**
    * EXPORT: CSV svih rezervacija (samo radnici).
    */
    public function exportCsv()
    {
        $user = Auth::user();
        if (! $user || ! $user->app_employee) {
            return response()->json(['error' => 'Samo radnici mogu eksportovati rezervacije.'], 403);
        }

        $rezervacije = Rezervacija::with(['dogadjaj','korisnik'])
            ->orderBy('id')
            ->get();

        $filename = 'rezervacije_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $columns = [
            'ID',
            'Datum',
            'Status',
            'Broj karata',
            'Tip karte',
            'Recenzija',
            'Korisnik ID',
            'Korisnik ime',
            'Korisnik email',
            'Događaj ID',
            'Događaj naziv',
            'Cena karte (RSD)',
            'Ukupna cena (RSD)',
            'Kreirano',
            'Ažurirano',
        ];

        return response()->streamDownload(function () use ($rezervacije, $columns) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM za Excel
            fwrite($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header
            fputcsv($handle, $columns);

            foreach ($rezervacije as $r) {
                $cena = optional($r->dogadjaj)->cena ?? 0;
                $ukupno = $cena * ($r->broj_karata ?? 0);

                fputcsv($handle, [
                    $r->id,
                    $r->datum,
                    $r->status,
                    $r->broj_karata,
                    $r->tip_karti,
                    $r->recenzija,
                    optional($r->korisnik)->id,
                    optional($r->korisnik)->name ?? optional($r->korisnik)->ime,
                    optional($r->korisnik)->email,
                    optional($r->dogadjaj)->id,
                    optional($r->dogadjaj)->naziv,
                    $cena,
                    $ukupno,
                    optional($r->created_at)?->toDateTimeString(),
                    optional($r->updated_at)?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, $filename, $headers);
    }


}
