import { Link, Outlet } from 'react-router-dom';
import logo from './assets/logo.png';
import ReactQueryProvider from './react-query-provider';
import { ErrorBoundary } from './error-boundary';
function App() {
  return (
    <main className="flex flex-wrap -mx-3 mb-5 h-screen">
      <div className="w-full h-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative h-full flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="p-9 flex justify-between items-stretch flex-wrap min-h-[70px] bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">Call Control API</span>
                <span className="mt-1 font-medium text-secondary-dark text-lg/normal">
                  Application samples
                </span>
                <Link className="text-blue-400 underline text-lg/normal" to="/">
                  Home page
                </Link>
              </h3>
              <div id="error-portal" className="w-1/2 flex items-center justify-center"></div>
              <div>
                <a
                  className="flex flex-row items-center gap-2 text-[.925rem] font-medium leading-normal text-center align-middle cursor-pointer rounded-2xl transition-colors duration-150 ease-in-out text-light-inverse bg-light-dark border-light shadow-none border-0 py-2 px-5 hover:bg-secondary active:bg-light focus:bg-light"
                  href="https://3cx.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  By <img src={logo} alt="3cx Logo" width={100} height={24} />
                </a>{' '}
              </div>
            </div>
            <ErrorBoundary>
              <ReactQueryProvider>
                <div className="flex-auto block py-8 pt-6 px-9" id="detail">
                  <Outlet></Outlet>
                </div>
              </ReactQueryProvider>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
