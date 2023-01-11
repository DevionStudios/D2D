import React from "react";
import { useRouter } from "next/router";
import { HiOutlineSearch } from "react-icons/hi";
import { z } from "zod";
import Form, { useZodForm } from "src/components/ui/Form/Form";
import { Input } from "src/components/ui/Input";
import toast from "react-hot-toast";

const SearchSchema = z.object({
  query: z.string().optional(),
});

export function SearchBar() {
  const form = useZodForm({
    schema: SearchSchema,
  });

  const router = useRouter();

  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <HiOutlineSearch
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <Form
          form={form}
          onSubmit={(values) => {
            if (values.query?.startsWith("#")) {
              if (values.query.match(new RegExp("#", "g")).length > 1) {
                toast.error("You can only search for one hashtag at a time!");
                return;
              }
              const query = values.query.slice(1);
              window.location.href = `/search?query=${query}&type=hashtag`;
            } else {
              window.location.href = `/search?query=${values.query}&type=user`;
            }
          }}
        >
          <Input
            noLabel
            label="Search"
            {...form.register("query")}
            className="block w-full dark:text-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
            placeholder="Search Users, #Hashtags"
          />
        </Form>
      </div>
    </div>
  );
}
