const hre = require("hardhat");

async function main() {
  // 1. Get signers (test accounts) provided by Hardhat
  const [deployer, recipient] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  // 2. Deploy the contract with 1000 initial tokens
  const Token = await hre.ethers.getContractFactory("TokenTransfer");
  const token = await Token.deploy(1000); 

  // Wait for deployment to finish
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 3. Check Initial Balance
  let bal = await token.balanceOf(deployer.address);
  console.log("Deployer balance:", bal.toString());

  // 4. EXECUTE TRANSFER (The Assignment Core)
  console.log("Transferring 100 tokens to:", recipient.address);
  const tx = await token.transfer(recipient.address, 100);
  await tx.wait(); // Wait for transaction to be mined

  // 5. Verify Results
  const finalDeployerBal = await token.balanceOf(deployer.address);
  const recipientBal = await token.balanceOf(recipient.address);

  console.log("-----------------------------------------");
  console.log("Transfer successful: tokens moved.");
  console.log("Final Deployer Balance:", finalDeployerBal.toString());
  console.log("Recipient Balance:", recipientBal.toString());
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});