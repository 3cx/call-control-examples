import { useNavigate } from 'react-router-dom';
import { ConnectFormProps } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { getStatusFunc } from '../../shared';

interface NavItemProps {
  appType: ConnectFormProps['appType'];
  label: string;
  description: string;
  children: React.ReactNode;
}

export default function NavItem({ appType, label, description, children }: NavItemProps) {
  const { data } = useQuery({
    queryFn: getStatusFunc(appType),
    queryKey: ['status', appType]
  });
  const navigate = useNavigate();
  const handleRowClick = () => {
    navigate(`/${appType}`);
  };
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
    <tr
      className="border-b border-dashed last:border-b-0 cursor-pointer"
      onClick={() => handleRowClick()}
    >
      <td className="p-3 pl-0 text-start min-w-[175px]">
        <div className="flex items-center">
          <div className="relative inline-block shrink-0 rounded-2xl me-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
              {children}
            </div>
          </div>
          <div className="flex flex-col justify-start">
            <span className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-secondary-inverse hover:text-primary">
              {' '}
              {label}{' '}
            </span>
          </div>
        </div>
      </td>
      <td className="p-3 pl-0 text-start font-semibold">{renderStatus(data?.connected)}</td>
      <td className="p-3 pl-0 text-start font-semibold">{description}</td>
    </tr>
  );
}
