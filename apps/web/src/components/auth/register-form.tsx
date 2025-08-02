"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterPayload } from "@tunnel/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { toast } from "sonner";
import { useAuthStore } from "~/store";
import { useRouter } from "next/navigation";
import { socials } from "./socials";
import Link from "next/link";
import { auth } from "~/api/auth.api";
import { ROUTES } from "~/constants";

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema.shape.body),
    defaultValues: { email: "" },
  });
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore((state) => state);

  const mutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = async (data: RegisterPayload) => {
    await mutation.mutateAsync(data);
    router.replace("/");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Get Started</h1>
          <p className="text-balance text-muted-foreground">
            Create an account to start using tunnel.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="me@tunnel.app"
                      autoCapitalize="off"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              Create Account
            </Button>
          </form>
        </Form>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {socials.map((social, index) => (
            <Button
              onClick={() => {
                const url = auth.oauth(social.name);
                window.location.href = url;
              }}
              variant="outline"
              className="w-full"
              key={index}
            >
              <social.icon />
              <span className="sr-only">{social.label}</span>
            </Button>
          ))}
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href={ROUTES.AUTH["SIGN-UP"]}
            className="underline underline-offset-4"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
