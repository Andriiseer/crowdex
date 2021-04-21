import moment from 'moment'

export default function Card (props) {
  const { name, authorName, filled, goal, funded, end, currency } = props.data
  return (
    <div className='w-96 rounded-2xl h-60 shadow-2xl mx-auto max-w-full'>
      <div className='bg-indigo-300 w-96 max-w-full h-28 rounded-t-2xl '>
        <p className='text-3xl font-light pt-6 pl-6'>{name}</p>
        <div className='flex justify-between'>
          <p className='text-l pl-6 pt-4 opacity-50'>by {authorName}</p>
          <p className='text-l pr-6 pt-4 opacity-80 '>{filled}% filled</p>
        </div>
      </div>
      <div className='grid grid-cols-3'>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-l pt-6 opacity-50'>Goal</p>
          <p class='text-xl pt-6 text-green-500'>{goal} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-l pt-6 opacity-50'>Funded</p>
          <p class='text-xl pt-6 text-green-500'>{funded} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-l pt-6 opacity-50'>Ends</p>
          <p class='text-xl pt-5 text-green-500'>{moment(end).fromNow()}</p>
        </div>
      </div>
    </div>
  )
}