import { useSession } from "vinxi/http";

type SessionUser = {
  username: string;
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: "secretPasswordWith32Characters!!",
  });
}
