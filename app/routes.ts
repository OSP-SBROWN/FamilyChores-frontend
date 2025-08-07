import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("timezones", "routes/timezones.tsx"),
  route("people", "routes/people.tsx"),
  route("availability", "routes/availability.tsx"),
] satisfies RouteConfig;
