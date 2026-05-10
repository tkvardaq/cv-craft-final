import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CV } from "@/lib/schemas/cv";

export function PersonalSection() {
  const { control } = useFormContext<CV>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={control}
          name="personal.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-semibold">First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personal.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-semibold">Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Smith" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personal.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-semibold">Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="john.smith@example.com" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personal.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 font-semibold">Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+44 7700 900000" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personal.address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-slate-600 font-semibold">Location / Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="London, United Kingdom" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personal.linkedin"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-slate-600 font-semibold">LinkedIn Profile URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="linkedin.com/in/johnsmith" className="bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-xl h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
