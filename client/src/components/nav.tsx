import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getStatusFunc } from "../shared";
import {
  APP_TYPE_CUSTOM_IVR,
  APP_TYPE_DIALER,
  APP_TYPE_OUTBOUND_CAMPAIGN,
} from "../constants";

export default function Nav() {
  const navigate = useNavigate();
  const handleRowClick = (url: string) => {
    navigate(url);
  };
  const ivr = useQuery({
    queryFn: getStatusFunc(APP_TYPE_CUSTOM_IVR),
    queryKey: ["status", APP_TYPE_CUSTOM_IVR],
  });
  const campaign = useQuery({
    queryFn: getStatusFunc(APP_TYPE_OUTBOUND_CAMPAIGN),
    queryKey: ["status", APP_TYPE_OUTBOUND_CAMPAIGN],
  });
  const dialer = useQuery({
    queryFn: getStatusFunc(APP_TYPE_DIALER),
    queryKey: ["status", APP_TYPE_DIALER],
  });

  function renderStatus(connected?: boolean) {
    return (
      <>
        {connected === true ? (
          <span className="relative flex h-4 w-4 ml-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        ) : (
          <span className="relative flex h-4 w-4 ml-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full my-0 align-middle text-dark border-neutral-200">
        <thead className="align-bottom w-full">
          <tr className="font-semibold text-[0.95rem] text-secondary-dark">
            <th className="pb-3 text-start min-w-[175px]">Name</th>
            <th className="pb-3 text-start min-w-[200px]">Status</th>
            <th className="pb-3 text-start min-w-[80px]">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            className="border-b border-dashed last:border-b-0 cursor-pointer"
            onClick={() => handleRowClick("/ivr")}
          >
            <td className="p-3 pl-0 text-start min-w-[175px]">
              <div className="flex items-center">
                <div className="relative inline-block shrink-0 rounded-2xl me-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                    <svg
                      fill="#0988b3"
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path d="M128 0C110.3 0 96 14.3 96 32V384c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H128zM64 32C28.7 32 0 60.7 0 96V448c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H256V384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V32zm256 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V128zm32 192a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm160-32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM480 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-start">
                  <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-secondary-inverse hover:text-primary">
                    {" "}
                    Custom IVR{" "}
                  </span>
                </div>
              </div>
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              {renderStatus(ivr.data?.connected)}
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              Route Point which works like IVR
            </td>
          </tr>
          <tr
            className="border-b border-dashed last:border-b-0 cursor-pointer"
            onClick={() => handleRowClick("/campaign")}
          >
            <td className="p-3 pl-0 text-start min-w-[175px]">
              <div className="flex items-center">
                <div className="relative inline-block shrink-0 rounded-2xl me-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                    <svg
                      fill="#0988b3"
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M295 183l135-135H384c-13.3 0-24-10.7-24-24s10.7-24 24-24H488c13.3 0 24 10.7 24 24V128c0 13.3-10.7 24-24 24s-24-10.7-24-24V81.9L329 217c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-start">
                  <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-secondary-inverse hover:text-primary">
                    Outbound Campaign
                  </span>
                </div>
              </div>
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              {renderStatus(campaign.data?.connected)}
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              Automated dialing of the participant list
            </td>
          </tr>
          <tr
            className="border-b border-dashed last:border-b-0 cursor-pointer"
            onClick={() => handleRowClick("/dialer")}
          >
            <td className="p-3 pl-0 text-start min-w-[175px]">
              <div className="flex items-center">
                <div className="relative inline-block shrink-0 rounded-2xl me-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                    <svg
                      className="w-6 h-6"
                      fill="#0988b3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 28.7 28.7 0 64 0H256c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm64 96v64c0 17.7 14.3 32 32 32H224c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H96c-17.7 0-32 14.3-32 32zM80 352a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm56-56a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm56-56a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM128 48c-8.8 0-16 7.2-16 16s7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H128z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-start">
                  <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-secondary-inverse hover:text-primary">
                    Dialer
                  </span>
                </div>
              </div>
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              {renderStatus(dialer.data?.connected)}
            </td>
            <td className="p-3 pl-0 text-start font-semibold">
              Simple Dialing console
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}