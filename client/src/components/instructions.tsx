import { ConnectFormProps } from '../types';

export default function Instructions({
  text,
  children,
}: ConnectFormProps & { text?: string; children?: React.ReactNode }) {
  return (
    <div className="w-full mx-auto bg-slate-900 shadow-lg rounded-lg">
      <div className="px-6 py-5">
        <div className="flex items-start">
          <svg
            className="fill-current flex-shrink-0 mr-5"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <path
              className="text-indigo-300"
              d="m16 14.883 14-7L14.447.106a1 1 0 0 0-.895 0L0 6.883l16 8Z"
            />
            <path
              className="text-indigo-200"
              d="M16 14.619v15l13.447-6.724A.998.998 0 0 0 30 22V7.619l-14 7Z"
            />
            <path
              className="text-indigo-500"
              d="m16 14.619-16-8V21c0 .379.214.725.553.895L16 29.619v-15Z"
            />
          </svg>
          <div className="flex-grow truncate">
            <div className="w-full sm:flex justify-between items-center mb-3">
              <h2 className="text-2xl leading-snug font-extrabold text-gray-50 truncate mb-1 sm:mb-0">
                Instructions
              </h2>
            </div>
            <div className="flex items-end justify-between whitespace-normal">
              <div className="max-w-md text-indigo-100">
                <p className="mb-2">{text}</p>
                <div>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
