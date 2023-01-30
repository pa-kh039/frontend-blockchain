/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ethers } from 'ethers';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  shouldDisplayReconnectButton,
  ConnectSmartContract,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton2,
  Card,
} from '../components';

import { Dropdown } from '../components/Dropdown';

// import { getAbi } from './function';
// import { all } from 'axios';
// import { defaultSnapOrigin } from '../config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

// const Heading = styled.h1`
//   margin-top: 0;
//   margin-bottom: 2.4rem;
//   text-align: center;
// `;

// const Span = styled.span`
//   color: ${(props) => props.theme.colors.primary.default};
// `;

// const Subtitle = styled.p`
//   font-size: ${({ theme }) => theme.fontSizes.large};
//   font-weight: 500;
//   margin-top: 0;
//   margin-bottom: 0;
//   ${({ theme }) => theme.mediaQueries.small} {
//     font-size: ${({ theme }) => theme.fontSizes.text};
//   }
// `;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

// const Notice = styled.div`
//   background-color: ${({ theme }) => theme.colors.background.alternative};
//   border: 1px solid ${({ theme }) => theme.colors.border.default};
//   color: ${({ theme }) => theme.colors.text.alternative};
//   border-radius: ${({ theme }) => theme.radii.default};
//   padding: 2.4rem;
//   margin-top: 2.4rem;
//   max-width: 60rem;
//   width: 100%;

//   & > * {
//     margin: 0;
//   }
//   ${({ theme }) => theme.mediaQueries.small} {
//     margin-top: 1.2rem;
//     padding: 1.6rem;
//   }
// `;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;
const Description = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 12.5px 10px;
  border-radius: 10px;
  border: 2px solid #b3b3b9;
  font-family: 'Nunito Sans';
  outline: none;
`;

const CardWrapper = styled.div<{ fullWidth?: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

// enum TransactionConstants {
//   // The address of an arbitrary contract that will reject any transactions it receives
//   Address = '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5',
//   // Some example encoded contract transaction data
//   UpdateWithdrawalAccount = '0x83ade3dc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
//   UpdateMigrationMode = '0x2e26065e0000000000000000000000000000000000000000000000000000000000000000',
//   UpdateCap = '0x85b2c14a00000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000000000000000000000000000000de0b6b3a7640000',
// }

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [newVar, setNewVar] = useState({});
  const [myInput, setMyInput] = useState('');
  const [functionNames, setFunctionNames] = useState({});

  console.log(functionNames);
  // ----------------------------------------
  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const myfunc = async (e: any) => {
    e.preventDefault();
    const apiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
    const url = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${myInput}&tag=latest&apikey=${apiKey}`;
    const res = await axios.get(url);
    const abi = JSON.parse(res.data.result);
    const contract = new ethers.Contract(myInput, abi);

    //  this is the way to find all the keys in a smart contract
    const iface = new ethers.utils.Interface(abi);
    // console.log("this is the iface11", Object.keys(iface.functions));
    const functions = Object.keys(iface.functions);
    let abc = {};
    console.log('functions', functions);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < functions.length; i++) {
      const function1 = functions[i];
      const function1Name = function1.split('(')[0];
      abc = { ...abc, [function1Name]: function1 };
    }
    setFunctionNames(abc);
    // [getNFTPrice: ]

    setNewVar(contract.functions);
  };

  const myfunc2 = async (Name1: any, Input: any) => {
    const ifaceFunctionNameKey: any = functionNames[Name1];
    console.log(
      'this is the value of the key and input for the myfunc2 function:- ',
      Name1,
      Input,
      ifaceFunctionNameKey,
    );
    // console.log(ifaceFunctionNameKey);
    // const apiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
    // const url = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${myInput}&tag=latest&apikey=${apiKey}`;
    // const res = await axios.get(url);
    // const abi = JSON.parse(res.data.result);
    // const iface1 = new ethers.utils.Interface(abi);
    // console.log(
    //   'this is the stateMutability:- ',
    //   iface1.functions[ifaceFunctionNameKey].stateMutability,
    // );
    // const { stateMutability } = iface1.functions[ifaceFunctionNameKey];

    try {
      await ConnectSmartContract(myInput, Name1, Input, ifaceFunctionNameKey);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    // const ifaceFunctionNameKey = functionNames[Name1];
    // console.log(ifaceFunctionNameKey);
    // const apiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
    // const url = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${myInput}&tag=latest&apikey=${apiKey}`;
    // const res = await axios.get(url);
    // console.log('this is the response to the api:- ', res, res.data.result);
    // const abi = JSON.parse(res.data.result);
    // const iface1 = new ethers.utils.Interface(abi);
    // console.log('iface1:- ', iface1);
    // console.log('iface1 function name:-', Object.keys(iface1.functions));
    // console.log(
    //   'this is the stateMutability:- ',
    //   iface1.functions[ifaceFunctionNameKey].stateMutability,
    // );
    // const {stateMutability} = iface1.functions[ifaceFunctionNameKey];

    // const ApiKey = 'sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN';
    // const provider = new ethers.providers.AlchemyProvider('maticmum', ApiKey);
    // const contract = new ethers.Contract(myInput, abi, provider);

    // console.log('contrat abject', contract);
    // const ans = await contract[Name1](Input[0]);

    // //  console.log("tis is the state mutability",contract.functions,"now                                 ", contract.functions.GetCurrentToken.constant);
    // //  await ans.wait()
    // console.log('this is the ans:-', ans);
    // return ans;
  };

  const handleSendHelloClick2 = () => {
    console.log();
  };

  return (
    <Container>
      {/* <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle> */}
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        {/* <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice> */}
        {/* <CardModified
          content={{
            title: 'Smart contract address',
            description:
              'Fetch all read and write functions of a smart contract from its address.',
            button: (
              <SendHelloButton1
                onClick={myfunc}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          onClick={myfunc}
        /> */}
        <CardWrapper
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          disabled={!state.installedSnap}
        >
          <Title>Smart contract address</Title>
          <Description>
            Fetch all read and write functions of a smart contract from its
            address.
          </Description>
          <Input
            placeholder="Enter Address"
            style={{ marginTop: '2%', marginBottom: '2%' }}
            type="text"
            value={myInput}
            onChange={(e) => {
              if (e.target.value !== '') {
                // getAbi(e.target.value)
                setMyInput(e.target.value);
              }
            }}
          />
          <button type="submit" onClick={myfunc}>
            Fetch Contract Details
          </button>
          {/* {button} */}
        </CardWrapper>
        <Dropdown
          content={{
            title: 'All functions of the given smart contract',
            description: 'Select functions from the given dropdown',
            button: (
              <SendHelloButton2
                onClick={handleSendHelloClick2}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          functionNames={functionNames}
          myfunc2={myfunc2}
        />
        {/* <form>
          <input
            id="addr1"
            onChange={(e) => {
              if (e.target.value !== '') {
                // getAbi(e.target.value)
                setMyInput(e.target.value);
              }
            }}
            type="text"
          />
          <button type="submit" onClick={myfunc}>
            Submit
          </button>
        </form> */}
      </CardContainer>
    </Container>
  );
};

export default Index;
