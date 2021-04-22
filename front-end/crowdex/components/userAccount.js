import { useState, useEffect } from 'react'
import Balances from './balances'
import { requestAccount } from '../utils/crowdex-utils'

export default function UserAccount () {
  const [showBalances, setshowBalances] = useState(false)
  const [account, setAccount] = useState('Connect Wallet')

  const getAccount = async () => {
    let account = await requestAccount()
    setAccount(account[0])
  }

  useEffect(() => {
    getAccount()
  }, [])

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
          <p className='text-white w-24 truncate px-4 py-2'>{account}</p>
        </button>
      </div>
      {showBalances && <Balances />}
    </div>
  )
}