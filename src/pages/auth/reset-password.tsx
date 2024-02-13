import { useRouter } from "next/router";

export default function ResetPassword() {
  const { query } = useRouter();

  return (
    <div>
      <h1>Reset Password</h1>
      <p>ID: {query.id as string}</p>
      <p>String {query.token as string}</p>
    </div>
  );
}
