"use client";

import { useActionState } from "react";
import { signInAction } from "./actions";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, LockKeyhole, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to") || "/admin";
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f0] text-neutral-900 font-sans selection:bg-black selection:text-white p-4">
      {/* Editorial Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
      <div className="absolute top-2 left-0 w-full h-px bg-black"></div>
      
      <div className="w-full max-w-md relative">
        {/* Decorative Badge */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-black text-white rounded-full flex items-center justify-center shadow-2xl z-10 animate-in fade-in zoom-in duration-700">
          <div className="text-center">
            <LockKeyhole className="size-6 mx-auto mb-1" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest block">Secure</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#fffff8] rounded-none border-2 border-black p-8 pt-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-0">
          <div className="space-y-3 mb-8 text-center border-b-2 border-black pb-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Admin <span className="font-serif italic font-light lowercase">portal</span>
            </h1>
            <p className="text-sm font-mono text-neutral-600 uppercase tracking-wider">
              Authorized personnel only
            </p>
          </div>
          
          {state?.error && (
            <Alert variant="destructive" className="mb-6 rounded-none border-2 border-red-600 bg-red-50 text-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold uppercase tracking-wide text-xs">Access Denied</AlertTitle>
              <AlertDescription className="font-mono text-xs">{state.error}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="return_to" value={returnTo} />
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase tracking-wide text-xs">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                autoFocus
                className="rounded-none border-2 border-black bg-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold uppercase tracking-wide text-xs">Passcode</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-none border-2 border-black bg-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus-visible:ring-0 focus-visible:border-black focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-mono"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-12 rounded-none bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 active:translate-x-1"
            >
              {isPending ? "Verifying..." : (
                <span className="flex items-center gap-2">
                  Authenticate <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            Portfolio CMS System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
