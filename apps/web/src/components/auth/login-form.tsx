"use client";

import { LoginPayload, loginSchema } from "@tunnel/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "~/api";
import { auth } from "~/api/auth.api";
import { useAuthStore } from "~/store";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { socials } from "./socials";
import { ROUTES } from "~/constants";

export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema.shape.body),
    defaultValues: { email: "" },
  });
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore((state) => state);

  const mutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = async (data: LoginPayload) => {
    await mutation.mutateAsync(data);
    router.replace("/");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Login to your account to continue
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
              login
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
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.AUTH["SIGN-UP"]}
            className="underline underline-offset-4"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
