import { useState, useEffect } from 'react';
import Router from 'next/router';
import dbConnect from '../../utils/dbConnect'
import CardList from '../../components/cardList'
import Modal from '../../components/adminModal'
import Listing from '../../models/Listing'

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
  const { profile, listings } = props;

  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({})

  const showSelectedProject = (project) => {
    setModalData(project)
    setShowModal(true)
  }

  useEffect(() => {
    !profile && Router?.push('/')
  }, [])

  return (
    <>
      {!profile ? null : (
      <>
        <Header />
        <div className="max-w-7xl mx-auto">
          <main>
            {showModal && <Modal data={modalData} closeModal={() => setShowModal(false)}/>}
            <CardList title={'All Projects'} cardData={listings} showSelectedProject={showSelectedProject} />
          </main>
        </div>
      </>
    )}
  </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  await dbConnect()
  const { token } = getAppCookies(req);
  const profile = token ? verifyToken(token.split(' ')[1]) : '';

  const listings = (await Listing.find()).map(listing => 
    {
      let l = listing.toObject()
      l._id = l._id.toString()
      return l
    }
  )
  
  return {
    props: {
      profile,
      listings
    },
  };
}