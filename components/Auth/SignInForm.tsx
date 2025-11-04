"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInSchema } from "@/lib/auth/validation";
import { useEffect, useState } from "react";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setId } from "@/lib/features/userdata/UserDataSlice";
import { useToast } from "@/hooks/use-toast";
import { PinInput } from "../ui/pin-input";

const SignInForm = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bError, setBError] = useState("");
  const dispatch = useDispatch();
  const [forgottenPassword, setForgottenPassword] = useState(false);
  const [forgetPasswordCode, setForgetPasswordCode] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const { signOut } = useClerk();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isLoaded, signIn, setActive } = useSignIn();
  useEffect(() => {
    if (user) {
      dispatch(setId(user.id));
      router.replace("/inventory");
    }
  }, [user, router, dispatch]);

  const handleSignIn = async (email: string, password: string) => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const result = await signIn?.create({ identifier: email, password });
      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/inventory");
      } else {
        setBError("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setBError("Invalid email or password");
    }
  };
  const handleForgetPassword = async () => {
    const email = await watch("email");
    if (email) {
      await signIn
        ?.create({
          identifier: email,
          strategy: "reset_password_email_code",
        })
        .then(() => {
          toast({ title: "Password reset email sent!" });
          setForgottenPassword(true);
        })
        .catch((err) => {
          toast({
            title: "Failed to send reset email.",
            variant: "destructive",
          });
          console.error(err);
        });
    } else {
      toast({
        title: "Please enter your email first.",
        variant: "destructive",
      });
    }
  };

  // Forgetting Password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Complete the password reset flow
      const response = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: forgetPasswordCode.join(""),
        password: newPassword,
      });

      if (response?.status === "complete") {
        toast({ title: "Password reset successfully!" });
        await signOut();
        setForgottenPassword(false);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Password reset failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        {forgottenPassword ? (
          <div className="space-y-4 text-center w-full">
            <Label>
              A password reset code has been sent to your provided email
            </Label>
            <PinInput
              value={forgetPasswordCode}
              onValueChange={(e) => setForgetPasswordCode(e.value)}
            />
            <div>
              <label>New Password</label>
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                type="password"
                required
                minLength={8}
              />
            </div>
            {bError && <p className="text-red-600">{bError}</p>}
            <Button onClick={handleReset} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              {loading ? "Reseting..." : "Reset"}
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) =>
              handleSignIn(data.email, data.password)
            )}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {bError && <p className="text-red-600 text-center">{bError}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => setActiveTab("signup")}
          disabled={loading}
        >
          Don&apos;t have an account? Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
