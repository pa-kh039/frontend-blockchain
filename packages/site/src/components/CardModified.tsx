/* eslint-disable prettier/prettier */
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
  };
  
  disabled?: boolean;
  fullWidth?: boolean;
};


const Input = styled.input`
box-sizing: border-box;
width: 100%;
padding: 12.5px 10px;
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

export const CardModified = ({ content, disabled = false, fullWidth}: CardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, description, button } = content;
  const [address,setaddress] =useState('');
 
  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && (
        //  eslint-disable-next-line
        <Title>{title}</Title>
      )}      
      <Description>{description}</Description>
      <Input placeholder='Enter Address'  style={{marginTop:'2%',marginBottom:'2%'}} type="text" value={address} onChange={(ev)=>{setaddress(ev.target.value)}}/>
      {button}
    </CardWrapper>
  );
};
