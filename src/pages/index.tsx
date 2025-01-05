import Head from 'next/head';
import HomePage from '../components/HomePage';
import { viewConfig } from '@/config/view';

const Home = () => (
    <>
        <Head>
            <title>{viewConfig.title}</title>
            <meta name="description" content={viewConfig.description} />
            <link rel="icon" href={viewConfig.favicon} />
            <link rel="shortcut icon" href={viewConfig.favicon} />
        </Head>
        <HomePage />
    </>
);

export default Home;