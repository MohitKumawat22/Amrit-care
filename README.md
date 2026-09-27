# AmritCare

AmritCare is a patient-focused healthcare platform that brings everyday health support, doctor discovery, appointments, triage, medicine reminders, and follow-up communication into one responsive web application.

The application provides two experiences:

- **Patients** can manage their health journey, find nearby care, book appointments, discuss symptoms with an AI assistant, and manage medicine reminders.
- **Doctors and healthcare staff** can sign in to review patient cases, manage availability and profiles, and handle appointment workflows.

AmritCare is a support and navigation tool, not a replacement for a licensed medical professional. AI responses are intended for preliminary guidance and should not be used as a diagnosis or emergency service.

## What AmritCare does

### Patient care

- Patient registration and password login
- Patient dashboard with appointments, nearby providers, and health actions
- AI symptom conversations and triage history
- Emergency symptom guidance for high-risk wording
- Nearby doctor and clinic discovery using location services
- Facility bookings and doctor appointment requests
- Medical timeline combining triage, bookings, and call history
- Medicine reminders, dose tracking, quantity tracking, and refill alerts
- Optional automated health check-in calls
- Responsive mobile navigation and installable PWA support

### Doctor and staff workflows

- Doctor/staff registration and NextAuth credentials login
- Role-aware patient and doctor appointment views
- Doctor profile, specialty, hospital, and availability management
- Patient history and triage-case views
- X-ray analysis interface
- Verification and subscription screens for the doctor portal

### AI and voice features

The AI assistant uses Groq for conversational health support. It can:

- Respond in English or natural Hinglish
- Use patient-provided context and saved conversation history
- Suggest general home-care steps and appropriate specialist types
- Avoid prescribing specific medicines
- Detect emergency wording and advise immediate emergency help
- Return application actions such as navigation, appointment booking, calendar events, and call scheduling

The voice experience supports browser speech recognition as a fallback, Deepgram speech-to-text when configured, ElevenLabs text-to-speech through the server API, and a Three.js avatar with optional lip-sync data.

## Application architecture

```text
Browser / PWA
  ├─ Patient portal
  ├─ Doctor portal
  ├─ AI chat and triage
  ├─ Medicine reminders
  └─ Voice / 3D avatar
          │
          ▼
Next.js App Router
  ├─ Pages and layouts in src/app
  ├─ API routes in src/app/api
  ├─ Shared UI, hooks, and client workflows
  └─ Server-side Supabase client
          │
          ├─ Supabase PostgreSQL
          ├─ Groq AI
          ├─ Twilio voice calls
          ├─ Mappls/location services
          ├─ Deepgram and ElevenLabs
          └─ n8n automation webhooks
```

The main database is **Supabase PostgreSQL**. Its schema is documented in [`supabase_schema.sql`](supabase_schema.sql). The standalone `scripts/call-worker.js` is an optional worker for scheduled calls and missed-dose escalation; configure it against the same production data/services before using it.

## Main routes

| Area | Routes |
| --- | --- |
| Patient | `/patient/login`, `/patient/register`, `/patient/dashboard`, `/patient/triage`, `/patient/locate`, `/patient/history` |
| Doctor | `/doctor/login`, `/doctor/signup`, `/doctor/dashboard`, `/doctor/profile`, `/doctor/settings`, `/doctor/verify`, `/doctor/subscribe`, `/doctor/xray` |
| Reminders | `/reminders` |
| Authentication | `/api/auth/login`, `/api/auth/register`, `/api/auth/[...nextauth]` |
| Patient data | `/api/patients`, `/api/triage`, `/api/bookings`, `/api/chat/history` |
| Appointments | `/api/appointments`, `/api/appointments/patient`, `/api/appointments/doctor` |
| AI and voice | `/api/chat`, `/api/tts`, `/api/lipsync` |
| Calls | `/api/calls`, `/api/twilio/voice` |
| Reminders | `/api/reminders`, `/api/reminders/mark-taken`, `/api/medicines` |
| External services | `/api/doctors`, `/api/places`, `/api/weather`, `/api/n8n/callback` |

## Technology

- **Framework:** Next.js 16 App Router
- **UI:** React 19, Tailwind CSS 4, Lucide React
- **Database:** Supabase PostgreSQL with `@supabase/supabase-js`
- **Authentication:** NextAuth credentials provider and bcryptjs
- **AI:** Groq chat completions
- **Voice:** Deepgram speech recognition, ElevenLabs/server TTS, browser speech fallbacks
- **Telephony:** Twilio and a node-cron call worker
- **3D:** Three.js, React Three Fiber, Drei, GLB models, and FBX animations
- **Location and data feeds:** Mappls and APILayer integrations
- **Automation:** n8n webhooks
- **Delivery:** PWA manifest, service worker, responsive mobile UI

## Project structure

```text
.
├── public/                         # PWA assets, icons, avatar models, animations, textures
├── scripts/
│   └── call-worker.js              # Optional scheduled-call and missed-dose worker
├── src/
│   ├── app/
│   │   ├── patient/                # Patient pages
│   │   ├── doctor/                 # Doctor/staff pages
│   │   ├── reminders/              # Reminder page
│   │   └── api/                    # Server route handlers
│   ├── components/                 # Shared, patient, doctor, avatar, and reminder UI
│   ├── hooks/                      # Voice, avatar, reminder, alarm, and notification hooks
│   └── lib/                        # Supabase, auth, reminder, alarm, and external API helpers
├── supabase_schema.sql             # Database tables and indexes
├── .env.example                    # Required environment variable names
└── package.json
```

## Getting started

### Requirements

- Node.js 18 or newer
- npm
- A Supabase project

Optional features require their corresponding provider accounts and API keys.

### Install and run

```bash
git clone https://github.com/MohitKumawat22/Amrit-care.git
cd Amrit-care
npm install
```

Create a local environment file:

```bash
copy .env.example .env.local
```

Run [`supabase_schema.sql`](supabase_schema.sql) in the Supabase SQL editor, fill in the required values, and start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The full variable list is in [`.env.example`](.env.example).

### Required for the core application

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
NEXTAUTH_SECRET=use_a_long_random_secret
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

### Optional integrations

```env
MAPPLS_API_KEY=your_mappls_key
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
NGROK_URL=https://your-public-webhook-url
ELEVENLABS_API_KEY=your_elevenlabs_key
N8N_REMINDER_WEBHOOK_URL=
N8N_ALERT_WEBHOOK_URL=
N8N_MISSED_DOSE_WEBHOOK_URL=
N8N_CALLBACK_SECRET=your_callback_secret
APILAYER_API_KEY=your_apilayer_key
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, Twilio credentials, AI provider keys, or webhook secrets to the browser. Only variables explicitly prefixed with `NEXT_PUBLIC_` are intended for client-side use.

## Database domains

The schema contains tables for:

- `users` and `patients`
- `doctor_profiles`
- `appointments` and facility `bookings`
- `triages` and `chat_histories`
- `reminders` and `medicines`
- `call_logs`

Patient-facing APIs should use the authenticated user identity when accessing private records. Review and configure Supabase Row Level Security before deploying sensitive health data to production.

## Useful commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm start         # Start the production server
npm run lint      # Run ESLint
node scripts/call-worker.js  # Start the optional call/reminder worker
```

## Safety and deployment notes

- AmritCare provides preliminary support, not medical diagnosis or treatment.
- Emergency symptoms should be directed to local emergency services immediately.
- Keep credentials and service-role keys server-side.
- Add authentication and ownership checks to every private patient-data endpoint.
- Validate Twilio signatures and protect n8n callbacks with a required secret.
- Use HTTPS in production and configure the Twilio webhook URL to reach `/api/twilio/voice`.
- The call worker must run continuously for scheduled calls; hosting a Next.js web process alone does not run it.
- Add rate limits, request-size limits, audit logging, backups, and appropriate healthcare/privacy controls before real patient use.

## License

This project is maintained as the AmritCare application base. Add a project-specific license before distributing it outside the owning team.
