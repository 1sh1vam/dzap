import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { useState } from "react";
import ErrorBox from "./ErrorBox";
import { isStrValidNumber } from "./util";

const myTheme = createTheme({
  theme: "light",
  settings: {
    background: "#f5f6fa",
    gutterBackground: "#f5f6fa",
  },
  styles: [],
});

interface TransformedAddress {
  [address: string]: { lineNumber: number; amount: number }[];
}

interface ErrorType {
  type: "validation" | "duplication";
  errors: string[];
}

const Disperse = () => {
  const [addresses, setAddresses] = useState("");
  const [transformedAddresses, setTransfromedAddress] =
    useState<TransformedAddress>({});
  const [errors, setErrors] = useState<ErrorType>();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setTransfromedAddress({});
    setErrors(undefined);
    const addressMap: TransformedAddress = {};

    const lines = addresses.split("\n");

    let validationError = false;
    for (let index = 0; index<lines.length; index++) {
        const line = lines[index];
        const [address, amount] = line.split(/[,= ]+/);

      if (!isStrValidNumber(amount)) {
        console.log('first', amount, index)
        setErrors({
          type: "validation",
          errors: [`Line ${index + 1} wrong amount`],
        });
        validationError = true;
        break;
      }

      const currentAmount = parseFloat(amount);
      if (addressMap[address]) {
        addressMap[address].push({
          lineNumber: index + 1,
          amount: currentAmount,
        });
      } else {
        addressMap[address] = [
          { lineNumber: index + 1, amount: currentAmount },
        ];
      }
    }

    const duplicateError: string[] = [];

    let duplicationError = false;
    Object.entries(addressMap).forEach(([address, duplicates]) => {
      if (duplicates.length > 1) {
        duplicationError = true;
        const duplicateLines = duplicates.map((dup) => dup.lineNumber);
        duplicateError.push(
          `Addreess ${address} encountered duplicate in Line: ${duplicateLines.join(
            ", "
          )}`
        );
      }
    });

    if (validationError) return;
    
    if (duplicationError) {
        setErrors({ type: "duplication", errors: duplicateError });
        setTransfromedAddress(addressMap);
    }
  };

  const updateAddressState = (newAddresses: string[]) => {
    setErrors(undefined)
    setAddresses(newAddresses.join("\n"));
  }

  const keepFirstOne = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newAddresses = Object.entries(transformedAddresses).map(
      ([address, duplicates]) => `${address} ${duplicates[0].amount}`
    );

    updateAddressState(newAddresses)
  };

  const combineAddress = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newAddresses = Object.entries(transformedAddresses).map(
      ([address, duplicates]) => {
        const totalAmount = duplicates.reduce(
          (acc, dup) => acc + dup.amount,
          0
        );
        return `${address} ${totalAmount}`;
      }
    );
    updateAddressState(newAddresses)
  };

  return (
    <div className="">
      <div className="bg-[#f5f6fa] p-4 rounded-[5.5px]">
        <CodeMirror
          value={addresses}
          height="200px"
          onChange={setAddresses}
          theme={myTheme}
        />
      </div>

      {errors && errors.type === "duplication" ? (
        <div className="mt-10 flex justify-between items-center text-red-500 font-semibold text-sm">
          <p>Duplicated</p>
          <div className="flex items-center gap-5">
            <button onClick={keepFirstOne}>Keep the first one</button>|
            <button onClick={combineAddress}>Combine Balance</button>
          </div>
        </div>
      ) : null}

      {errors ? <ErrorBox errors={errors.errors} /> : null}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white w-full text-center py-3 text-xl rounded-md mt-10 hover:opacity-80"
      >
        Next
      </button>
    </div>
  );
};

export default Disperse;
