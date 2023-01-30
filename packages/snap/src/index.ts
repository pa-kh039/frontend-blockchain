/* eslint-disable dot-notation */
/*eslint-disable no-case-declarations, prefer-destructuring, no-inner-declarations*/
/* eslint-disable import/no-extraneous-dependencies*/
import { OnRpcRequestHandler } from '@metamask/snap-types';
import { ethers } from 'ethers';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  /**
   *
   */
  function logDetails(tx1: {
    blockNumber: any;
    blockHash: any;
    hash: any;
    from: any;
    to: any;
    gasPrice: any;
    nonce: any;
    data: any;
  }) {
    console.log('transaction blockNumber', tx1.blockNumber);
    console.log('transaction blockhash', tx1.blockHash);
    console.log('transaction hash', tx1.hash);
    console.log('transaction from', tx1.from);
    console.log('transaction to', tx1.to);
    console.log('transaction gasPrice', tx1.gasPrice);
    console.log('transaction nonce', tx1.nonce);
    console.log('transaction  data', tx1.data);
  }

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'SmartContract':
      console.log(request);
      const params: any = request.params;
      const contractAddress = params['0']['contractAddress'];
      const functionName = params['0']['functionName'];
      let functionInputs = params['0']['functionInputs'];
      const ifaceFunctionNameKey = params['0']['ifaceFunctionNameKey'];
      const apiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
      console.log(
        'This is the smart contract address, functionName, functionInputs:- ,',
        params,
        contractAddress,
        functionName,
        functionInputs,
        ifaceFunctionNameKey,
      );
      const url = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
      const res = await fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await res.json();
      console.log('this is the response to the api:- ', response);
      const abi = JSON.parse(response.result);
      const iface1 = new ethers.utils.Interface(abi);
      console.log('iface1:- ', iface1);
      // console.log('iface1 function name:-', Object.keys(iface1.functions));
      console.log(
        'this is the stateMutability:- ',
        iface1.functions[ifaceFunctionNameKey].stateMutability,
      );

      const { stateMutability } = iface1.functions[ifaceFunctionNameKey];

      const ApiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
      const provider = new ethers.providers.AlchemyProvider('maticmum', ApiKey);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      console.log('contract abject', contract);
      let ans;
      if (functionInputs.length === 1 && functionInputs[0] === '') {
        functionInputs = '';
      }

      console.log(
        'check for if condition on function inputs',
        functionInputs === '' || functionInputs.length === 0,
      );

      if (stateMutability === 'view' || stateMutability === 'pure') {
        if (functionInputs === '' || functionInputs.length === 0) {
          ans = await contract.callStatic[functionName]();
        } else {
          console.log('this is the destructured inputs:-', ...functionInputs);
          ans = await contract.callStatic[functionName](...functionInputs);
        }
        console.log('this is the ans:-', ans, Object.values(ans));
      } else {
        try {
          const provider1 = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider1.getSigner();
          const CONTRACT = new ethers.Contract(contractAddress, abi, signer);
          console.log(
            'this is a payable function with provider, signer, contract as:- ',
            provider1,
            signer,
            CONTRACT,
          );
        } catch (e) {
          console.log('error1', e);
        }

        try {
          if (stateMutability === 'payable') {
            ans = await CONTRACT.callStatic[functionName](functionInputs, {
              value: ethers.utils.parseEther(`{ETHER}`),
            });
          } else {
            ans = await CONTRACT.callStatic[functionName](functionInputs);
          }
        } catch (e) {
          console.log('error', e);
        }
        logDetails(ans);
      }

      //  await ans.wait()
      console.log('this is the ans:-', ans, Object.values(ans));

      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description: `This is the response from the function:- ${functionName}\n with arguments passed:- ${functionInputs}.\n `,
            textAreaContent: `Response:- ${ans}`,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
