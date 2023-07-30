# <img src="./public/images/logo.png" width="50" height="50" /> Chatterbox

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

1. Change password in settings modal
2. Forgot password flow with `nodemailer`
3. **Bugfix**: Videos not showing on iOS
4. Keyboard events on chat input
5. Conditionally render avatar and username
6. Optimistically send messages
7. Invite new users to group chat
8. Leaving GCs
9. Roles
10. Initial state flicker on `useGetOtherUser`
11. Infinite scrolling inside chats and on user/chat list
12. Experiment converting API Routes to server actions (e.g: delete chat)
13. Search
14. Reading old messages indicator
15. Delete messages
16. Reply
17. Reactions
18. Gifs
