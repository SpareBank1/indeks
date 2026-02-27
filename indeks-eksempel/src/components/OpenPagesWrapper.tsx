import { Outlet } from "react-router-dom";

export default function OpenPagesWrapper() {
  return (
    <div className="">
      <Outlet />
    </div>
  );
}
