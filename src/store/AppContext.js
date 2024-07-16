import React, { createContext, useState, useContext } from 'react';

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
  const [labelList, setLabelList] = useState([]);

  return (
    <LabelContext.Provider value={{ labelList, setLabelList }}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabelContext = () => {
  return useContext(LabelContext);
};
