import moment from 'moment'

export default function Card (props) {
  const { name, authorName, filled, goal, funded, end, currency } = props.data
  return (
    <div className='max-w-full sm:w-96 w-full rounded-2xl h-60 shadow-2xl truncate mx-auto'>
      <div className='bg-indigo-300 max-w-full h-28 rounded-t-2xl truncate'>
        <p className='text-2xl font-light pt-6 pl-6 overflow-ellipsis truncate'>{name}</p>
        <div className='flex justify-between'>
          <p className='sm:text-md text-xs pl-6 pt-4 opacity-50 overflow-ellipsis'>by {authorName}</p>
          <p className='sm:text-md text-xs pr-6 pt-4 opacity-80'>{filled}% filled</p>
        </div>
      </div>
      <div className='grid grid-cols-3'>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-6 opacity-50'>Goal</p>
          <p class='text-md sm:text-lg pt-6 text-green-500'>{goal} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-6 opacity-50'>Funded</p>
          <p class='text-md sm:text-lg pt-6 text-green-500'>{funded} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-7 opacity-50'>Ends</p>
          <p class='text-sm sm:text-md pt-6 text-green-500'>{moment(end).fromNow()}</p>
        </div>
      </div>
    </div>
  )
}