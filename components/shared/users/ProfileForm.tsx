"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import { ProfileSchema } from "@/lib/validations";
import { editProfile } from "@/lib/actions/user";

interface Props {
  user: UserData;
}

const ProfileForm = ({ user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.profile.name || "",
      bio: user.profile.bio,
      location: user.profile.location,
      portfolio: user.profile.portfolio,
    },
  });

  async function onSubmit(data: z.infer<typeof ProfileSchema>) {
    try {
      setIsSubmitting(true);
      await editProfile({ userId: user._id, ...data });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  type="text"
                  placeholder="Your name"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  type="url"
                  placeholder="Your portfolio link"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  type="text"
                  placeholder="Your location"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                More about you
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  placeholder="Your bio"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit text-light-900"
            disabled={isSubmitting}
          >
            {!isSubmitting ? "Save" : "Saving..."}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
