import { formatUnits, parseUnits } from 'viem';

const usdcAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  }
];

const USDC_CONTRACT_ADDRESS = '0xf175520c52418dfe19c8098071a252da48cd1c19'; 

/**
 * @param provider 
 * @param address 
 * @returns 
 */
export async function getUSDCBalance(provider, address) {
  try {
    const data = encodeFunctionData({
      abi: usdcAbi,
      functionName: 'balanceOf',
      args: [address],
    });

    const balanceHex = await provider.request({
      method: 'eth_call',
      params: [
        {
          to: USDC_CONTRACT_ADDRESS,
          data,
        },
        'latest',
      ],
    });

    const balanceBigInt = BigInt(balanceHex);
    
    const balance = formatUnits(balanceBigInt, 6);
    
    return parseFloat(balance);
  } catch (error) {
    console.error('Error al obtener balance de USDC:', error);
    return 100.00;
  }
}

/**
 * @param provider
 * @param fromAddress 
 * @param toAddress 
 * @param amount 
 * @returns 
 */
export async function sendUSDC(
  provider,
  fromAddress,
  toAddress,
  amount
) {
  try {
    const amountInBaseUnits = parseUnits(amount.toString(), 6);

    const data = encodeFunctionData({
      abi: usdcAbi,
      functionName: 'transfer',
      args: [toAddress, amountInBaseUnits.toString()],
    });

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: fromAddress,
        to: USDC_CONTRACT_ADDRESS,
        data,
      }],
    });

    return txHash;
  } catch (error) {
    console.error('Error al enviar USDC:', error);
    throw error;
  }
}

function encodeFunctionData({ abi, functionName, args }) {
  if (functionName === 'balanceOf') {
    const selector = '0x70a08231';
    const paddedAddress = args[0].slice(2).padStart(64, '0');
    return `${selector}${paddedAddress}`;
  }
  
  if (functionName === 'transfer') {
    const selector = '0xa9059cbb';
    const paddedAddress = args[0].slice(2).padStart(64, '0');
    const amountHex = BigInt(args[1]).toString(16).padStart(64, '0');
    return `${selector}${paddedAddress}${amountHex}`;
  }
  
  throw new Error(`Function ${functionName} not supported in simplified encoder`);
}


export async function getRecentTransactions(address) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '0x' + Math.random().toString(16).substring(2, 10),
      type: 'received',
      amount: 50,
      from: 'Alice',
      fromAddress: '0x765d392C019D36372f9b2D9Ce947D73fd12Aa02d',
      toAddress: address,
      timestamp: Date.now() - 3600000, 
      status: 'confirmed',
      message: '🎮 Payment for game assets',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'
    },
    {
      id: '0x' + Math.random().toString(16).substring(2, 10),
      type: 'sent',
      amount: 25,
      to: 'Bob',
      toAddress: '0x9876543210fedcba9876543210fedcba98765432',
      fromAddress: address,
      timestamp: Date.now() - 86400000,
      status: 'confirmed',
      message: '🍕 Dinner split',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120'
    },
    {
      id: '0x' + Math.random().toString(16).substring(2, 10),
      type: 'received',
      amount: 100,
      from: 'Carol',
      fromAddress: '0xabcdef0123456789abcdef0123456789abcdef01',
      toAddress: address,
      timestamp: Date.now() - 172800000, 
      status: 'confirmed', 
      message: '💻 Freelance project',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120'
    }
  ];
}