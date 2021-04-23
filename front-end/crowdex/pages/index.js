import Head from "next/head";
import { useState } from "react";
import Header from '../components/header'
import Banner from '../components/banner'
import CardList from '../components/cardList'
import Modal from '../components/modal'
import { fetchGreeting } from '../utils/crowdex-utils'
import dbConnect from '../utils/dbConnect'
import Listing from '../models/Listing'

export default function Home(props) {
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({})
  const [greetingData, setGreetingData] = useState({
    data: '', 
    icoPrice: '', 
    cDAIBalance: ''
  })

  const getGreetingData = async() => {
    const data = await fetchGreeting()
    console.log(data)
    setGreetingData(data)
  }

  const showSelectedProject = (project) => {
    setModalData(project)
    setShowModal(true)
  }

  return (
    <>
      <Header />
      <Banner />
      {showModal && <Modal data={modalData} closeModal={() => setShowModal(false)}/>}
      <CardList title={'Trending Projects'} cardData={props.cardData} showSelectedProject={showSelectedProject} />
      <CardList title={'Past Projects'} cardData={props.cardData} showSelectedProject={showSelectedProject} />

      <div className={'max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'}>
        <button
          class="bg-gray-800 m-2 p-4 rounded-full text-white"
          onClick={getGreetingData}
        >
          <span>Fetch Greeting</span>
        </button>
        <div>
          ICO Price: {greetingData.icoPrice}
        </div>
        <div>
          cDAI Balance: {greetingData.cDAIBalance}
        </div>
        <div>
          Data: {greetingData.data}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await dbConnect()

  const listings = (await Listing.find({ status: 'active' })).map(listing => 
    {
      let l = listing.toObject()
      delete l['_id']
      return l
    }
  )
  
  console.log(listings)

  return {
    props: { cardData: listings }, // will be passed to the page component as props
  }
}
