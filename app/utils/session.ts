import { useSession } from "vinxi/http";

type SessionUser = {
  id: number;
  username: string;
  name: string;
  email: string;
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: "secretPasswordWith32Characters!!",
  });
}
