import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { getEnumeredType, getStatusFunc, stringifyError } from '../shared';
import { useState } from 'react';
import { ConnectFormProps } from '../types';
import { ButtonForms, Error } from 'cc-component-lib';
import { APP_TYPE_CUSTOM_IVR, APP_TYPE_DIALER, APP_TYPE_OUTBOUND_CAMPAIGN } from '../constants';
import { ErrorPortal } from '../error-portal';

type Inputs = {
  pbxBase: string;
  appId: string;
  appSecret: string;
};

export default function ConnectForm({ appType }: ConnectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<Inputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const { data, refetch } = useQuery({
    queryFn: getStatusFunc(appType),
    queryKey: ['status', appType]
  });

  function renderFormTitle() {
    switch (appType) {
      case APP_TYPE_CUSTOM_IVR:
        return 'Connect Custom IVR Example';
      case APP_TYPE_DIALER:
        return 'Connect Dialer Example';
      case APP_TYPE_OUTBOUND_CAMPAIGN:
        return 'Connect Outbound Campaign Example';
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (submitData) => {
    setServerError(undefined);
    const enumeredType = getEnumeredType(appType);
    if (enumeredType === undefined) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE}/api/connect?appId=${enumeredType}`,
        {
          method: 'POST',
          body: JSON.stringify({
            pbxBase: submitData.pbxBase,
            appId: submitData.appId,
            appSecret: submitData.appSecret
          }),
          headers: {
            'Content-type': 'application/json'
          }
        }
      );
      const json = await response.json();
      if (json?.errorCode) {
        setServerError(stringifyError(json));
        return;
      }
      await refetch();
    } catch (err) {
      setServerError('Failed to connect to Application server');
    }
  };

  return (
    <>
      {data?.connected === true ? (
        <Navigate replace to={`/${appType}`} />
      ) : (
        <div className="flex flex-col gap-3 items-center">
          <div className="max-w-lg w-3/4">
            {serverError && <ErrorPortal message={serverError} />}
            <h1 className="font-bold text-lg mb-5">{renderFormTitle()}</h1>
            <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="pbxBase">PBX Base URL</label>
              <input
                className="w-full h-[36px] rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
                placeholder="https://pbx.3cx.com"
                id="pbxBase"
                {...register('pbxBase', { required: 'Required' })}
              />
              {errors.pbxBase && <p className="text-red-500 text-sm">{errors.pbxBase.message}</p>}
              <label htmlFor="appId" className="mt-2">
                APP ID
              </label>
              <input
                className="w-full h-[36px] rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
                id="appId"
                placeholder="APP2JAdaOIWKdasG23KAL"
                {...register('appId', { required: 'Required' })}
              />
              <p id="helper-text-explanation" className="text-sm text-gray-500 dark:text-gray-400">
                Client ID of Service Principal
              </p>
              {errors.appId && <p className="text-red-500 text-sm">{errors.appId.message}</p>}
              <label htmlFor="appSecret" className="mt-2">
                APP Secret
              </label>
              <input
                className="w-full h-[36px] mb-2 rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
                placeholder="APPSEC3123klJKSADjasdk"
                id="appSecret"
                {...register('appSecret', { required: 'Required' })}></input>
              <div className="flex flex-col mb-4">
                <span
                  id="helper-text-explanation"
                  className="text-sm text-gray-500 dark:text-gray-400">
                  API Key you received after configuring Service Principal
                </span>
                {errors.appSecret && (
                  <span className="text-red-500 text-sm">{errors.appSecret.message}</span>
                )}
              </div>
              <ButtonForms
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                label="Connect"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
