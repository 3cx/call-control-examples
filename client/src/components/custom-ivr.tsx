import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import OutboundCampaign from './outbound-campaign';
import Instructions from './instructions';
import AppStatus from './app-status';
import { getStatusFunc, stringifyError } from '../shared';
import { useEffect, useState } from 'react';
import { APP_TYPE_CUSTOM_IVR } from '../constants';
import { Error, ButtonForms } from 'cc-component-lib';

type Inputs = {
  wavSource: string;
  keyCommands: string[];
  aiModeOn: boolean;
  aiStreamMode: number;
};

export default function CustomIvr() {
  const { data, refetch } = useQuery({
    queryFn: getStatusFunc(APP_TYPE_CUSTOM_IVR),
    queryKey: ['status', APP_TYPE_CUSTOM_IVR],
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Inputs>({ defaultValues: { aiStreamMode: 1 } });

  const { aiModeOn } = watch();
  useEffect(() => {
    if (data?.aiModeOn) {
      setValue('aiModeOn', data.aiModeOn);
    }
    if (data?.aiStreamMode !== undefined) {
      setValue('aiStreamMode', data.aiStreamMode);
    }
    if (data?.keymap) {
      setValue('keyCommands', data.keymap);
    }
  }, [data, setValue]);

  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit: SubmitHandler<Inputs> = async (submitData) => {
    setServerError(undefined);
    const formData = new FormData();
    if (!submitData.aiModeOn) {
      formData.append('wavSource', submitData.wavSource[0]);
      formData.append('keyCommands', JSON.stringify(submitData.keyCommands));
    } else {
      formData.append('aiStreamMode', JSON.stringify(submitData.aiStreamMode));
    }
    formData.append('aiModeOn', JSON.stringify(submitData.aiModeOn));

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE}/api/setup/ivr`, {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      if (json?.errorCode) {
        setServerError(stringifyError(json));
        return;
      }
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  function renderFunction() {
    const content = [];
    for (let i = 0; i <= 9; i++) {
      content.push(
        <div key={i} className="flex flex-row gap-2">
          <label className="flex items-center" htmlFor={`dtmf${i}`}>
            {i}:{' '}
          </label>
          <input
            disabled={aiModeOn}
            className="h-[36px] rounded p-1 text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            id={`dtmf${i}`}
            {...register(`keyCommands.${i}` as 'keyCommands')}
          />
        </div>,
      );
    }
    return content;
  }
  return (
    <section className="flex flex-row gap-10">
      <div className="bg-white rounded px-8 mb-4 flex flex-col w-3/5">
        {serverError && <Error message={serverError} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inline-flex items-center mb-2">
            <label className="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                id="check"
                {...register('aiModeOn')}
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            <span className="ml-2">Enable AI Mode</span>
          </div>
          <div className="mb-4">
            <label htmlFor="opts" className="flex items-center cursor-pointer gap-2">
              AI Type:
              <select
                id="opts"
                disabled={!aiModeOn}
                defaultValue={1}
                {...register('aiStreamMode')}
                className="bg-gray-50 w-[150px] h-[30px] borderdisabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value={1}>AI Chat</option>
                <option value={0}>Echo</option>
              </select>
            </label>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3">
              <div className="flex flex-col">
                <label htmlFor="csvFile">Prompt File</label>
                <input
                  type="file"
                  id="datasource"
                  accept=".wav"
                  aria-describedby="file-helper"
                  disabled={aiModeOn}
                  className="w-full text-gray-500 font-medium text-sm bg-gray-100 shadow appearance-none file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  {...register('wavSource')}
                />
                <p
                  id="helper-text-explanation"
                  className="text-sm mt-1 text-gray-500 dark:text-gray-400"
                >
                  Select .wav file of IVR prompt
                </p>
                {errors.wavSource && (
                  <p className="text-red-500 text-sm">{errors.wavSource.message}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label>DTMF Redirection Inputs</label>
          </div>
          <div className="-mx-3 md:flex mb-2 py-5 flex-wrap gap-2 w-full">{renderFunction()}</div>
          <ButtonForms
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            label="Load Config"
          />
        </form>
        {data?.wavSource && <OutboundCampaign appType={APP_TYPE_CUSTOM_IVR} />}
      </div>
      <div className="flex gap-10 flex-col w-2/5">
        <Instructions appType="ivr">
          <p>
            This application implements IVR functionality. After you have connected your APP, you
            can specify configuration for your IVR. Prompt file will be streamed to each participant
            handled by IVR connection, you also may specify DTMF string routes for redirection
            purposes. Moreover, you are able to perform outgoing calls from Custom IVR. You may
            specify comma-separated phone numbers and run dialing campaign.
          </p>
          <p className="pt-2">
            <span className="font-bold">AI Mode:</span> this option enable showcase with AI google
            speech API + vertex AI Api. To make it work please make sure that you have .json with
            Google Service Account credentials in your server root folder, that inludes
            speech-to-text, text-to-speech, vertex-ai permissions.
          </p>
        </Instructions>
        <AppStatus appType={APP_TYPE_CUSTOM_IVR} />
      </div>
    </section>
  );
}
