import moment from 'moment'

export default function Card (props) {
  const { showSelectedProject } = props
  const { name, authorName, filled, goal, funded, end, currency, gallery } = props.data

  return (
    <div onClick={showSelectedProject} className='max-w-full sm:w-96 w-full rounded-2xl h-60 shadow-xl truncate mx-auto cursor-pointer'>
      <div className='max-w-full h-28 rounded-t-2xl truncate relative'>
        <img 
          className='filter grayscale-20 brightness-75'
          src={gallery[0]}
          style={{ position: 'absolute', objectFit: 'cover'}}
        />
        <div>
          <p className='relative text-3xl tracking-tight pt-6 pl-6 overflow-ellipsis truncate text-white'>{name}</p>
        </div>
        <div className='flex justify-between relative'>
          <p className='sm:text-md text-xs pl-6 pt-4 opacity-70 overflow-ellipsis text-white'>by {authorName}</p>
          <p className='sm:text-md text-xs pr-6 pt-4 text-white'>{filled}% filled</p>
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
          <p class='text-lg pt-6 opacity-50'>Ends</p>
          <p class='text-sm sm:text-md pt-7 text-green-500'>{moment(end).fromNow()}</p>
        </div>
      </div>
    </div>
  )
}