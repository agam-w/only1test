import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/Button";
import { Form } from "~/components/ui/Form";
import { TextField } from "~/components/ui/TextField";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div className="container h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-medium mb-4">Login</h1>

      <Form>
        <TextField label="Username" type="text" />
        <TextField label="Password" type="password" />

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
