import AuthFeedbackMessage from "@/components/ui/auth-feedback-message";
import Link from "next/link";

export type ErrorType =
  | "default"
  | "configuration"
  | "accessdenied"
  | "verification";

interface ErrorView {
  status: number;
  heading: string;
  message: JSX.Element;
  signin?: JSX.Element;
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  const error = searchParams.error?.toLowerCase() as ErrorType;

  const errors: Record<ErrorType, ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <div className="min-w-[200px]">
          <p className="mb-3">An unindentified error has occured.</p>
          <Link
            href="/auth/sign-in"
            className="font-medium text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
          >
            Back to sign in
          </Link>
        </div>
      ),
    },
    configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p className="leading-8">
            Check the server logs for more information.
          </p>
        </div>
      ),
    },
    accessdenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <div>
          <p className="mb-4">You do not have permission to sign in.</p>
          <Link
            href="/auth/signin"
            className="font-medium text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      ),
    },
    verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <div className="flex flex-col gap-3 text-center">
          <p>The sign in link is no longer valid.</p>
          <p>It may have been used already or it may have expired.</p>
        </div>
      ),
      signin: (
        <Link
          className="font-medium text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
          href="/auth/signin"
        >
          Sign in
        </Link>
      ),
    },
  };

  const { heading, message, signin, status } = errors[error] ?? errors.default;

  return (
    <>
      <AuthFeedbackMessage message={`Error - ${status}`} />
      <h2 className="mx-2 mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        {heading}
      </h2>

      <div className="p-5 text-center sm:p-7">
        <div>{message}</div>
        {signin && <div className="mt-5">{signin}</div>}
      </div>
    </>
  );
}
