import { utils } from "ethers";

export async function validateAddressInput(
  addressInput: string
): Promise<boolean> {
  try {
    utils.getAddress(addressInput);
  } catch (error: any) {
    throw new Error("Input is not a valid address");
  }

  return true;
}
