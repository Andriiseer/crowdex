import { useState, useEffect, useRef } from 'react'
import Balances from './balances'
import { requestAccount } from '../utils/crowdex-utils'
import axios from 'axios'

export default function UserAccount () {
  const [showBalances, setshowBalances] = useState(false)
  const [account, setAccount] = useState('Wallet')
  const [balancesData, setBalancesData] = useState({investments: [], grants: []})
  const balancesModal = useRef(null);

  const getAccount = async () => {
    let account = await requestAccount()
    if (account?.[0]) {
      setAccount(account?.[0])
      localStorage.setItem('account', account?.[0])
      await axios.post('/api/wallet', { wallet: account?.[0]})
      const balances = await axios.post('/api/get-balances', { wallet: account?.[0]})
      setBalancesData(balances.data)
    } 
  }

  useEffect(() => {
    getAccount()

    if (!showBalances) return;
    function handleClick(event) {
      if (balancesModal.current && !balancesModal.current.contains(event.target)) {
        setshowBalances(false);
      }
    }
    window.addEventListener("click", handleClick);
   
    return () => window.removeEventListener("click", handleClick);
  }, [showBalances])



  return (
    <div class="ml-3 relative">
      <div>
        <button
          onClick={() => setshowBalances(!showBalances)}
          type="button"
          class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span class="sr-only">Open user menu</span>
          <p className='text-white text-xs w-16 truncate px-2 py-2'>{account}</p>
        </button>
      </div>
      {showBalances && 
        <div ref={balancesModal} >
          <Balances data={balancesData}/>
        </div>
      }
    </div>
  )
}