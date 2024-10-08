import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Button } from "~/components/ui/Button";
import { Form } from "~/components/ui/Form";
import { TextField } from "~/components/ui/TextField";
import { useAppSession } from "~/utils/session";

export const loginFn = createServerFn(
  "POST",
  async (payload: { username: string; password: string }) => {
    // TODO: Implement authentication logic
    if (payload.username === "user" && payload.password === "123456") {
      // Create a session
      const session = await useAppSession();

      // Store the username in the session
      await session.update({
        username: payload.username,
      });
      return {
        success: true,
        message: "Login successful",
        username: payload.username,
      };
    }

    return { success: false, message: "Invalid username or password" };
  },
);

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const router = useRouter();

  return (
    <div className="container h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-medium mb-4">Login</h1>

      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const username = formData.get("username") as string;
          const password = formData.get("password") as string;

          const { success } = await loginFn({ username, password });
          if (success) {
            // Redirect to the home page
            await router.invalidate();
            router.navigate({ to: "/" });
          } else {
            alert("Invalid username or password");
          }
        }}
      >
        <TextField label="Username" type="text" name="username" />
        <TextField label="Password" type="password" name="password" />

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
