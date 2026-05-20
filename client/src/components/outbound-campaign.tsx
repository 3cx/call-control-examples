import { SubmitHandler, useForm } from 'react-hook-form';
import AppStatus from './app-status';
import { useState } from 'react';
import { Error, ButtonForms } from 'cc-component-lib';
import Instructions from './instructions';
import { ConnectFormProps } from '../types';
import { APP_TYPE_OUTBOUND_CAMPAIGN } from '../constants';
import { makeCallRequest, stringifyError } from '../shared';

type Inputs = {
  sources: string;
};
export default function OutboundCampaign({ appType }: ConnectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Inputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit: SubmitHandler<Inputs> = async (submitData) => {
    try {
      const response = await makeCallRequest(appType, submitData.sources);
      const json = await response?.json();
      if (json?.errorCode) {
        setServerError(stringifyError(json));
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`bg-white ${
        appType === 'campaign' && 'px-8'
      } pt-6 pb-8 mb-4 flex flex-row gap-10 my-2`}
    >
      <form
        className={`flex flex-col gap3 ${appType === 'campaign' ? 'w-1/2' : 'w-full'}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {serverError && <Error message={serverError} />}
        <label>Call Destinations</label>
        <textarea
          {...register('sources', { required: 'Required' })}
          className="w-full h-[176px] resize-none rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none"
        ></textarea>
        <p
          id="helper-text-explanation"
          className="text-sm mt-1 mb-2 text-gray-500 dark:text-gray-400"
        >
          Please specify destination numbers separated by «,»
        </p>
        {errors.sources && <p className="text-red-500 text-sm">{errors.sources.message}</p>}
        <ButtonForms
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          label="Start Dialing"
        />
      </form>
      {appType === APP_TYPE_OUTBOUND_CAMPAIGN && (
        <div className="flex flex-col gap-5 w-1/2">
          <Instructions
            appType={APP_TYPE_OUTBOUND_CAMPAIGN}
            text="This application represents simple Outbound Campaign, you may specify comma-separated phone numbers and run dialing campaign"
          />
          <AppStatus appType={APP_TYPE_OUTBOUND_CAMPAIGN} />
        </div>
      )}
    </div>
  );
}
