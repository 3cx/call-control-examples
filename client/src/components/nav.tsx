import { APP_TYPE_CUSTOM_IVR, APP_TYPE_DIALER, APP_TYPE_OUTBOUND_CAMPAIGN } from '../constants';
import NavItem from './common/nav-item';

export default function Nav() {
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
          <NavItem
            appType={APP_TYPE_CUSTOM_IVR}
            label="Custom IVR"
            description="RoutePoint which works like IVR"
          >
            <svg
              fill="#0988b3"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M128 0C110.3 0 96 14.3 96 32V384c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H128zM64 32C28.7 32 0 60.7 0 96V448c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H256V384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V32zm256 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V128zm32 192a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm160-32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM480 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z" />
            </svg>
          </NavItem>
          <NavItem
            appType={APP_TYPE_OUTBOUND_CAMPAIGN}
            label="Outbound Campaign"
            description="Automated dialing of the participant list"
          >
            <svg
              fill="#0988b3"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M295 183l135-135H384c-13.3 0-24-10.7-24-24s10.7-24 24-24H488c13.3 0 24 10.7 24 24V128c0 13.3-10.7 24-24 24s-24-10.7-24-24V81.9L329 217c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
            </svg>
          </NavItem>
          <NavItem appType={APP_TYPE_DIALER} label="Dialer" description="Simple Dialing console">
            <svg
              className="w-6 h-6"
              fill="#0988b3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M0 64C0 28.7 28.7 0 64 0H256c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm64 96v64c0 17.7 14.3 32 32 32H224c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H96c-17.7 0-32 14.3-32 32zM80 352a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm56-56a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm56-56a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm24 56a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM128 48c-8.8 0-16 7.2-16 16s7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H128z" />
            </svg>
          </NavItem>
        </tbody>
      </table>
    </div>
  );
}
