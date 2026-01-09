import { Redirect } from "expo-router";

export default function Index() {
  // Redirect root URL to landing page
  return <Redirect href="/landing" />;
}
