const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/swap", (req, res) => {
  res.json({
    iframe: {
      html: `
            <style>
            .naslovcek {
                margin-top: -30px;
            }
            #dugme{
                margin-bottom: 10px;
                background-color: #FF0000;
            }
            </style>
            <h1 class="naslovcek">Swap DAI to USDC keor</h1><p>Swap tokens using Uniswap V2</p><p id="referrerWarning">Referer gets a cut. </p><input placeholder="Enter amount..." type="text" id="input"><p id="expectedOutputAmount"></p><button id="dugme">Swap</button>`,
      js: `
            const fromToken = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
            const fromDecimals = 18
            const toToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            const toDecimals = 6
            const referrer = null
            if(!referrer){
                document.getElementById('referrerWarning').style.display = 'none';
            }
            async function doSwap() {
      const amount = document.getElementById("input").value;
      const expectedOutputAmountP = document.getElementById("expectedOutputAmount");
      if (!amount) {
        expectedOutputAmountP.innerText = "Please enter an amount.";
        return;
      }

      // UniswapV2 Router contract address
      const uniswapV2RouterAddress = "0x83eafF3C19083B03A8E0708F7637D0c4638E9FC9";

      // ABI for UniswapV2 Router swapExactTokensForTokens function
      const swapExactTokensForTokensAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "router",
        "type": "address",
        "internalType": "contract IUniswapV2Router"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapWithReferral",
    "inputs": [
      {
        "name": "referrer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amountOutMin",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "path",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "amounts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ReferralShare",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "referrer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "referee",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];

      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const fromAddress = await signer.getAddress();
        const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, swapExactTokensForTokensAbi, signer);
        const amountInWei = ethers.utils.parseUnits(amount, fromDecimals);
        const path = [fromToken, toToken];
        const deadline = Math.floor(Date.now() / 1000) + 1200;
        const amountOutMin = 0;
        const fromTokenContract = new ethers.Contract(fromToken, [
          "function approve(address spender, uint256 amount) public returns (bool)"
        ], signer);
        const approvalTx = await fromTokenContract.approve(uniswapV2RouterAddress, amountInWei);
        await approvalTx.wait();

        const swapTx = await uniswapV2Router.swapWithReferral(
          referrer || "0x0000000000000000000000000000000000000000",
          amountInWei,
          amountOutMin,
          path,
          "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          deadline
        );
        const receipt = await swapTx.wait();

        expectedOutputAmountP.innerText = \`Transaction Sent! Hash: \${receipt.transactionHash}\`;
      } catch (error) {
        console.error(error);
        expectedOutputAmountP.innerText = \`Error: \${error.message}\`;
      }
    }

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function updateAmount(event) {
    const amount = this.value;
    const expectedOutputAmountP = document.getElementById("expectedOutputAmount");
    if (!amount) {
        expectedOutputAmountP.innerText = "";
        return;
    }

    // UniswapV2 Router contract address
    const uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    // ABI for UniswapV2 Router (only the functions you need)
    const uniswapV2RouterAbi = [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
    ];

    // Tokens
    const fromToken = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI
    const toToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const fromDecimals = 18;
    const toDecimals = 6;

    try {
        // Connect to Ethereum using ethers.js and MetaMask provider
        await ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapV2RouterAbi, signer);

        // Convert amount to wei
        const amountInWei = ethers.utils.parseUnits(amount, fromDecimals);

        // Define the path for the swap
        const path = [fromToken, toToken];

        // Get the expected output amount
        const amountsOut = await uniswapV2Router.getAmountsOut(amountInWei, path);
        const expectedOutputAmount = ethers.utils.formatUnits(amountsOut[1], toDecimals);

        // Update the UI
        expectedOutputAmountP.innerText = "Expected output amount " + expectedOutputAmount + " USDC";
    } catch (error) {
        console.error(error);
        expectedOutputAmountP.innerText = "Error fetching expected output amount";
    }
}

document.getElementById('dugme').addEventListener('click', doSwap);
document.getElementById('input').addEventListener('keyup', debounce(updateAmount, 200));
`,
    },
  });
});

app.get("/blink", (req, res) => {
  res.json({
    iframe: {
      html: `
            <style>
            #naslovce {
                color: #FF0000;
            }
            </style>
            <h1 id="naslovce">Send ether</h1><p>Send 1 ether to the following address:</p><input placeholder="Type the address..." value="0x679a9aa509A85EeA7912D76d85b0b9195972B211" type="text" id="input"><button id="dugme">Send ether</button>`,
      js: `
console.log('Dobar eval')
async function showAlert() {
    const recipient = document.getElementById("input").value;

    console.log(window.ethereum);
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const publicKey = accounts[0];

            // Specify the amount of Ether to send (in Wei)
            const amount = "0x" + (1e18).toString(16)

            // Transaction parameters
            const transactionParameters = {
                to: recipient,
                from: publicKey,
                value: amount,
            };

            console.log(transactionParameters)

            // Send the transaction
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            alert(\`Transaction Sent! Hash: \${txHash}\`);

            // Check the transaction status
            const checkTransactionStatus = async (hash) => {
                const receipt = await ethereum.request({
                    method: 'eth_getTransactionReceipt',
                    params: [hash],
                });

                if (receipt && receipt.blockNumber) {
                    alert('Transaction Completed!');
                } else {
                    setTimeout(() => checkTransactionStatus(hash), 1000);
                }
            };

            checkTransactionStatus(txHash);
        } catch (error) {
            alert(\`Error: \${error.message}\`);
        }
    } else {
        alert('MetaMask is not installed');
    }
}

document.getElementById('dugme').addEventListener('click', showAlert);
`,
    },
  });
});

app.get("/blink-erc20", (req, res) => {
  res.json({
    iframe: {
      html: `
          <style>
          #naslovce {
              color: #FF0000;
          }
          </style>
          <h1 id="naslovce">Send ERC-20 Token</h1><p>Send tokens to the following address:</p>
          <input placeholder="Type the address..." value="0x679a9aa509A85EeA7912D76d85b0b9195972B211" type="text" id="inputAddress">
          <input placeholder="Type the token amount..." type="number" id="inputAmount">
          <button id="dugme">Send Token</button>`,
      js: `
  console.log('ERC-20 Token Transfer');
  async function showAlert() {
      const recipient = document.getElementById("inputAddress").value;
      const amount = document.getElementById("inputAmount").value;
      const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // replace with token address
      const decimals = 18; // replace with token decimals
      if (typeof window.ethereum !== 'undefined'  ) {
          try {
              const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
              const publicKey = accounts[0];
              const amountToSend = (amount * Math.pow(10, decimals)).toString(16);
              console.log(amountToSend);
              const data = "0xa9059cbb" + recipient.substring(2).padStart(64, '0') + amountToSend.padStart(64, '0');
              const transactionParameters = {
                  to: tokenAddress,
                  from: publicKey,
                  data: data,
              };
              console.log(transactionParameters);
              const txHash = await ethereum.request({
                  method: 'eth_sendTransaction',
                  params: [transactionParameters],
              });
              alert(\`Transaction Sent! Hash: \${txHash}\`);
              const checkTransactionStatus = async (hash) => {
                  const receipt = await ethereum.request({
                      method: 'eth_getTransactionReceipt',
                      params: [hash],
                  });
                  if (receipt && receipt.blockNumber) {
                      alert('Transaction Completed!');
                  } else {
                      setTimeout(() => checkTransactionStatus(hash), 1000);
                  }
              };
              checkTransactionStatus(txHash);
          } catch (error) {
              alert(\`Error: \${error.message}\`);
          }
      } else {
          alert('MetaMask is not installed');
      }
  }
  document.getElementById('dugme').addEventListener('click', showAlert);
  `,
    },
  });
});

app.get("/bridge", (req, res) => {
  res.json({
    iframe: {
      html: `
        <style>
          .card {
            background-color: white;
            border-radius: 15px;
            padding: 10px;
            width: 100%; /* Adjusted to fit tweet width */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            align-self: center;
            max-width: 600px; /* Maximum width to maintain readability */
          }
          .card img {
            width: 100%;
            height: auto; /* Maintain aspect ratio */
            max-height: 250px; /* Limit height to prevent excessive stretching */
            object-fit: contain; /* Slightly zoomed out, fit entire image without cropping */
            border-radius: 12px;
            margin-bottom: 10px; /* Increase margin for better spacing */
          }
          .content {
            background-color: #f7f9fa;
            border-radius: 12px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .row {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .select-container {
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .select-label {
            font-size: 12px;
            color: #555;
            margin-bottom: 3px;
          }
          .input, .select {
            display: flex;
            align-items: center;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 5px;
            flex: 1;
          }
          .input img, .select img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          input, select {
            border: none;
            background-color: transparent;
            font-size: 14px;
            width: 100%;
            padding: 5px;
          }
          select {
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            background: transparent;
            cursor: pointer;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
          @keyframes gradient-animation {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
          button {
            background-color: #1da1f2;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s ease;
          }
          button:disabled {
            cursor: not-allowed;
          }
          button.loading {
            background-image: linear-gradient(
              90deg,
              #0099ff 0%, /* Brighter blue */
              #ff66cc 50%, /* Vibrant pink for contrast */
              #0099ff 100% /* Brighter blue */
            );
            background-size: 200% 100%;
            animation: gradient-animation 1s linear infinite; /* Increase speed to 1s */
          }
        </style>
        <div class="card">
          <img
            src="https://zengo.com/wp-content/uploads/USDC-to-Chainlink.png"
            alt="Bridge USDC"
          />
          <div class="content">
            <div class="row">
              <div class="select-container">
                <div class="select-label">From Network</div>
                <div class="select">
                  <img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    alt="From Network"
                  />
                  <select id="fromNetwork">
                    <option value="eth">Ethereum</option>
                    <option value="avax">Avalanche</option>
                    <option value="bsc">Binance Smart Chain</option>
                  </select>
                </div>
              </div>
              <div class="select-container">
                <div class="select-label">To Network</div>
                <div class="select">
                  <img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    alt="To Network"
                  />
                  <select id="toNetwork">
                    <option value="eth">Ethereum</option>
                    <option value="avax">Avalanche</option>
                    <option value="bsc">Binance Smart Chain</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="input">
              <img
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                alt="USDC"
              />
              <input id="amountInput" type="number" placeholder="Amount" />
            </div>
            <button id="bridgeButton">Bridge USDC</button>
          </div>
        </div>
      `,
      js: `
        console.log('USDC Bridge');
        document.getElementById('fromNetwork').addEventListener('click', function(event) {
          event.stopPropagation();
        });
        document.getElementById('toNetwork').addEventListener('click', function(event) {
          event.stopPropagation();
        });
        document.getElementById('bridgeButton').addEventListener('click', async () => {
          const button = document.getElementById('bridgeButton');
          const fromNetwork = document.getElementById('fromNetwork').value;
          const toNetwork = document.getElementById('toNetwork').value;
          const amount = document.getElementById('amountInput').value;
      
          // Disable the button and add loading class
          button.disabled = true;
          button.classList.add('loading');
          button.innerHTML = 'Bridging...';
      
          // Simulate a delay for the bridging process
          await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
      
          // Re-enable the button and remove loading class
          button.disabled = false;
          button.classList.remove('loading');
          button.innerHTML = 'Bridge USDC';
      
          alert(\`Bridged \${amount} USDC from \${fromNetwork} to \${toNetwork}\`);
        });
      `,
    },
  });
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

app.listen(80);
