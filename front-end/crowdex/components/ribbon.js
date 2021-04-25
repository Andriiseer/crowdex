const RibbonLayout = ({children}) => {
  return (
    <>
      {children}
      <style jsx global>{`
        /* common */
        .ribbon {
          width: 150px;
          height: 150px;
          overflow: hidden;
          position: absolute;
          z-index: 1;
        }
        .ribbon::before,
        .ribbon::after {
          position: absolute;
          z-index: -1;
          content: '';
          display: block;
          border: 5px solid #2980b9;
        }
        .ribbon span {
          position: absolute;
          display: block;
          width: 225px;
          padding: 15px 0;
          background-color: #3498db;
          box-shadow: 0 5px 10px rgba(0,0,0,.1);
          color: #fff;
          font: 700 18px/1 'Lato', sans-serif;
          text-shadow: 0 1px 1px rgba(0,0,0,.2);
          text-transform: uppercase;
          text-align: center;
        }

        /* top right*/
        .ribbon-top-right {
          top: -10px;
          right: -10px;
        }
        .ribbon-top-right::before,
        .ribbon-top-right::after {
          border-top-color: transparent;
          border-right-color: transparent;
        }
        .ribbon-top-right::before {
          top: 0;
          left: 0;
        }
        .ribbon-top-right::after {
          bottom: 0;
          right: 0;
        }
        .ribbon-top-right span {
          left: -25px;
          top: 30px;
          transform: rotate(45deg);
        }
      `}</style>
    </>
  ) 
}


export default function Ribbon () {
  return <RibbonLayout><div class="ribbon ribbon-top-right"><span>NFT Ready</span></div></RibbonLayout>
}