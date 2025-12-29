import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();

  // ✅ Environment variable (correct usage)
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log("API URL:", baseUrl); // remove after verification

  // ✅ Validation schema
  const formSchema = z
    .object({
      name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
      }),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      confirm_password: z.string().min(8, {
        message: "Confirm password must be at least 8 characters.",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // ✅ Corrected API call
  const handleForm = async (values) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/auth/register`,
        {
          method: "POST", // ✅ FIXED
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        toast({
          title: "Registration Successful",
          description: data.message,
        });
        navigate("/login");
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="pt-5 w-[400px]">
        <CardContent>
          <h2 className="text-center font-semibold text-xl mb-3">
            Register Here
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForm)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full mt-4">Register</Button>

              <div className="flex justify-center text-sm mt-4">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="underline text-blue-500"
                  >
                    Login now
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
