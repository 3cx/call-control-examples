import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Error, ButtonForms } from "cc-component-lib";
import { useQuery } from "@tanstack/react-query";
import { getStatusFunc, stringifyError } from "../../utils";

type Inputs = {
  pbxBase: string;
  appId: string;
  appSecret: string;
};
export const Connect: React.FC = () => {
  const { refetch } = useQuery({
    queryFn: getStatusFunc(),
    queryKey: ["status", "dialer"],
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Inputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const onSubmit: SubmitHandler<Inputs> = async (submitData) => {
    setServerError(undefined);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE}/api/connect?appId=2`,
        {
          method: "POST",
          body: JSON.stringify({
            pbxBase: submitData.pbxBase,
            appId: submitData.appId,
            appSecret: submitData.appSecret,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (json?.errorCode) {
        setServerError(stringifyError(json));
        return;
      }
      refetch();
    } catch (err) {
      setServerError("Failed to connect to Application server");
    }
  };
  return (
    <div className="flex w-full flex-col gap-3 items-center pt-6 px-6">
      {serverError && <Error message={serverError} />}
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="pbxBase">PBX Base URL</label>
        <input
          className="w-full h-[36px] rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
          placeholder="https://pbx.3cx.com"
          id="pbxBase"
          {...register("pbxBase", { required: "Required" })}
        />
        {errors.pbxBase && (
          <p className="text-red-500 text-sm">{errors.pbxBase.message}</p>
        )}
        <label htmlFor="appId">APP ID</label>
        <input
          className="w-full h-[36px] rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
          id="appId"
          placeholder="APP2JAdaOIWKdasG23KAL"
          {...register("appId", { required: "Required" })}
        />
        {errors.appId && (
          <p className="text-red-500 text-sm">{errors.appId.message}</p>
        )}
        <label htmlFor="appSecret">APP Secret</label>
        <input
          className="w-full h-[36px] mb-2 rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
          placeholder="APPSEC3123klJKSADjasdk"
          id="appSecret"
          {...register("appSecret", { required: "Required" })}
        />
        {errors.appSecret && (
          <p className="text-red-500 text-sm">{errors.appSecret.message}</p>
        )}
        <div className="flex justify-center pt-5">
          <ButtonForms
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            label="Connect"
          />
        </div>
      </form>
    </div>
  );
};
