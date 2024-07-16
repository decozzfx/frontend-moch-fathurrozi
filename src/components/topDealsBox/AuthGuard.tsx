import { Navigate, Outlet } from "react-router-dom";
import useStore from "../../zustand";

interface IProps {
  level: string[];
}

const AuthGuard = ({ level }: IProps) => {
  // Do we have access to the requested page(the page will be rendered in <Outlet />)
  const userLevel = useStore((state) => state.user.data?.level);
  const hasAccess = level.includes(userLevel?.toString() || "");
  return hasAccess ? <Outlet /> : <Navigate to={"/unauthorized"} replace />;
};
export default AuthGuard;
