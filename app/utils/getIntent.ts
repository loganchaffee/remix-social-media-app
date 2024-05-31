import { ActionFunctionArgs } from "@remix-run/node";

export async function getIntent({ request }: ActionFunctionArgs) {
  return (await request.clone().formData()).get("intent");
}
