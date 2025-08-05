import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("timezones", "routes/timezones.tsx"),
] satisfies RouteConfig;
