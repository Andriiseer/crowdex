import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "../components/header";
import Drop from "../components/drop";
import { requestAccount, fetchGreeting } from "../utils/crowdex-utils";

export default function Home() {
  const [greetingData, setGreetingData] = useState({
    data: "",
    icoPrice: "",
    cDAIBalance: "",
  });

  useEffect(() => {
    requestAccount();
  }, []);

  const getGreetingData = async () => {
    const data = await fetchGreeting();
    console.log(data);
    setGreetingData(data);
  };

  return (
    <>
      <Header />

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
      <Drop></Drop>
    </>
  );
}
