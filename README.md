# <img src="./public/images/logo.png" width="50" height="50" /> Chatterbox

Chatterbox is a realtime messaging application built with [Next 13](https://nextjs.org/) and [Pusher](https://pusher.com/).

You can create a group chat or start a DM. Users can send text messages, or upload multiple videos or images.

The UI is updated in realtime. Meaning when a channel is created by another user, or when a message is sent, you will instantly see the update.

**Deployed on Vercel: https://chatterboxes.vercel.app/**

## Tech stack

- Next.js 13
- [Pusher](https://pusher.com/) for realtime updates.
- [Prisma](https://www.prisma.io/) for ORM.
- [Next Auth](https://next-auth.js.org/) for authentication with Github or Email.
- [UploadThing](https://uploadthing.com/) for file uploads.
- [TailwindCSS](https://tailwindcss.com/) for styling.
- [Radix UI](https://www.radix-ui.com/) primitives + [Shadcn UI](https://ui.shadcn.com/)
- [zod](https://zod.dev/) for validating forms and parsing API payloads.
- [React Hook Form](https://react-hook-form.com/) for building forms.
- [Jotai](https://jotai.org/) for global state.

## Next 13

This project uses the new Next.js 13 App Router, React Server Components, server actions, suspense and React 18's `cache()`

We also make use of API Routes (Deployed as serverless functions to Vercel) for actions like registering a new user, creating a message, etc.

## Realtime

Whenever a user sends a message, creates a chat, or comes on-line for example, all other users will be notified and their UI will be updated in realtime.

This is done with Pusher. We **listen to events** like `message:new` or `chat:update`. When a user makes an action, we **trigger** the event on the server, and other user's listening will receive the updates.

### Presence

Besides listening and triggering events, Pusher's [presence channels](https://pusher.com/docs/channels/using_channels/presence-channels/) is used to get every user currently online.

When a user logs in, we get every active user from Pusher and store them in a local jotai store. When a user logs in or logs off, Pusher sends an update and we update the jotai store locally.

## Typescript

This project is written in Typescript and uses **Prisma generated types** & **zod schemas** and types to ensure typesafety across the codebase. Because Prisma auto-generates types, we rarely have to declare or maintain any types.

`zod` is used to validate every form client-side to ensure the values are correct before doing any API calls or mutations.

On the server, every API route also has zod validation to ensure the input is valid and corresponds to the zod schema before proceeding.

ESLint is also configured with strict rules to ensure code quality and minimize bugs.

---

# <img src="./public/images/logo.png" width="50" height="50" />

### TODOS

1. Send less data through pusher
2. "Today", "Yesterday", etc. indicators
3. Search channels and users
4. Delete messages
5. Keyboard events on chat input
6. Change password in settings modal
7. Forgot password flow with `nodemailer`
8. **Bugfix**: Videos not showing on iOS
9. Invite new users to group chat
10. Leaving GCs
11. Roles
12. Mute chats
13. Optimistically send messages
14. Initial state flicker on `useGetOtherUser`
15. Infinite scrolling inside chats and on user/chat list
16. Experiment converting API Routes to server actions (e.g: delete chat)
17. Search
18. Reading old messages indicator
19. Reply
20. Reactions
21. Gifs
22. Mentions
