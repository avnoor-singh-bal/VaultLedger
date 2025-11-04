"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck, Loader2, UserPlus } from "lucide-react";
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
import { SignUpSchema } from "@/lib/auth/validation";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PinInput } from "../ui/pin-input";
import { ToastAction } from "@radix-ui/react-toast";

type User = {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
};

const SignUpForm = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [email, setEmail] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { user } = useUser();
  const [bError, setBError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push("/inventory");
    }
  }, [user, router]);

  const handleSignUp = async (firstName: string, lastName: string, email: string, password: string) => {
    setBError("");
    if (!isLoaded) return;
    setLoading(true);
    const user: User = {
      first_name: firstName,
      last_name: lastName,
      email_address: email!,
      password: password,
    };
    try {
      
      await signUp.create(user);

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setEmail(email);
      setPendingVerification(true);
    } catch (err) {
      if (err instanceof Error) {
        setBError(err.message);
      } else {
        setBError("An unknown error occurred");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    await signUp
      .attemptEmailAddressVerification({
        code: code.join(""),
      })
      .then(async (completeSignUp) => {
        if (completeSignUp.status !== "complete") {
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
        if (completeSignUp.status === "complete") {
          toast({
            title: "Acount Created Successfully! ",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
          await setActive({ session: completeSignUp.createdSessionId });
          router.push("/inventory");
        }
      })
      .catch((err) => {
        setBError(err.message);
        setLoading(false);
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingVerification ? (
          <div className="space-y-4 text-center w-full">
            <Label>A verification code has been sent to {email}</Label>
            <PinInput value={code} onValueChange={(e) => setCode(e.value)} />
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              {loading ? "Verifying..." : "Verify"}
            </Button>
            {bError && <p className="text-red-600">{bError}</p>}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((data) => handleSignUp(data.firstname, data.lastname, data.email, data.password))}
            className="space-y-4"
          >
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 space-x-2">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" {...register("firstname")} placeholder="First Name" />
                {errors.firstname && (
                  <p className="text-red-600">{errors.firstname.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" {...register("lastname")} placeholder="Last Name" />
                {errors.lastname && (
                  <p className="text-red-600">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Email" />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="●●●●●●●●" />
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            {bError && <p className="text-red-600 text-center">{bError}</p>}
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => setActiveTab("signin")}
        >
          Already have an account? Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
