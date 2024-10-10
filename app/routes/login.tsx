import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Form } from "~/components/ui/Form";
import { TextField } from "~/components/ui/TextField";
import { findUser } from "~/repositories/user";
import { verifyPassword } from "~/utils/hash";
import { useAppSession } from "~/utils/session";

export const loginFn = createServerFn(
  "POST",
  async (payload: { username: string; password: string }) => {
    // check if user exists
    const user = await findUser({ username: payload.username });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if the password is correct
    if (!verifyPassword(payload.password, user.password)) {
      return { success: false, message: "Invalid password" };
    }

    // Create a session
    const session = await useAppSession();

    // Store the username in the session
    await session.update({
      id: user.id,
      username: user.username,
      name: user.name || "",
      email: user.email,
    });

    return {
      success: true,
      message: "Login successful",
      username: payload.username,
    };
  },
);

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="container h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-medium mb-4">Login</h1>

      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          setErrorMessage("");
          const formData = new FormData(e.target as HTMLFormElement);
          const username = formData.get("username") as string;
          const password = formData.get("password") as string;

          const { success, message } = await loginFn({ username, password });
          if (success) {
            // Redirect to the home page
            await router.invalidate();
            router.navigate({ to: "/" });
          } else {
            setErrorMessage(message);
          }
        }}
      >
        <TextField label="Username" type="text" name="username" />
        <TextField label="Password" type="password" name="password" />

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
