import { Button } from "@AmaZon-Clone/ui/components/button";
import { Input } from "@AmaZon-Clone/ui/components/input";
import { Label } from "@AmaZon-Clone/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful");
            window.location.href = "/";
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] pt-6 pb-24 bg-white">
      {/* Amazon Logo Dummy */}
      <h1 className="text-3xl font-bold tracking-tighter mb-4 font-sans text-black">
        Ama<span className="text-[#f90]">Z</span>on
      </h1>

      <div className="w-[350px] p-6 border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-[28px] font-normal mb-4 text-black">Sign in</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button 
              type="submit" 
              className="w-full bg-[#f0c14b] text-black border border-[#a88734] hover:bg-[#ddb347] font-normal" 
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </Button>
          )}
        </form.Subscribe>
      </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-xs text-gray-500 bg-white shadow-sm">New to Amazon?</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Button
          variant="outline"
          onClick={onSwitchToSignUp}
          className="w-full shadow-sm bg-gray-100 hover:bg-gray-200"
        >
          Create your Amazon account
        </Button>
      </div>
    </div>
  );
}
