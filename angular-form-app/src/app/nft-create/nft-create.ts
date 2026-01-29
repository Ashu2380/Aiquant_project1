import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ethers } from 'ethers';
import abi from '../../assets/MyNFT.json';

@Component({
  selector: 'app-nft-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nft-create.html',
  styleUrls: ['./nft-create.css']
})
export class NftCreate {

  contractAddress: string = "0x1cC9a555b79525661507d44FD553Eb6ba9772E23";
  txHash: string = '';
  errorMessage: string = '';

  // Form properties
  nftName: string = '';
  nftDescription: string = '';
  nftImage: string = '';
  nftAttributes: string = '';
  isMinting: boolean = false;

  async mintNFT() {
    if (!this.nftName || !this.nftDescription || !this.nftImage) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isMinting = true;
    this.errorMessage = '';
    this.txHash = '';

    try {
      if (!(window as any).ethereum) {
        this.errorMessage = "MetaMask install karo";
        this.isMinting = false;
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        this.contractAddress,
        abi,
        signer
      );

      const userAddress = await signer.getAddress();

      // Generate NFT metadata from form inputs
      const metadata = {
        name: this.nftName,
        description: this.nftDescription,
        image: this.nftImage,
        attributes: this.nftAttributes ? this.nftAttributes.split(',').map(attr => {
          const [trait_type, value] = attr.split(':').map(s => s.trim());
          return { trait_type, value };
        }) : []
      };

      // Convert metadata to data URL for tokenURI
      const metadataString = JSON.stringify(metadata);
      const tokenURI = 'data:application/json;base64,' + btoa(metadataString);

      // awardItem(address, tokenURI)
      const tx = await (contract as any).awardItem(userAddress, tokenURI);

      await tx.wait();

      this.txHash = tx.hash;
      this.errorMessage = '';
      this.isMinting = false;
      alert("NFT Successfully Minted!");
      console.log("NFT Minted:", tx.hash);

    } catch (err) {
      console.error(err);
      this.errorMessage = "Mint failed. Check console.";
      this.isMinting = false;
    }
  }
}