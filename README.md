# Chatterbox

Chatterbox is a realtime messaging application built with [Next 13](https://nextjs.org/) and [Pusher](https://pusher.com/).

You can create a group chat or start a DM. Users can send text messages, or upload multiple videos or images.

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

---

### TODOS

1. Optimistically send messages
2. Add profile to mobile sidebar
3. Conditionally render avatar and username
4. Initial state flicker on `useGetOtherUser`
5. Experiment converting API Routes to server actions (e.g: delete chat)
6. Search
7. Reading old messages indicator
8. Forgot password flow with `nodemailer`
9. Delete messages
10. Roles
11. Infinite scrolling inside chats and on user/chat list
12. Reply
13. Reactions
14. Gifs
