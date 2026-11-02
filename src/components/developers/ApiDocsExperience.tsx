'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircle,
  IoCodeSlashOutline,
  IoDocumentTextOutline,
  IoLockClosedOutline,
  IoRadioOutline,
  IoServerOutline,
  IoShieldCheckmarkOutline,
  IoTerminalOutline,
} from 'react-icons/io5';
import Logo from '@/components/ui/Logo';
import CodeBlock from '@/components/developers/CodeBlock';

const API = 'https://api.faucon.cm/api';
const SOCKET = 'https://api.faucon.cm';

const navigation = [
  ['demarrage', 'Démarrage rapide'],
  ['cles', 'Clés API'],
  ['endpoints', 'Endpoints'],
  ['donnees', 'Données exposées'],
  ['temps-reel', 'Temps réel'],
  ['exemples', 'Exemples par langage'],
  ['erreurs', 'Erreurs & limites'],
  ['securite', 'Sécurité'],
];

const ownerEndpoints = [
  ['GET', '/owner/vehicles', 'Vos véhicules, leur état et leur dernière position', 'Liste filtrée par propriétaire'],
  ['GET', '/owner/vehicles/:id', 'Détail d’un véhicule : état, réglages et dernière position', 'UUID du véhicule'],
  ['GET', '/owner/vehicles/:id/position/last', 'Dernière position brute connue', 'UUID du véhicule'],
  ['GET', '/owner/vehicles/:id/positions', 'Historique brut des déplacements', '?date=YYYY-MM-DD ou ?from=&to='],
  ['GET', '/owner/vehicles/:id/alerts', 'Alertes du véhicule', '?limit=1..100&unread=true'],
  ['GET', '/owner/vehicles/:id/health', 'État GPS, réseau et batterie du boîtier', 'UUID du véhicule'],
] as const;

const keyEndpoints = [
  ['GET', '/api-keys', 'Lister vos clés (sans le secret)', 'JWT du compte'],
  ['POST', '/api-keys', 'Créer une clé lecture seule', 'JWT du compte'],
  ['DELETE', '/api-keys/:id', 'Révoquer immédiatement une clé', 'JWT du compte'],
] as const;

const vehicleJson = `{
  "success": true,
  "message": "Véhicules récupérés",
  "data": [
    {
      "id": "8c5f2d7e-1a4b-4c3d-9e2f-0a1b2c3d4e5f",
      "nom": "Camion Nord",
      "trackerId": "FCN-0733",
      "modeActuel": "MOVE",
      "niveauBatterie": 78,
      "estActif": true,
      "derniereCommunication": "2026-10-28T14:32:00.000Z",
      "limiteVitesse": { "seuilKmh": 80, "estActive": true },
      "perimetreGeofence": {
        "nom": "Dépôt Douala",
        "centreLat": 4.0511,
        "centreLon": 9.7679,
        "rayonMetres": 500,
        "estActif": true
      },
      "enLigne": true,
      "dernierePosition": {
        "latitude": 3.8480,
        "longitude": 11.5021,
        "vitesse": 42,
        "cap": 128,
        "batterie": 78,
        "horodatage": "2026-10-28T14:32:00.000Z"
      }
    }
  ]
}`;

const positionJson = `{
  "id": "8710",
  "latitude": 3.8480,
  "longitude": 11.5021,
  "altitude": null,
  "vitesse": 42,
  "cap": 128,
  "satellites": 8,
  "signal": 74,
  "hdop": 1.1,
  "batterie": 78,
  "contact": true,
  "horodatage": "2026-10-28T14:32:00.000Z",
  "recuLe": "2026-10-28T14:32:02.000Z"
}`;

const alertJson = `{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "typeAlarme": "VITESSE_EXCESSIVE",
  "latitude": 3.8480,
  "longitude": 11.5021,
  "valeurMesuree": 86,
  "seuilConfigure": 80,
  "estAcquittee": false,
  "dateAcquittement": null,
  "horodatage": "2026-10-28T14:32:00.000Z"
}`;

const healthJson = `{
  "horodatage": "2026-10-28T14:30:00.000Z",
  "mode": "MOVE",
  "fixValide": true,
  "fixPerime": false,
  "ageFixSecondes": 12,
  "satellites": 9,
  "hdop": 1.2,
  "batteriePct": 85,
  "signalPct": 70,
  "signalValide": true
}`;

const curlSample = `API="${API}"
KEY="fk_live_VOTRE_CLE"

# Vos véhicules
curl -s "$API/owner/vehicles" \\
  -H "X-API-Key: $KEY"

# Dernière position d'un véhicule
curl -s "$API/owner/vehicles/VEHICLE_ID/position/last" \\
  -H "X-API-Key: $KEY"

# Historique d'une journée
curl -s "$API/owner/vehicles/VEHICLE_ID/positions?date=2026-10-28" \\
  -H "X-API-Key: $KEY"

# Plage de dates (ISO 8601)
curl -s "$API/owner/vehicles/VEHICLE_ID/positions?from=2026-10-01T00:00:00Z&to=2026-10-31T23:59:59Z" \\
  -H "X-API-Key: $KEY"

# Alertes non acquittées
curl -s "$API/owner/vehicles/VEHICLE_ID/alerts?unread=true&limit=20" \\
  -H "X-API-Key: $KEY"`;

const jsSample = `const API = '${API}';
const API_KEY = process.env.FAUCON_API_KEY; // jamais dans le frontend public

async function fauchonGet(path) {
  const response = await fetch(API + path, {
    headers: { 'X-API-Key': API_KEY },
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || 'Erreur API');
  }
  return body.data;
}

const vehicles = await fauchonGet('/owner/vehicles');
const vehicleId = vehicles[0].id;

const lastPosition = await fauchonGet(
  '/owner/vehicles/' + vehicleId + '/position/last'
);

const history = await fauchonGet(
  '/owner/vehicles/' + vehicleId + '/positions?date=2026-10-28'
);

const alerts = await fauchonGet(
  '/owner/vehicles/' + vehicleId + '/alerts?unread=true'
);`;

const pythonSample = `import os
import requests

API = "${API}"
HEADERS = {"X-API-Key": os.environ["FAUCON_API_KEY"]}

vehicles = requests.get(
    API + "/owner/vehicles",
    headers=HEADERS,
    timeout=10,
).json()["data"]

vehicle_id = vehicles[0]["id"]

last_position = requests.get(
    API + "/owner/vehicles/" + vehicle_id + "/position/last",
    headers=HEADERS,
    timeout=10,
).json()["data"]

history = requests.get(
    API + "/owner/vehicles/" + vehicle_id + "/positions",
    headers=HEADERS,
    params={"date": "2026-10-28"},
    timeout=10,
).json()["data"]

health = requests.get(
    API + "/owner/vehicles/" + vehicle_id + "/health",
    headers=HEADERS,
    timeout=10,
).json()["data"]`;

const phpSample = `<?php
const API = '${API}';

function ownerGet(string $path): array {
    $key = getenv('FAUCON_API_KEY');
    $ch = curl_init(API . $path);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'X-API-Key: ' . $key,
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 15,
    ]);

    $raw = curl_exec($ch);
    if ($raw === false) {
        throw new RuntimeException(curl_error($ch));
    }
    curl_close($ch);

    $payload = json_decode($raw, true);
    if (!($payload['success'] ?? false)) {
        throw new RuntimeException($payload['message'] ?? 'Erreur API');
    }
    return $payload['data'];
}

$vehicles = ownerGet('/owner/vehicles');
$vehicleId = $vehicles[0]['id'];

$position = ownerGet(
    '/owner/vehicles/' . $vehicleId . '/position/last'
);`;

const kotlinSample = `import okhttp3.*
import org.json.JSONObject

const val API = "${API}"
val client = OkHttpClient()

fun ownerGet(path: String): JSONObject {
    val key = System.getenv("FAUCON_API_KEY")
        ?: error("FAUCON_API_KEY manquante")

    val request = Request.Builder()
        .url(API + path)
        .header("X-API-Key", key)
        .header("Accept", "application/json")
        .get()
        .build()

    client.newCall(request).execute().use { response ->
        val payload = JSONObject(response.body?.string() ?: "{}")
        if (!response.isSuccessful || !payload.optBoolean("success")) {
            error(payload.optString("message", "Erreur API"))
        }
        return payload
    }
}

val vehicles = ownerGet("/owner/vehicles").getJSONArray("data")
val vehicleId = vehicles.getJSONObject(0).getString("id")
val position = ownerGet(
    "/owner/vehicles/" + vehicleId + "/position/last"
).optJSONObject("data")`;

const createKeyCurl = `# Étape 1 — se connecter (côté serveur, jamais dans un navigateur public)
curl -s -X POST "${API}/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"vous@exemple.cm","password":"••••••••"}'

# Étape 2 — créer UNE clé dédiée à l'intégration
curl -s -X POST "${API}/api-keys" \\
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"nom":"ERP production"}'

# La réponse contient "key" UNE SEULE FOIS.
# Conservez-la dans un coffre-fort de secrets, pas dans le code.

# Étape 3 — utiliser la clé
curl -s "${API}/owner/vehicles" \\
  -H "X-API-Key: fk_live_..."`;

const realtimeJs = `import { io } from 'socket.io-client';

const socket = io('${SOCKET}', {
  transports: ['websocket'],
  auth: { token: process.env.FAUCON_API_KEY },
});

socket.on('connect', () => {
  socket.emit('subscribe', ['VEHICLE_ID_1', 'VEHICLE_ID_2']);
});

socket.on('position_update', (position) => {
  console.log(position.vehiculeId, position.latitude, position.longitude);
});

socket.on('alarm', (alarm) => {
  console.log(alarm.typeAlarme, alarm.horodatage);
});

socket.on('vehicle_mode', ({ vehiculeId, modeActuel }) => {
  console.log(vehiculeId, modeActuel);
});`;

export default function ApiDocsExperience() {
  const [language, setLanguage] = useState('javascript');

  const samples: Record<string, { label: string; code: string }> = {
    curl: { label: 'cURL', code: curlSample },
    javascript: { label: 'JavaScript / Node.js', code: jsSample },
    python: { label: 'Python', code: pythonSample },
    php: { label: 'PHP', code: phpSample },
    kotlin: { label: 'Kotlin / Android', code: kotlinSample },
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Retour à l’accueil Faucon">
              <Logo tone="color" size={28} />
            </Link>
            <span className="hidden h-5 w-px bg-neutral-200 sm:block" />
            <span className="hidden text-xs font-semibold text-neutral-500 sm:block">
              API propriétaire · lecture seule
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              <IoArrowBackOutline /> Site
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-700"
            >
              Espace client <IoArrowForwardOutline />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-blueprint opacity-[0.12]" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-300">
            Faucon Owner API
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.045em] md:text-6xl">
            Les données de vos traceurs.
            <span className="block text-accent-300">Rien de plus.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-primary-100/80 md:text-base">
            Une API en lecture seule pour récupérer l’état et les déplacements des
            traceurs que vous avez achetés, sans passer par l’application mobile. Votre
            clé ne donne accès qu’à vos véhicules et à aucune donnée interne Faucon.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Lecture seule', 'Clé API dédiée', 'Vos véhicules uniquement', 'REST + Socket.IO', 'ISO 8601 UTC'].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-primary-100/80"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[220px_1fr] lg:gap-14 lg:py-16">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Sommaire de la documentation">
            {navigation.map(([id, label]) => (
              <a
                key={id}
                href={'#' + id}
                className="block rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-16">
          <section id="demarrage" className="scroll-mt-24">
            <SectionTitle icon={<IoServerOutline />} eyebrow="01" title="Démarrage rapide" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              L’API propriétaire est une API REST JSON en <strong>lecture seule</strong>.
              Elle expose uniquement les appareils rattachés à votre compte, leur état et
              leurs déplacements. Les dates sont en ISO 8601 UTC.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard label="Base URL (exemple)" value={API} mono />
              <InfoCard label="WebSocket (exemple)" value={SOCKET} mono />
              <InfoCard label="En-tête d’authentification" value="X-API-Key: fk_live_…" mono />
              <InfoCard label="Portée de la clé" value="owner:read — vos véhicules uniquement" />
            </div>

            <StepList
              steps={[
                ['Créer une clé API', 'Dans l’application mobile : Profil → Clés API. Ou via POST /api-keys avec votre JWT. Le secret n’est affiché qu’une seule fois.'],
                ['Appeler l’API propriétaire', 'Envoyez X-API-Key sur /owner/vehicles, /owner/vehicles/:id/position/last ou /positions.'],
                ['Écouter le temps réel', 'Connectez Socket.IO avec la même clé, puis subscribe à vos identifiants de véhicules.'],
              ]}
            />

            <Callout tone="info">
              L’URL exacte de votre instance et votre clé vous sont communiquées lors de
              l’activation. Ne partagez jamais votre mot de passe avec un prestataire :
              créez-lui une clé dédiée, révocable à tout moment, et transmettez-la par un
              canal sécurisé.
            </Callout>
          </section>

          <section id="cles" className="scroll-mt-24">
            <SectionTitle icon={<IoLockClosedOutline />} eyebrow="02" title="Clés API" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Une clé est liée à votre compte, limitée à la portée <code>owner:read</code>{' '}
              et ne peut lire que les véhicules qui vous appartiennent. Le secret est
              stocké sous forme d’empreinte SHA-256 : Faucon ne peut pas le réafficher.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard label="Format" value="fk_live_ + 43 caractères" mono />
              <InfoCard label="Scope" value="owner:read (lecture seule)" />
              <InfoCard label="Révocation" value="Immédiate via DELETE /api-keys/:id" />
            </div>

            <div className="mt-6">
              <CodeBlock language="bash" title="créer et utiliser une clé" code={createKeyCurl} />
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-100">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Méthode</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Chemin</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Rôle</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {keyEndpoints.map(([method, path, description, auth], index) => (
                    <tr key={path + method} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-0/40'}>
                      <td className="px-4 py-3"><MethodBadge method={method} /></td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-primary-800">{path}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600">{description}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold text-neutral-500">{auth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Callout tone="warning">
              Une clé API est un secret. Ne la mettez jamais dans un dépôt Git, un bundle
              JavaScript public ou une application mobile distribuée. Pour un site web,
              faites transiter les appels par votre propre backend.
            </Callout>
          </section>

          <section id="endpoints" className="scroll-mt-24">
            <SectionTitle icon={<IoDocumentTextOutline />} eyebrow="03" title="Endpoints" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Toutes les routes sous <code>/owner</code> sont en lecture seule, limitées à
              120 requêtes par minute et par IP, et filtrées sur le propriétaire de la clé.
              Aucune route d’écriture n’est exposée : les commandes, la configuration et
              l’administration restent dans l’espace client sécurisé.
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-100">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Méthode</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Chemin</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Description</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Paramètres</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerEndpoints.map(([method, path, description, params], index) => (
                    <tr key={path + method} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-0/40'}>
                      <td className="px-4 py-3"><MethodBadge method={method} /></td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-primary-800">{path}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600">{description}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-neutral-500">{params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-100 p-5">
                <p className="text-xs font-bold text-neutral-900">Paramètres d’historique</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
                  <li><code>date</code> — <code>YYYY-MM-DD</code>, jour calendaire Douala.</li>
                  <li><code>from</code> / <code>to</code> — ISO 8601, plage personnalisée.</li>
                  <li>Maximum <strong>10 000 positions</strong> par appel.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-100 p-5">
                <p className="text-xs font-bold text-neutral-900">Paramètres d’alertes</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
                  <li><code>limit</code> — 1 à 100, défaut 50.</li>
                  <li><code>unread=true</code> — uniquement les alertes non acquittées.</li>
                  <li>Aucune modification d’alerte n’est possible via cette API.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="donnees" className="scroll-mt-24">
            <SectionTitle icon={<IoCodeSlashOutline />} eyebrow="04" title="Données exposées" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Seules les données utiles au suivi de vos appareils sont renvoyées. Les
              informations de compte, les identifiants techniques, les commandes et les
              diagnostics internes de Faucon ne sont jamais inclus.
            </p>

            <div className="mt-6 space-y-4">
              <JsonAccordion title="Véhicule — GET /owner/vehicles" code={vehicleJson} />
              <JsonAccordion title="Position brute — GET …/position/last ou …/positions" code={positionJson} />
              <JsonAccordion title="Alerte — GET …/alerts" code={alertJson} />
              <JsonAccordion title="Santé du traceur — GET …/health" code={healthJson} />
            </div>

            <div className="mt-6 rounded-xl border border-neutral-100 p-5">
              <p className="text-xs font-bold text-neutral-900">Champs de position</p>
              <div className="mt-3 grid gap-x-6 gap-y-2 text-xs text-neutral-600 sm:grid-cols-2">
                {[
                  ['latitude / longitude', 'Coordonnées WGS84'],
                  ['vitesse', 'km/h'],
                  ['cap', 'Degrés, 0 = nord'],
                  ['satellites', 'Nombre de satellites GPS'],
                  ['signal', 'Qualité réseau en %'],
                  ['hdop', 'Précision horizontale GPS'],
                  ['batterie', 'Niveau de batterie en %'],
                  ['contact', 'Contact véhicule (ACC)'],
                  ['horodatage', 'Heure GPS de la mesure'],
                  ['recuLe', 'Heure de réception serveur'],
                ].map(([field, meaning]) => (
                  <div key={field} className="flex gap-2">
                    <code className="shrink-0 font-semibold text-primary-800">{field}</code>
                    <span>{meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            <Callout tone="warning">
              <strong>Données non exposées :</strong> compte et profil, identifiants de
              connexion, données internes du boîtier et de l’exploitation, commandes,
              journaux techniques et diagnostics réservés à Faucon.
            </Callout>
          </section>

          <section id="temps-reel" className="scroll-mt-24">
            <SectionTitle icon={<IoRadioOutline />} eyebrow="05" title="Temps réel — Socket.IO" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              La clé API peut aussi ouvrir le canal temps réel, toujours en lecture seule.
              Après connexion, le client s’abonne aux identifiants de ses véhicules
              (maximum 50 par appel). Les événements réservés à l’exploitation Faucon ne sont
              jamais diffusés aux clients authentifiés par clé API.
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-100">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Événement</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Sens</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Payload utile</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['subscribe', 'Client → serveur', '["vehicleId1", "vehicleId2"]'],
                    ['position_update', 'Serveur → client', 'vehiculeId, latitude, longitude, vitesse, cap, battery, satellites, signal, statutACC, horodatage'],
                    ['alarm', 'Serveur → client', 'id, vehiculeId, typeAlarme, latitude, longitude, horodatage'],
                    ['vehicle_mode', 'Serveur → client', '{ vehiculeId, modeActuel }'],
                  ].map(([event, direction, payload], index) => (
                    <tr key={event} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-0/40'}>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-primary-800">{event}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold text-neutral-500">{direction}</td>
                      <td className="px-4 py-3 font-mono text-[10px] leading-relaxed text-neutral-600">{payload}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <CodeBlock language="javascript" title="Socket.IO — JavaScript" code={realtimeJs} />
            </div>

            <Callout tone="info">
              Les alertes temps réel contiennent l’essentiel pour la notification. Pour les
              valeurs mesurées et les seuils, rechargez{' '}
              <code>/owner/vehicles/:id/alerts</code>.
            </Callout>
          </section>

          <section id="exemples" className="scroll-mt-24">
            <SectionTitle icon={<IoTerminalOutline />} eyebrow="06" title="Exemples par langage" />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
              Chaque exemple montre la lecture des véhicules, de la dernière position et de
              l’historique avec une clé API. Adaptez le chargement du secret à votre
              coffre-fort (variables d’environnement, Vault, Secrets Manager…).
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(samples).map(([id, sample]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLanguage(id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    language === id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <CodeBlock language={samples[language].label} code={samples[language].code} />
            </div>

            <Callout tone="info">
              Pour une application mobile, ne stockez pas une clé donnant accès à toute la
              flotte dans le binaire publié. Préférez un backend intermédiaire qui limite
              l’utilisateur à ses propres véhicules.
            </Callout>
          </section>

          <section id="erreurs" className="scroll-mt-24">
            <SectionTitle icon={<IoShieldCheckmarkOutline />} eyebrow="07" title="Erreurs & limites" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-100 p-5">
                <p className="text-xs font-bold text-neutral-900">Codes HTTP</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
                  <li><code>200</code> — succès</li>
                  <li><code>400</code> — date ou paramètre invalide</li>
                  <li><code>401</code> — clé absente, invalide, révoquée ou expirée</li>
                  <li><code>404</code> — véhicule introuvable ou non rattaché à votre compte</li>
                  <li><code>429</code> — limite de débit, respecter <code>Retry-After</code></li>
                  <li><code>500</code> — erreur serveur, réessayer avec backoff</li>
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-100 p-5">
                <p className="text-xs font-bold text-neutral-900">Limites</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
                  <li><code>/owner/*</code> : 120 requêtes / minute / IP</li>
                  <li><code>/api-keys</code> : 20 requêtes / minute / IP</li>
                  <li>Historique : 10 000 positions maximum par appel</li>
                  <li>Alertes : 100 maximum par appel</li>
                  <li><code>subscribe</code> : 50 véhicules maximum</li>
                  <li>10 clés actives maximum par compte</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-neutral-100 p-5">
              <p className="text-xs font-bold text-neutral-900">Stratégie recommandée</p>
              <div className="mt-3 grid gap-3 text-xs leading-relaxed text-neutral-600 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-neutral-900">1. Initial</p>
                  <p className="mt-1">GET /owner/vehicles pour l’état et la dernière position.</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">2. Live</p>
                  <p className="mt-1">Socket.IO pour les positions et alertes.</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">3. Filet</p>
                  <p className="mt-1">Poll REST toutes les 30–60 s si le socket est coupé.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="securite" className="scroll-mt-24">
            <SectionTitle icon={<IoShieldCheckmarkOutline />} eyebrow="08" title="Sécurité" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-neutral-0 p-5">
                <p className="text-xs font-bold text-neutral-900">Bonnes pratiques</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-600">
                  {[
                    'Une clé par intégration ou prestataire.',
                    'Stockage dans un coffre-fort de secrets, jamais dans Git.',
                    'HTTPS exclusivement, certificats validés.',
                    'Révocation immédiate au départ d’un prestataire.',
                    'Backoff exponentiel sur 429 et 5xx.',
                    'Journaliser les appels sans jamais écrire la clé en clair.',
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <IoCheckmarkCircle className="mt-0.5 shrink-0 text-success-strong" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-danger/15 bg-danger-tint/40 p-5">
                <p className="text-xs font-bold text-danger-strong">Interdit</p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-neutral-700">
                  {[
                    'Partager la clé d’un autre client.',
                    'Exposer la clé dans un navigateur ou une app publiée.',
                    'Tenter d’accéder à un véhicule qui n’est pas le vôtre.',
                    'Utiliser l’API pour contourner les règles de sécurité Faucon.',
                    'Conserver une clé après le départ d’un collaborateur.',
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-danger" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/60 p-6">
              <p className="text-sm font-bold text-neutral-900">Une question sur votre intégration ?</p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-neutral-600">
                Écrivez à{' '}
                <a href="mailto:admin@faucon.cm" className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-2">
                  admin@faucon.cm
                </a>{' '}
                en précisant votre entreprise, le traceur concerné et les endpoints utilisés.
                Ne joignez jamais une clé API en clair dans un e-mail.
              </p>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-neutral-100 bg-neutral-0">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-8 text-xs text-neutral-500 md:flex-row md:items-center md:px-8">
          <p>© {new Date().getFullYear()} Faucon — API propriétaire.</p>
          <div className="flex gap-5">
            <Link href="/" className="font-semibold text-primary-700 hover:text-primary-800">
              Retour au site
            </Link>
            <a href="mailto:admin@faucon.cm" className="hover:text-neutral-900">
              Support intégration
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="border-b border-neutral-100 pb-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-primary-600">
          {icon}
        </span>
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-neutral-900 md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-0/50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      <p className={`mt-1.5 break-all text-xs font-semibold text-neutral-900 ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function StepList({ steps }: { steps: [string, string][] }) {
  return (
    <div className="mt-6 space-y-3">
      {steps.map(([title, text], index) => (
        <div key={title} className="flex gap-4 rounded-xl border border-neutral-100 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[11px] font-bold text-white">
            {index + 1}
          </span>
          <div>
            <p className="text-xs font-bold text-neutral-900">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Callout({ tone, children }: { tone: 'info' | 'warning'; children: ReactNode }) {
  const styles =
    tone === 'warning'
      ? 'border-warning/20 bg-warning-tint/60 text-warning-strong'
      : 'border-primary-100 bg-primary-50/60 text-primary-900';
  return (
    <div className={`mt-5 rounded-xl border px-4 py-3 text-xs leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-primary-50 text-primary-700',
    POST: 'bg-success-tint text-success-strong',
    PUT: 'bg-warning-tint text-warning-strong',
    PATCH: 'bg-accent-50 text-accent-700',
    DELETE: 'bg-danger-tint text-danger-strong',
  };
  return (
    <span className={`rounded-md px-2 py-1 font-mono text-[10px] font-bold ${colors[method] ?? 'bg-neutral-100 text-neutral-600'}`}>
      {method}
    </span>
  );
}

function JsonAccordion({ title, code }: { title: string; code: string }) {
  return (
    <details className="group rounded-xl border border-neutral-100 bg-white open:bg-neutral-0/20">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
        <span className="text-xs font-bold text-neutral-900">{title}</span>
        <span className="text-[10px] font-semibold text-primary-600 group-open:hidden">Afficher</span>
        <span className="hidden text-[10px] font-semibold text-neutral-500 group-open:inline">Masquer</span>
      </summary>
      <div className="px-3 pb-3">
        <CodeBlock language="json" code={code} />
      </div>
    </details>
  );
}
