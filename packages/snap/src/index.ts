/* eslint-disable dot-notation */
/*eslint-disable no-case-declarations, prefer-destructuring*/
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
      const functionInputs = params['0']['functionInputs'];
      const apiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
      console.log(
        'This is the smart contract address, functionName, functionInputs:- ,',
        params,
        contractAddress,
        functionName,
        functionInputs,
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
      // const abi = JSON.parse(res.data.result);

      const abi = JSON.parse(response.result);
      const iface1 = new ethers.utils.Interface(abi);
      console.log('iface1:- ', iface1);
      console.log('iface1 function name:-', Object.keys(iface1.functions));
      // console.log(
      //   'this is the stateMutability:- ',
      //   iface1.functions[ifaceFunctionNameKey].stateMutability,
      // );
      // const {stateMutability} = iface1.functions[ifaceFunctionNameKey];

      const ApiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
      const provider = new ethers.providers.AlchemyProvider('maticmum', ApiKey);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      console.log('contract abject', contract);
      const ans = await contract.callStatic[functionName](functionInputs);

      //  console.log("tis is the state mutability",contract.functions,"now                                 ", contract.functions.GetCurrentToken.constant);
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
