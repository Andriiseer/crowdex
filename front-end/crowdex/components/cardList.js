import Card from './card'

export default function CardList (props) {
  const { showSelectedProject, cardData } = props
  return (
    <div className='mt-16'>
      <p className='text-center text-4xl tracking-tight font-bold'>{props.title}</p>
      <div className='mt-16 px-4 max-w-7xl mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 gap-y-8'>
        {
          cardData.map((data, index) => <Card key={'nft-card-'+index+props.title} data={data} showSelectedProject={() => showSelectedProject(data)} />)
        }
      </div>
    </div>
  )
}