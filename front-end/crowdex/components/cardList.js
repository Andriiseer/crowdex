import Card from './Card'

const cardData = [
  {
    name: 'Awesome Shite',
    authorName: 'zombie_panda3000',
    filled: 54,
    goal: 25, 
    funded: 13, 
    end: '2021-04-25T09:15:00Z',
    currency: 'BUSD'
  },
  {
    name: 'DOGECOIN ON MARZ',
    authorName: 'kotopes',
    filled: 54,
    goal: 25, 
    funded: 13, 
    end: '2021-04-25T09:15:00Z',
    currency: 'BUSD'
  },
  {
    name: 'Another NFT Shit',
    authorName: 'BibsBObs',
    filled: 95,
    goal: 25, 
    funded: 24, 
    end: '2021-04-21T23:15:00Z',
    currency: 'BUSD'
  },
]


export default function CardList (props) {
  return (
    <div className='m-16'>
      <p className='text-center text-4xl tracking-tight font-bold'>{props.title}</p>
      <div className='m-16 max-w-7xl mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3'>
        {
          cardData.map((data, index) => <Card key={'nft-card-'+index+props.title} data={data} />)
        }
      </div>
    </div>
  )
}