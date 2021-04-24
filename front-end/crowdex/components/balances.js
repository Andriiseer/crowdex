import { useRouter } from "next/router";
import axios from "axios";
const getProposals = async () => {
  axios
    .get("https://hub.snapshot.page/api/crowdex.eth/proposals")
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
const BalanceRecord = ({ data }) => {
  const router = useRouter();
  const { token, name, bal, proposals } = data;

  return (
    <div>
      <div className="grid grid-cols-3 my-1">
        <p className="text-left tracking-tight">{token}</p>
        <p className="text-center tracking-tight truncate overflow-ellipsis">
          {name}
        </p>
        <p className="text-right tracking-tight">{bal}</p>
      </div>
      {proposals?.length > 0 && (
        <div
          // onClick={() => router.push(proposals[0])}
          onClick={() => getProposals()}
          style={{ marginLeft: "8rem" }}
          className="cursor-pointer  rounded-full py-1 px-3 bg-green-500 text-white text-xs font-bold mb-2 mt-1"
        >
          {proposals.length} proposal(s) available
        </div>
      )}
    </div>
  );
};

const GrantRecord = ({ data }) => {
  const { name, currency, total, vested, claimed } = data;
  return (
    <div>
      <div className="grid grid-cols-4 my-1">
        <p className="text-left truncate overflow-ellipsis">{name}</p>
        <p className="text-center tracking-tight">{total}</p>
        <p className="text-center tracking-tight">{vested}</p>
        <p className="text-right tracking-tight">{claimed}</p>
      </div>
      {claimed < vested && (
        <div
          style={{ marginLeft: "8rem" }}
          className="cursor-pointer rounded-full py-1 px-3 bg-green-500 text-white text-xs font-bold mb-2 mt-1 text-center"
        >
          Claim {vested - claimed} BUSD
        </div>
      )}
    </div>
  );
};

export default function Balances({ data }) {
  const { investments, grants } = data.balances;

  return (
    <div
      class="origin-top-right z-20 absolute right-0 mt-2 w-80 rounded-md shadow-lg p-4 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      onClick={() => getProposals()}
    >
      {!investments.length && <p>No investments found</p>}
      {investments.length !== 0 && (
        <div className="border-b-2">
          <p className="text-lg tracking-tight font-bold pb-2">Balances</p>
          <div className="grid grid-cols-3">
            <p className="text-sm opacity-50 text-left pb-1">Token</p>
            <p className="text-sm opacity-50 text-center pb-1">Description</p>
            <p className="text-sm opacity-50 text-right pb-1">Balance</p>
          </div>
        </div>
      )}

      {investments.map((bal, index) => (
        <BalanceRecord key={index + "bal-rec"} data={bal} />
      ))}

      {grants.length !== 0 && (
        <div className="border-b-2">
          <p className="text-lg tracking-tight font-bold pt-8 pb-2">Grants</p>
          <div className="grid grid-cols-4">
            <p className="text-sm opacity-50 text-left pb-1">Name</p>
            <p className="text-sm opacity-50 text-center pb-1">Total</p>
            <p className="text-sm opacity-50 text-center pb-1">Vested</p>
            <p className="text-sm opacity-50 text-right pb-1">Claimed</p>
          </div>
        </div>
      )}
      {grants.map((grant, index) => (
        <GrantRecord key={index + "bal-rec"} data={grant} />
      ))}
    </div>
  );
}
