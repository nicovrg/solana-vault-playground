
import { FC } from "react";
import { Vault } from '../../components/Vault';

export const VaultView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4 min-h-80vh">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Vault App
        </h1>
        <div className="text-center">
          <Vault/>
        </div>
      </div>
    </div>
  );
};
