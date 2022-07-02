import React, { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Container, Tab, Tabs } from "@mui/material";
import { providers } from "ethers";
import EpochListings from "../components/EpochListings";
import AdminFunctions from "../components/AdminFunctions";
import Header from "../components/Header";

function LoggedInComponent(connectedWalletAddress: string) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Container>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        <Tab label="Admin View" />
        <Tab label="Member View" />
      </Tabs>
      {selectedTab === 0 ? (
        <AdminFunctions connectedWalletAddress={connectedWalletAddress} />
      ) : (
        <EpochListings connectedWalletAddress={connectedWalletAddress} />
      )}
    </Container>
  );
}

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddress] = useState("");

  async function handleConnectWallet() {
    const provider = (await detectEthereumProvider()) as any;

    await provider.request({ method: "eth_requestAccounts" });

    const ethersProvider = new providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const connectedWalletAddress = await signer.getAddress();

    setConnectedWalletAddress(connectedWalletAddress);
  }

  const PageComponent = !!connectedWalletAddress
    ? () => LoggedInComponent(connectedWalletAddress)
    : () => null;

  return (
    <div>
      <Header
        connectedWalletAddress={connectedWalletAddress}
        onClick={handleConnectWallet}
      />
      <PageComponent />
    </div>
  );
}
