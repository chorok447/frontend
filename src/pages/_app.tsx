import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { ScheduleProvider } from '../contexts/ScheduleContext';
import { DutyProvider } from '../contexts/DutyContext'; // 추가

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ScheduleProvider>
      <DutyProvider> {/* DutyProvider로 감싸기 */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DutyProvider>
    </ScheduleProvider>
  );
}

export default MyApp;