import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import { ZodSchema, TypeOf } from "zod";
import FormSubmitButton from "../SubmitButton";

export const useZodForm = ({ schema, ...formConfig }) => {
  return useForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};

export function FieldError({ name }) {
  const {
    formState: { errors },
  } = useFormContext();

  if (!name) return null;

  const error = errors[name];
  if (!error) return null;

  return <span className="text-sm text-red-600">{error.message}</span>;
}

const Form = ({ form, onSubmit, children, ...props }) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset
          className="flex flex-col space-y-4"
          disabled={form.formState.isSubmitting}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

Form.SubmitButton = FormSubmitButton;

export default Form;
