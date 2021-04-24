import Head from "next/head";
import { useState } from "react";
import Header from '../components/header'
import Banner from '../components/banner'
import CardList from '../components/cardList'
import Modal from '../components/modal'
import useSWR from 'swr'
import axios from 'axios'

export default function Home(props) {
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({})
  const wallet = typeof window !== 'undefined' ? localStorage.getItem('account') : null
  const { data, error } = useSWR('/api/get-listings', axios.post('/api/get-listings', { wallet }).then(res => res.data))
  const invested = []
  const showSelectedProject = (project) => {
    setModalData(project)
    setShowModal(true)
  }

  const pushInvestments = (source) => {
    source.forEach(record => {
      if (record?.investors?.find(el => el === wallet)) {
        invested.push(record)
      }
    })
  }

  if (data) {
    pushInvestments(data.current)
    pushInvestments(data.past)
  }

  return (
    <div className='mb-48'>
      <Header />
      <Banner />
      {showModal && <Modal data={modalData} closeModal={() => setShowModal(false)}/>}
      { invested.length !== 0 && <CardList title={'Your Investments'} cardData={invested} showSelectedProject={showSelectedProject} /> }
      { data && <CardList title={'Current Funding Projects'} cardData={data.current} showSelectedProject={showSelectedProject} /> }
      { data && <CardList title={'Past Projects'} cardData={data.past} showSelectedProject={showSelectedProject} /> }
    </div>
  );
}
