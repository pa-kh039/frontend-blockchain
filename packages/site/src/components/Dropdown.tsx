/* eslint-disable prettier/prettier */
import { ReactNode, useState } from 'react';
// import { Dropdown } from 'rsuite';
import styled from 'styled-components';

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
    
  };
  disabled?: boolean;
  fullWidth?: boolean;
  functionNames:object;
  myfunc2: Function;
};

const Input = styled.input`
box-sizing: border-box;
width: 40%;
padding: 12.5px 10px;
border-radius: 10px;
border: 2px solid #B3B3B9;
font-family: 'Nunito Sans';
outline: none;
`;


const Select = styled.select`
box-sizing: border-box;
width: 100%;
padding: 12.5px 10px;
margin-bottom:2%;
border-radius: 10px;
border: 2px solid #B3B3B9;
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

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Description = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
`;

export const Dropdown = ({ content, disabled = false, fullWidth,functionNames, myfunc2 }: CardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, description, button} = content;
  const [selected , setselect] = useState({});
  const [data , setdata] = useState({});
  const [abhiwala, setabhiwala]=useState("");
//   const allfuntion = ['funa','funb']; 
const allfuntion = {...functionNames}

// console.log("allfunction",allfuntion);
const setFunction = (e)=>{
    const val = e.target.value;
    let newState = {}
    // const tempArr= new Array(((allfuntion[val]).split(",")).length).fill('')
    const parameters=(allfuntion[val]).split("(");
    // f(a,b,c)
    const parameters2 = ((parameters[1]).split(")"))[0]
   
    
      const tempArr=parameters2.split(",");
      newState[val]=tempArr;
    

    
let k=0;

const array = [];
    for (k=0;k<tempArr.length;k++){
        array.push('')
    }
    setdata({[val]:array});
    
    setselect(newState);
    setabhiwala(val);
  }



const setvalue=(abhiwala,index,val)=>{
 
    let newState = {...data}
    console.log(newState,'newatte')
    if (newState[abhiwala]!==[]){
        newState[abhiwala][index] = val
    }
    setdata(newState)
    
}

const handleSendHelloClick2=()=>{
    console.log(selected[abhiwala])
}




  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && (
        //  eslint-disable-next-line
        <Title>{title}</Title>
      )}      
      <Description>{description}</Description>
      <Select
        onChange={(e)=>{setFunction(e)}}>
        <option value='select' selected disabled>select</option>
        {Object.entries(allfuntion).length>0 ? Object.entries(allfuntion).map(([key,value],index)=>{
       
            return <option value={key}>{key}</option>
        })
        :
        ''
        }
      </Select>
      {/* functionname: [a,b,c] */}
      { Object.keys(selected).length>0 && selected[abhiwala].map((val,index)=>{
       return  <Input placeholder={`${val}`}  style={{marginTop:'2%',marginBottom:'2%'}} type={['address','string'].includes(val)?"text":'number'} value={data[abhiwala][index]} onChange={(e)=>{
       setvalue(abhiwala,index,e.target.value)
       }}/>})

      }
      
     {abhiwala!==''&& selected[abhiwala].length && <center><button onClick={(e) => {
                  myfunc2(abhiwala,data[abhiwala]);
                }}>Query</button></center> } 
    </CardWrapper>
  );
};

