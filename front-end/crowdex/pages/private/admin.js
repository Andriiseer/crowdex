import { useState, useEffect } from 'react';
import Router from 'next/router';

/* middleware */
import {
  getAppCookies,
  verifyToken,
} from '../../middleware/utils';

/* components */
import Header from "../../components/header";
import Drop from "../../components/drop";
import { fetchGreeting } from "../../utils/crowdex-utils";

export default function About(props) {
  const { profile } = props;

  const [greetingData, setGreetingData] = useState({
    data: "",
    icoPrice: "",
    cDAIBalance: "",
  });

  useEffect(() => {
    !profile && Router?.push('/')
  }, [])

  const getGreetingData = async () => {
    const data = await fetchGreeting();
    console.log(data);
    setGreetingData(data);
  };

  return (
    <>
      {!profile ? null : (
      <>
        <Header />
        <div className="container">
          <main>
            <h1 className="title">Admin Page</h1>
            <div className={"max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"}>
              <button
                class="bg-gray-800 m-2 p-4 rounded-full text-white"
                onClick={getGreetingData}
              >
                <span>Fetch Greeting</span>
              </button>
              <div>ICO Price: {greetingData.icoPrice}</div>
              <div>cDAI Balance: {greetingData.cDAIBalance}</div>
              <div>Data: {greetingData.data}</div>
            </div>
            <Drop /> 
          </main>
        </div>
      </>
    )}
  </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  const { token } = getAppCookies(req);
  const profile = token ? verifyToken(token.split(' ')[1]) : '';

  return {
    props: {
      profile,
    },
  };
}