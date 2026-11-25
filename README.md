# GoKid

GoKid is a kids' task, learning and rewards platform. Supervisors and institutions manage children, classes, tasks, gifts, levels and story adventures. Children use the mobile app.

> Graduation project.

## Repository structure
| Folder | What it is |
|---|---|
| `Web/gokid_dashboard` | Admin and supervisor web dashboard (Next.js) |
| `Mobile` | Mobile app |
| `backend` | API server |
| `Ai` | AI models |
| `Documents` | Project documentation |

## Web dashboard features
- Login and token-based authentication
- Manage institutions, classes, students and supervisors
- Manage children, categories and sub-categories
- Create tasks, including voice tasks
- Gifts and levels (rewards)
- Story adventures with a builder page
- Real-time notifications and story-voice status through SignalR
- Platform and supervisor dashboards

## Tech stack
- **Web:** Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI, TanStack Query, Axios, SignalR, dnd-kit
- **Backend:** REST API with SignalR hubs (consumed by the dashboard)

## Getting started (web dashboard)
Requirements: Node.js 20+ and npm.

```bash
cd Web/gokid_dashboard
npm install
npm run dev
```
Open http://localhost:3000.

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-host/api
```
If not set, the dashboard falls back to a default hosted API URL (see `src/lib/axios.ts`).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Team
See the repository's Contributors list. Web dashboard: Eslam Elsayed.
