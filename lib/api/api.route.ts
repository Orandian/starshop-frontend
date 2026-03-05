import { adminRoutes } from "@/lib/api/routes/admin.route";
import { fcRoutes } from "@/lib/api/routes/fc.route";
import { publicRoutes } from "@/lib/api/routes/public.route";
import { userRoutes } from "./routes/user.route";

export const apiRoutes = {
  public: publicRoutes,
  admin: adminRoutes,
  fc: fcRoutes,
  user: userRoutes,
};




