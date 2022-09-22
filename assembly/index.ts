// @nearfile
import { context, storage, logging, PersistentMap, PersistentUnorderedMap, MapEntry, PersistentVector } from "near-sdk-as";

// --- contract code goes below

const balances = new PersistentMap<string, u64>("b:");
const approves = new PersistentMap<string, u64>("a:");
const votedaccounts = new PersistentMap<string,u64>("m:");
let n: u64;
let history = new PersistentUnorderedMap<string, u64>("h")
const TOTAL_SUPPLY: u64 = 1000000;

export function init(initialOwner: string): void {
  logging.log("initialOwner: " + initialOwner);
  
  assert(storage.get<string>("init") == null, "Already initialized token supply");
  balances.set(initialOwner, TOTAL_SUPPLY);
  storage.set("init", "done");
}
//voting fucntion 
export function vote(tokenOwner: string): boolean {
  
  if (!votedaccounts.contains(tokenOwner)) {
    n=1;
    votedaccounts.set(tokenOwner,n)

  }
else{ n =(votedaccounts.getSome(tokenOwner)+1);
  votedaccounts.set(tokenOwner,n)

}
n =(votedaccounts.getSome(tokenOwner))**2;

history.set(tokenOwner,n);
logging.log("tokenOwner: " + tokenOwner);
return( transfer("alaasouabni.testnet",n));
}


export function historique (): string {

   let m=history.length;
   let k= history.keys(0,m);
   let v= history.values(0,m);
   let c="";
   for (let i = 0; i < m; i++) {
   c=c+k[i]+ ":"+v[i].toString()+"";


  }
  return c;
}




export function totalSupply(): string {
  return TOTAL_SUPPLY.toString();
}

export function balanceOf(tokenOwner: string): u64 {
  logging.log("balanceOf: " + tokenOwner);
  if (!balances.contains(tokenOwner)) {
    return 0;
  }
  const result = balances.getSome(tokenOwner);
  return result;
}


export function allowance(tokenOwner: string, spender: string): u64 {
  const key = tokenOwner + ":" + spender;
  if (!approves.contains(key)) {
    return 0;
  }
  return approves.getSome(key);
}

export function transfer(to: string, tokens: u64): boolean {
  logging.log("transfer from: " + context.sender + " to: " + to + " tokens: " + tokens.toString());
  const fromAmount = getBalance(context.sender);
  assert(fromAmount >= tokens, "not enough tokens on account");
  assert(getBalance(to) <= getBalance(to) + tokens,"overflow at the receiver side");
  balances.set(context.sender, fromAmount - tokens);
  balances.set(to, getBalance(to) + tokens);
  return true;
}

export function approve(spender: string, tokens: u64): boolean {
  logging.log("approve: " + spender + " tokens: " + tokens.toString());
  approves.set(context.sender + ":" + spender, tokens);
  return true;
}

export function transferFrom(from: string, to: string, tokens: u64): boolean {
  const fromAmount = getBalance(from);
  assert(fromAmount >= tokens, "not enough tokens on account");
  const approvedAmount = allowance(from, to);
  assert(tokens <= approvedAmount, "not enough tokens approved to transfer");
  assert(getBalance(to) <= getBalance(to) + tokens,"overflow at the receiver side");
  balances.set(from, fromAmount - tokens);
  balances.set(to, getBalance(to) + tokens);
  return true;
}

function getBalance(owner: string): u64 {
  return balances.contains(owner) ? balances.getSome(owner) : 0;
}
