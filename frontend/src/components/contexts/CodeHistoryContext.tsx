import { useState, createContext } from 'react';

export const CodeHistoryContext = createContext<{
  updateCodeHistoryList: {
    get: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  codeId: {
    get: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}>({
  updateCodeHistoryList: {
    get: false,
    set: () => {
      throw new Error();
    }
  },
  codeId: {
    get: -1,
    set: () => {
      throw new Error();
    }
  }
});

type Props = {
  children: React.ReactNode;
};

export const CodeHistoryContextProvider = ({ children }: Props) => {
  const [updateCodeHistory, setUpdateCodeHistory] = useState(false);
  const [codeId, setCodeId] = useState(-1);

  const providedValues = {
    updateCodeHistoryList: {
      get: updateCodeHistory,
      set: setUpdateCodeHistory
    },
    codeId: { get: codeId, set: setCodeId }
  };

  return (
    <CodeHistoryContext.Provider value={providedValues}>
      {children}
    </CodeHistoryContext.Provider>
  );
};
