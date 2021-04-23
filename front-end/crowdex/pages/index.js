import Head from "next/head";
import { useState } from "react";
import Header from '../components/header'
import Banner from '../components/banner'
import CardList from '../components/cardList'
import Modal from '../components/modal'
import dbConnect from '../utils/dbConnect'
import Listing from '../models/Listing'

export default function Home(props) {
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({})

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
    <div className='mb-48'>
      <Header />
      <Banner />
      {showModal && <Modal data={modalData} closeModal={() => setShowModal(false)}/>}
      <CardList title={'Trending Projects'} cardData={props.cardData} showSelectedProject={showSelectedProject} />
      <CardList title={'Past Projects'} cardData={props.cardData} showSelectedProject={showSelectedProject} />
    </div>
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
