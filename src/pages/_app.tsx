import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { ScheduleProvider } from '../contexts/ScheduleContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ScheduleProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ScheduleProvider>
  );
}

export default MyApp;